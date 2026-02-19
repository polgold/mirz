import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getGalleryCategories } from '@/lib/images';
import { buildPageMetadata } from '@/lib/seo';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/Reveal';
import JsonLdArtworks from '@/components/JsonLdArtworks';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata('works', locale);
}

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = getGalleryCategories();
  const t = await getTranslations('works');

  return (
    <>
      <JsonLdArtworks categories={categories} />
      <article aria-label="Gallery of artworks">
        <Reveal as="header" className="mb-12 md:mb-14">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
            {t('title')}
          </h1>
        </Reveal>
        <section aria-label="Artworks by category">
          <Gallery categories={categories} />
        </section>
      </article>
    </>
  );
}
