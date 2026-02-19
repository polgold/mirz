'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
  /** Para header oscuro: enlaces blancos */
  variant?: 'default' | 'dark';
};

export default function NavLink({ href, children, variant = 'default' }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const isDark = variant === 'dark';

  return (
    <Link
      href={href}
      className={`
        link-underline-animated relative inline-block text-sm tracking-wide transition-colors duration-200
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none
        ${isDark
          ? `text-white/90 hover:text-white focus-visible:outline-white ${isActive ? 'font-medium text-white' : ''}`
          : `text-neutral-600 hover:text-neutral-900 focus-visible:outline-neutral-400 ${isActive ? 'font-medium text-neutral-900' : ''}`
        }
      `}
    >
      {children}
      {isActive && (
        <span
          className={`absolute -bottom-px left-0 right-0 h-px ${isDark ? 'bg-white' : 'bg-neutral-900'}`}
          aria-hidden
        />
      )}
    </Link>
  );
}
