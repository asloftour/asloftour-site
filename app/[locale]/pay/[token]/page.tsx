import { notFound } from 'next/navigation';
import { ReservationStatus } from '@prisma/client';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentLinkStart } from '@/components/public/payment-link-start';
import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { AppLocale } from '@/i18n/routing';

const copy = {
  tr: {
    eyebrow: 'Ödeme linki',
    title: 'Güvenli ödeme',
    description: 'Aþaðýdaki tutar için güvenli Halkbank ödeme akýþýna devam edebilirsiniz.',
    paid: 'Bu ödeme zaten tamamlanmýþ görünüyor.',
    cta: 'Güvenli ödemeye devam et',
    descriptionLabel: 'Açýklama',
    amountLabel: 'Tutar'
  },
  en: {
    eyebrow: 'Payment link',
    title: 'Secure payment',
    description: 'You can continue to the secure Halkbank payment flow for the amount below.',
    paid: 'This payment appears to have already been completed.',
    cta: 'Continue to secure payment',
    descriptionLabel: 'Description',
    amountLabel: 'Amount'
  },
  ar: {
    eyebrow: '???? ?????',
    title: '??? ???',
    description: '????? ???????? ??? ????? ????? ?????? ?? ???? ??? ?????? ?????.',
    paid: '???? ?? ??? ?????? ?? ?????? ??????.',
    cta: '???????? ??? ????? ?????',
    descriptionLabel: '?????',
    amountLabel: '??????'
  }
} as const;

export default async function PaymentLinkPage({
  params
}: {
  params: Promise<{ locale: AppLocale; token: string }>;
}) {
  const { locale, token } = await params;

  const linkPayment = await db.payment.findUnique({
    where: { paymentLinkToken: token },
    include: { reservation: true }
  });

  if (!linkPayment || !linkPayment.reservation) {
    notFound();
  }

  const t = copy[locale];
  const isPaid = linkPayment.reservation.status === ReservationStatus.PAID;
  const description = linkPayment.reservation.specialRequests || 'Turizm danýþmanlýk ücreti';

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        showActions={false}
      />
      <Container className="py-16">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-white/46">
                    AS LOF TOUR
                  </div>
                  <div className="mt-4 grid gap-4 rounded-3xl border border-white/10 bg-white/4 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/56">{t.amountLabel}</span>
                      <span className="text-lg font-semibold text-white">
                        {formatCurrency(Number(linkPayment.amount), linkPayment.currency, locale)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-white/56">{t.descriptionLabel}</span>
                      <span className="max-w-[70%] text-right text-white">{description}</span>
                    </div>
                  </div>
                </div>

                {isPaid ? (
                  <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm text-white/84">
                    {t.paid}
                  </div>
                ) : (
                  <PaymentLinkStart locale={locale} reservationId={linkPayment.reservationId} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
}
