import { PaymentProviderContract } from '@/lib/payment/types';

export const halkbankProvider: PaymentProviderContract = {
  key: 'HALKBANK',
  async start3DS() {
    throw new Error('Halkbank adapter is isolated and intentionally requires the official bank-issued signature specification before live use. Flow routing, settings storage, callbacks, and persistence are already wired.');
  },
  async verifyCallback({ body }) {
    return {
      approved: false,
      verified: false,
      raw: body,
      message: 'Halkbank live verification requires official bank documentation.'
    };
  }
};
