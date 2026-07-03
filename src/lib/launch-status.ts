import { getEnv } from './env';

/** true cuando MARIA_NUTRICIONISTA_EMAIL está configurado (modo producción de emails) */
export function isMariaEmailLive(): boolean {
  return Boolean(getEnv('MARIA_NUTRICIONISTA_EMAIL')?.trim());
}

export const LAUNCH_CHECKLIST = {
  mariaEmail:
    'Configurar MARIA_NUTRICIONISTA_EMAIL en .env y Vercel (email de María — no va en el repo)',
  vercelEnv: 'Copiar todas las variables de .env a Vercel → Environment Variables',
  supabaseSchema:
    'Ejecutar supabase/schema.sql en un proyecto Supabase existente (tablas embarazafit_*)',
} as const;
