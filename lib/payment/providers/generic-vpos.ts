import crypto from 'node:crypto';
import { PaymentProviderContract } from '@/lib/payment/types';

function signPayload(fields: Record<string, string>, secret: string) {
  const raw = Object.entries(fields)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return crypto.createHmac('sha256', secret).update(raw).digest('hex');
}

export const genericVposProvider: PaymentProviderContract = {
  key: 'GENERIC_VPOS',
  async start3DS(context) {
    if (!context.setting.apiUrl || !context.setting.storeKeyEncrypted || !context.setting.merchantId) {
      throw new Error('Generic VPOS provider configuration is incomplete.');
    }

    const fields = {
      merchantId: context.setting.merchantId,
      terminalId: context.setting.terminalId || '',
      orderId: context.payment.id,
      amount: String(context.payment.amount),
      currency: context.payment.currency,
      successUrl: context.successUrl,
      failUrl: context.failUrl,
      callbackUrl: context.callbackUrl,
      email: context.reservation.email,
      customerName: context.reservation.fullName,
      mode: context.setting.testMode ? 'TEST' : 'LIVE'
    };

    const signature = signPayload(fields, context.setting.storeKeyEncrypted);
    return {
      mode: 'post',
      action: context.setting.apiUrl,
      fields: { ...fields, signature }
    };
  },
  async verifyCallback({ setting, body }) {
    if (!setting.storeKeyEncrypted) {
      return { approved: false, verified: false, raw: body, message: 'Store key missing.' };
    }
    const incomingSignature = body.signature || '';
    const source = { ...body };
    delete source.signature;
    const expected = signPayload(source, setting.storeKeyEncrypted);
    const approved = body.status === 'approved';
    return {
      approved,
      verified: incomingSignature === expected,
      transactionReference: body.transactionReference,
      cardBrand: body.cardBrand,
      raw: body,
      message: incomingSignature === expected ? undefined : 'Signature mismatch.'
    };
  }
};
