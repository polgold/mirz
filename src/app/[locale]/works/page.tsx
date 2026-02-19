import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getGalleryCategories } from '@/lib/images';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/Reveal';

type Props = { params: Promise<{ locale: string }> };

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = getGalleryCategories();
  const t = await getTranslations('works');

  return (
    <article>
      <Reveal as="header" className="mb-12 md:mb-14">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
          {t('title')}
        </h1>
      </Reveal>
      <section>
        <Gallery categories={categories} />
      </section>
    </article>
  );
}
