import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { Locale, isLocale, isRtl } from '@/lib/site-content';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;

  return (
    <div dir={isRtl(locale) ? 'rtl' : 'ltr'} className={`page-shell ${isRtl(locale) ? 'is-rtl' : ''}`}>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
      <WhatsAppFloat locale={locale} />
    </div>
  );
}
