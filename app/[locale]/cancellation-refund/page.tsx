import { LegalPage } from '@/components/public/legal-page';
import { AppLocale } from '@/i18n/routing';
const titles = { tr: 'İptal / İade / Değişiklik', en: 'Cancellation / Refund', ar: 'الإلغاء / الاسترداد / التعديل' } as const;
export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} type="CANCELLATION_REFUND" title={titles[locale]} />;
}
