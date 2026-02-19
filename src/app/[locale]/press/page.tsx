import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import { buildPageMetadata } from '@/lib/seo';
import MarkdownContent from '@/components/MarkdownContent';
import Reveal from '@/components/Reveal';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata('press', locale);
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, title } = await getCopy('press', locale as 'es' | 'en');

  return (
    <article className="max-w-2xl">
      {title && (
        <Reveal as="header" className="mb-12 md:mb-14">
          <h1 className="font-heading text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
            {title}
          </h1>
        </Reveal>
      )}
      <Reveal as="section">
        <MarkdownContent html={content} />
      </Reveal>
    </article>
  );
}
