create table if not exists public.welcome_email_deliveries (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  sent_at timestamptz not null default timezone('utc', now())
);

alter table public.welcome_email_deliveries enable row level security;

comment on table public.welcome_email_deliveries is
  'Server-side idempotency records for verified Adsrow welcome emails.';
