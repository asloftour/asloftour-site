import { LegalPage } from '@/components/public/legal-page';
import { AppLocale } from '@/i18n/routing';

const titles = { tr: 'Gizlilik Politikası', en: 'Privacy Policy', ar: 'سياسة الخصوصية' } as const;

export default async function Page({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return <LegalPage locale={locale} type="PRIVACY" title={titles[locale]} />;
}
