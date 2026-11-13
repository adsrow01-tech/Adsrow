
begin;

-- Acceptance rows are written by the verified registration Edge Function or
-- the auth.users trigger. Browser clients must not choose a user id, hash, or
-- accepted_at value directly.
drop policy if exists "Users can record their own terms acceptance"
on public.terms_acceptances;
drop policy if exists "Users can update their own terms acceptance"
on public.terms_acceptances;
revoke insert, update on table public.terms_acceptances from anon, authenticated;
grant select on table public.terms_acceptances to authenticated;
grant select, insert, update on table public.terms_acceptances to service_role;

create or replace function public.consume_google_signup_legal_intent(
    p_intent_id uuid,
    p_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    intent public.signup_legal_intents%rowtype;
    matched_acceptances integer;
begin
    if p_intent_id is null or p_user_id is null then
        return false;
    end if;

    -- Defense in depth: only a Google-authenticated user can consume this intent.
    if not exists (
        select 1
        from auth.users u
        where u.id = p_user_id
          and coalesce(u.raw_app_meta_data ->> 'provider', '') = 'google'
    ) then
        return false;
    end if;

    select * into intent
    from public.signup_legal_intents
    where intent_id = p_intent_id
    for update;

    if not found then
        return false;
    end if;

    if intent.consumed_at is not null then
        if intent.consumed_user_id <> p_user_id then
            return false;
        end if;

        select count(*) into matched_acceptances
        from public.terms_acceptances ta
        where ta.user_id = p_user_id
          and ta.terms_version = intent.terms_version
          and (
              (ta.document_type = 'terms' and ta.content_hash = intent.terms_content_hash)
              or (ta.document_type = 'privacy' and ta.content_hash = intent.privacy_content_hash)
          );
        return matched_acceptances = 2;
    end if;

    if intent.expires_at <= now() then
        return false;
    end if;

    -- accepted_at and created_at are omitted so PostgreSQL supplies server time.
    insert into public.terms_acceptances (
        user_id, document_type, terms_version, content_hash
    ) values
        (p_user_id, 'terms', intent.terms_version, intent.terms_content_hash),
        (p_user_id, 'privacy', intent.terms_version, intent.privacy_content_hash)
    on conflict (user_id, document_type, terms_version) do nothing;

    select count(*) into matched_acceptances
    from public.terms_acceptances ta
    where ta.user_id = p_user_id
      and ta.terms_version = intent.terms_version
      and (
          (ta.document_type = 'terms' and ta.content_hash = intent.terms_content_hash)
          or (ta.document_type = 'privacy' and ta.content_hash = intent.privacy_content_hash)
      );

    if matched_acceptances <> 2 then
        raise exception 'Google signup legal acceptance could not be verified';
    end if;

    update public.signup_legal_intents
    set consumed_at = now(),
        consumed_user_id = p_user_id
    where intent_id = p_intent_id;

    return true;
end;
$$;

revoke all on function public.consume_google_signup_legal_intent(uuid, uuid) from public, anon, authenticated;
grant execute on function public.consume_google_signup_legal_intent(uuid, uuid) to service_role;

commit;
