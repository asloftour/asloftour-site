import crypto from 'node:crypto';
import { PaymentMethod, PaymentProvider, PaymentStatus, ReservationStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';
import { getActivePaymentSetting } from '@/lib/payment/settings';
import { getPaymentProvider } from '@/lib/payment/registry';
import { writeAuditLog } from '@/lib/audit';
import { getProviderApiCredential } from '@/lib/payment/provider-api-credentials';

type PaymentAttemptSnapshot = {
  amountSnapshot: string;
  currencySnapshot: string;
  orderIdSnapshot: string;
  localeSnapshot: string;
  reservationCode?: string;
  sourceIp?: string | null;
  fromPaymentLink?: boolean;
  paymentLinkToken?: string | null;
  bypassPaymentPolicies?: boolean;
  cardLast4?: string;
};

function decimalString(value: unknown) {
  const raw = typeof value === 'string' ? value : value != null && typeof (value as { toString?: () => string }).toString === 'function'
    ? (value as { toString: () => string }).toString()
    : String(value ?? '0');
  const normalized = raw.replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return '0.00';
  return parsed.toFixed(2);
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

function deriveHalkbankApiUrl(gatewayUrl?: string | null) {
  if (!gatewayUrl) return '';
  if (gatewayUrl.toLowerCase().includes('/fim/api')) return gatewayUrl;
  return gatewayUrl
    .replace(/\/fim\/est3dgate/i, '/fim/api')
    .replace(/\/servlet\/est3dgate/i, '/fim/api');
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getXmlTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
  return match?.[1]?.trim() || '';
}

function readAttemptSnapshot(value: unknown, fallback: { amount: unknown; currency: string; orderId: string; locale: string; reservationCode: string }) : PaymentAttemptSnapshot {
  const raw = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  return {
    amountSnapshot: decimalString(raw.amountSnapshot ?? fallback.amount),
    currencySnapshot: String(raw.currencySnapshot || fallback.currency || 'TRY').toUpperCase(),
    orderIdSnapshot: String(raw.orderIdSnapshot || fallback.orderId),
    localeSnapshot: String(raw.localeSnapshot || raw.locale || fallback.locale || 'tr').toLowerCase(),
    reservationCode: String(raw.reservationCode || fallback.reservationCode || ''),
    sourceIp: raw.sourceIp ? String(raw.sourceIp) : null,
    fromPaymentLink: raw.fromPaymentLink === true,
    paymentLinkToken: raw.paymentLinkToken ? String(raw.paymentLinkToken) : null,
    bypassPaymentPolicies: raw.bypassPaymentPolicies === true,
    cardLast4: raw.cardLast4 ? String(raw.cardLast4) : undefined
  };
}

async function updateAttemptAndPayment(params: {
  attemptId: string;
  paymentId: string;
  reservationId: string;
  success: boolean;
  raw: unknown;
  transactionReference?: string | null;
  cardBrand?: string | null;
  action: string;
}) {
  await db.paymentAttempt.update({
    where: { id: params.attemptId },
    data: {
      status: params.success ? PaymentStatus.AUTHORIZED : PaymentStatus.FAILED,
      callbackVerified: true,
      responsePayload: params.raw as never,
      transactionReference: params.transactionReference || null
    }
  });

  await db.payment.update({
    where: { id: params.paymentId },
    data: {
      status: params.success ? PaymentStatus.PAID : PaymentStatus.FAILED,
      cardBrand: params.cardBrand || null,
      transactionReference: params.transactionReference || null,
      providerResponse: params.raw as never
    }
  });

  await db.reservation.update({
    where: { id: params.reservationId },
    data: { status: params.success ? ReservationStatus.PAID : ReservationStatus.FAILED }
  });

  await writeAuditLog({
    entityType: 'PaymentAttempt',
    entityId: params.attemptId,
    action: params.action,
    after: params.raw
  });
}

export async function createTransferPayment(reservationId: string) {
  const reservation = await db.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) throw new Error('Reservation not found.');

  const payment = await db.payment.create({
    data: {
      reservationId,
      method: PaymentMethod.BANK_TRANSFER,
      provider: PaymentProvider.NONE,
      status: PaymentStatus.PENDING_TRANSFER,
      amount: reservation.totalAmount,
      currency: reservation.currency
    }
  });

  await db.reservation.update({
    where: { id: reservationId },
    data: { status: ReservationStatus.PENDING_TRANSFER }
  });

  return payment;
}

export async function createPaymentLink(reservationId: string) {
  const reservation = await db.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) throw new Error('Reservation not found.');

  return db.payment.create({
    data: {
      reservationId,
      method: PaymentMethod.PAYMENT_LINK,
      provider: PaymentProvider.NONE,
      status: PaymentStatus.PENDING,
      amount: reservation.totalAmount,
      currency: reservation.currency,
      paymentLinkToken: crypto.randomUUID()
    }
  });
}

