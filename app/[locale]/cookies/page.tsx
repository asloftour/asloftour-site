import { LegalPage } from '@/components/public/legal-page';
import { AppLocale } from '@/i18n/routing';
const titles = { tr: 'Çerez Politikası', en: 'Cookie Policy', ar: 'سياسة ملفات تعريف الارتباط' } as const;
export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} type="COOKIES" title={titles[locale]} />;
}
