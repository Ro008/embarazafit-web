import type { APIRoute } from 'astro';
import { isAdminAuthed, unauthorizedResponse } from '../../../lib/admin-auth';
import { validateNewPago } from '../../../lib/leads';
import {
  fetchPagosForLead,
  insertPago,
  updateLeadStatus,
} from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdminAuthed(cookies)) return unauthorizedResponse();

  try {
    const body = (await request.json()) as {
      action?: string;
      lead_id?: string;
      mes?: string;
      importe?: number | string;
      tipo?: string;
      status?: string;
    };

    if (body.action === 'update_status') {
      const validStatuses = ['nuevo', 'enviado', 'en_tratamiento', 'cerrado'];
      if (!body.lead_id || !body.status || !validStatuses.includes(body.status)) {
        return new Response(JSON.stringify({ error: 'Datos inválidos' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      await updateLeadStatus(
        body.lead_id,
        body.status as 'nuevo' | 'enviado' | 'en_tratamiento' | 'cerrado',
      );

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const importe = Number(body.importe);
    const tipo = body.tipo;
    const mes = body.mes?.trim();

    if (!body.lead_id || !mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return new Response(JSON.stringify({ error: 'Mes inválido (usa YYYY-MM)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!importe || importe <= 0) {
      return new Response(JSON.stringify({ error: 'Importe inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (tipo !== 'fraccionado' && tipo !== 'completo') {
      return new Response(JSON.stringify({ error: 'Tipo de pago inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existingPagos = await fetchPagosForLead(body.lead_id);
    const validation = validateNewPago(existingPagos, { mes, tipo });
    if (!validation.ok) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pago = await insertPago({
      lead_id: body.lead_id,
      mes,
      importe,
      tipo,
    });

    return new Response(JSON.stringify({ ok: true, pago }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('admin/pagos POST error:', err);
    return new Response(JSON.stringify({ error: 'Error al guardar' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
