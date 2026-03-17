import Link from 'next/link';
import { LegalDocumentType } from '@prisma/client';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { PaymentPanel } from '@/components/public/payment-panel';
import { ReservationSummary } from '@/components/public/reservation-summary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { resolveLocaleParam } from '@/lib/locale';
import { getLegalDocument, getSiteSettings } from '@/lib/queries';

const copy = {
  tr: {
    eyebrow: 'Güvenli ödeme',
    title: 'Rezervasyonunuzu tamamlayın',
    description: 'Kart, IBAN ve ödeme linki akışları tek bir operasyon mantığında yönetilir. Yasal metinler ödeme öncesinde görünür; durum güncellemeleri rezervasyon kaydına işlenir.',
    requestedLink: 'Güvenli ödeme linki talebiniz kaydedildi. Operasyon ekibi kısa süre içinde sizinle bağlantı kurabilir.',
    noReservationTitle: 'Ödeme adımı rezervasyon kaydıyla birlikte aktifleşir',
    noReservationText: 'Bu sayfa, ödeme yöntemlerini ve yasal akışı önceden incelemeniz için açık tutulur. Tahsilatı tamamlamak için rezervasyon oluşturduğunuzda size özel ödeme kaydı oluşturulur.',
    bookingCta: 'Önce rezervasyon oluştur',
    supportCta: 'Rezervasyon masasıyla görüş'
  },
  en: {
    eyebrow: 'Secure payment',
    title: 'Complete your reservation',
    description: 'Card, IBAN and payment-link flows are managed within one operational logic. Legal texts stay visible before payment and every status change is written into the reservation record.',
    requestedLink: 'Your secure payment link request has been recorded. The operations team may contact you shortly.',
    noReservationTitle: 'The payment step becomes active once a reservation exists',
    noReservationText: 'This page remains open so guests can review payment methods and legal texts in advance. A dedicated payment record is created as soon as a reservation is submitted.',
    bookingCta: 'Create a reservation first',
    supportCta: 'Talk to reservations'
  },
  ar: {
    eyebrow: 'دفع آمن',
    title: 'أكمل حجزك',
    description: 'تُدار المدفوعات بالبطاقة والآيبان وروابط الدفع ضمن منطق تشغيلي واحد. تبقى النصوص القانونية ظاهرة قبل الدفع ويتم تسجيل كل تحديث داخل الحجز.',
    requestedLink: 'تم تسجيل طلب رابط الدفع الآمن. قد يتواصل معك فريق العمليات قريباً.',
    noReservationTitle: 'تتفعّل خطوة الدفع بعد إنشاء الحجز',
    noReservationText: 'تظل هذه الصفحة متاحة لمراجعة طرق الدفع والنصوص القانونية مسبقاً. يتم إنشاء سجل دفع مخصص بمجرد إرسال الحجز.',
    bookingCta: 'أنشئ الحجز أولاً',
    supportCta: 'تواصل مع فريق الحجوزات'
  }
} as const;

