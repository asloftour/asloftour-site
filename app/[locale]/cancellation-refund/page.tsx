import { LegalPage } from '@/components/public/legal-page';
import { resolveLocaleParam } from '@/lib/locale';
const titles = { tr: 'İptal / İade / Değişiklik', en: 'Cancellation / Refund', ar: 'الإلغاء / الاسترداد / التعديل' } as const;
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return <LegalPage locale={locale} type="CANCELLATION_REFUND" title={titles[locale]} />;
}
