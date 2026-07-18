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

## Email de María

El email de María **no se guarda en el repo** (GitHub es público). Configúralo solo en:

- **Local:** `.env` → `MARIA_NUTRICIONISTA_EMAIL=…`
- **Producción:** Vercel → Environment Variables (mismo nombre)

Por cada formulario se envían **3 emails**:

| Quién | Destino |
|---|---|
| La clienta | El email que ponga en el formulario |
| Embarazafit | `NOTIFICATION_EMAIL` |
| María | `MARIA_NUTRICIONISTA_EMAIL` |

### Pruebas sin molestar a María

Deja el campo **vacío** (solo 2 emails: clienta + Embarazafit) o pon temporalmente tu email personal.

Tras cambiar `.env`, **reinicia** `npm run dev`. En Vercel, la misma variable y redeploy.

### Si Mailrelay falla en el 2.º o 3.º email

A veces la API responde `Your account is currently under review` aunque el panel no muestre nada. Suele ser **límite de envíos seguidos**. El código ya espera 5 s entre emails y reintenta. Si persiste, escribe a soporte de Mailrelay con ese mensaje exacto.

---

## Paso a paso: Supabase (proyecto Embarazafit)

Embarazafit usa su **proyecto propio**: `https://vysngzqpcwnharrifmdp.supabase.co`

1. Entra en [supabase.com](https://supabase.com) → abre el **proyecto Embarazafit**
2. **SQL Editor** → **New query**
3. Copia y ejecuta `supabase/schema.sql` del repo
   - Crea tablas `embarazafit_leads` y `embarazafit_pagos`
4. **Settings → API** → copia al `.env`:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** (Reveal → copiar) → `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ Usa `service_role`, **no** la clave `anon`

Más detalle: `docs/SUPABASE-COMPARTIDO.md`

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

## Monitorización del formulario (tranquilidad con poco esfuerzo)

Para no enterarte tarde de que el formulario ha dejado de guardar leads:

### 1. Ya está en el código (tras deploy)

| Qué | URL | Cuándo |
|---|---|---|
| **Ping ligero** | `https://www.embarazafit.com/api/health/leads` | Lo vigila un servicio externo (tú configuras) |
| **Prueba de escritura** | `/api/cron/check-lead-form` | Vercel, **1×/día** a las 8:00 UTC (~9:00 hora España en invierno). Plan Hobby: máximo un cron diario. |

Si la prueba de escritura falla, recibes un email en `NOTIFICATION_EMAIL` con asunto `[ALERTA Embarazafit]…`.

La prueba inserta un lead ficticio y lo borra al instante. No llega a María ni ensucia el dashboard.

### 2. Variable en Vercel (obligatoria para el cron)

Añade `CRON_SECRET` — una contraseña larga aleatoria (p. ej. generada con un gestor de contraseñas). Vercel la usa para llamar al cron de forma segura.

La misma variable en `.env` local si quieres probar el endpoint a mano:

```bash
curl -H "Authorization: Bearer TU_CRON_SECRET" http://localhost:4321/api/cron/check-lead-form
```

### 3. UptimeRobot (gratis, 5 minutos — 2 minutos de configuración)

1. Cuenta en [uptimerobot.com](https://uptimerobot.com)
2. **Add monitor** → tipo **HTTP(s)**
3. URL: `https://www.embarazafit.com/api/health/leads`
4. Intervalo: 5 minutos
5. Alerta: tu email

Opcional: segundo monitor a la página pública `https://www.embarazafit.com/consulta-nutricionista`.

Con esto cubres el 80 % del riesgo: caída de web, Supabase roto o variables mal configuradas, y fallos al guardar leads.

---

## Checklist de prueba

- [ ] Supabase: tablas creadas (`schema.sql` ejecutado)
- [ ] `.env` local y Vercel con `MARIA_NUTRICIONISTA_EMAIL` (email de María, solo en entorno — no en GitHub)
- [ ] Dashboard local: `/dashboard` + contraseña
- [ ] Enviar formulario de prueba → lead en dashboard
- [ ] Recibir 2 emails en contacto@embarazafit.com
- [ ] Variables en Vercel + redeploy
- [ ] Probar formulario en producción
- [ ] **Monitorización:** `CRON_SECRET` en Vercel + monitor UptimeRobot en `/api/health/leads`
- [ ] **Testing (Pareto):** ver `docs/TESTING.md` si cambias lógica de leads, pagos o emails

---

## Variables de entorno (referencia)

Ver `.env.example` en la raíz del proyecto (plantilla sin valores reales, sí se sube a GitHub).
