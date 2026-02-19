import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import Reveal from '@/components/Reveal';

type Props = { params: Promise<{ locale: string }> };

const SUMMARY = {
  es: {
    title: 'Sobre la artista',
    subtitle: 'Artista visual argentina – Medios mixtos, dibujo y grabado',
    lead:
      'Mirta Zaliauskas es una artista visual contemporánea argentina. Trabaja con medios mixtos, dibujo, grabado y materiales reciclados. Su obra explora la transformación, los paisajes y la emoción humana a través de la experimentación con materiales.',
    body: 'Artista quilmeña con trayectoria en escultura, dibujo y múltiples técnicas. Estudió en la Escuela de Bellas Artes Carlos Morel. Ha expuesto en museos nacionales e internacionales, entre ellos el Museo Nacional de Vilnius (Lituania) y galerías en Roma y California.',
    linkBio: 'Ver biografía completa',
  },
  en: {
    title: 'About the artist',
    subtitle: 'Argentine Visual Artist – Mixed Media, Drawing and Engraving',
    lead:
      'Mirta Zaliauskas is an Argentine contemporary visual artist working with mixed media, drawing, engraving and recycled materials. Her work explores transformation, landscapes and human emotion through material experimentation.',
    body: 'Visual artist from Quilmes with a career in sculpture, drawing and multiple techniques. She studied at the Carlos Morel School of Fine Arts. She has exhibited at national and international museums, including the National Museum of Vilnius (Lithuania) and galleries in Rome and California.',
    linkBio: 'Full biography',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata('about', locale);
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = SUMMARY[locale as keyof typeof SUMMARY] ?? SUMMARY.en;

  return (
    <article className="max-w-2xl" aria-label="About the artist">
      <Reveal as="header" className="mb-12 md:mb-14">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          {t.subtitle}
        </p>
      </Reveal>
      <Reveal as="section" className="space-y-6">
        <p className="leading-relaxed text-[var(--foreground)]">{t.lead}</p>
        <p className="leading-relaxed text-[var(--foreground)]">{t.body}</p>
        <p>
          <Link
            href="/bio"
            className="link-underline-animated text-sm tracking-wide text-[var(--foreground-soft)] hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none"
          >
            {t.linkBio}
          </Link>
        </p>
      </Reveal>
    </article>
  );
}
