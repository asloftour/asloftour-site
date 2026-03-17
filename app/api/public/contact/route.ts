import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';
import { db } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getClientIp, sanitizeText } from '@/lib/security';
import { sendEmail } from '@/lib/email';
import { toLocaleEnum } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    await enforceRateLimit('public:contact', ip, 5, 10);
    const body = contactSchema.parse(await request.json());
    if (body.website) return NextResponse.json({ ok: true });

    await db.contactSubmission.create({
      data: {
        locale: toLocaleEnum(body.locale) as any,
        name: sanitizeText(body.name),
        email: sanitizeText(body.email),
        phone: sanitizeText(body.phone),
        message: sanitizeText(body.message),
        sourceIp: ip
      }
    });

    await db.inquiry.create({
      data: {
        locale: toLocaleEnum(body.locale) as any,
        type: 'GENERAL',
        name: sanitizeText(body.name),
        email: sanitizeText(body.email),
        phone: sanitizeText(body.phone) || '-',
        company: null,
        message: sanitizeText(body.message),
        sourceIp: ip
      }
    });

    await sendEmail({ to: 'asloftour@gmail.com', subject: 'New contact submission', html: `<p>${body.name}</p><p>${body.message}</p>` });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Contact failed.' }, { status: 400 });
  }
}
