import Link from 'next/link';
import { LegalDocumentType, Locale } from '@prisma/client';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { PaymentPanel } from '@/components/public/payment-panel';
import { ReservationSummary } from '@/components/public/reservation-summary';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { AppLocale } from '@/i18n/routing';
import { getLegalDocument, getSiteSettings } from '@/lib/queries';
import { getExperienceCopy, getExperienceImage } from '@/lib/experience-media';
import { toLocaleEnum } from '@/lib/utils';
import { experienceCategories } from '@/lib/site';

const copy = {
  tr: {
    eyebrow: 'Güvenli ödeme',
    title: 'Rezervasyonunuzu tamamlayın',
    description: 'Kart, IBAN ve güvenli ödeme linki seçenekleri tek bir rafine akış içinde yönetilir. Yasal metinler ödeme öncesinde görünür; tüm durum güncellemeleri rezervasyon kaydına işlenir.',
    requestedLink: 'Güvenli ödeme linki talebiniz kaydedildi. Operasyon ekibi kısa süre içinde sizinle iletişime geçebilir.',
    noReservationTitle: 'Ödeme adımı rezervasyonla birlikte aktifleşir',
    noReservationText: 'Bu alan; ödeme seçeneklerini, yasal çerçeveyi ve işlem disiplinini önceden inceleyebilmeniz için açık tutulur. Rezervasyon oluşturduğunuzda size özel ödeme kaydı otomatik olarak açılır.',
    bookingCta: 'Önce rezervasyon oluştur',
    supportCta: 'Rezervasyon masasıyla görüş',
    cardLabel: 'Kart ödemesi',
    ibanLabel: 'IBAN',
    linkLabel: 'Ödeme linki',
    ready: 'Hazır',
    test: 'Test',
    off: 'Kapalı',
    configured: 'Tanımlı',
    pending: 'Bekliyor',
    visible: 'Görünür',
    hidden: 'Kapalı'
  },
  en: {
    eyebrow: 'Secure payment',
    title: 'Complete your reservation',
    description: 'Card, IBAN and secure payment-link options are handled within one refined flow. Legal texts remain visible before payment, and every status change is recorded on the reservation.',
    requestedLink: 'Your secure payment link request has been recorded. The operations team may contact you shortly.',
    noReservationTitle: 'The payment step becomes active once a reservation exists',
    noReservationText: 'This area remains open so guests can review payment options, legal framework and transaction discipline in advance. A dedicated payment record is created automatically once a reservation is submitted.',
    bookingCta: 'Create a reservation first',
    supportCta: 'Speak with reservations',
    cardLabel: 'Card payment',
    ibanLabel: 'IBAN',
    linkLabel: 'Payment link',
    ready: 'Ready',
    test: 'Test',
    off: 'Off',
    configured: 'Configured',
    pending: 'Pending',
    visible: 'Visible',
    hidden: 'Hidden'
  },
  ar: {
    eyebrow: 'دفع آمن',
    title: 'أكمل حجزك',
    description: 'تُدار خيارات البطاقة والآيبان وروابط الدفع الآمنة ضمن تدفق واحد مصقول. تظل النصوص القانونية ظاهرة قبل الدفع وتُسجل كل تحديثات الحالة داخل الحجز.',
    requestedLink: 'تم تسجيل طلب رابط الدفع الآمن. قد يتواصل معك فريق العمليات قريباً.',
    noReservationTitle: 'تتفعّل خطوة الدفع بعد إنشاء الحجز',
    noReservationText: 'يبقى هذا القسم مفتوحاً حتى تتمكن من مراجعة طرق الدفع والإطار القانوني وانضباط العملية مسبقاً. يتم فتح سجل دفع مخصص تلقائياً عند إرسال الحجز.',
    bookingCta: 'أنشئ الحجز أولاً',
    supportCta: 'تواصل مع فريق الحجوزات',
    cardLabel: 'الدفع بالبطاقة',
    ibanLabel: 'الآيبان',
    linkLabel: 'رابط الدفع',
    ready: 'جاهز',
    test: 'اختبار',
    off: 'مغلق',
    configured: 'تم الإعداد',
    pending: 'قيد الانتظار',
    visible: 'ظاهر',
    hidden: 'مغلق'
  }
} as const;

export default async function PaymentPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ reservation?: string; requestedLink?: string }>;
}) {
  const { locale } = await params;
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

  const item = reservation?.items[0] || null;
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

  let preview: {
    image?: string;
    description?: string;
    location?: string;
    categoryLabel?: string;
  } | null = null;

  if (item) {
    const experience = await db.experience.findUnique({
      where: { id: item.experienceId },
      include: {
        translations: { where: { locale: toLocaleEnum(locale) as Locale } }
      }
    });

    if (experience) {
      preview = {
        image: getExperienceImage(experience.translations[0]?.slug),
        description: getExperienceCopy(experience.translations[0]?.slug, locale, experience.translations[0]?.shortDescription || ''),
        location: experience.location,
        categoryLabel: experienceCategories[experience.category as keyof typeof experienceCategories][locale]
      };
    }
  }

  return (
    <>
      <PageHero locale={locale} eyebrow={current.eyebrow} title={current.title} description={current.description} showActions={false} />
      <Container className="py-16">
        {requestedLink ? <div className="mb-6 rounded-3xl border border-gold/30 bg-gold/10 p-5 text-sm text-white/78">{current.requestedLink}</div> : null}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-8">
            <PaymentPanel
              locale={locale}
              reservationId={reservation?.id}
              activeProviders={activeProviders.length ? activeProviders : ['MOCK']}
              legalDocuments={docs.filter(Boolean).map((doc) => ({ id: doc!.id, title: doc!.title, content: doc!.content, type: doc!.type }))}
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
              image={preview?.image}
              description={preview?.description}
              location={preview?.location}
              categoryLabel={preview?.categoryLabel}
            />
          ) : (
            <Card className="lg:sticky lg:top-24">
              <CardContent>
                <div className="text-sm uppercase tracking-[0.2em] text-white/46">AS LOF TOUR</div>
                <div className="mt-4 text-2xl font-semibold text-white">{current.noReservationTitle}</div>
                <div className="mt-6 space-y-4 text-sm text-white/72">
                  <div className="flex justify-between gap-4"><span>{current.cardLabel}</span><span>{cardGatewayStatus === 'live' ? current.ready : cardGatewayStatus === 'test' ? current.test : current.off}</span></div>
                  <div className="flex justify-between gap-4"><span>{current.ibanLabel}</span><span>{bankTransfer?.iban ? current.configured : current.pending}</span></div>
                  <div className="flex justify-between gap-4"><span>{current.linkLabel}</span><span>{paymentOptions.enablePaymentLink ? current.visible : current.hidden}</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </>
  );
}
