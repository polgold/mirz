'use client';

import { useInViewAnimation } from '@/hooks/useInViewAnimation';

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header';
};

export default function Reveal({ children, className = '', as: Tag = 'div' }: Props) {
  const { ref, isInView } = useInViewAnimation();

  return (
    <Tag
      ref={ref as unknown as React.Ref<HTMLDivElement>}
      className={`reveal-initial ${isInView ? 'reveal-visible' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
