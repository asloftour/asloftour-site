import { LegalPage } from '@/components/public/legal-page';
import { AppLocale } from '@/i18n/routing';
const titles = { tr: 'Mesafeli Satış Koşulları', en: 'Distance Sales Terms', ar: 'شروط البيع عن بُعد' } as const;
export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} type="DISTANCE_SALES" title={titles[locale]} />;
}
