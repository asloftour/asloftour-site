'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Landmark, Link2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { LegalConsents } from '@/components/public/legal-consents';
import { tLocale, ui } from '@/lib/public-copy';

const methodCopy = {
  tr: {
    cardDescLive: 'Visa, Mastercard ve TROY için 3D Secure akışı hazır. Aktif POS sağlayıcısı bulunduğunda yönlendirme gerçek sağlayıcıya yapılır.',
    cardDescTest: 'Henüz canlı POS aktif değil. MOCK sağlayıcı ile 3D akış testi görülebilir; banka bilgileri admin panelden girildiğinde canlı sağlayıcı devreye alınır.',
    cardDescInactive: 'Kart ile ödeme şu anda pasif durumda. Sağlayıcı aktif edildiğinde bu alan otomatik açılır.',
    bankDesc: 'Banka transferi seçildiğinde hesap bilgileri gösterilir, rezervasyon PENDING_TRANSFER durumuna alınır ve dekont yükleme ekranına geçilir.',
    linkDesc: 'Operasyon ekibinden güvenli ödeme linki talep edebilirsiniz. Talep rezervasyon kaydına işlenir.',
    legalHint: 'Ödeme öncesi zorunlu metinlerin tamamını onaylayın.',
    needsReservation: 'Bu adımı aktif kullanmak için önce bir rezervasyon oluşturmanız gerekir.',
    noIban: 'IBAN bilgisi henüz panelden girilmedi.',
    '3d': '3D Secure zorunlu',
    cardReady: 'Canlıya hazır',
    cardTest: 'Test akışı açık',
    cardInactive: 'Henüz aktif değil',
    reservationRequiredButton: 'Önce rezervasyon oluşturun'
  },
  en: {
    cardDescLive: 'The 3D Secure flow is ready for Visa, Mastercard and TROY. Once a live POS provider is active, guests are sent to the real gateway.',
    cardDescTest: 'A live POS is not active yet. You can still see the MOCK 3D test flow; once merchant credentials are saved from admin, the live provider takes over.',
    cardDescInactive: 'Card payments are currently inactive. This area opens automatically once a provider is enabled.',
    bankDesc: 'When bank transfer is selected, account details are shown, the reservation moves to PENDING_TRANSFER and the proof-upload step becomes available.',
    linkDesc: 'Guests can request a secure payment link from operations. The request is attached to the reservation record.',
    legalHint: 'Please accept all required legal documents before continuing.',
    needsReservation: 'You need an existing reservation to use this step fully.',
    noIban: 'The IBAN details have not been entered in admin yet.',
    '3d': '3D Secure required',
    cardReady: 'Ready for live use',
    cardTest: 'Test flow enabled',
    cardInactive: 'Not active yet',
    reservationRequiredButton: 'Create a reservation first'
  },
  ar: {
    cardDescLive: 'أصبح مسار الدفع ثلاثي الأبعاد جاهزاً لفيزا وماستركارد وتروي. عند تفعيل مزود مباشر يتم التحويل إلى البوابة الحقيقية.',
    cardDescTest: 'لا يوجد مزود مباشر نشط بعد. يمكن مشاهدة مسار MOCK الاختباري، وعند إدخال بيانات البنك من لوحة التحكم يتفعّل المزود الحقيقي.',
    cardDescInactive: 'الدفع بالبطاقة غير نشط حالياً. سيتم فتح هذا القسم تلقائياً عند تفعيل المزود.',
    bankDesc: 'عند اختيار التحويل البنكي تظهر بيانات الحساب، وتتحول حالة الحجز إلى PENDING_TRANSFER ثم يصبح رفع الإيصال متاحاً.',
    linkDesc: 'يمكن للضيف طلب رابط دفع آمن من فريق العمليات ويتم تسجيل الطلب داخل الحجز.',
    legalHint: 'يرجى قبول جميع المستندات القانونية المطلوبة قبل المتابعة.',
    needsReservation: 'تحتاج إلى حجز قائم لاستخدام هذه الخطوة بالكامل.',
    noIban: 'لم يتم إدخال بيانات الآيبان من لوحة التحكم بعد.',
    '3d': 'الدفع ثلاثي الأبعاد إلزامي',
    cardReady: 'جاهز للتفعيل',
    cardTest: 'مسار اختبار مفعل',
    cardInactive: 'غير مفعل بعد',
    reservationRequiredButton: 'أنشئ الحجز أولاً'
  }
} as const;

