import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { resolveLocaleParam } from '@/lib/locale';
import { tLocale, ui } from '@/lib/public-copy';

export default async function FailPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.fail.eyebrow, locale)} title={tLocale(ui.fail.title, locale)} description={tLocale(ui.fail.description, locale)} showActions={false} />
      <Container className="py-16 flex flex-wrap gap-3"><Button asChild><Link href={`/${locale}/payment`}>{tLocale(ui.common.retryPayment, locale)}</Link></Button><Button variant="secondary" asChild><Link href={`/${locale}/contact`}>{tLocale(ui.common.contactSupport, locale)}</Link></Button></Container>
    </>
  );
}
