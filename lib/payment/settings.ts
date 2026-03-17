import { PaymentProvider } from '@prisma/client';
import { db } from '@/lib/db';
import { decryptSecret, encryptSecret } from '@/lib/encryption';

export async function getActivePaymentSetting(preferred?: PaymentProvider | null) {
  if (preferred) {
    const exact = await db.paymentProviderSetting.findUnique({ where: { provider: preferred } });
    if (exact?.active) {
      return { ...exact, storeKeyEncrypted: decryptSecret(exact.storeKeyEncrypted) };
    }
  }

  const fallback = await db.paymentProviderSetting.findFirst({
    where: { active: true },
    orderBy: { updatedAt: 'desc' }
  });

  if (!fallback) return null;
  return { ...fallback, storeKeyEncrypted: decryptSecret(fallback.storeKeyEncrypted) };
}

export async function savePaymentSetting(input: {
  provider: PaymentProvider;
  merchantId?: string;
  terminalId?: string;
  storeKey?: string;
  apiUrl?: string;
  successUrl?: string;
  failUrl?: string;
  callbackUrl?: string;
  testMode: boolean;
  active: boolean;
}) {
  const existing = await db.paymentProviderSetting.findUnique({ where: { provider: input.provider } });
  const encrypted = input.storeKey ? encryptSecret(input.storeKey) : existing?.storeKeyEncrypted || null;

  return db.paymentProviderSetting.upsert({
    where: { provider: input.provider },
    update: {
      merchantId: input.merchantId || null,
      terminalId: input.terminalId || null,
      storeKeyEncrypted: encrypted,
      apiUrl: input.apiUrl || null,
      successUrl: input.successUrl || null,
      failUrl: input.failUrl || null,
      callbackUrl: input.callbackUrl || null,
      testMode: input.testMode,
      active: input.active
    },
    create: {
      provider: input.provider,
      merchantId: input.merchantId || null,
      terminalId: input.terminalId || null,
      storeKeyEncrypted: encrypted,
      apiUrl: input.apiUrl || null,
      successUrl: input.successUrl || null,
      failUrl: input.failUrl || null,
      callbackUrl: input.callbackUrl || null,
      testMode: input.testMode,
      active: input.active
    }
  });
}
