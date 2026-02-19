'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px 0px -8% 0px',
  threshold: 0.1,
};

/**
 * Hook que activa una clase CSS cuando el elemento entra en viewport.
 * Respetar prefers-reduced-motion en CSS (clase .reveal-visible sin transición cuando reduce).
 */
export function useInViewAnimation(options: Partial<IntersectionObserverInit> = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const opts = { ...DEFAULT_OPTIONS, ...options };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      opts
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold]);

  return { ref, isInView };
}
