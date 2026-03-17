import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { resolveLocaleParam } from '@/lib/locale';
import { tLocale, ui } from '@/lib/public-copy';

export default async function SuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.success.eyebrow, locale)} title={tLocale(ui.success.title, locale)} description={tLocale(ui.success.description, locale)} showActions={false} />
      <Container className="py-16"><Button asChild><Link href={`/${locale}`}>{tLocale(ui.common.returnHome, locale)}</Link></Button></Container>
    </>
  );
}
