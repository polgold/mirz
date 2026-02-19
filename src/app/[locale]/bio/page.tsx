import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import { buildPageMetadata } from '@/lib/seo';
import MarkdownContent from '@/components/MarkdownContent';
import Reveal from '@/components/Reveal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata('bio', locale);
}

const BIO_SUMMARY = {
  es: 'Mirta Zaliauskas es una artista visual contemporánea argentina. Trabaja en escultura, dibujo, grabado, pintura y materiales reciclados; su obra explora la transformación, los paisajes y la emoción humana a través de la experimentación con materiales.',
  en: 'Mirta Zaliauskas is an Argentine contemporary visual artist working with mixed media, drawing, engraving and recycled materials. Her work explores transformation, landscapes and human emotion through material experimentation.',
} as const;

export default async function BioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, data } = await getCopy('bio', locale as 'es' | 'en');
  const title = (data.title as string) || 'Bio';
  const summary = BIO_SUMMARY[locale as keyof typeof BIO_SUMMARY] ?? BIO_SUMMARY.en;

  return (
    <article className="max-w-2xl">
      <Reveal as="header" className="mb-12 md:mb-14">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          {summary}
        </p>
      </Reveal>
      <Reveal className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
        <figure className="shrink-0 overflow-hidden rounded-sm bg-[var(--border-soft)] md:w-52 md:max-w-[13rem]">
          <img
            src="/images/home/mir2.jpeg"
            alt="Mirta Zaliauskas"
            className="h-auto w-full object-cover"
            width={208}
            height={260}
            loading="lazy"
          />
        </figure>
        <section className="min-w-0 flex-1">
          <MarkdownContent html={content} />
        </section>
      </Reveal>
    </article>
  );
}
