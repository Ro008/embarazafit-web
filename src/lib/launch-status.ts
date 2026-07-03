import { getEnv } from './env';

/** Email de María cuando actives el modo producción (dejar vacío en pruebas). */
export const MARIA_PRODUCTION_EMAIL = 'mariagonzalvezbellon@gmail.com';

/** true cuando MARIA_NUTRICIONISTA_EMAIL está configurado (modo producción de emails) */
export function isMariaEmailLive(): boolean {
  return Boolean(getEnv('MARIA_NUTRICIONISTA_EMAIL')?.trim());
}

export const LAUNCH_CHECKLIST = {
  mariaEmail: `Activar MARIA_NUTRICIONISTA_EMAIL=${MARIA_PRODUCTION_EMAIL} en .env y Vercel cuando el formulario esté probado`,
  vercelEnv: 'Copiar todas las variables de .env a Vercel → Environment Variables',
  supabaseSchema:
    'Ejecutar supabase/schema.sql en un proyecto Supabase existente (tablas embarazafit_*)',
} as const;
