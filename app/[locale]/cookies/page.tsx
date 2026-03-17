import { LegalPage } from '@/components/public/legal-page';
import { resolveLocaleParam } from '@/lib/locale';
const titles = { tr: 'Çerez Politikası', en: 'Cookie Policy', ar: 'سياسة ملفات تعريف الارتباط' } as const;
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return <LegalPage locale={locale} type="COOKIES" title={titles[locale]} />;
}
