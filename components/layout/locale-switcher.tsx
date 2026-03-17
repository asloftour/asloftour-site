'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localeLabels } from '@/lib/site';
import type { AppLocale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const locales: AppLocale[] = ['tr', 'en', 'ar'];

export function LocaleSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const pathname = usePathname();
  const stripped = pathname.replace(/^\/(tr|en|ar)/, '');

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 p-1">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${stripped || ''}`}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition',
            currentLocale === locale ? 'bg-gold text-black' : 'text-white/72 hover:bg-white/8'
          )}
        >
          {localeLabels[locale]}
        </Link>
      ))}
    </div>
  );
}
