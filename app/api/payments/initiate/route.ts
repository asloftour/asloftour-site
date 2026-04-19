import { NextRequest, NextResponse } from 'next/server';
import { paymentInitSchema } from '@/lib/validation';
import { createTransferPayment, initiateCard3DPayment, createPaymentLink } from '@/lib/payment/service';
import { getSiteSettings } from '@/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const body = paymentInitSchema.parse(await request.json());
    const settings = await getSiteSettings();
    const paymentOptions = {
      enableCard: settings.paymentOptions?.enableCard ?? true,
      enableBankTransfer: settings.paymentOptions?.enableBankTransfer ?? true,
      enablePaymentLink: settings.paymentOptions?.enablePaymentLink ?? true
    };

    if (body.method === 'BANK_TRANSFER') {
      if (!paymentOptions.enableBankTransfer) throw new Error('Bank transfer payments are currently disabled.');
      await createTransferPayment(body.reservationId);
      return NextResponse.json({ mode: 'redirect', redirectUrl: `/${body.locale}/bank-transfer?reservation=${body.reservationId}` });
    }

    if (body.method === 'PAYMENT_LINK') {
      if (!paymentOptions.enablePaymentLink) throw new Error('Payment-link requests are currently disabled.');
      await createPaymentLink(body.reservationId);
      return NextResponse.json({ mode: 'redirect', redirectUrl: `/${body.locale}/payment?reservation=${body.reservationId}&requestedLink=1` });
    }

    if (!paymentOptions.enableCard) throw new Error('Card payments are currently disabled.');
    const result = await initiateCard3DPayment({
      reservationId: body.reservationId,
      preferredProvider: body.provider as any,
      installment: body.installment,
      locale: body.locale
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Payment initiation failed.' }, { status: 400 });
  }
}
