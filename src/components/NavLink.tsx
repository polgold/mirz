'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative text-sm text-neutral-500 transition-colors duration-200
        hover:text-neutral-900
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 focus:outline-none
        ${isActive ? 'font-medium text-neutral-900' : ''}
      `}
    >
      {children}
      {isActive && (
        <span
          className="absolute -bottom-px left-0 right-0 h-px bg-neutral-900"
          aria-hidden
        />
      )}
    </Link>
  );
}
