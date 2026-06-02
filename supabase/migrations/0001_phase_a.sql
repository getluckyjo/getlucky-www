-- Phase A: Postgres as the durable system-of-record for paid entries,
-- vouchers and leads. Google Sheets remains a human-friendly mirror.
--
-- All access is server-side via the service-role key. RLS is enabled on every
-- table with NO policies, so anon/authenticated clients have zero access; the
-- service role bypasses RLS. There is no client-side read/write.

create extension if not exists pgcrypto;

-- Bumps updated_at on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Online voucher purchases (/buy-a-swing, reference prefix GL-).
create table if not exists public.vouchers (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique,
  status           text not null default 'pending',
  tier             text,
  amount           numeric(10,2),
  prize            text,
  course           text,
  buyer_name       text,
  buyer_email      text,
  buyer_mobile     text,
  purchase_for     text,
  recipient_name   text,
  recipient_email  text,
  personal_message text,
  promo_code       text,
  pf_payment_id    text,
  paid_at          timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- In-person QR-code course entries (/form, reference prefix GLE-).
create table if not exists public.entries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  status        text not null default 'pending',
  entry_date    date,
  tier          text,
  amount        numeric(10,2),
  prize         text,
  course        text,
  name          text,
  email         text,
  mobile        text,
  pf_payment_id text,
  paid_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Non-paid lead capture: partner / corporate / agency / free_entry / risk_review.
-- Common contact columns are first-class; type-specific fields live in `data`.
create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  type                  text not null,
  full_name             text,
  email                 text,
  mobile                text,
  company               text,
  message               text,
  source                text,
  consent_communication boolean not null default false,
  data                  jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

create trigger trg_vouchers_set_updated_at
  before update on public.vouchers
  for each row execute function public.set_updated_at();

create trigger trg_entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

create index if not exists idx_vouchers_status     on public.vouchers (status);
create index if not exists idx_vouchers_created_at on public.vouchers (created_at desc);
create index if not exists idx_entries_status      on public.entries (status);
create index if not exists idx_entries_created_at  on public.entries (created_at desc);
create index if not exists idx_leads_type_created  on public.leads (type, created_at desc);

-- RLS on, no policies → no anon/authenticated access. Service role bypasses RLS.
alter table public.vouchers enable row level security;
alter table public.entries  enable row level security;
alter table public.leads    enable row level security;
