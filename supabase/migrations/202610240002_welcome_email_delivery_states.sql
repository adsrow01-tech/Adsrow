alter table public.welcome_email_deliveries
  alter column sent_at drop not null;

alter table public.welcome_email_deliveries
  add column if not exists status text not null default 'pending',
  add column if not exists attempts integer not null default 0,
  add column if not exists last_error text,
  add column if not exists claimed_at timestamptz;

update public.welcome_email_deliveries
set status = 'sent'
where sent_at is not null and status = 'pending';

alter table public.welcome_email_deliveries
  drop constraint if exists welcome_email_deliveries_status_check;

alter table public.welcome_email_deliveries
  add constraint welcome_email_deliveries_status_check
  check (status in ('pending', 'sending', 'sent', 'failed', 'uncertain'));

create or replace function public.queue_welcome_email()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if new.email is not null then
    insert into public.welcome_email_deliveries (user_id, email, status, sent_at)
    values (new.id, new.email, 'pending', null)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

revoke all on function public.queue_welcome_email() from public, anon, authenticated;

drop trigger if exists queue_welcome_email_on_user_created on auth.users;

create trigger queue_welcome_email_on_user_created
  after insert on auth.users
  for each row execute function public.queue_welcome_email();

revoke all on table public.welcome_email_deliveries from anon, authenticated;
