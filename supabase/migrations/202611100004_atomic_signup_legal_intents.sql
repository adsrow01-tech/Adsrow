-- ============================================================
-- ADSROW: ATOMIC SIGNUP LEGAL ACCEPTANCE
-- Migration: 202611100004_atomic_signup_legal_intents.sql
--
-- Review and apply this migration only after the legal documents and
-- server-side approved hashes have been signed off. It is intentionally not
-- applied by the frontend build or local development scripts.
-- ============================================================

begin;

create table if not exists public.signup_legal_intents (
    intent_id uuid primary key,
    terms_version text not null,
    terms_content_hash text not null,
    privacy_content_hash text not null,
    created_at timestamptz not null default now(),
    expires_at timestamptz not null default (now() + interval '15 minutes'),
    consumed_at timestamptz,
    consumed_user_id uuid references auth.users(id) on delete set null
);

alter table public.signup_legal_intents enable row level security;
revoke all on table public.signup_legal_intents from anon, authenticated;

create or replace function public.consume_signup_legal_intent()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    intent public.signup_legal_intents%rowtype;
    intent_id_text text;
    accepted_at timestamptz := now();
begin
    intent_id_text := new.raw_user_meta_data ->> 'adsrow_legal_intent_id';

    -- Password users must use the server-side legal-signup flow. OAuth is
    -- intentionally left as a separate flow until it receives its own
    -- provider-specific consent handoff.
    if intent_id_text is null or intent_id_text = '' then
        if coalesce(new.raw_app_meta_data ->> 'provider', '') = 'email' then
            raise exception 'Email signup requires legal acceptance';
        end if;
        return new;
    end if;

    begin
        select * into strict intent
        from public.signup_legal_intents
        where intent_id = intent_id_text::uuid
          and consumed_at is null
          and expires_at > now()
        for update;
    exception when invalid_text_representation then
        raise exception 'Invalid legal signup intent';
    when no_data_found then
        raise exception 'Legal signup intent is missing, expired, or already used';
    end;

    insert into public.terms_acceptances (
        user_id, document_type, terms_version, content_hash, accepted_at
    ) values
        (new.id, 'terms', intent.terms_version, intent.terms_content_hash, accepted_at),
        (new.id, 'privacy', intent.terms_version, intent.privacy_content_hash, accepted_at);

    update public.signup_legal_intents
    set consumed_at = accepted_at,
        consumed_user_id = new.id
    where intent_id = intent.intent_id;

    return new;
end;
$$;

revoke all on function public.consume_signup_legal_intent() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_consume_legal_intent on auth.users;
create trigger on_auth_user_created_consume_legal_intent
    after insert on auth.users
    for each row
    execute function public.consume_signup_legal_intent();

commit;

-- Operational note: the Edge Function must validate the approved version and
-- hashes before inserting an intent. This table is deliberately inaccessible
-- to browser roles; only the service role used by that function can write it.
