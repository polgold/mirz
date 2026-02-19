'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ENDPOINT = '/contact.php';

export default function ContactForm() {
  const t = useTranslations('contactForm');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const text = await res.text();
      let data: { ok?: boolean; error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        /* no JSON */
      }

      if (res.ok && data.ok) {
        setStatus('ok');
        setMessage(t('success'));
        form.reset();
      } else {
        setStatus('error');
        const detail = data.error || `HTTP ${res.status}: ${text.slice(0, 80)}`;
        setMessage(`${t('error')} (${detail})`);
      }
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Error de red';
      setMessage(`${t('error')} (${msg})`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium tracking-wide text-neutral-700">
          {t('name')}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 shadow-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium tracking-wide text-neutral-700">
          {t('email')}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 shadow-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium tracking-wide text-neutral-700">
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 shadow-sm transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-premium rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium tracking-wide text-white disabled:opacity-60"
        >
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
        {message && (
          <p
            className={`text-sm ${
              status === 'ok' ? 'text-green-700' : status === 'error' ? 'text-red-600' : ''
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
