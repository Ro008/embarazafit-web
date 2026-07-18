# Supabase Embarazafit (proyecto propio)

Embarazafit tiene su **propio proyecto Supabase**, separado de DocCy.

---

## Proyecto Supabase

| Campo | Valor |
|---|---|
| Nombre en Supabase | **Embarazafit** (o el nombre que le hayas puesto) |
| Project URL | `https://vysngzqpcwnharrifmdp.supabase.co` |
| Uso | Tablas `embarazafit_leads` y `embarazafit_pagos` |

---

## Tablas

| Tabla | Para qué |
|---|---|
| `embarazafit_leads` | Solicitudes del formulario de consulta nutricionista |
| `embarazafit_pagos` | Pagos y comisiones del 17% |

Script de creación: `supabase/schema.sql` (ejecutar una vez en SQL Editor).

Migración desde DocCy (datos históricos): `supabase/migrate-data.sql` (después del schema).

---

## Claves API — cuál usar

En Supabase → **Settings → API**:

| Clave en Supabase | Variable en `.env` / Vercel | ¿Usar? |
|---|---|---|
| **Project URL** | `SUPABASE_URL` | ✅ Sí |
| **service_role** (secreta) | `SUPABASE_SERVICE_ROLE_KEY` | ✅ Sí — solo en servidor |
| **publishable** / anon | — | ❌ No |

---

## Variables en `.env` y Vercel

```text
SUPABASE_URL=https://vysngzqpcwnharrifmdp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role del proyecto Embarazafit>
```

Misma URL y misma service_role en local (`.env`) y en Vercel.

---

## Qué NO hacer

- No poner la publishable key en `SUPABASE_SERVICE_ROLE_KEY`
- No subir la service_role a GitHub (solo `.env` local y Vercel)
- No dejar producción apuntando al proyecto DocCy tras la migración

---

## Checklist migración

- [ ] Ejecutar `supabase/schema.sql` en el proyecto nuevo
- [ ] Ejecutar `supabase/migrate-data.sql` (copia leads + pagos)
- [ ] Actualizar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env`
- [ ] Actualizar las mismas variables en Vercel
- [ ] Probar formulario + dashboard
- [ ] (Opcional) Borrar tablas `embarazafit_*` del proyecto DocCy cuando confirmes que todo va bien

Ver también: `docs/CONSULTA-NUTRICIONISTA.md`
