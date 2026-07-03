# Supabase compartido: Embarazafit + DocCy Testing

Embarazafit **no tiene proyecto Supabase propio**. Usa el mismo que **DocCy - Testing** para no superar el límite de 2 proyectos del plan free.

---

## Proyecto Supabase

| Campo | Valor |
|---|---|
| Nombre en Supabase | **DocCy - Testing** |
| Project URL | `https://fwinchqdgrkpxuuttech.supabase.co` |
| Uso Embarazafit | Solo tablas con prefijo `embarazafit_` |

---

## Tablas de Embarazafit (aisladas de DocCy)

Embarazafit solo usa estas tablas. **No toca** las tablas de DocCy.

| Tabla | Para qué |
|---|---|
| `embarazafit_leads` | Solicitudes del formulario de consulta nutricionista |
| `embarazafit_pagos` | Pagos y comisiones del 17% |

Script de creación: `supabase/schema.sql` (ejecutar una vez en SQL Editor).

---

## Claves API — cuál usar

En Supabase → **Settings → API** hay varios tipos de clave:

| Clave en Supabase | Variable en `.env` / Vercel | ¿Usar en Embarazafit? |
|---|---|---|
| **Project URL** | `SUPABASE_URL` | ✅ Sí |
| **service_role** (secreta) | `SUPABASE_SERVICE_ROLE_KEY` | ✅ Sí — solo en servidor |
| **publishable** / anon | — | ❌ No — es para el navegador, no para nuestro backend |

La **publishable key** (`sb_publishable_...`) **no sirve** para Embarazafit. Hay que copiar la **service_role**.

---

## Variables en `.env` y Vercel

```text
SUPABASE_URL=https://fwinchqdgrkpxuuttech.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role de DocCy - Testing>
```

Misma URL y misma service_role en local (`.env`) y en Vercel.

---

## Qué NO hacer

- No crear un tercer proyecto Supabase solo para Embarazafit
- No mezclar datos: DocCy sigue en sus tablas, Embarazafit en `embarazafit_*`
- No poner la publishable key en `SUPABASE_SERVICE_ROLE_KEY`
- No subir la service_role a GitHub (solo `.env` local y Vercel)

---

## Estado de configuración

- [ ] Ejecutar `supabase/schema.sql` en DocCy - Testing
- [ ] Copiar **service_role** al `.env`
- [ ] Añadir `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en Vercel

Ver también: `docs/CONSULTA-NUTRICIONISTA.md`
