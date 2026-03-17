import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bookingSchema } from '@/lib/validation';
import { calculateTotal } from '@/lib/pricing';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getClientIp, sanitizeText } from '@/lib/security';
import { sendEmail } from '@/lib/email';
import { toLocaleEnum } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    await enforceRateLimit('public:booking', ip, 5, 10);
    const body = bookingSchema.parse(await request.json());
    if (body.website) return NextResponse.json({ ok: true });

    const experience = await db.experience.findUnique({
      where: { id: body.experienceId },
      include: { translations: { where: { locale: toLocaleEnum(body.locale) as any } } }
    });
    if (!experience) {
      return NextResponse.json({ message: 'Experience not found.' }, { status: 404 });
    }
    if (body.guestCount < experience.minGuests || body.guestCount > experience.maxGuests) {
      return NextResponse.json({ message: 'Guest count is outside allowed range.' }, { status: 400 });
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const total = calculateTotal({
      pricingMode: experience.pricingMode,
      basePrice: Number(experience.basePrice),
      guestCount: body.guestCount,
      startDate,
      endDate
    });

    const reservation = await db.reservation.create({
      data: {
        code: `ASL-${Date.now().toString().slice(-8)}`,
        locale: toLocaleEnum(body.locale) as any,
        startDate,
        endDate,
        guestCount: body.guestCount,
        addTransfer: Boolean(body.addTransfer),
        fullName: sanitizeText(body.fullName),
        phone: sanitizeText(body.phone),
        email: sanitizeText(body.email),
        specialRequests: sanitizeText(body.specialRequests),
        billingType: body.billingType || null,
        billingFullName: sanitizeText(body.billingFullName),
        billingCompany: sanitizeText(body.billingCompany),
        billingTaxOffice: sanitizeText(body.billingTaxOffice),
        billingTaxNumber: sanitizeText(body.billingTaxNumber),
        billingAddress: sanitizeText(body.billingAddress),
        totalAmount: total,
        currency: experience.currency,
        sourceIp: ip,
        items: {
          create: {
            experienceId: experience.id,
            titleSnapshot: experience.translations[0]?.title || experience.location,
            pricingMode: experience.pricingMode,
            unitPrice: experience.basePrice,
            quantity: 1,
            totalPrice: total,
            details: {
              guests: body.guestCount,
              addTransfer: body.addTransfer
            }
          }
        }
      }
    });

    await sendEmail({
      to: reservation.email,
      subject: `Reservation received: ${reservation.code}`,
      html: `<p>Dear ${reservation.fullName}, your reservation request has been received.</p><p>Reference: <strong>${reservation.code}</strong></p>`
    });
    await sendEmail({
      to: 'asloftour@gmail.com',
      subject: `New reservation ${reservation.code}`,
      html: `<p>${reservation.fullName} submitted a reservation.</p><p>${reservation.code}</p>`
    });

    return NextResponse.json({ reservationId: reservation.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Reservation failed.' }, { status: 400 });
  }
}
