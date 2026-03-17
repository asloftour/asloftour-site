import { PaymentProvider } from '@prisma/client';
import { PaymentProviderContract } from '@/lib/payment/types';
import { mockProvider } from '@/lib/payment/providers/mock';
import { genericVposProvider } from '@/lib/payment/providers/generic-vpos';
import { akbankProvider } from '@/lib/payment/providers/akbank';
import { halkbankProvider } from '@/lib/payment/providers/halkbank';

const registry: Record<PaymentProvider, PaymentProviderContract | null> = {
  NONE: null,
  MOCK: mockProvider,
  GENERIC_VPOS: genericVposProvider,
  AKBANK: akbankProvider,
  HALKBANK: halkbankProvider,
  GARANTI_BBVA: null,
  ISBANK: null
};

export function getPaymentProvider(provider: PaymentProvider) {
  const adapter = registry[provider];
  if (!adapter) {
    throw new Error(`Payment provider ${provider} is not registered.`);
  }
  return adapter;
}
