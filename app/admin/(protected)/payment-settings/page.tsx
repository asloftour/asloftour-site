import { db } from '@/lib/db';
import { maskedSecret } from '@/lib/utils';
import { decryptSecret } from '@/lib/encryption';
import { PaymentSettingsForm } from '@/components/admin/payment-settings-form';
import { getSiteSettings } from '@/lib/queries';
import { getAllProviderApiCredentials } from '@/lib/payment/provider-api-credentials';

export default async function PaymentSettingsPage() {
  const [settings, siteSettings, apiCredentials] = await Promise.all([
    db.paymentProviderSetting.findMany({ orderBy: { provider: 'asc' } }),
    getSiteSettings(),
    getAllProviderApiCredentials()
  ]);
  const initial = settings.map((item) => {
    const rawStoreKey = decryptSecret(item.storeKeyEncrypted);
    const creds = apiCredentials[item.provider] || { username: '', hasPassword: false, maskedPassword: '' };
    return {
      ...item,
      storeKey: rawStoreKey,
      hasStoreKey: Boolean(rawStoreKey),
      maskedStoreKey: maskedSecret(rawStoreKey),
      apiUsername: creds.username,
      hasApiPassword: creds.hasPassword,
      maskedApiPassword: creds.maskedPassword
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
