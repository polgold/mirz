'use client';

import { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLink from './NavLink';
import Container from './Container';

const SCROLL_THRESHOLD = 24;

const LOCALES = [
  { code: 'es' as const, label: 'ES' },
  { code: 'en' as const, label: 'EN' },
] as const;

const NAV_ITEMS = [
  { href: '/', key: 'home' },
  { href: '/bio', key: 'bio' },
  { href: '/statement', key: 'statement' },
  { href: '/works', key: 'works' },
  { href: '/press', key: 'press' },
  { href: '/contact', key: 'contact' },
] as const;

function LocaleLink({ code, label }: { code: 'es' | 'en'; label: string }) {
  const pathname = usePathname();
  const current =
    typeof document !== 'undefined' ? document.documentElement.lang : 'es';
  const isActive = current === code;

  return (
    <Link
      href={pathname}
      locale={code}
      className={`
        text-sm transition-colors duration-200
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus:outline-none
        ${isActive ? 'font-medium text-white' : 'text-white/80 hover:text-white'}
      `}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 border-b border-[var(--border)]/30 text-white transition-colors duration-300 ${
        scrolled
          ? 'bg-[var(--foreground)]/90 backdrop-blur-[8px] supports-[backdrop-filter]:bg-[var(--foreground)]/85'
          : 'bg-[var(--foreground)]'
      }`}
    >
      <Container>
        <div className="flex h-14 sm:h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="inline-block transition-opacity duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus:outline-none"
            aria-label="Mirta Zaliauskas - Inicio"
          >
            <img
              src="/images/home/logo.png"
              alt="Mirta Zaliauskas"
              className="h-8 w-auto md:h-9"
              width={120}
              height={36}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-7 md:flex lg:gap-8"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ href, key }) => (
              <NavLink key={key} href={href} variant="dark">
                {t(key)}
              </NavLink>
            ))}
          </nav>

          {/* Language + hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 border-l border-neutral-700 pl-4">
              {LOCALES.map(({ code, label }) => (
                <LocaleLink key={code} code={code} label={label} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus:outline-none md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className={`border-t border-white/10 bg-[var(--foreground)]/95 backdrop-blur-[8px] transition-[height,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? 'visible h-auto opacity-100' : 'invisible h-0 overflow-hidden opacity-0'
        }`}
        aria-hidden={!mobileOpen}
      >
        <Container>
          <nav
            className="flex flex-col gap-1 py-4"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-sm text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus:outline-none"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
}
