# Testing — regla Pareto (Embarazafit)

Guía interna: **cuándo** hace falta probar más y **cuándo no** merece la pena montar una batería de tests.

---

## Filosofía (80/20)

El riesgo principal del negocio en este proyecto es **perder leads** (formulario roto, Supabase caído, emails que no salen). Eso ya cubre el **80 %** con:

| Capa | Qué hace |
|---|---|
| **Prueba manual** del formulario + dashboard | Antes de cada deploy importante |
| **`/api/health/leads`** + UptimeRobot | Aviso en minutos si la web o Supabase fallan |
| **Cron `/api/cron/check-lead-form`** | Prueba de escritura 2×/día + email si falla |
| **Mailrelay** con pausa y reintentos | 3 emails por lead sin perder el lead en BD |

Los **tests automatizados** (Vitest, Playwright) son el **20 % restante**: útiles, pero no obligatorios mientras lo anterior funcione y el flujo sea estable.

---

## Cuándo NO ampliar tests (por ahora)

- Cambios solo de **texto**, estilos o copy de emails
- Ajustes visuales en `/consulta-nutricionista`
- Documentación o variables de entorno
- Bug que ya reprodujiste y arreglaste a mano en 5 minutos

En esos casos: **prueba manual rápida** y deploy.

---

## Cuándo SÍ considerar tests o ampliar cobertura

Actúa si ocurre **alguna** de estas señales:

1. **El mismo bug vuelve a aparecer** (p. ej. cobros duplicados, emails que fallan en silencio)
2. **Cambias lógica de negocio** en:
   - `src/lib/lead-form.ts` (validación del formulario)
   - `src/lib/leads.ts` (`validateNewPago`, comisiones)
   - `src/pages/api/consulta-nutricionista.ts` (orden o condiciones de emails)
3. **Refactor grande** de Supabase, auth del dashboard o Mailrelay
4. **Nueva integración** (otro CRM, otro proveedor de email, pago online)
5. **Monitorización alerta** pero no sabes por qué (necesitas reproducir en local)

---

## Si añadimos tests: orden de prioridad

Montar **Vitest** solo cuando toque. Empezar por **unitarios** (rápidos, baratos):

| Prioridad | Función / módulo | Por qué |
|---|---|---|
| 1 | `getFirstName()` | Emails a clientas; fácil de romper |
| 2 | `validateLeadPayload()` | Puerta de entrada de todos los leads |
| 3 | `validateNewPago()` | Dinero / comisiones; reglas estrictas |
| 4 | `commissionForAmount()` | Cálculo del 17 % |

**Después** (solo si hace falta):

- Test de integración del API con Supabase/Mailrelay **mockeados**
- **Playwright E2E**: rellenar formulario en navegador (lento; último recurso)

---

## Checklist manual antes de PR / producción

- [ ] Enviar formulario de prueba → lead en `/dashboard`
- [ ] Llegan los **3 emails** (clienta, Embarazafit, María) o los que correspondan según `.env`
- [ ] Registrar un cobro en dashboard → no permite duplicado
- [ ] `npm run build` sin errores
- [ ] En Vercel: `CRON_SECRET`, Supabase, Mailrelay, `MARIA_NUTRICIONISTA_EMAIL`

---

## Referencias

- Monitorización: `docs/CONSULTA-NUTRICIONISTA.md` → sección «Monitorización del formulario»
- Configuración emails: misma guía → «Modo pruebas vs producción»
