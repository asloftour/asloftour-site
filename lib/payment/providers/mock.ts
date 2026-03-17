import { PaymentProviderContract } from '@/lib/payment/types';

export const mockProvider: PaymentProviderContract = {
  key: 'MOCK',
  async start3DS(context) {
    const url = new URL('/payment/mock-3ds', process.env.MOCK_PROVIDER_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
    url.searchParams.set('attempt', context.attempt.id);
    url.searchParams.set('successUrl', context.successUrl);
    url.searchParams.set('failUrl', context.failUrl);
    return { mode: 'redirect', redirectUrl: url.toString() };
  },
  async verifyCallback({ body }) {
    const approved = body.approved === 'true';
    return {
      approved,
      verified: true,
      transactionReference: body.reference || `MOCK-${Date.now()}`,
      cardBrand: body.cardBrand || 'Visa',
      raw: body
    };
  }
};
