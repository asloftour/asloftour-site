import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { auth } from '@/auth';
import { Locale, PaymentMethod, PaymentProvider, PaymentStatus, ReservationStatus } from '@prisma/client';
import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';

function normalizeLocale(value?: string) {
  const locale = (value || 'tr').toLowerCase();
  if (locale === 'en') return { app: 'en', db: Locale.EN };
  if (locale === 'ar') return { app: 'ar', db: Locale.AR };
  return { app: 'tr', db: Locale.TR };
}

function normalizeCurrency(value?: string) {
  const currency = (value || 'TRY').toUpperCase();
  if (currency === 'EUR' || currency === 'USD' || currency === 'TRY') return currency;
  return 'TRY';
}

function buildReservationCode() {
  return `PL-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ message: 'Geçerli bir tutar girin.' }, { status: 400 });
    }

    const currency = normalizeCurrency(body.currency);
    const locale = normalizeLocale(body.locale);
    const description =
      String(body.description || '').trim() || 'Turizm danışmanlık ücreti';

    const reservation = await db.reservation.create({
      data: {
        code: buildReservationCode(),
        locale: locale.db,
        status: ReservationStatus.NEW,
        startDate: new Date(),
        endDate: new Date(),
        guestCount: 1,
        addTransfer: false,
        fullName: 'Payment Link Customer',
        phone: '-',
        email: 'payment-link@asloftour.com',
        specialRequests: description,
        internalNotes: `Quick payment link created by ${session.user.email || 'admin'}`,
        totalAmount: amount.toFixed(2),
        currency
      }
    });

    const payment = await db.payment.create({
      data: {
        reservationId: reservation.id,
        method: PaymentMethod.PAYMENT_LINK,
        provider: PaymentProvider.HALKBANK,
        status: PaymentStatus.NEW,
        amount: amount.toFixed(2),
        currency,
        installment: 1,
        paymentLinkToken: randomUUID()
      }
    });

    const url = absoluteUrl(`/${locale.app}/pay/${payment.paymentLinkToken}`);

    return NextResponse.json({
      ok: true,
      url,
      token: payment.paymentLinkToken,
      reservationId: reservation.id
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment link could not be created.' },
      { status: 400 }
    );
  }
}