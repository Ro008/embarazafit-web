import { statSync } from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

const WORDS_PER_MINUTE = 200;

/** Tiempo de lectura estimado a partir del cuerpo Markdown. */
export function getReadingMinutes(body: string | undefined): number {
  const text = (body ?? '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`\[\]()!-]/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * dateModified para Schema.org: mtime del archivo .md en disco.
 * Se actualiza solo al guardar el post; no hay que editar fechas a mano.
 */
export function getDateModified(entry: CollectionEntry<'blog'>): Date {
  const filePath = entry.filePath
    ? path.resolve(entry.filePath)
    : path.join(process.cwd(), 'src/content/blog', `${entry.id}.md`);

  return statSync(filePath).mtime;
}

export function formatReadingLabel(minutes: number): string {
  return `Lectura de ${minutes} min`;
}
