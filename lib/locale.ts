import { notFound } from 'next/navigation';
import { locales, type AppLocale } from '@/i18n/routing';

export function resolveAppLocale(locale: string): AppLocale {
  if (locales.includes(locale as AppLocale)) {
    return locale as AppLocale;
  }
  notFound();
}

export async function resolveLocaleParam(params: Promise<{ locale: string }>): Promise<AppLocale> {
  const { locale } = await params;
  return resolveAppLocale(locale);
}
