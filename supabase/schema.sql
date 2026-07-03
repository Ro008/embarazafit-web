-- Ejecutar en Supabase → SQL Editor
-- Puedes usar UNO de tus proyectos Supabase existentes (no hace falta crear uno nuevo).
-- Las tablas llevan prefijo embarazafit_ para no chocar con otras apps del mismo proyecto.

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

alter table embarazafit_leads enable row level security;
alter table embarazafit_pagos enable row level security;

-- Sin políticas públicas: solo service_role (servidor) accede a los datos.
