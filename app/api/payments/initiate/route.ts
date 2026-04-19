import { NextRequest, NextResponse } from 'next/server';
import { PaymentMethod } from '@prisma/client';
import { paymentInitSchema } from '@/lib/validation';
import { createTransferPayment, initiateCard3DPayment, createPaymentLink } from '@/lib/payment/service';
import { getSiteSettings } from '@/lib/queries';
import { getClientIp } from '@/lib/security';
import { ensureIpNotBlocked } from '@/lib/payment/risk';
import { db } from '@/lib/db';
import { verifyTurnstileToken } from '@/lib/turnstile';

function digits(value?: string | null) {
  return String(value || '').replace(/\D+/g, '');
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readBoolean(value: unknown) {
  return value === true;
}

function readLinkConfig(value: unknown) {
  const raw = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const linkConfig =
    raw.linkConfig && typeof raw.linkConfig === 'object'
      ? (raw.linkConfig as Record<string, unknown>)
      : {};

  return {
    specialCustomerBypass: linkConfig.specialCustomerBypass === true
  };
}

async function resolvePaymentLinkForReservation(reservationId: string, token?: string) {
  if (token) {
    const payment = await db.payment.findUnique({
      where: { paymentLinkToken: token },
      include: { reservation: true }
    });

    if (!payment || payment.reservationId !== reservationId) {
      throw new Error('Payment link could not be validated.');
    }

    return payment;
  }

  return db.payment.findFirst({
    where: {
      reservationId,
      method: PaymentMethod.PAYMENT_LINK
    },
    orderBy: { createdAt: 'desc' },
    include: { reservation: true }
  });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = (await request.json()) as Record<string, unknown>;
    const body = paymentInitSchema.parse(rawBody);

    const paymentLinkToken = readString(rawBody.paymentLinkToken);
    const fromPaymentLink = readBoolean(rawBody.fromPaymentLink);
    const turnstileToken = readString(rawBody.turnstileToken);

    const settings = await getSiteSettings();
    const paymentOptions = {
      enableCard: settings.paymentOptions?.enableCard ?? true,
      enableBankTransfer: settings.paymentOptions?.enableBankTransfer ?? true,
      enablePaymentLink: settings.paymentOptions?.enablePaymentLink ?? true
    };

    const ip = getClientIp(request.headers);
    await ensureIpNotBlocked(ip);

    if (body.method === 'BANK_TRANSFER') {
      if (!paymentOptions.enableBankTransfer) {
        throw new Error('Bank transfer payments are currently disabled.');
      }

      await createTransferPayment(body.reservationId);
      return NextResponse.json({
        mode: 'redirect',
        redirectUrl: `/${body.locale}/bank-transfer?reservation=${body.reservationId}`
      });
    }

    if (body.method === 'PAYMENT_LINK') {
      if (!paymentOptions.enablePaymentLink) {
        throw new Error('Payment-link requests are currently disabled.');
      }

      await createPaymentLink(body.reservationId);
      return NextResponse.json({
        mode: 'redirect',
        redirectUrl: `/${body.locale}/payment?reservation=${body.reservationId}&requestedLink=1`
      });
    }

    if (!paymentOptions.enableCard) {
      throw new Error('Card payments are currently disabled.');
    }

    const cardNumber = digits(readString(rawBody.cardNumber));
    const expiryMonth = digits(readString(rawBody.expiryMonth));
    const expiryYear = digits(readString(rawBody.expiryYear));
    const cvv = digits(readString(rawBody.cvv));

    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      throw new Error('Kart bilgileri eksik.');
    }

    let bypassPaymentPolicies = false;
    let resolvedPaymentLinkToken = paymentLinkToken;
    let resolvedFromPaymentLink = fromPaymentLink || Boolean(paymentLinkToken);

    const linkPayment = await resolvePaymentLinkForReservation(
      body.reservationId,
      paymentLinkToken
    );

    if (linkPayment) {
      const linkConfig = readLinkConfig(linkPayment.providerResponse);

      if (linkConfig.specialCustomerBypass) {
        bypassPaymentPolicies = true;
      }

      if (!resolvedPaymentLinkToken && linkPayment.paymentLinkToken) {
        resolvedPaymentLinkToken = linkPayment.paymentLinkToken;
      }

      if (linkPayment.paymentLinkToken) {
        resolvedFromPaymentLink = true;
      }
    }

    if (!bypassPaymentPolicies) {
      if (settings.paymentSecurity?.captchaEnabled === true) {
        const captcha = await verifyTurnstileToken({ token: turnstileToken, ip });
        if (!captcha.success) {
          return NextResponse.json({ message: captcha.message }, { status: 400 });
        }
      }
    }

    const result = await initiateCard3DPayment({
      reservationId: body.reservationId,
      preferredProvider: body.provider as any,
      installment: body.installment,
      locale: body.locale,
      sourceIp: ip,
      fromPaymentLink: resolvedFromPaymentLink,
      paymentLinkToken: resolvedPaymentLinkToken,
      bypassPaymentPolicies,
      card: {
        number: cardNumber,
        expiryMonth,
        expiryYear,
        cvv
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment initiation failed.' },
      { status: 400 }
    );
  }
}
