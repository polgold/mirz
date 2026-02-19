import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import MarkdownContent from '@/components/MarkdownContent';
import Reveal from '@/components/Reveal';

type Props = { params: Promise<{ locale: string }> };

export default async function BioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, data } = await getCopy('bio', locale as 'es' | 'en');
  const title = (data.title as string) || 'Bio';

  return (
    <article className="max-w-2xl">
      <Reveal as="header" className="mb-12 md:mb-14">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-[var(--foreground)] md:text-4xl">
          {title}
        </h1>
      </Reveal>
      <Reveal className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
        <figure className="shrink-0 overflow-hidden rounded-sm bg-[var(--border-soft)] md:w-52 md:max-w-[13rem]">
          <img
            src="/images/home/mir2.jpeg"
            alt=""
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
