import { LegalPage } from '@/components/public/legal-page';
import { resolveLocaleParam } from '@/lib/locale';

const titles = { tr: 'Gizlilik Politikası', en: 'Privacy Policy', ar: 'سياسة الخصوصية' } as const;

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return <LegalPage locale={locale} type="PRIVACY" title={titles[locale]} />;
}
