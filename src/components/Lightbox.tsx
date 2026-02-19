'use client';

import { useEffect, useCallback, useRef } from 'react';
import type { GalleryImage } from '@/lib/images';

type Props = {
  image: GalleryImage;
  showPrice: boolean;
  onClose: () => void;
};

export default function Lightbox({ image, showPrice, onClose }: Props) {
  const { src, alt, title, technique, measure, price } = image;
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const displayTitle = title ?? alt;

  return (
    <div
      className="lightbox-backdrop fixed inset-0 z-50 flex flex-col items-center justify-center p-6 opacity-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-xl text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus:outline-none"
        aria-label="Cerrar"
      >
        ×
      </button>
      <div
        className="flex max-h-[85vh] max-w-full flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="lightbox-image max-h-[70vh] w-auto max-w-full object-contain opacity-0 drop-shadow-2xl"
        />
        <div className="w-full max-w-md space-y-1 text-center text-white/90">
          <p className="font-medium tracking-wide">{displayTitle}</p>
          {technique && (
            <p className="text-sm text-white/75">{technique}</p>
          )}
          {measure && (
            <p className="text-sm text-white/75">{measure}</p>
          )}
          {showPrice && price && (
            <p className="text-sm text-white/75">{price}</p>
          )}
        </div>
      </div>
    </div>
  );
}
