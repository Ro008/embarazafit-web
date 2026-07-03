import type { APIRoute } from 'astro';
import { checkLeadFormDependencies } from '../../../lib/form-monitor';

export const prerender = false;

/** Ping ligero para UptimeRobot / Better Stack (cada 5 min). */
export const GET: APIRoute = async () => {
  const result = await checkLeadFormDependencies();

  return new Response(JSON.stringify({ ok: result.ok }), {
    status: result.ok ? 200 : 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
