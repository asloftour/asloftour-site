import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './routing';

function unflatten(messages: Record<string, unknown>) {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(messages)) {
    const parts = key.split('.');
    let current: Record<string, unknown> = result;

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      const isLeaf = i === parts.length - 1;

      if (isLeaf) {
        current[part] = value;
      } else {
        const next = current[part];
        if (!next || typeof next !== 'object' || Array.isArray(next)) {
          current[part] = {};
        }
        current = current[part] as Record<string, unknown>;
      }
    }
  }

  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) || defaultLocale;
  const validLocale = locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale;
  const rawMessages = (await import(`../messages/${validLocale}.json`)).default as Record<string, unknown>;

  return {
    locale: validLocale,
    messages: unflatten(rawMessages)
  };
});
