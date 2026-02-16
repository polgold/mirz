import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import MarkdownContent from '@/components/MarkdownContent';

type Props = { params: Promise<{ locale: string }> };

export default async function StatementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, data } = await getCopy('statement', locale as 'es' | 'en');
  const title = (data.title as string) || 'Statement';

  return (
    <article className="max-w-3xl">
      <header className="mb-10 md:mb-12">
        <figure className="mb-8 overflow-hidden rounded-sm bg-neutral-100">
          <img
            src="/images/home/mir.jpeg"
            alt=""
            className="w-full object-cover"
            width={800}
            height={500}
          />
        </figure>
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
