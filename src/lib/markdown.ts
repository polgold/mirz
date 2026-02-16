import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const COPY_DIR = path.join(process.cwd(), 'source', 'copy');

const DEFAULT_PLACEHOLDERS: Record<string, { title: string; body: string }> = {
  home: {
    title: 'Mirta Zaliauskas',
    body: '<p>Artista visual. Bienvenidos a este espacio.</p>',
  },
  press: {
    title: 'Prensa',
    body: '<p>Contenido de prensa próximamente.</p>',
  },
  contact: {
    title: 'Contacto',
    body: '<p>Información de contacto próximamente.</p>',
  },
};

export type CopySlug = 'home' | 'bio' | 'statement' | 'press' | 'contact';

export async function getCopy(slug: CopySlug): Promise<{
  content: string;
  data: Record<string, unknown>;
  title?: string;
}> {
  const filePath = path.join(COPY_DIR, `${slug}.md`);
  let raw = '';

  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch {
    const placeholder = DEFAULT_PLACEHOLDERS[slug];
    if (placeholder) {
      return {
        content: placeholder.body,
        data: {},
        title: placeholder.title,
      };
    }
    return { content: '', data: {} };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    const placeholder = DEFAULT_PLACEHOLDERS[slug];
    if (placeholder) {
      return {
        content: placeholder.body,
        data: {},
        title: placeholder.title,
      };
    }
    return { content: '', data: {} };
  }

  const { data: frontMatter, content } = matter(raw);
  const result = await unified().use(remarkParse).use(remarkHtml).process(content);
  const html = String(result);

  return {
    content: html,
    data: frontMatter as Record<string, unknown>,
    title: (frontMatter.title as string) || undefined,
  };
}
