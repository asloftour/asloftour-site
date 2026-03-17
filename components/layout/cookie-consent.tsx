'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLocale } from '@/i18n/routing';

const copy = {
  tr: {
    title: 'Çerez tercihleri',
    description: 'Gerekli çerezler rezervasyon güvenliği, dil tercihi ve oturum sürekliliği için kullanılır. İsteğe bağlı çerezleri kabul veya reddedebilirsiniz.',
    accept: 'Kabul et',
    reject: 'Reddet',
    policy: 'Çerez politikasını incele'
  },
  en: {
    title: 'Cookie preferences',
    description: 'Necessary cookies are used for reservation security, language preference and session continuity. You can accept or reject optional cookies.',
    accept: 'Accept',
    reject: 'Reject',
    policy: 'Review cookie policy'
  },
  ar: {
    title: 'تفضيلات ملفات الارتباط',
    description: 'تُستخدم ملفات الارتباط الضرورية لأمان الحجز وتفضيل اللغة واستمرارية الجلسة. يمكنك قبول ملفات الارتباط الاختيارية أو رفضها.',
    accept: 'قبول',
    reject: 'رفض',
    policy: 'مراجعة سياسة ملفات الارتباط'
  }
} as const;

export function CookieConsent({ locale }: { locale: AppLocale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('aslof_cookie_pref');
    if (!stored) setVisible(true);
  }, []);

  function decide(value: 'accepted' | 'rejected') {
    window.localStorage.setItem('aslof_cookie_pref', value);
    setVisible(false);
  }

  if (!visible) return null;
  const current = copy[locale];

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl rounded-[28px] border border-white/12 bg-[#0b0b10]/95 p-5 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d5c28a]">{current.title}</div>
          <p className="mt-3 text-sm leading-7 text-white/72">{current.description}</p>
          <Link href={`/${locale}/cookies`} className="mt-3 inline-flex text-sm text-[#d5c28a] hover:text-white">{current.policy}</Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => decide('rejected')}>{current.reject}</Button>
          <Button onClick={() => decide('accepted')}>{current.accept}</Button>
        </div>
      </div>
    </div>
  );
}
