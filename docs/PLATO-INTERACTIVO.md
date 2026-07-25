# Simulador del Plato — Stripe + acceso híbrido

Guía corta para compras de Stripe, email de acceso y dashboard.

---

## Qué hace el sistema

1. La clienta paga con el **Payment Link** de Stripe.
2. Stripe redirige a `/plato?premium=true` → acceso inmediato **en ese dispositivo** (cookie).
3. Stripe envía un **webhook** a tu web.
4. Tu API guarda la compra en Supabase (`embarazafit_plato_compras`) con un **token de acceso**.
5. Mailrelay envía un email con el **magic link** (`/plato?acceso=TOKEN`) para otros dispositivos.
6. Si no encuentra el email: en `/plato` → **«Ya compré»** con el email del pago → desbloquea + reenvía el enlace.
7. El **dashboard** muestra esas ventas **separadas** de la comisión con María.

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

## 3. Crear el webhook en Stripe

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. **Endpoint URL:**
   `https://www.embarazafit.com/api/stripe/webhook`
3. Evento a escuchar: **`checkout.session.completed`**
4. Guarda → copia el **Signing secret** (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`
5. La **Secret key** live (`sk_live_…`) va en `STRIPE_SECRET_KEY`

**Success URL del Payment Link** (no cambiar):

`https://www.embarazafit.com/plato?premium=true`

---

## 4. Comprobar que funciona

1. Haz un pago real de prueba con el Payment Link.
2. Debes entrar al simulador en ese navegador al instante.
3. Revisa la bandeja (y spam) del email del pago → enlace «Abrir mi Plato Interactivo».
4. En otro dispositivo / ventana privada: abre el enlace **o** ve a `/plato` → «Ya compré».
5. En Stripe → Webhooks → entregas **200**.
6. En `/dashboard` → **Ingresos · Simulador del Plato** debe aparecer la venta.

Si el webhook falla con 400: revisa `STRIPE_WEBHOOK_SECRET`.  
Si falla con 500: revisa que la tabla tenga las columnas nuevas y `SUPABASE_*` estén bien.  
Si no llega el email pero «Ya compré» funciona: revisa Mailrelay (la compra ya está guardada).

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
| Recover / magic link API | `POST /api/plato/access` |
