-- Solo si ya tenías las tablas de leads/pagos: ejecuta esto en Supabase → SQL Editor.
-- (También está incluido en schema.sql completo.)

create table if not exists embarazafit_plato_compras (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  email text,
  customer_name text,
  importe numeric(10, 2) not null check (importe > 0),
  currency text not null default 'eur',
  access_token text,
  access_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_ef_plato_compras_created_at
  on embarazafit_plato_compras (created_at desc);

create unique index if not exists idx_ef_plato_compras_access_token
  on embarazafit_plato_compras (access_token)
  where access_token is not null;

create index if not exists idx_ef_plato_compras_email_lower
  on embarazafit_plato_compras (lower(email));

alter table embarazafit_plato_compras enable row level security;
