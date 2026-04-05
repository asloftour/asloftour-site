import crypto from 'node:crypto';
import { PaymentProviderContract } from '@/lib/payment/types';

const SUCCESS_MD_STATUSES = new Set(['1', '2', '3', '4']);

type AttemptSnapshot = {
  amountSnapshot?: string;
  currencySnapshot?: string;
  orderIdSnapshot?: string;
};

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

function normalizeYearToYY(year: string) {
  const raw = year.replace(/\D+/g, '');
  if (raw.length >= 2) return raw.slice(-2);
  return raw;
}

function decimalString(value: unknown) {
  const raw = typeof value === 'string'
    ? value
    : value != null && typeof (value as { toString?: () => string }).toString === 'function'
      ? (value as { toString: () => string }).toString()
      : String(value ?? '0');
  const parsed = Number(raw.replace(',', '.'));
  if (!Number.isFinite(parsed)) return '0.00';
  return parsed.toFixed(2);
}

function readAttemptSnapshot(value: unknown): AttemptSnapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  return {
    amountSnapshot: raw.amountSnapshot ? decimalString(raw.amountSnapshot) : undefined,
    currencySnapshot: raw.currencySnapshot ? String(raw.currencySnapshot).toUpperCase() : undefined,
    orderIdSnapshot: raw.orderIdSnapshot ? String(raw.orderIdSnapshot) : undefined
  };
}

export const halkbankProvider: PaymentProviderContract = {
  key: 'HALKBANK',

  async start3DS(context) {
    const clientId = context.setting.merchantId?.trim();
    const storeKey = context.setting.storeKeyEncrypted?.trim();
    const action = context.setting.apiUrl?.trim();

    if (!clientId || !storeKey || !action) {
      throw new Error('Halkbank yapilandirmasi eksik. merchantId, storeKey ve apiUrl zorunlu.');
    }

    if (!context.card?.number || !context.card?.expiryMonth || !context.card?.expiryYear || !context.card?.cvv) {
      throw new Error('Kart bilgileri eksik.');
    }

    const snapshot = readAttemptSnapshot(context.attempt.requestPayload);
    const amount = snapshot.amountSnapshot || decimalString(context.payment.amount);
    const currency = snapshot.currencySnapshot || String(context.payment.currency || 'TRY').toUpperCase();
    const orderId = snapshot.orderIdSnapshot || context.payment.id;

    const callbackEndpoint = `${context.callbackUrl}${
      context.callbackUrl.includes('?') ? '&' : '?'
    }attemptId=${encodeURIComponent(context.attempt.id)}`;

    const successUrl = `${context.successUrl}${context.successUrl.includes('?') ? '&' : '?'}attemptId=${encodeURIComponent(context.attempt.id)}`;
    const failUrl = `${context.failUrl}${context.failUrl.includes('?') ? '&' : '?'}attemptId=${encodeURIComponent(context.attempt.id)}`;
    const rnd = `${Date.now()}`;

    const fields = normalizeFields({
      clientid: clientId,
      amount,
      oid: orderId,
      okurl: successUrl,
      failUrl,
      callbackUrl: callbackEndpoint,
      TranType: 'Auth',
      Instalment: context.payment.installment > 1 ? String(context.payment.installment) : '',
      currency: mapCurrencyToNumeric(currency),
      rnd,
      storetype: '3d',
      hashAlgorithm: 'ver3',
      lang: mapLang(context.locale),
      BillToName: context.reservation.fullName || '',
      BillToCompany: '',
      email: context.reservation.email || '',
      refreshtime: '5',
      attemptId: context.attempt.id,
      pan: context.card.number,
      cv2: context.card.cvv,
      Ecom_Payment_Card_ExpDate_Year: normalizeYearToYY(context.card.expiryYear),
      Ecom_Payment_Card_ExpDate_Month: context.card.expiryMonth.padStart(2, '0').slice(0, 2)
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

    const hashVerified = incomingHash ? incomingHash === expectedHash : true;
    const mdOk = mdStatus ? SUCCESS_MD_STATUSES.has(mdStatus) : false;
    const responseOk = response === 'approved' || response === 'success';
    const procOk = procReturnCode === '00';

    return {
      approved: hashVerified && mdOk && responseOk && procOk,
      verified: hashVerified,
      transactionReference: pickTransactionReference(body),
      cardBrand: pickCardBrand(body),
      raw: body,
      message: hashVerified ? undefined : 'HASH dogrulamasi basarisiz.'
    };
  }
};