export default async function PaymentPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reservation?: string; requestedLink?: string }>;
}) {
  const locale = await resolveLocaleParam(params);
  const { reservation: reservationId, requestedLink } = await searchParams;

  const [settings, docs, providers] = await Promise.all([
    getSiteSettings(),
    Promise.all([
      getLegalDocument(locale, LegalDocumentType.PRE_INFORMATION),
      getLegalDocument(locale, LegalDocumentType.DISTANCE_SALES),
      getLegalDocument(locale, LegalDocumentType.CANCELLATION_REFUND),
      getLegalDocument(locale, LegalDocumentType.PRIVACY),
      getLegalDocument(locale, LegalDocumentType.COOKIES),
      getLegalDocument(locale, LegalDocumentType.SERVICE_AGREEMENT)
    ]),
    db.paymentProviderSetting.findMany({ orderBy: { provider: 'asc' } })
  ]);

  const reservation = reservationId
    ? await db.reservation.findUnique({ where: { id: reservationId }, include: { items: true } })
    : null;

  const item = reservation?.items[0];
  const current = copy[locale];
  const paymentOptions = {
    enableCard: settings.paymentOptions?.enableCard ?? true,
    enableBankTransfer: settings.paymentOptions?.enableBankTransfer ?? true,
    enablePaymentLink: settings.paymentOptions?.enablePaymentLink ?? true,
    allowMockProvider: settings.paymentOptions?.allowMockProvider ?? true
  };
  const bankTransfer = settings.bankTransfer || {};
  const providerMeta = providers.map((provider) => ({
    provider: provider.provider,
    testMode: provider.testMode,
    ready: Boolean(provider.apiUrl && provider.merchantId && (provider.storeKeyEncrypted || provider.provider === 'MOCK')),
    active: provider.active
  }));
  const activeProviders = providerMeta
    .filter((provider) => provider.active && (provider.provider !== 'MOCK' || paymentOptions.allowMockProvider))
    .map((provider) => provider.provider);
  const liveReady = providerMeta.some((provider) => provider.active && provider.provider !== 'MOCK' && provider.ready);
  const mockReady = providerMeta.some((provider) => provider.active && provider.provider === 'MOCK' && paymentOptions.allowMockProvider);
  const cardGatewayStatus = liveReady ? 'live' : mockReady ? 'test' : 'inactive';

  return (
    <>
      <PageHero locale={locale} eyebrow={current.eyebrow} title={current.title} description={current.description} showActions={false} />
      <Container className="py-16">
        {requestedLink ? <div className="mb-6 rounded-3xl border border-gold/30 bg-gold/10 p-5 text-sm text-white/78">{current.requestedLink}</div> : null}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <PaymentPanel
              locale={locale}
              reservationId={reservation?.id}
              activeProviders={activeProviders.length ? activeProviders : ['MOCK']}
              legalDocuments={docs.filter(Boolean).map((doc) => ({ id: doc!.id, title: doc!.title, content: doc!.content }))}
              paymentOptions={paymentOptions}
              bankTransfer={bankTransfer}
              cardGatewayStatus={cardGatewayStatus}
              providerMeta={providerMeta}
            />
            {!reservation ? (
              <Card>
                <CardContent>
                  <div className="text-sm uppercase tracking-[0.2em] text-white/46">AS LOF TOUR</div>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{current.noReservationTitle}</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">{current.noReservationText}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild><Link href={`/${locale}/booking`}>{current.bookingCta}</Link></Button>
                    <Button asChild variant="secondary"><Link href={`/${locale}/contact`}>{current.supportCta}</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
          {reservation && item ? (
            <ReservationSummary
              locale={locale}
              title={item.titleSnapshot}
              startDate={reservation.startDate}
              endDate={reservation.endDate}
              guestCount={reservation.guestCount}
              amount={Number(reservation.totalAmount)}
              currency={reservation.currency}
              pricingLabel={item.pricingMode}
              code={reservation.code}
            />
          ) : (
            <Card className="lg:sticky lg:top-24">
              <CardContent>
                <div className="text-sm uppercase tracking-[0.2em] text-white/46">AS LOF TOUR</div>
                <div className="mt-4 text-2xl font-semibold text-white">{current.noReservationTitle}</div>
                <div className="mt-6 space-y-4 text-sm text-white/72">
                  <div className="flex justify-between gap-4"><span>Visa / Mastercard / TROY</span><span>{cardGatewayStatus === 'live' ? 'Ready' : cardGatewayStatus === 'test' ? 'Test' : 'Off'}</span></div>
                  <div className="flex justify-between gap-4"><span>IBAN</span><span>{bankTransfer?.iban ? 'Configured' : 'Pending'}</span></div>
                  <div className="flex justify-between gap-4"><span>Payment link</span><span>{paymentOptions.enablePaymentLink ? 'Visible' : 'Hidden'}</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </>
  );
}
