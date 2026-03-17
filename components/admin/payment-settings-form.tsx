'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export function PaymentSettingsForm({
  initial,
  bankTransfer,
  paymentOptions
}: {
  initial: any[];
  bankTransfer: { accountName?: string; bankName?: string; iban?: string; enabled?: boolean };
  paymentOptions: { enableCard: boolean; enableBankTransfer: boolean; enablePaymentLink: boolean; allowMockProvider: boolean };
}) {
  const router = useRouter();
  const [provider, setProvider] = useState('MOCK');
  const current = useMemo(() => initial.find((item) => item.provider === provider), [initial, provider]);
  const [status, setStatus] = useState<string | null>(null);
  const providerCards = initial.map((item) => ({
    ...item,
    ready: Boolean(item.merchantId && item.apiUrl && (item.hasStoreKey || item.provider === 'MOCK'))
  }));

  async function onSubmit(formData: FormData) {
    setStatus(null);
    const response = await fetch('/api/admin/payment-settings', { method: 'POST', body: formData });
    const payload = await response.json().catch(() => ({}));
    setStatus(response.ok ? 'Ödeme ve transfer ayarları kaydedildi.' : payload.message || 'Ayarlar kaydedilemedi.');
    if (response.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        {providerCards.map((item) => (
          <Card key={item.provider} className={item.active ? 'border-gold/40' : ''}>
            <CardContent>
              <div className="text-sm uppercase tracking-[0.2em] text-white/46">{item.provider}</div>
              <div className="mt-3 text-lg font-semibold text-white">{item.active ? 'Aktif' : 'Pasif'}</div>
              <div className="mt-2 text-sm text-white/64">{item.ready ? (item.testMode ? 'Hazır · Test modu' : 'Hazır · Live adayı') : 'Kimlik bilgisi eksik'}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <form action={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-5">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-white/46">Sanal POS sağlayıcısı</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Kart ödeme yapılandırması</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/66">Gerçek banka bilgileri kaydedildiğinde ödeme ekranı aynı akış üzerinden aktif hale gelir. MOCK aktif bırakılırsa test 3D akışı korunur.</p>
            </div>
            <div>
              <Label>Provider</Label>
              <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                {['MOCK', 'GENERIC_VPOS', 'AKBANK', 'HALKBANK'].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <input type="hidden" name="provider" value={provider} />
              <div>
                <Label>merchantId</Label>
                <Input name="merchantId" defaultValue={current?.merchantId || ''} />
              </div>
              <div>
                <Label>terminalId</Label>
                <Input name="terminalId" defaultValue={current?.terminalId || ''} />
              </div>
              <div>
                <Label>storeKey</Label>
                <Input name="storeKey" placeholder={current?.maskedStoreKey || 'Yeni anahtarı girin'} />
              </div>
              <div>
                <Label>apiUrl</Label>
                <Input name="apiUrl" defaultValue={current?.apiUrl || ''} />
              </div>
              <div>
                <Label>successUrl</Label>
                <Input name="successUrl" defaultValue={current?.successUrl || ''} />
              </div>
              <div>
                <Label>failUrl</Label>
                <Input name="failUrl" defaultValue={current?.failUrl || ''} />
              </div>
              <div>
                <Label>callbackUrl</Label>
                <Input name="callbackUrl" defaultValue={current?.callbackUrl || ''} />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
                <input type="checkbox" name="testMode" defaultChecked={current?.testMode ?? true} /> TEST mode
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
                <input type="checkbox" name="active" defaultChecked={current?.active ?? (provider === 'MOCK')} /> Active provider
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-white/46">IBAN / Havale</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Banka transferi bilgileri</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Hesap adı</Label>
                <Input name="bankTransferAccountName" defaultValue={bankTransfer?.accountName || 'AS LOF TOUR'} />
              </div>
              <div>
                <Label>Banka adı</Label>
                <Input name="bankTransferBankName" defaultValue={bankTransfer?.bankName || ''} />
              </div>
              <div className="md:col-span-2">
                <Label>IBAN</Label>
                <Input name="bankTransferIban" defaultValue={bankTransfer?.iban || ''} />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
                <input type="checkbox" name="bankTransferEnabled" defaultChecked={bankTransfer?.enabled ?? true} /> IBAN ile ödemeyi aktif tut
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-white/46">Ödeme yöntemleri</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Ekranda hangi seçenekler görünsün?</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80"><input type="checkbox" name="enableCard" defaultChecked={paymentOptions.enableCard} /> Kart ile ödeme</label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80"><input type="checkbox" name="enableBankTransfer" defaultChecked={paymentOptions.enableBankTransfer} /> IBAN / havale</label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80"><input type="checkbox" name="enablePaymentLink" defaultChecked={paymentOptions.enablePaymentLink} /> Güvenli ödeme linki</label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80"><input type="checkbox" name="allowMockProvider" defaultChecked={paymentOptions.allowMockProvider} /> MOCK 3D test akışını göster</label>
            </div>
            <div>
              <Button type="submit">Ödeme ayarlarını kaydet</Button>
            </div>
          </CardContent>
        </Card>
        {status ? <p className="text-sm text-white/70">{status}</p> : null}
      </form>
    </div>
  );
}
