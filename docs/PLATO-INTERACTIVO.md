# Simulador del Plato — Stripe + dashboard

Guía corta para conectar las compras de Stripe con tu dashboard de Embarazafit.

---

## Qué hace el sistema

1. La clienta paga con el **Payment Link** de Stripe.
2. Stripe redirige a `/plato?premium=true` (acceso al simulador).
3. Stripe envía un **webhook** a tu web.
4. Tu API guarda email + importe + fecha en Supabase (`embarazafit_plato_compras`).
5. El **dashboard** muestra esas ventas **separadas** de la comisión con María.

---

## 1. Crear la tabla en Supabase

En [Supabase](https://supabase.com) → proyecto Embarazafit → **SQL Editor** → ejecuta el contenido de:

`supabase/plato-compras.sql`

(Si montas el proyecto desde cero, puedes ejecutar `supabase/schema.sql` completo.)

---

## 2. Variables de entorno

Añade en `.env` (local) y en **Vercel → Environment Variables**:

```text
STRIPE_SECRET_KEY=sk_live_…
STRIPE_WEBHOOK_SECRET=whsec_…
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

---

## 4. Comprobar que funciona

1. Haz un pago real de prueba (o el tuyo) con el Payment Link.
2. En Stripe → Webhooks → el endpoint debe mostrar entregas **200**.
3. En `/dashboard` → sección **Ingresos · Simulador del Plato** debe aparecer la venta.

Si el webhook falla con 400: revisa `STRIPE_WEBHOOK_SECRET`.  
Si falla con 500: revisa que la tabla exista y `SUPABASE_*` estén bien.

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
