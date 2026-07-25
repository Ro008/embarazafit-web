-- Acceso híbrido del Plato: magic link + recuperación por email.
-- Ejecutar en Supabase → SQL Editor (si ya existe embarazafit_plato_compras).

alter table embarazafit_plato_compras
  add column if not exists access_token text,
  add column if not exists access_email_sent_at timestamptz;

create unique index if not exists idx_ef_plato_compras_access_token
  on embarazafit_plato_compras (access_token)
  where access_token is not null;

create index if not exists idx_ef_plato_compras_email_lower
  on embarazafit_plato_compras (lower(email));
