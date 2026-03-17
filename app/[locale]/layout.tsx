import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { resolveLocaleParam } from '@/lib/locale';
import { isRtl } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  const t = await getTranslations({ locale });
  return {
    title: t('brand.name'),
    description: t('brand.tagline'),
    alternates: {
      canonical: `/${locale}`
    }
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={isRtl(locale) ? 'rtl' : 'ltr'} className="min-h-screen bg-background">
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
        <WhatsAppButton />
        <CookieConsent locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
