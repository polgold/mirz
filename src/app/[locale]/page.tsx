import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import MarkdownContent from '@/components/MarkdownContent';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, title, data } = await getCopy('home', locale as 'es' | 'en');
  const subtitle = data?.subtitle as string | undefined;

  return (
    <article className="max-w-3xl">
      <header className="mb-12 md:mb-16">
        {title && (
          <h1 className="font-heading text-4xl font-medium tracking-tight text-neutral-900 md:text-5xl lg:text-[2.75rem]">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-4 text-lg text-neutral-500 md:mt-5 md:text-xl">
            {subtitle}
          </p>
        )}
      </header>
      <section className="space-y-6">
        <MarkdownContent html={content} />
      </section>
    </article>
  );
}
