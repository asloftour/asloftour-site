import { LegalPage } from '@/components/public/legal-page';
import { resolveLocaleParam } from '@/lib/locale';
const titles = { tr: 'Mesafeli Satış Koşulları', en: 'Distance Sales Terms', ar: 'شروط البيع عن بُعد' } as const;
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return <LegalPage locale={locale} type="DISTANCE_SALES" title={titles[locale]} />;
}