export async function initiateCard3DPayment(input: {
  reservationId: string;
  preferredProvider?: PaymentProvider | null;
  installment: number;
  locale: string;
  sourceIp?: string;
  fromPaymentLink?: boolean;
  paymentLinkToken?: string;
  bypassPaymentPolicies?: boolean;
  card: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
}) {
  const reservation = await db.reservation.findUnique({
    where: { id: input.reservationId }
  });
  if (!reservation) throw new Error('Reservation not found.');

  const setting = await getActivePaymentSetting(input.preferredProvider || null);
  if (!setting) throw new Error('No active payment provider is configured.');

  const amountSnapshot = decimalString(reservation.totalAmount);

  const payment = await db.payment.create({
    data: {
      reservationId: reservation.id,
      method: PaymentMethod.CARD_3D,
      provider: setting.provider,
      status: PaymentStatus.PENDING,
      amount: amountSnapshot,
      currency: reservation.currency,
      installment: input.installment
    }
  });

  const attempt = await db.paymentAttempt.create({
    data: {
      paymentId: payment.id,
      provider: setting.provider,
      status: PaymentStatus.PENDING,
      sessionToken: crypto.randomUUID(),
      requestPayload: {
        locale: input.locale,
        localeSnapshot: input.locale,
        reservationCode: reservation.code,
        sourceIp: input.sourceIp || null,
        fromPaymentLink: input.fromPaymentLink === true,
        paymentLinkToken: input.paymentLinkToken || null,
        bypassPaymentPolicies: input.bypassPaymentPolicies === true,
        cardLast4: input.card.number.slice(-4),
        amountSnapshot,
        currencySnapshot: reservation.currency,
        orderIdSnapshot: payment.id
      }
    }
  });

  const successUrl = setting.successUrl || absoluteUrl(`/${input.locale}/payment/success?reservation=${reservation.id}`);
  const failUrl = setting.failUrl || absoluteUrl(`/${input.locale}/payment/fail?reservation=${reservation.id}`);
  const callbackUrl = setting.callbackUrl || absoluteUrl(`/api/payments/callback/${setting.provider.toLowerCase()}`);

  const adapter = getPaymentProvider(setting.provider);
  const init = await adapter.start3DS({
    payment,
    attempt,
    reservation,
    setting: setting as never,
    locale: input.locale,
    successUrl,
    failUrl,
    callbackUrl,
    card: input.card
  });

  await db.reservation.update({
    where: { id: reservation.id },
    data: { status: ReservationStatus.PENDING_PAYMENT }
  });

  return init;
}

export async function storeHalkbank3DCallbackSnapshot(input: {
  body: Record<string, string>;
  query?: Record<string, string>;
}) {
  const attemptId = input.body.attemptId || input.query?.attemptId;
  if (!attemptId) return;

  const attempt = await db.paymentAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt) return;

  const existing = attempt.responsePayload && typeof attempt.responsePayload === 'object'
    ? (attempt.responsePayload as Record<string, unknown>)
    : {};

  const merged = {
    ...existing,
    callbackSnapshot: input.body,
    callbackQuery: input.query || {}
  };

  await db.paymentAttempt.update({
    where: { id: attempt.id },
    data: {
      callbackVerified: ['1', '2', '3', '4'].includes(input.body.mdStatus || input.body.MdStatus || ''),
      responsePayload: merged as never,
      transactionReference: input.body.HostRefNum || input.body.TransId || input.body.xid || attempt.transactionReference || null
    }
  });

  await writeAuditLog({
    entityType: 'PaymentAttempt',
    entityId: attempt.id,
    action: 'PAYMENT_CALLBACK_SNAPSHOT_RECORDED',
    after: merged
  });
}

