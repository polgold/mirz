'use client';

import { useEffect, useCallback } from 'react';

type Props = {
  src: string;
  alt: string;
  onClose: () => void;
};

export default function Lightbox({ src, alt, onClose }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 text-3xl text-white/90 hover:text-white"
        aria-label="Cerrar"
      >
        ×
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
