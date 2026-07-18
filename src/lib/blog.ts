import { statSync } from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

const WORDS_PER_MINUTE = 200;

export type BlogPost = CollectionEntry<'blog'>;

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
export function getDateModified(entry: BlogPost): Date {
  const filePath = entry.filePath
    ? path.resolve(entry.filePath)
    : path.join(process.cwd(), 'src/content/blog', `${entry.id}.md`);

  return statSync(filePath).mtime;
}

export function formatReadingLabel(minutes: number): string {
  return `Lectura de ${minutes} min`;
}

/**
 * Orden de serie: más antiguo primero (post #1 = primer pubDate).
 * Si empatan en fecha, desempata por id.
 */
export function sortPostsChronological(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    const byDate = a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
    if (byDate !== 0) return byDate;
    return a.id.localeCompare(b.id);
  });
}

/** Anterior / siguiente en la serie (por pubDate). */
export function getAdjacentPosts(posts: BlogPost[], currentId: string) {
  const ordered = sortPostsChronological(posts);
  const index = ordered.findIndex((p) => p.id === currentId);
  if (index < 0) {
    return { prev: undefined, next: undefined, position: 0, total: ordered.length };
  }
  return {
    prev: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
    position: index + 1,
    total: ordered.length,
  };
}
