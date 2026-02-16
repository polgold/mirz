import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import MarkdownContent from '@/components/MarkdownContent';

type Props = { params: Promise<{ locale: string }> };

export default async function StatementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, data } = await getCopy('statement');
  const title = (data.title as string) || 'Statement';

  return (
    <article className="max-w-3xl">
      <header className="mb-10 md:mb-12">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
          {title}
        </h1>
      </header>
      <section className="space-y-6">
        <MarkdownContent html={content} />
      </section>
    </article>
  );
}
