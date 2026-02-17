import { setRequestLocale } from 'next-intl/server';
import { getCopy } from '@/lib/markdown';
import { getHomeHeroMedia } from '@/lib/images';
import MarkdownContent from '@/components/MarkdownContent';

const YOUTUBE_HERO_ID = 'h1AbuIRyEwc';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, title, data } = await getCopy('home', locale as 'es' | 'en');
  const subtitle = data?.subtitle as string | undefined;
  const { images: heroImages } = getHomeHeroMedia();

  return (
    <>
      {/* Hero: YouTube a ancho completo, autoplay mute */}
      <section className="mb-12 md:mb-16 w-full overflow-hidden bg-neutral-900">
        <div className="relative aspect-video w-full">
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
      {/* Fotos mir8 a mir15 */}
      {heroImages.length > 0 && (
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {heroImages.map((src) => (
              <div
                key={src}
                className="aspect-square overflow-hidden rounded-sm bg-neutral-100"
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
            ))}
          </div>
        </section>
      )}

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
    </>
  );
}
