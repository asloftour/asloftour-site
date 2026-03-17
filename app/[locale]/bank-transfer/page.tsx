import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent } from '@/components/ui/card';
import { getSiteSettings } from '@/lib/queries';
import { db } from '@/lib/db';
import { TransferProofForm } from '@/components/public/transfer-proof-form';
import { resolveLocaleParam } from '@/lib/locale';
import { tLocale, ui } from '@/lib/public-copy';

export default async function BankTransferPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reservation?: string }>;
}) {
  const locale = await resolveLocaleParam(params);
  const { reservation } = await searchParams;
  const settings = await getSiteSettings();
  const bank = settings.bankTransfer || {};
  if (!reservation) notFound();
  const payment = await db.payment.findFirst({ where: { reservationId: reservation, method: 'BANK_TRANSFER' }, orderBy: { createdAt: 'desc' } });
  if (!payment) notFound();

  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.bankTransfer.eyebrow, locale)} title={tLocale(ui.bankTransfer.title, locale)} description={tLocale(ui.bankTransfer.description, locale)} showActions={false} />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Card><CardContent className="space-y-3 text-sm leading-7 text-white/72">
            <div>{tLocale(ui.bankTransfer.accountName, locale)}: {bank.accountName || 'AS LOF TOUR'}</div>
            <div>{tLocale(ui.bankTransfer.bank, locale)}: {bank.bankName || tLocale(ui.bankTransfer.configureAdmin, locale)}</div>
            <div>{tLocale(ui.bankTransfer.iban, locale)}: {bank.iban || tLocale(ui.bankTransfer.configureAdmin, locale)}</div>
            <div>{tLocale(ui.bankTransfer.referenceNote, locale)}</div>
            <div>{tLocale(ui.bankTransfer.status, locale)}: {payment.status}</div>
          </CardContent></Card>
          <TransferProofForm paymentId={payment.id} locale={locale} />
        </div>
      </Container>
    </>
  );
}
