import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getGalleryCategories } from '@/lib/images';
import Gallery from '@/components/Gallery';

type Props = { params: Promise<{ locale: string }> };

export default async function WorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = getGalleryCategories();
  const t = await getTranslations('works');

  return (
    <article>
      <header className="mb-10 md:mb-12">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
          {t('title')}
        </h1>
      </header>
      <section>
        <Gallery categories={categories} />
      </section>
    </article>
  );
}
