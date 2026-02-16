import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import MarkdownContent from '@/components/MarkdownContent';

type Props = { params: Promise<{ locale: string }> };

export default async function BioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, data } = await getCopy('bio', locale as 'es' | 'en');
  const title = (data.title as string) || 'Bio';

  return (
    <article className="max-w-4xl">
      <header className="mb-10 md:mb-12">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-neutral-900 md:text-4xl">
          {title}
        </h1>
      </header>
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <figure className="shrink-0 overflow-hidden rounded-sm bg-neutral-100 md:w-56 md:max-w-[14rem]">
          <img
            src="/images/home/mir2.jpeg"
            alt=""
            className="h-auto w-full object-cover"
            width={224}
            height={280}
          />
        </figure>
        <section className="min-w-0 flex-1 space-y-6">
          <MarkdownContent html={content} />
        </section>
      </div>
    </article>
  );
}