export async function finalizeHalkbank3DPayment(input: {
  body: Record<string, string>;
  query?: Record<string, string>;
}) {
  const attemptId = input.body.attemptId || input.query?.attemptId;
  if (!attemptId) throw new Error('Payment attempt not found.');

  const attempt = await db.paymentAttempt.findUnique({
    where: { id: attemptId },
    include: { payment: { include: { reservation: true } } }
  });
  if (!attempt) throw new Error('Payment attempt not found.');

  const snapshot = readAttemptSnapshot(attempt.requestPayload, {
    amount: attempt.payment.amount,
    currency: attempt.payment.currency,
    orderId: attempt.payment.id,
    locale: attempt.payment.reservation.locale.toLowerCase(),
    reservationCode: attempt.payment.reservation.code
  });

  const locale = snapshot.localeSnapshot;

  if (attempt.payment.status === PaymentStatus.PAID && attempt.payment.transactionReference) {
    return {
      success: true,
      locale,
      reservationId: attempt.payment.reservationId,
      details: {
        Response: 'Approved',
        ProcReturnCode: '00',
        HostRefNum: attempt.payment.transactionReference,
        oid: input.body.oid || snapshot.orderIdSnapshot,
        mdStatus: input.body.mdStatus || input.body.MdStatus || '',
        callbackCall: input.body.callbackCall || ''
      } as Record<string, string>
    };
  }

  const body = input.body;
  const mdStatus = body.mdStatus || body.MdStatus || '';
  const mdOk = ['1', '2', '3', '4'].includes(mdStatus);

  if (!mdOk) {
    const raw = { auth3d: body, finalize: null, reason: '3D authentication failed before sale.' };
    await updateAttemptAndPayment({
      attemptId: attempt.id,
      paymentId: attempt.paymentId,
      reservationId: attempt.payment.reservationId,
      success: false,
      raw,
      transactionReference: null,
      cardBrand: null,
      action: 'PAYMENT_3D_AUTH_FAILED'
    });

    return {
      success: false,
      locale,
      reservationId: attempt.payment.reservationId,
      details: {
        mdStatus,
        mdErrorMsg: body.mdErrorMsg || body.MdErrorMessage || body.ErrMsg || '3D authentication failed',
        oid: body.oid || snapshot.orderIdSnapshot,
        xid: body.xid || '',
        clientid: body.clientid || '',
        callbackCall: body.callbackCall || ''
      } as Record<string, string>
    };
  }

  if (!body.md || !body.xid || !body.eci || !body.cavv) {
    throw new Error('Halkbank 3D success response is missing md/xid/eci/cavv values required for sale finalization.');
  }

  const setting = await getActivePaymentSetting(PaymentProvider.HALKBANK);
  if (!setting?.merchantId || !setting.apiUrl) {
    throw new Error('Halkbank payment setting is incomplete.');
  }

  const creds = await getProviderApiCredential(PaymentProvider.HALKBANK);
  if (!creds.username || !creds.password) {
    throw new Error('Halkbank API username/password are not configured in admin payment settings.');
  }

  const apiUrl = deriveHalkbankApiUrl(setting.apiUrl);
  if (!apiUrl) {
    throw new Error('Halkbank API endpoint could not be derived from the configured apiUrl.');
  }

  const sourceIp = snapshot.sourceIp || '127.0.0.1';
  const currencyCode = mapCurrencyToNumeric(snapshot.currencySnapshot);
  const orderId = snapshot.orderIdSnapshot;
  const total = snapshot.amountSnapshot;
  const mode = setting.testMode ? 'T' : 'P';

  const xml = `<?xml version="1.0" encoding="ISO-8859-9"?>` +
    `<CC5Request>` +
    `<Name>${xmlEscape(creds.username)}</Name>` +
    `<Password>${xmlEscape(creds.password)}</Password>` +
    `<ClientId>${xmlEscape(setting.merchantId)}</ClientId>` +
    `<IPAddress>${xmlEscape(sourceIp)}</IPAddress>` +
    `<Email>${xmlEscape(attempt.payment.reservation.email || '')}</Email>` +
    `<Mode>${xmlEscape(mode)}</Mode>` +
    `<OrderId>${xmlEscape(orderId)}</OrderId>` +
    `<GroupId></GroupId>` +
    `<TransId></TransId>` +
    `<UserId></UserId>` +
    `<Type>Auth</Type>` +
    `<Number>${xmlEscape(body.md)}</Number>` +
    `<Expires></Expires>` +
    `<Cvv2Val></Cvv2Val>` +
    `<Total>${xmlEscape(total)}</Total>` +
    `<Currency>${xmlEscape(currencyCode)}</Currency>` +
    `<Taksit></Taksit>` +
    `<PayerTxnId>${xmlEscape(body.xid)}</PayerTxnId>` +
    `<PayerSecurityLevel>${xmlEscape(body.eci)}</PayerSecurityLevel>` +
    `<PayerAuthenticationCode>${xmlEscape(body.cavv)}</PayerAuthenticationCode>` +
    `<CardholderPresentCode>13</CardholderPresentCode>` +
    `<BillTo><Name></Name><Street1></Street1><Street2></Street2><Street3></Street3><City></City><StateProv></StateProv><PostalCode></PostalCode><Country></Country><Company></Company><TelVoice></TelVoice></BillTo>` +
    `<ShipTo><Name></Name><Street1></Street1><Street2></Street2><Street3></Street3><City></City><StateProv></StateProv><PostalCode></PostalCode><Country></Country></ShipTo>` +
    `<Extra></Extra>` +
    `</CC5Request>`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-9'
    },
    body: new URLSearchParams({ DATA: xml }).toString(),
    cache: 'no-store'
  });

  const xmlResponse = await response.text();

  const parsed = {
    Response: getXmlTag(xmlResponse, 'Response'),
    OrderId: getXmlTag(xmlResponse, 'OrderId'),
    AuthCode: getXmlTag(xmlResponse, 'AuthCode'),
    ProcReturnCode: getXmlTag(xmlResponse, 'ProcReturnCode'),
    TransId: getXmlTag(xmlResponse, 'TransId'),
    HostRefNum: getXmlTag(xmlResponse, 'HostRefNum'),
    ErrMsg: getXmlTag(xmlResponse, 'ErrMsg'),
    Total: total,
    Currency: snapshot.currencySnapshot,
    xmlResponse
  };

  const approved = parsed.Response.toLowerCase() === 'approved' && parsed.ProcReturnCode === '00';
  const transactionReference = parsed.HostRefNum || parsed.TransId || null;
  const raw = { auth3d: body, finalize: parsed };

  await updateAttemptAndPayment({
    attemptId: attempt.id,
    paymentId: attempt.paymentId,
    reservationId: attempt.payment.reservationId,
    success: approved,
    raw,
    transactionReference,
    cardBrand: body.CardType || body.cardType || null,
    action: approved ? 'PAYMENT_APPROVED' : 'PAYMENT_FAILED'
  });

  return {
    success: approved,
    locale,
    reservationId: attempt.payment.reservationId,
    details: {
      Response: parsed.Response || 'Error',
      ProcReturnCode: parsed.ProcReturnCode || '',
      HostRefNum: parsed.HostRefNum || '',
      AuthCode: parsed.AuthCode || '',
      TransId: parsed.TransId || '',
      ErrMsg: parsed.ErrMsg || '',
      mdStatus,
      oid: orderId,
      xid: body.xid || '',
      clientid: body.clientid || setting.merchantId,
      callbackCall: body.callbackCall || ''
    } as Record<string, string>
  };
}

