import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AppLocale } from '@/i18n/routing';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string, currency = 'TRY', locale: AppLocale = 'tr') {
  const numeric = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'tr-TR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(numeric);
}

export function formatDate(date: Date | string, locale: AppLocale = 'tr') {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : locale === 'en' ? 'en-US' : 'tr-TR', {
    dateStyle: 'medium'
  }).format(typeof date === 'string' ? new Date(date) : date);
}

export function isRtl(locale: AppLocale) {
  return locale === 'ar';
}

export function toLocaleEnum(locale: AppLocale) {
  return locale.toUpperCase() as 'TR' | 'EN' | 'AR';
}

export function maskedSecret(secret?: string | null) {
  if (!secret) return 'Not configured';
  const visible = secret.slice(-4);
  return `••••••••${visible}`;
}

export function absoluteUrl(path = '') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${base}${path}`;
}
