'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const TO_EMAIL = 'hola@mirtazaliauskas.com';
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

      if (res.ok) {
        setStatus('ok');
        setMessage(t('success'));
        form.reset();
      } else {
        setStatus('error');
        setMessage(t('error'));
      }
    } catch {
      setStatus('error');
      setMessage(t('error'));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('name')}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('email')}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-neutral-700">
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-60"
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
