import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent } from '@/components/ui/card';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';

export default async function PoliciesPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const items = [
    ['/privacy', tLocale(ui.footer.privacy, locale)],
    ['/cookies', tLocale(ui.footer.cookies, locale)],
    ['/distance-sales', tLocale(ui.footer.distanceSales, locale)],
    ['/cancellation-refund', tLocale(ui.footer.cancellationRefund, locale)],
    ['/pre-information', tLocale(ui.footer.preInformation, locale)],
    ['/service-agreement', tLocale(ui.footer.serviceAgreement, locale)]
  ] as const;
  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.policies.eyebrow, locale)} title={tLocale(ui.policies.title, locale)} description={tLocale(ui.policies.description, locale)} />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map(([href, label]) => (
            <Card key={href}><CardContent><h2 className="text-xl font-semibold text-white">{label}</h2><p className="mt-3 text-sm leading-7 text-white/68">{tLocale(ui.policies.cardText, locale)}</p><Link className="mt-5 inline-block text-gold" href={`/${locale}${href}`}>{tLocale(ui.common.readDocument, locale)}</Link></CardContent></Card>
          ))}
        </div>
      </Container>
    </>
  );
}
