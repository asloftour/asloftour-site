import { LegalPage } from '@/components/public/legal-page';
import { resolveLocaleParam } from '@/lib/locale';
const titles = { tr: 'Ön Bilgilendirme Formu', en: 'Pre-Information Form', ar: 'النموذج التمهيدي' } as const;
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return <LegalPage locale={locale} type="PRE_INFORMATION" title={titles[locale]} />;
}
