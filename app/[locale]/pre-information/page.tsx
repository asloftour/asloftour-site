import { LegalPage } from '@/components/public/legal-page';
import { AppLocale } from '@/i18n/routing';
const titles = { tr: 'Ön Bilgilendirme Formu', en: 'Pre-Information Form', ar: 'النموذج التمهيدي' } as const;
export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} type="PRE_INFORMATION" title={titles[locale]} />;
}