export function PaymentPanel({
  locale,
  reservationId,
  legalDocuments,
  activeProviders,
  paymentOptions,
  bankTransfer,
  cardGatewayStatus,
  providerMeta
}: {
  locale: 'tr' | 'en' | 'ar';
  reservationId?: string | null;
  legalDocuments: Array<{ id: string; title: string; content: string; type?: string }>;
  activeProviders: string[];
  paymentOptions: { enableCard: boolean; enableBankTransfer: boolean; enablePaymentLink: boolean };
  bankTransfer: { accountName?: string; bankName?: string; iban?: string };
  cardGatewayStatus: 'live' | 'test' | 'inactive';
  providerMeta: Array<{ provider: string; testMode: boolean; ready: boolean; active?: boolean }>;
}) {
  const [method, setMethod] = useState<'CARD_3D' | 'BANK_TRANSFER' | 'PAYMENT_LINK'>(() => {
    if (paymentOptions.enableCard) return 'CARD_3D';
    if (paymentOptions.enableBankTransfer) return 'BANK_TRANSFER';
    return 'PAYMENT_LINK';
  });
  const [installment, setInstallment] = useState(1);
  const [provider, setProvider] = useState(activeProviders[0] || 'MOCK');
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const copy = methodCopy[locale];

  const allAccepted = useMemo(() => legalDocuments.every((doc) => accepted[doc.id]), [accepted, legalDocuments]);
  const hasReservation = Boolean(reservationId);
  const methods = [
    paymentOptions.enableCard ? ['CARD_3D', tLocale(ui.forms.payment.card3d, locale)] : null,
    paymentOptions.enableBankTransfer ? ['BANK_TRANSFER', tLocale(ui.forms.payment.bankTransfer, locale)] : null,
    paymentOptions.enablePaymentLink ? ['PAYMENT_LINK', tLocale(ui.forms.payment.paymentLink, locale)] : null
  ].filter(Boolean) as Array<[typeof method, string]>;

  async function submit() {
    if (!hasReservation) {
      setError(copy.needsReservation);
      return;
    }
    if (!allAccepted) {
      setError(tLocale(ui.forms.payment.legalError, locale));
      return;
    }
    setLoading(true);
    setError(null);
    const response = await fetch('/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, reservationId, method, provider, installment })
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(payload.message || tLocale(ui.forms.payment.paymentError, locale));
      return;
    }

    if (payload.mode === 'redirect') {
      window.location.href = payload.redirectUrl;
      return;
    }

    if (payload.mode === 'post') {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payload.action;
      Object.entries(payload.fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      return;
    }

    if (payload.redirectInternal) {
      router.push(payload.redirectInternal);
    }
  }

  const cardDescription = cardGatewayStatus === 'live' ? copy.cardDescLive : cardGatewayStatus === 'test' ? copy.cardDescTest : copy.cardDescInactive;
  const gatewayBadge = cardGatewayStatus === 'live' ? copy.cardReady : cardGatewayStatus === 'test' ? copy.cardTest : copy.cardInactive;
  const actionDisabled = loading || !hasReservation || methods.length === 0 || (method === 'CARD_3D' && cardGatewayStatus === 'inactive');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5">
          <div>
            <div className="text-sm font-medium text-white/86">{tLocale(ui.forms.payment.method, locale)}</div>
            <div className="mt-4 grid gap-3">
              {methods.map(([value, label]) => {
                const icon = value === 'CARD_3D' ? <CreditCard className="h-5 w-5" /> : value === 'BANK_TRANSFER' ? <Landmark className="h-5 w-5" /> : <Link2 className="h-5 w-5" />;
                const desc = value === 'CARD_3D' ? cardDescription : value === 'BANK_TRANSFER' ? copy.bankDesc : copy.linkDesc;
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setMethod(value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${method === value ? 'border-gold bg-gold/10 text-white' : 'border-white/10 bg-white/4 text-white/74 hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-white/10 bg-black/20 p-2">{icon}</div>
                        <div className="font-medium">{label}</div>
                      </div>
                      {value === 'CARD_3D' ? <div className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#d5c28a]">{gatewayBadge}</div> : null}
                    </div>
                    <div className="mt-3 text-sm leading-7 text-white/58">{desc}</div>
                    {value === 'CARD_3D' ? <div className="mt-3 text-xs text-white/50">{tLocale(ui.forms.payment.brands, locale)}</div> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {method === 'CARD_3D' ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-medium text-white/84">{tLocale(ui.forms.payment.provider, locale)}</div>
                <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                  {activeProviders.map((item) => {
                    const meta = providerMeta.find((entry) => entry.provider === item);
                    return <option key={item} value={item}>{item}{meta?.testMode ? ' · TEST' : ''}</option>;
                  })}
                </Select>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium text-white/84">{tLocale(ui.forms.payment.installment, locale)}</div>
                <Input type="number" min={1} max={12} value={installment} onChange={(e) => setInstallment(Number(e.target.value || 1))} />
              </div>
              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/70">
                <div className="flex items-center gap-2 text-white"><ShieldCheck className="h-4 w-4 text-[#d5c28a]" /> {copy['3d']}</div>
                <div className="mt-2 leading-7">{cardDescription}</div>
              </div>
            </div>
          ) : null}

          {method === 'BANK_TRANSFER' ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-5 text-sm leading-7 text-white/72">
              <div><span className="text-white/46">{tLocale(ui.bankTransfer.accountName, locale)}:</span> {bankTransfer.accountName || 'AS LOF TOUR'}</div>
              <div><span className="text-white/46">{tLocale(ui.bankTransfer.bank, locale)}:</span> {bankTransfer.bankName || copy.noIban}</div>
              <div><span className="text-white/46">{tLocale(ui.bankTransfer.iban, locale)}:</span> {bankTransfer.iban || copy.noIban}</div>
              <div className="mt-3 text-white/58">{copy.bankDesc}</div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <LegalConsents documents={legalDocuments} accepted={accepted} setAccepted={setAccepted} locale={locale} />
      <div className="text-xs text-white/46">{copy.legalHint}</div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <Button className="w-full" onClick={submit} disabled={actionDisabled}>
        {loading ? tLocale(ui.forms.payment.pleaseWait, locale) : hasReservation ? tLocale(ui.forms.payment.continue, locale) : copy.reservationRequiredButton}
      </Button>
    </div>
  );
}
