import { PaymentMethod, PaymentProvider, PaymentStatus, ReservationStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';
import { getActivePaymentSetting } from '@/lib/payment/settings';
import { getPaymentProvider } from '@/lib/payment/registry';
import { writeAuditLog } from '@/lib/audit';

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
}) {
  const reservation = await db.reservation.findUnique({
    where: { id: input.reservationId }
  });
  if (!reservation) throw new Error('Reservation not found.');

  const setting = await getActivePaymentSetting(input.preferredProvider || null);
  if (!setting) throw new Error('No active payment provider is configured.');

  const payment = await db.payment.create({
    data: {
      reservationId: reservation.id,
      method: PaymentMethod.CARD_3D,
      provider: setting.provider,
      status: PaymentStatus.PENDING,
      amount: reservation.totalAmount,
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
        reservationCode: reservation.code
      }
    }
  });

  const successUrl = setting.successUrl || absoluteUrl(`/${input.locale}/success?reservation=${reservation.id}`);
  const failUrl = setting.failUrl || absoluteUrl(`/${input.locale}/fail?reservation=${reservation.id}`);
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
    callbackUrl
  });

  await db.reservation.update({
    where: { id: reservation.id },
    data: { status: ReservationStatus.PENDING_PAYMENT }
  });

  return init;
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
