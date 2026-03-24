import crypto from 'node:crypto';
import { PaymentProviderContract } from '@/lib/payment/types';

const SUCCESS_MD_STATUSES = new Set(['1', '2', '3', '4']);

function escapeHashValue(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

function normalizeFields(input: Record<string, string | null | undefined>) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value ?? ''])
  ) as Record<string, string>;
}

function buildHashV3(fields: Record<string, string>, storeKey: string) {
  const keys = Object.keys(fields)
    .filter((key) => {
      const lower = key.toLowerCase();
      return lower !== 'hash' && lower !== 'encoding' && lower !== 'countdown';
    })
    .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

  const plaintext = [
    ...keys.map((key) => escapeHashValue(fields[key] ?? '')),
    escapeHashValue(storeKey)
  ].join('|');

  return crypto.createHash('sha512').update(plaintext, 'utf8').digest('base64');
}

function mapCurrencyToNumeric(currency: string) {
  switch ((currency || '').toUpperCase()) {
    case 'TRY':
      return '949';
    case 'USD':
      return '840';
    case 'EUR':
      return '978';
    case 'GBP':
      return '826';
    default:
      return '949';
  }
}

function mapLang(locale: string) {
  const value = (locale || 'tr').toLowerCase();
  return value === 'en' ? 'en' : 'tr';
}

function pickTransactionReference(body: Record<string, string>) {
  return body.TransId || body.HostRefNum || body.OrderId || body.oid || body.orderid || undefined;
}

function pickCardBrand(body: Record<string, string>) {
  return body.CardType || body.cardType || body.CardBrand || body.cardBrand || undefined;
}

export const halkbankProvider: PaymentProviderContract = {
  key: 'HALKBANK',

  async start3DS(context) {
    const clientId = context.setting.merchantId?.trim();
    const storeKey = context.setting.storeKeyEncrypted?.trim();
    const action = context.setting.apiUrl?.trim();

    if (!clientId || !storeKey || !action) {
      throw new Error('Halkbank yapılandırması eksik. merchantId, storeKey ve apiUrl zorunlu.');
    }

    const callbackEndpoint = `${context.callbackUrl}${
      context.callbackUrl.includes('?') ? '&' : '?'
    }attemptId=${encodeURIComponent(context.attempt.id)}`;

    const rnd = `${Date.now()}`;

    const fields = normalizeFields({
      clientid: clientId,
      amount: Number(context.payment.amount).toFixed(2),
      oid: context.payment.id,
      okurl: callbackEndpoint,
      failUrl: callbackEndpoint,
      callbackUrl: callbackEndpoint,
      TranType: 'Auth',
      Instalment: '',
      currency: mapCurrencyToNumeric(context.payment.currency),
      rnd,
      storetype: '3D_PAY_HOSTING',
      hashAlgorithm: 'ver3',
      lang: mapLang(context.locale),
      BillToName: context.reservation.fullName || '',
      BillToCompany: '',
      email: context.reservation.email || '',
      refreshtime: '5',
      attemptId: context.attempt.id
    });

    const hash = buildHashV3(fields, storeKey);

    return {
      mode: 'post',
      action,
      fields: {
        ...fields,
        HASH: hash
      }
    };
  },

  async verifyCallback({ setting, body }) {
    const storeKey = setting.storeKeyEncrypted?.trim();

    if (!storeKey) {
      return {
        approved: false,
        verified: false,
        raw: body,
        message: 'Store key missing.'
      };
    }

    const incomingHash = body.HASH || body.hash || '';
    const source = normalizeFields({ ...body });
    delete source.HASH;
    delete source.hash;

    const expectedHash = buildHashV3(source, storeKey);

    const response = (body.Response || body.response || '').toLowerCase();
    const procReturnCode = body.ProcReturnCode || body.procReturnCode || '';
    const mdStatus = body.mdStatus || body.MdStatus || '';

    const hashVerified = incomingHash === expectedHash;
    const mdOk = mdStatus ? SUCCESS_MD_STATUSES.has(mdStatus) : true;
    const responseOk = response ? ['approved', 'success'].includes(response) : true;
    const procOk = procReturnCode ? procReturnCode === '00' : true;

    return {
      approved: hashVerified && mdOk && responseOk && procOk,
      verified: hashVerified,
      transactionReference: pickTransactionReference(body),
      cardBrand: pickCardBrand(body),
      raw: body,
      message: hashVerified ? undefined : 'HASH doğrulaması başarısız.'
    };
  }
};