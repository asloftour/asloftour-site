import { db } from '@/lib/db';
import { maskedSecret } from '@/lib/utils';
import { decryptSecret } from '@/lib/encryption';
import { PaymentSettingsForm } from '@/components/admin/payment-settings-form';
import { getSiteSettings } from '@/lib/queries';

export default async function PaymentSettingsPage() {
  const [settings, siteSettings] = await Promise.all([
    db.paymentProviderSetting.findMany({ orderBy: { provider: 'asc' } }),
    getSiteSettings()
  ]);
  const initial = settings.map((item) => {
    const rawStoreKey = decryptSecret(item.storeKeyEncrypted);
    return {
      ...item,
      storeKey: rawStoreKey,
      hasStoreKey: Boolean(rawStoreKey),
      maskedStoreKey: maskedSecret(rawStoreKey)
    };
  });

  const paymentOptions = {
    enableCard: siteSettings.paymentOptions?.enableCard ?? true,
    enableBankTransfer: siteSettings.paymentOptions?.enableBankTransfer ?? true,
    enablePaymentLink: siteSettings.paymentOptions?.enablePaymentLink ?? true,
    allowMockProvider: siteSettings.paymentOptions?.allowMockProvider ?? true
  };

  const bankTransfer = {
    accountName: siteSettings.bankTransfer?.accountName || 'AS LOF TOUR',
    bankName: siteSettings.bankTransfer?.bankName || '',
    iban: siteSettings.bankTransfer?.iban || '',
    enabled: siteSettings.bankTransfer?.enabled ?? true
  };

  return <PaymentSettingsForm initial={initial} paymentOptions={paymentOptions} bankTransfer={bankTransfer} />;
}
