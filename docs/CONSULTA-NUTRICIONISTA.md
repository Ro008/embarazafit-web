# Consulta nutricionista — Guía de configuración

Documentación interna del formulario de María, emails y dashboard.

---

## URLs

| Qué | URL local | URL producción |
|---|---|---|
| Página pública | `http://localhost:4321/consulta-nutricionista` | `https://www.embarazafit.com/consulta-nutricionista` |
| Dashboard (leads) | `http://localhost:4321/dashboard` | `https://www.embarazafit.com/dashboard` |

El dashboard **no aparece en el menú** de la web. Solo entras si conoces la URL y la contraseña.

---

## Contraseña del dashboard

La contraseña **no está en el código**. La defines tú en:

- **Local:** archivo `.env` → variable `ADMIN_PASSWORD`
- **Producción:** Vercel → proyecto `embarazafit-web` → Settings → Environment Variables → `ADMIN_PASSWORD`

Valor inicial sugerido en tu `.env` local: `CambiaEstaContraseña123` — **cámbiala** por una que solo tú conozcas.

La misma contraseña debe estar en Vercel para que funcione en producción.

---

## Modo pruebas vs producción (email de María)

### Mientras pruebas

En `.env` y Vercel, deja **vacío**:

```text
MARIA_NUTRICIONISTA_EMAIL=
```

Comportamiento:
- Recibes **2 emails** en `NOTIFICATION_EMAIL` (contacto@embarazafit.com)
- El que iría a María lleva el asunto: **`[Prueba — iría a María]`**
- María **no recibe nada**

### Cuando todo funcione — activar email real de María

1. Abre `.env` (local) y Vercel (producción)
2. Añade:

```text
MARIA_NUTRICIONISTA_EMAIL=hola@mariagonzalvez.com
```

3. Guarda y redeploy en Vercel (o reinicia `npm run dev` en local)
4. **No hace falta cambiar código**

A partir de ahí María recibe su email con los datos de cada clienta.

---

## Paso a paso: Supabase (sin crear proyecto nuevo)

El plan free permite **máximo 2 proyectos**. Si ya los tienes ocupados, **reutiliza uno** (DocCy u otro personal).

1. Entra en [supabase.com](https://supabase.com) → abre **uno de tus proyectos existentes**
2. **SQL Editor** → **New query**
3. Copia y ejecuta `supabase/schema.sql` del repo
   - Crea tablas `embarazafit_leads` y `embarazafit_pagos` (prefijo para no chocar con otras apps)
4. **Settings → API** → copia al `.env`:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** (Reveal → copiar) → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ Usa `service_role`, **no** la clave `anon`

No hace falta un tercer proyecto Supabase solo para Embarazafit.

**Proyecto usado:** DocCy - Testing → ver `docs/SUPABASE-COMPARTIDO.md`

---

## Paso a paso: Mailrelay — Claves API

En Mailrelay ve a **Configuración → Claves API**. Si la tabla está vacía, aún no has creado ninguna clave.

1. Clic en **+ Añadir**
2. Confirma / guarda → aparecerá una fila con un **Token**
3. Ese Token es tu **`MAILRELAY_API_KEY`** (cópialo al `.env`)

**`MAILRELAY_API_URL`:** mira la barra de direcciones cuando estás logueada. Si ves:

`https://embarazafit.ipzmarketing.com/admin/...`

tu URL es:

```text
MAILRELAY_API_URL=https://embarazafit.ipzmarketing.com
```

(Sin `/admin` — solo el dominio base.)

En `.env` también:

```text
MAILRELAY_FROM_EMAIL=contacto@embarazafit.com
MAILRELAY_FROM_NAME=Embarazafit
```

---

## Paso a paso: Vercel — Environment Variables (crearlas tú)

**Vercel no crea las variables sola.** "No Environment Variables Added" es normal al principio.

Para cada variable de tu `.env`:

1. Vercel → **embarazafit-web** → **Settings** → **Environment Variables**
2. **Add Environment Variable**
3. **Key:** ej. `ADMIN_PASSWORD` | **Value:** tu contraseña
4. Marca **Production** → **Save**
5. Repite para todas las variables del `.env`

Después: **Deployments** → **⋯** → **Redeploy**

---

## Paso a paso: Vercel (despliegue)

1. Rellena tu `.env` local y prueba todo en `npm run dev`
2. Haz **commit + push** a `main` en GitHub
3. Vercel despliega solo
4. En Vercel → **Settings → Environment Variables** (ver sección anterior)
5. **Redeploy**

Tras el deploy:
- `https://www.embarazafit.com/dashboard` → login con tu `ADMIN_PASSWORD`
- `https://www.embarazafit.com/consulta-nutricionista` → formulario activo

---

## Checklist de prueba

- [ ] Supabase: tablas creadas (`schema.sql` ejecutado)
- [ ] `.env` local completo (excepto `MARIA_NUTRICIONISTA_EMAIL` vacío)
- [ ] Dashboard local: `/dashboard` + contraseña
- [ ] Enviar formulario de prueba → lead en dashboard
- [ ] Recibir 2 emails en contacto@embarazafit.com
- [ ] Variables en Vercel + redeploy
- [ ] Probar formulario en producción
- [ ] **LANZAMIENTO:** `MARIA_NUTRICIONISTA_EMAIL=hola@mariagonzalvez.com` en .env + Vercel (aviso amarillo del dashboard debe desaparecer)

---

## Variables de entorno (referencia)

Ver `.env.example` en la raíz del proyecto (plantilla sin valores reales, sí se sube a GitHub).
