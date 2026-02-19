import type { GalleryCategory } from '@/lib/images';
import { SITE_BASE } from '@/lib/seo';

type Props = { categories: GalleryCategory[] };

function buildVisualArtworkList(categories: GalleryCategory[]) {
  const itemListElement = categories.flatMap((cat) =>
    cat.images.map((img) => ({
      '@type': 'VisualArtwork' as const,
      name: img.title || img.alt,
      image: `${SITE_BASE}${img.src.startsWith('/') ? img.src : `/${img.src}`}`,
      artMedium: img.technique || cat.name,
      creator: {
        '@type': 'Person' as const,
        name: 'Mirta Zaliauskas',
      },
    }))
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Works by Mirta Zaliauskas',
    description: 'Visual artworks: sculpture, drawing, engraving, mixed media and recycled materials.',
    numberOfItems: itemListElement.length,
    itemListElement,
  };
}

export default function JsonLdArtworks({ categories }: Props) {
  const jsonLd = buildVisualArtworkList(categories);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
