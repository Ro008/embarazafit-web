# Blog EmbarazaFit

Posts en Markdown local (`src/content/blog/`). Rutas: `/blog` y `/blog/[slug]`.

Para que el agente maquete un borrador automáticamente, ver la regla `.cursor/rules/blog.mdc`.

## Cómo publicar

1. Pásale al agente un borrador (texto libre vale).
2. Él crea `src/content/blog/mi-slug.md` con el frontmatter de abajo.
3. Revisa en `/blog` y `/blog/mi-slug`.

La plantilla del post ya incluye: autor, tiempo de lectura, CTA a `/regalo` (menú de diabetes gestacional + newsletter) y firma. No los escribas en el Markdown.

## Plantilla mínima

```markdown
---
title: "Título del post"
description: "Resumen corto para SEO y el listado."
pubDate: 2026-07-18
---

Primer párrafo…

## Subtítulo

Más contenido.
```

- `pubDate` solo va a SEO (JSON-LD). No se muestra en pantalla.
- Al guardar el archivo, `dateModified` se actualiza solo (mtime).
- Opcional: `draft: true` para no publicar aún en producción.
