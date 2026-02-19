import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import { getHomeHeroMedia } from '@/lib/images';
import MarkdownContent from '@/components/MarkdownContent';
import Reveal from '@/components/Reveal';
import { Link } from '@/i18n/navigation';

const YOUTUBE_HERO_ID = 'h1AbuIRyEwc';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const { content, title, data } = await getCopy('home', locale as 'es' | 'en');
  const subtitle = data?.subtitle as string | undefined;
  const { images: heroImages } = getHomeHeroMedia();

  return (
    <>
      {/* Hero curatorial: título + frase + CTA Ver obra */}
      <header className="mb-16 md:mb-20 lg:mb-24">
        {title && (
          <Reveal>
            <h1 className="font-heading text-4xl font-medium tracking-tight text-[var(--foreground)] md:text-5xl lg:text-[2.75rem]">
              {title}
            </h1>
          </Reveal>
        )}
        {subtitle && (
          <Reveal>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted)] md:mt-6 md:text-xl">
              {subtitle}
            </p>
          </Reveal>
        )}
        <Reveal>
          <Link
            href="/works"
            className="link-underline-animated mt-8 inline-block text-sm tracking-wide text-[var(--foreground-soft)] hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none"
          >
            {t('viewWorks')}
          </Link>
        </Reveal>
      </header>

      {/* Video con overlay muy sutil (profundidad) */}
      <section className="hero-fade-in mb-16 w-full overflow-hidden rounded-sm bg-neutral-900 md:mb-20 lg:mb-24">
        <div className="relative aspect-video w-full">
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            aria-hidden
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.06) 100%)',
            }}
          />
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_HERO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_HERO_ID}&rel=0`}
            title="Video hero"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </section>

      <article className="max-w-3xl">
        {/* Grid fotos mir8–mir15 — márgenes generosos */}
        {heroImages.length > 0 && (
          <Reveal className="mb-16 md:mb-20 lg:mb-24">
            <section>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
                {heroImages.map((src) => (
                  <div
                    key={src}
                    className="aspect-square overflow-hidden rounded-sm bg-[var(--border-soft)]"
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      width={400}
                      height={400}
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 400px"
                    />
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal as="section" className="space-y-6">
          <MarkdownContent html={content} />
        </Reveal>
      </article>
    </>
  );
}
