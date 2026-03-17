import { NextRequest, NextResponse } from 'next/server';
import { inquirySchema } from '@/lib/validation';
import { db } from '@/lib/db';
import { enforceRateLimit } from '@/lib/rate-limit';
import { getClientIp, sanitizeText } from '@/lib/security';
import { sendEmail } from '@/lib/email';
import { toLocaleEnum } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    await enforceRateLimit('public:inquiry', ip, 5, 10);
    const body = inquirySchema.parse(await request.json());
    if (body.website) return NextResponse.json({ ok: true });

    await db.inquiry.create({
      data: {
        locale: toLocaleEnum(body.locale) as any,
        type: body.type,
        experienceId: body.experienceId || null,
        name: sanitizeText(body.name),
        email: sanitizeText(body.email),
        phone: sanitizeText(body.phone),
        company: sanitizeText(body.company),
        message: sanitizeText(body.message),
        preferredDate: body.preferredDate ? new Date(body.preferredDate) : null,
        sourceIp: ip
      }
    });

    await sendEmail({ to: 'asloftour@gmail.com', subject: 'New planning inquiry', html: `<p>${body.name}</p><p>${body.message}</p>` });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Inquiry failed.' }, { status: 400 });
  }
}
