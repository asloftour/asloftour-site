'use client';

import { useState } from 'react';
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
    cardDescLive:
      'Visa, Mastercard ve TROY için 3D Secure akışı hazır. Kart bilgilerinizi bu sayfada girerek güvenli şekilde Halkbank 3D ekranına devam edebilirsiniz.',
    cardDescTest:
      'Henüz canlı POS aktif değil. MOCK sağlayıcı ile 3D akış testi görülebilir; banka bilgileri admin panelden girildiğinde canlı sağlayıcı devreye alınır.',
    cardDescInactive:
      'Kart ile ödeme şu anda pasif durumda. Sağlayıcı aktif edildiğinde bu alan otomatik açılır.',
    bankDesc:
      'Banka transferi seçildiğinde hesap bilgileri gösterilir, rezervasyon PENDING_TRANSFER durumuna alınır ve dekont yükleme ekranına geçilir.',
    linkDesc:
      'Operasyon ekibinden güvenli ödeme linki talep edebilirsiniz. Talep rezervasyon kaydına işlenir.',
    legalHint: 'Ödeme öncesi zorunlu metinleri onaylayın.',
    needsReservation:
      'Bu adımı aktif kullanmak için önce bir rezervasyon oluşturmanız gerekir.',
    noIban: 'IBAN bilgisi henüz panelden girilmedi.',
    '3d': '3D Secure zorunlu',
    cardReady: 'Canlıya hazır',
    cardTest: 'Test akışı açık',
    cardInactive: 'Henüz aktif değil',
    reservationRequiredButton: 'Önce rezervasyon oluşturun',
    invalidCard: 'Kart numarası geçersiz.',
    invalidCvv: 'CVV / CVC geçersiz.',
    invalidMonth: 'Son kullanma ayı geçersiz.',
    invalidYear: 'Son kullanma yılı geçersiz.',
    cardNumber: 'Kart numarası',
    expiryMonth: 'Son kullanma ayı',
    expiryYear: 'Son kullanma yılı',
    cvv: 'CVV / CVC',
    monthPlaceholder: 'Ay',
    yearPlaceholder: 'Yıl'
  },
  en: {
    cardDescLive:
      'The 3D Secure flow is ready for Visa, Mastercard and TROY. Enter your card details on this page and continue securely to Halkbank 3D.',
    cardDescTest:
      'A live POS is not active yet. You can still see the MOCK 3D test flow; once merchant credentials are saved from admin, the live provider takes over.',
    cardDescInactive:
      'Card payments are currently inactive. This area opens automatically once a provider is enabled.',
    bankDesc:
      'When bank transfer is selected, account details are shown, the reservation moves to PENDING_TRANSFER and the proof-upload step becomes available.',
    linkDesc:
      'Guests can request a secure payment link from operations. The request is attached to the reservation record.',
    legalHint: 'Please accept the required legal texts before continuing.',
    needsReservation:
      'You need an existing reservation to use this step fully.',
    noIban: 'The IBAN details have not been entered in admin yet.',
    '3d': '3D Secure required',
    cardReady: 'Ready for live use',
    cardTest: 'Test flow enabled',
    cardInactive: 'Not active yet',
    reservationRequiredButton: 'Create a reservation first',
    invalidCard: 'Invalid card number.',
    invalidCvv: 'Invalid CVV / CVC.',
    invalidMonth: 'Invalid expiry month.',
    invalidYear: 'Invalid expiry year.',
    cardNumber: 'Card number',
    expiryMonth: 'Expiry month',
    expiryYear: 'Expiry year',
    cvv: 'CVV / CVC',
    monthPlaceholder: 'Month',
    yearPlaceholder: 'Year'
  },
  ar: {
    cardDescLive:
      'أصبح مسار الدفع ثلاثي الأبعاد جاهزاً لفيزا وماستركارد وتروي. يمكنك إدخال بيانات البطاقة هنا ثم المتابعة بأمان إلى شاشة هالك بنك ثلاثية الأبعاد.',
    cardDescTest:
      'لا يوجد مزود مباشر نشط بعد. يمكن مشاهدة مسار MOCK الاختباري، وعند إدخال بيانات البنك من لوحة التحكم يتفعّل المزود الحقيقي.',
    cardDescInactive:
      'الدفع بالبطاقة غير نشط حالياً. سيتم فتح هذا القسم تلقائياً عند تفعيل المزود.',
    bankDesc:
      'عند اختيار التحويل البنكي تظهر بيانات الحساب، وتتحول حالة الحجز إلى PENDING_TRANSFER ثم يصبح رفع الإيصال متاحاً.',
    linkDesc:
      'يمكن للضيف طلب رابط دفع آمن من فريق العمليات ويتم تسجيل الطلب داخل الحجز.',
    legalHint: 'يرجى قبول النصوص القانونية المطلوبة قبل المتابعة.',
    needsReservation:
      'تحتاج إلى حجز قائم لاستخدام هذه الخطوة بالكامل.',
    noIban: 'لم يتم إدخال بيانات الآيبان من لوحة التحكم بعد.',
    '3d': 'الدفع ثلاثي الأبعاد إلزامي',
    cardReady: 'جاهز للتفعيل',
    cardTest: 'مسار اختبار مفعل',
    cardInactive: 'غير مفعل بعد',
    reservationRequiredButton: 'أنشئ الحجز أولاً',
    invalidCard: 'رقم البطاقة غير صالح.',
    invalidCvv: 'رمز الأمان غير صالح.',
    invalidMonth: 'شهر الانتهاء غير صالح.',
    invalidYear: 'سنة الانتهاء غير صالحة.',
    cardNumber: 'رقم البطاقة',
    expiryMonth: 'شهر الانتهاء',
    expiryYear: 'سنة الانتهاء',
    cvv: 'رمز الأمان',
    monthPlaceholder: 'الشهر',
    yearPlaceholder: 'السنة'
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
  const [provider, setProvider] = useState(
    activeProviders.includes('HALKBANK') ? 'HALKBANK' : activeProviders[0] || 'MOCK'
  );
  const [requiredAccepted, setRequiredAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [card, setCard] = useState({
    pan: '',
    cv2: '',
    expMonth: '',
    expYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const copy = methodCopy[locale];
  const hasReservation = Boolean(reservationId);
  const allAccepted = requiredAccepted;

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

    if (method === 'CARD_3D' && provider === 'HALKBANK') {
      const pan = card.pan.replace(/\s+/g, '');
      if (!/^\d{12,19}$/.test(pan)) {
        setError(copy.invalidCard);
        return;
      }
      if (!/^\d{3,4}$/.test(card.cv2)) {
        setError(copy.invalidCvv);
        return;
      }
      if (!/^\d{2}$/.test(card.expMonth) || Number(card.expMonth) < 1 || Number(card.expMonth) > 12) {
        setError(copy.invalidMonth);
        return;
      }
      if (!/^\d{2}$/.test(card.expYear)) {
        setError(copy.invalidYear);
        return;
      }
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
        input.value = String(value ?? '');
        form.appendChild(input);
      });

      if (method === 'CARD_3D' && provider === 'HALKBANK') {
        const cardFields: Record<string, string> = {
          pan: card.pan.replace(/\s+/g, ''),
          cv2: card.cv2,
          Ecom_Payment_Card_ExpDate_Month: card.expMonth,
          Ecom_Payment_Card_ExpDate_Year: card.expYear
        };

        Object.entries(cardFields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
      }

      document.body.appendChild(form);
      form.submit();
      return;
    }

    if (payload.redirectInternal) {
      router.push(payload.redirectInternal);
    }
  }

  const cardDescription =
    cardGatewayStatus === 'live'
      ? copy.cardDescLive
      : cardGatewayStatus === 'test'
        ? copy.cardDescTest
        : copy.cardDescInactive;

  const gatewayBadge =
    cardGatewayStatus === 'live'
      ? copy.cardReady
      : cardGatewayStatus === 'test'
        ? copy.cardTest
        : copy.cardInactive;

  const actionDisabled =
    loading ||
    !hasReservation ||
    methods.length === 0 ||
    (method === 'CARD_3D' && cardGatewayStatus === 'inactive');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-5">
          <div>
            <div className="text-sm font-medium text-white/86">
              {tLocale(ui.forms.payment.method, locale)}
            </div>

            <div className="mt-4 grid gap-3">
              {methods.map(([value, label]) => {
                const icon =
                  value === 'CARD_3D' ? (
                    <CreditCard className="h-5 w-5" />
                  ) : value === 'BANK_TRANSFER' ? (
                    <Landmark className="h-5 w-5" />
                  ) : (
                    <Link2 className="h-5 w-5" />
                  );

                const desc =
                  value === 'CARD_3D'
                    ? cardDescription
                    : value === 'BANK_TRANSFER'
                      ? copy.bankDesc
                      : copy.linkDesc;

                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setMethod(value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      method === value
                        ? 'border-gold bg-gold/10 text-white'
                        : 'border-white/10 bg-white/4 text-white/74 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full border border-white/10 bg-black/20 p-2">
                          {icon}
                        </div>
                        <div className="font-medium">{label}</div>
                      </div>

                      {value === 'CARD_3D' ? (
                        <div className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#d5c28a]">
                          {gatewayBadge}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-3 text-sm leading-7 text-white/58">{desc}</div>

                    {value === 'CARD_3D' ? (
                      <div className="mt-3 text-xs text-white/50">
                        {tLocale(ui.forms.payment.brands, locale)}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {method === 'CARD_3D' ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-medium text-white/84">
                  {tLocale(ui.forms.payment.provider, locale)}
                </div>
                <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                  {activeProviders
                    .sort((a, b) =>
                      a === 'HALKBANK' ? -1 : b === 'HALKBANK' ? 1 : a.localeCompare(b)
                    )
                    .map((item) => {
                      const meta = providerMeta.find((entry) => entry.provider === item);
                      return (
                        <option key={item} value={item}>
                          {item}
                          {meta?.testMode ? ' · TEST' : ''}
                        </option>
                      );
                    })}
                </Select>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium text-white/84">
                  {tLocale(ui.forms.payment.installment, locale)}
                </div>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={installment}
                  onChange={(e) => setInstallment(Number(e.target.value || 1))}
                />
              </div>

              <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="mb-2 text-sm font-medium text-white/84">
                    {copy.cardNumber}
                  </div>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={card.pan}
                    onChange={(e) =>
                      setCard((prev) => ({
                        ...prev,
                        pan: e.target.value.replace(/[^\d\s]/g, '').slice(0, 23)
                      }))
                    }
                  />
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-white/84">
                    {copy.expiryMonth}
                  </div>
                  <Select
                    value={card.expMonth}
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, expMonth: e.target.value }))
                    }
                  >
                    <option value="">{copy.monthPlaceholder}</option>
                    {Array.from({ length: 12 }).map((_, i) => {
                      const v = String(i + 1).padStart(2, '0');
                      return (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-white/84">
                    {copy.expiryYear}
                  </div>
                  <Select
                    value={card.expYear}
                    onChange={(e) =>
                      setCard((prev) => ({ ...prev, expYear: e.target.value }))
                    }
                  >
                    <option value="">{copy.yearPlaceholder}</option>
                    {Array.from({ length: 12 }).map((_, i) => {
                      const year = new Date().getFullYear() + i;
                      const value = String(year).slice(-2);
                      return (
                        <option key={value} value={value}>
                          {year}
                        </option>
                      );
                    })}
                  </Select>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium text-white/84">{copy.cvv}</div>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cv2}
                    onChange={(e) =>
                      setCard((prev) => ({
                        ...prev,
                        cv2: e.target.value.replace(/\D/g, '').slice(0, 4)
                      }))
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/70">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="h-4 w-4 text-[#d5c28a]" />
                  {copy['3d']}
                </div>
                <div className="mt-2 leading-7">{cardDescription}</div>
              </div>
            </div>
          ) : null}

          {method === 'BANK_TRANSFER' ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-5 text-sm leading-7 text-white/72">
              <div>
                <span className="text-white/46">{tLocale(ui.bankTransfer.accountName, locale)}:</span>{' '}
                {bankTransfer.accountName || 'AS LOF TOUR'}
              </div>
              <div>
                <span className="text-white/46">{tLocale(ui.bankTransfer.bank, locale)}:</span>{' '}
                {bankTransfer.bankName || copy.noIban}
              </div>
              <div>
                <span className="text-white/46">{tLocale(ui.bankTransfer.iban, locale)}:</span>{' '}
                {bankTransfer.iban || copy.noIban}
              </div>
              <div className="mt-3 text-white/58">{copy.bankDesc}</div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <LegalConsents
        documents={legalDocuments}
        requiredAccepted={requiredAccepted}
        setRequiredAccepted={setRequiredAccepted}
        marketingAccepted={marketingAccepted}
        setMarketingAccepted={setMarketingAccepted}
        locale={locale}
      />

      <div className="text-xs text-white/46">{copy.legalHint}</div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <Button className="w-full" onClick={submit} disabled={actionDisabled}>
        {loading
          ? tLocale(ui.forms.payment.pleaseWait, locale)
          : hasReservation
            ? tLocale(ui.forms.payment.continue, locale)
            : copy.reservationRequiredButton}
      </Button>
    </div>
  );
}