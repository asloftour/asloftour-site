import { LegalPage } from '@/components/public/legal-page';
import { resolveLocaleParam } from '@/lib/locale';
const titles = { tr: 'Hizmet Sözleşmesi', en: 'Service Agreement', ar: 'اتفاقية الخدمة' } as const;
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return <LegalPage locale={locale} type="SERVICE_AGREEMENT" title={titles[locale]} />;
}
