'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Lightbox from './Lightbox';
import type { GalleryCategory } from '@/lib/images';

const CATEGORY_KEYS: Record<string, string> = {
  escultura: 'escultura',
  esculturas: 'esculturas',
  pinturas: 'pinturas',
  vidrio: 'vidrio',
};

type Props = { categories: GalleryCategory[] };

export default function Gallery({ categories }: Props) {
  const t = useTranslations('works');
  const [filter, setFilter] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const filtered =
    filter === null
      ? categories
      : categories.filter((c) => c.slug === filter);

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`rounded-full px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none ${filter === null ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800'}`}
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
              className={`rounded-full px-4 py-2.5 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none ${filter === cat.slug ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800'}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {filtered.flatMap((cat) =>
          cat.images.map((img) => (
            <button
              key={`${cat.slug}-${img.src}`}
              type="button"
              className="group aspect-square overflow-hidden rounded-sm bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none"
              onClick={() => setLightbox({ src: img.src, alt: img.alt })}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
              />
            </button>
          ))
        )}
      </div>
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
