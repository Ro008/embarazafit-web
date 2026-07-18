import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Solo para SEO / JSON-LD (datePublished). No se muestra en la UI. */
    pubDate: z.coerce.date(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
