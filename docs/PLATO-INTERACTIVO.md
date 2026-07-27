# Simulador del Plato — Stripe + acceso híbrido

Guía corta para compras de Stripe, email de acceso y dashboard.

---

## Qué hace el sistema

1. La clienta paga con el **Payment Link** de Stripe.
2. Stripe redirige a `/plato?session_id={CHECKOUT_SESSION_ID}`.
3. La web **valida el pago en Stripe** (pagado + 6 €). Solo entonces pone la cookie.
4. Stripe envía un **webhook** a tu web.
5. Tu API guarda la compra en Supabase (`embarazafit_plato_compras`) con un **token de acceso**.
6. Mailrelay envía un email con el **magic link** (`/plato?acceso=TOKEN`) para otros dispositivos.
7. Si no encuentra el email: en `/plato` → **«Ya compré»** con el email del pago → desbloquea + reenvía el enlace.
8. El **dashboard** muestra esas ventas **separadas** de la comisión con María.

> **Importante:** `?premium=true` **ya no otorga acceso** (era un bypass del MVP). Quien lo use verá el paywall.

---

## 1. Crear / actualizar la tabla en Supabase

Si la tabla **aún no existe**, ejecuta `supabase/plato-compras.sql`  
(o `supabase/schema.sql` completo en un proyecto nuevo).

Si la tabla **ya existe**, ejecuta solo:

`supabase/plato-acceso.sql`

(añade `access_token` y `access_email_sent_at`).

---

## 2. Variables de entorno

Añade en `.env` (local) y en **Vercel → Environment Variables**:

```text
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…
```

También necesitas Mailrelay (mismo stack que la consulta con María):

```text
MAILRELAY_API_URL=…
MAILRELAY_API_KEY=…
MAILRELAY_FROM_EMAIL=…
MAILRELAY_FROM_NAME=…
```

Opcional (por defecto 600 = 6,00 €):

```text
PLATO_STRIPE_AMOUNT_CENTS=600
```

Tras cambiar variables en Vercel: **Redeploy**.

---

## 3. Webhook + Success URL en Stripe

### Webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. **Endpoint URL:**
   `https://www.embarazafit.com/api/stripe/webhook`
3. Evento: **`checkout.session.completed`**
4. Signing secret → `STRIPE_WEBHOOK_SECRET`
5. Secret key live → `STRIPE_SECRET_KEY`

### Success URL del Payment Link (obligatorio cambiar si aún tienes `premium=true`)

En el Payment Link → **After payment** / URL de éxito:

```text
https://www.embarazafit.com/plato?session_id={CHECKOUT_SESSION_ID}
```

Stripe sustituye `{CHECKOUT_SESSION_ID}` por el ID real (`cs_live_…`).

---

## 4. Comprobar que funciona

1. En ventana de invitado: `/plato?premium=true` → **debe verse el paywall** (no el simulador).
2. Pago real de prueba con el Payment Link → entras al simulador al instante.
3. Email del pago → magic link funciona en otro dispositivo.
4. `/plato` → «Ya compré» con el email del pago.
5. Stripe → Webhooks → **200**; dashboard → venta del Plato.

Si verify-session falla: revisa `STRIPE_SECRET_KEY` y que la Success URL use `session_id`.  
Si el webhook falla con 400: revisa `STRIPE_WEBHOOK_SECRET`.  
Si no llega el email pero «Ya compré» funciona: revisa Mailrelay.

---

## Dashboard: dos fuentes de ingreso

| Bloque | Origen | Qué ves |
|---|---|---|
| **Simulador del Plato** | Stripe (automático) | Ventas brutas 6 € |
| **Colaboración con María** | Registro manual | Tu comisión 17 % |

No se mezclan en un solo total a propósito: son negocios distintos.

---

## URLs útiles

| Qué | URL |
|---|---|
| Plato (público) | `/plato` |
| Dashboard | `/dashboard` |
| Webhook | `/api/stripe/webhook` |
| Verificar pago Stripe | `POST /api/plato/verify-session` |
| Recover / magic link | `POST /api/plato/access` |
