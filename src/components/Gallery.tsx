'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Lightbox from './Lightbox';
import Reveal from './Reveal';
import type { GalleryCategory, GalleryImage } from '@/lib/images';

const CATEGORY_KEYS: Record<string, string> = {
  escultura: 'escultura',
  esculturas: 'esculturas',
  pinturas: 'pinturas',
  vidrio: 'vidrio',
  paisajes: 'paisajes',
  'dibujo-carbonilla': 'dibujo-carbonilla',
  grabados: 'grabados',
  tango: 'tango',
  'plastico-reutilizado': 'plastico-reutilizado',
};

type Props = { categories: GalleryCategory[] };

export default function Gallery({ categories }: Props) {
  const t = useTranslations('works');
  const [filter, setFilter] = useState<string | null>(null);
  const [showPrices, setShowPrices] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered =
    filter === null
      ? categories
      : categories.filter((c) => c.slug === filter);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3 sm:mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter(null)}
            className={`rounded-full border px-4 py-2.5 text-sm tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground-soft)] focus:outline-none ${
              filter === null
                ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                : 'border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[var(--foreground-soft)] hover:text-[var(--foreground)]'
            }`}
          >
            {t('all')}
          </button>
          {categories.map((cat) => {
            const label = t(`category.${CATEGORY_KEYS[cat.slug] ?? cat.slug}`);
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setFilter(cat.slug)}
                className={`rounded-full border px-4 py-2.5 text-sm tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground-soft)] focus:outline-none ${
                  filter === cat.slug
                    ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                    : 'border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[var(--foreground-soft)] hover:text-[var(--foreground)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowPrices((p) => !p)}
          className="ml-auto rounded-full border border-[var(--border)] px-3 py-2 text-xs tracking-wide text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none"
        >
          {showPrices ? t('hidePrices') : t('showPrices')}
        </button>
      </div>
      <Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {filtered.flatMap((cat) =>
            cat.images.map((img) => (
              <figure key={`${cat.slug}-${img.src}`} className="group">
                <button
                  type="button"
                  className="card-hover block w-full overflow-hidden rounded-sm bg-[var(--border-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground-soft)] focus:outline-none"
                  onClick={() => setLightbox(img)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={400}
                    height={400}
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="card-hover-img aspect-square w-full object-cover"
                  />
                </button>
                <figcaption className="mt-3 space-y-0.5 px-0.5 text-left">
                  <p className="text-sm font-medium tracking-wide text-[var(--foreground)]">
                    {img.title ?? img.alt}
                  </p>
                  {img.technique && (
                    <p className="text-xs text-[var(--muted)]">{img.technique}</p>
                  )}
                  {img.measure && (
                    <p className="text-xs text-[var(--muted)]">{img.measure}</p>
                  )}
                  {showPrices && img.price && (
                    <p className="text-xs text-[var(--muted)]">{img.price}</p>
                  )}
                </figcaption>
              </figure>
            ))
          )}
        </div>
      </Reveal>
      {lightbox && (
        <Lightbox
          image={lightbox}
          showPrice={showPrices}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
