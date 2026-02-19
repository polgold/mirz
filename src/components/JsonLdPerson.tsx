import { SITE_BASE } from '@/lib/seo';

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mirta Zaliauskas',
  jobTitle: 'Visual Artist',
  url: SITE_BASE,
  description:
    'Mirta Zaliauskas is an Argentine contemporary visual artist working with mixed media, drawing, engraving and recycled materials. Her work explores transformation, landscapes and human emotion through material experimentation.',
  sameAs: ['https://www.instagram.com/mirta.zaliauskas/'],
} as const;

export default function JsonLdPerson() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
    />
  );
}
