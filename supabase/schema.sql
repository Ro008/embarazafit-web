-- Ejecutar en Supabase → SQL Editor (proyecto Embarazafit).
-- Las tablas llevan prefijo embarazafit_.

create table if not exists embarazafit_leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text not null,
  momento text not null,
  situacion text,
  status text not null default 'nuevo'
    check (status in ('nuevo', 'enviado', 'en_tratamiento', 'cerrado')),
  created_at timestamptz not null default now()
);

create table if not exists embarazafit_pagos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references embarazafit_leads(id) on delete cascade,
  mes text not null,
  importe numeric(10, 2) not null check (importe > 0),
  tipo text not null check (tipo in ('fraccionado', 'completo')),
  created_at timestamptz not null default now()
);

create index if not exists idx_ef_leads_created_at on embarazafit_leads (created_at desc);
create index if not exists idx_ef_pagos_lead_id on embarazafit_pagos (lead_id);
create index if not exists idx_ef_pagos_mes on embarazafit_pagos (mes);
-- Máximo un cobro por clienta y mes
create unique index if not exists idx_ef_pagos_lead_mes on embarazafit_pagos (lead_id, mes);

-- Compras del Simulador del Plato (Stripe Payment Link → webhook)
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

alter table embarazafit_leads enable row level security;
alter table embarazafit_pagos enable row level security;
alter table embarazafit_plato_compras enable row level security;

-- Sin políticas públicas: solo service_role (servidor) accede a los datos.