export async function handleProviderCallback(input: {
  provider: PaymentProvider;
  body: Record<string, string>;
  query?: Record<string, string>;
}) {
  const attemptId = input.body.attemptId || input.query?.attemptId;
  if (!attemptId) throw new Error('Payment attempt not found.');

  const attempt = await db.paymentAttempt.findUnique({
    where: { id: attemptId },
    include: { payment: { include: { reservation: true } } }
  });
  if (!attempt) throw new Error('Payment attempt not found.');

  const setting = await getActivePaymentSetting(attempt.provider);
  if (!setting) throw new Error('Provider setting not found.');
  const adapter = getPaymentProvider(attempt.provider);
  const verification = await adapter.verifyCallback({
    setting: setting as never,
    body: input.body,
    query: input.query || {}
  });

  const approved = verification.approved && verification.verified;

  await db.paymentAttempt.update({
    where: { id: attempt.id },
    data: {
      status: approved ? PaymentStatus.AUTHORIZED : PaymentStatus.FAILED,
      callbackVerified: verification.verified,
      responsePayload: verification.raw as never,
      transactionReference: verification.transactionReference || null
    }
  });

  await db.payment.update({
    where: { id: attempt.paymentId },
    data: {
      status: approved ? PaymentStatus.PAID : PaymentStatus.FAILED,
      cardBrand: verification.cardBrand || null,
      transactionReference: verification.transactionReference || null,
      providerResponse: verification.raw as never
    }
  });

  await db.reservation.update({
    where: { id: attempt.payment.reservationId },
    data: { status: approved ? ReservationStatus.PAID : ReservationStatus.FAILED }
  });

  await writeAuditLog({
    entityType: 'PaymentAttempt',
    entityId: attempt.id,
    action: approved ? 'PAYMENT_APPROVED' : 'PAYMENT_FAILED',
    after: verification.raw
  });

  return {
    success: approved,
    reservationId: attempt.payment.reservationId,
    locale: attempt.payment.reservation.locale.toLowerCase()
  };
}
