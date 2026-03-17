export const locales = ['tr', 'en', 'ar'] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = 'tr';
