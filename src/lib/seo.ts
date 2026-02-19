import type { Metadata } from 'next';

const BASE = 'https://mirtazaliauskas.com';
const LOCALES = ['es', 'en'] as const;
type Locale = (typeof LOCALES)[number];

export type PageSlug = '' | 'bio' | 'statement' | 'works' | 'press' | 'contact' | 'about';

const PAGE_META: Record<
  PageSlug,
  Record<Locale, { title: string; description: string }>
> = {
  '': {
    es: {
      title: 'Mirta Zaliauskas – Artista visual argentina',
      description:
        'Mirta Zaliauskas es una artista visual contemporánea argentina. Obra en escultura, dibujo, grabado, pintura y materiales reciclados. Sitio oficial.',
    },
    en: {
      title: 'Mirta Zaliauskas – Argentine Visual Artist',
      description:
        'Mirta Zaliauskas is an Argentine contemporary visual artist working with mixed media, drawing, engraving and recycled materials. Official website.',
    },
  },
  bio: {
    es: {
      title: 'Bio – Mirta Zaliauskas',
      description:
        'Biografía de Mirta Zaliauskas: artista quilmeña, escultura, dibujo, Bellas Artes Carlos Morel, exposiciones y premios nacionales e internacionales.',
    },
    en: {
      title: 'Bio – Mirta Zaliauskas',
      description:
        'Biography of Mirta Zaliauskas: visual artist from Quilmes, sculpture, drawing, Carlos Morel School of Fine Arts, national and international exhibitions.',
    },
  },
  statement: {
    es: {
      title: 'Statement – Mirta Zaliauskas',
      description:
        'Statement artístico de Mirta Zaliauskas. Reflexión sobre su proceso creativo y su obra en escultura, dibujo y medios mixtos.',
    },
    en: {
      title: 'Statement – Mirta Zaliauskas',
      description:
        'Artistic statement by Mirta Zaliauskas. Reflection on her creative process and work in sculpture, drawing and mixed media.',
    },
  },
  works: {
    es: {
      title: 'Obra – Mirta Zaliauskas | Escultura, dibujo, grabado',
      description:
        'Galería de obra de Mirta Zaliauskas: escultura, pintura, vidrio, paisajes, dibujo, grabados, plástico reutilizado. Obra disponible.',
    },
    en: {
      title: 'Works – Mirta Zaliauskas | Sculpture, Drawing, Engraving',
      description:
        'Gallery of works by Mirta Zaliauskas: sculpture, painting, glass, landscapes, drawing, prints, recycled plastic. Artworks available.',
    },
  },
  press: {
    es: {
      title: 'Prensa – Mirta Zaliauskas',
      description:
        'Prensa y notas sobre Mirta Zaliauskas. Exposiciones, muestras y cobertura en medios.',
    },
    en: {
      title: 'Press – Mirta Zaliauskas',
      description:
        'Press and news about Mirta Zaliauskas. Exhibitions, shows and media coverage.',
    },
  },
  contact: {
    es: {
      title: 'Contacto – Mirta Zaliauskas',
      description:
        'Contacto con Mirta Zaliauskas. Consultas sobre obra, disponibilidad y colaboraciones.',
    },
    en: {
      title: 'Contact – Mirta Zaliauskas',
      description:
        'Contact Mirta Zaliauskas. Inquiries about works, availability and collaborations.',
    },
  },
  about: {
    es: {
      title: 'Sobre la artista – Mirta Zaliauskas | Artista visual argentina',
      description:
        'Mirta Zaliauskas es una artista visual contemporánea argentina. Trabaja con medios mixtos, dibujo, grabado y materiales reciclados.',
    },
    en: {
      title: 'About – Mirta Zaliauskas | Argentine Visual Artist',
      description:
        'Mirta Zaliauskas is an Argentine contemporary visual artist working with mixed media, drawing, engraving and recycled materials.',
    },
  },
};

function pathToUrl(slug: PageSlug, locale: Locale): string {
  const path = slug === '' ? '' : `/${slug}`;
  return `${BASE}/${locale}${path}/`;
}

export function buildPageMetadata(
  slug: PageSlug,
  locale: string
): Metadata {
  const loc = locale as Locale;
  const meta = PAGE_META[slug]?.[loc] ?? PAGE_META[''][loc];
  const canonical = pathToUrl(slug, loc);
  const alternates: Metadata['alternates'] = {
    canonical,
    languages: {} as Record<string, string>,
  };
  for (const l of LOCALES) {
    (alternates.languages as Record<string, string>)[l] = pathToUrl(slug, l);
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: canonical,
      siteName: 'Mirta Zaliauskas',
      locale: loc === 'es' ? 'es_AR' : 'en_US',
      alternateLocale: loc === 'es' ? ['en_US'] : ['es_AR'],
      images: [
        {
          url: `${BASE}/images/home/logo.png`,
          width: 120,
          height: 36,
          alt: 'Mirta Zaliauskas',
        },
        {
          url: `${BASE}/images/home/mir2.jpeg`,
          width: 208,
          height: 260,
          alt: 'Mirta Zaliauskas',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

export function getSitemapRoutes(): { path: string; locale: Locale }[] {
  const slugs: PageSlug[] = ['', 'bio', 'statement', 'works', 'press', 'contact', 'about'];
  const routes: { path: string; locale: Locale }[] = [];
  for (const locale of LOCALES) {
    for (const slug of slugs) {
      const path = slug === '' ? '' : `/${slug}`;
      routes.push({ path: `/${locale}${path}`, locale });
    }
  }
  return routes;
}

export const SITE_BASE = BASE;
