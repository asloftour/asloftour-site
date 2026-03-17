import { LegalPage } from '@/components/public/legal-page';
import { AppLocale } from '@/i18n/routing';
const titles = { tr: 'Hizmet Sözleşmesi', en: 'Service Agreement', ar: 'اتفاقية الخدمة' } as const;
export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} type="SERVICE_AGREEMENT" title={titles[locale]} />;
}
