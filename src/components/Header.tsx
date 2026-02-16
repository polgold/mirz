'use client';

import { useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLink from './NavLink';
import Container from './Container';

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
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none
        ${isActive ? 'font-medium text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}
      `}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/95">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none"
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
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ href, key }) => (
              <NavLink key={key} href={href}>
                {t(key)}
              </NavLink>
            ))}
          </nav>

          {/* Language + hamburger */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
              {LOCALES.map(({ code, label }) => (
                <LocaleLink key={code} code={code} label={label} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none md:hidden"
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
        className={`border-t border-neutral-200/80 bg-white/98 backdrop-blur-md transition-[height,opacity] duration-200 ease-out md:hidden ${
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
                className="rounded-md px-2 py-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none"
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
