import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { db } from '@/lib/db';
import { getEmailSettings } from '@/lib/email-config';
import { getPaymentSecuritySettings } from '@/lib/site-settings';

const ACCESS_COOKIE = 'asl_customer_session';
const OTP_COOKIE = 'asl_customer_otp';

function secret() {
  return process.env.CUSTOMER_SESSION_SECRET || process.env.NEXTAUTH_SECRET || 'asl-customer-secret';
}

function sha(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function sign(data: string) {
  return createHmac('sha256', secret()).update(data).digest('hex');
}

function encode(payload: Record<string, string | number>) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${sign(data)}`;
}

function decode(token?: string | null) {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  if (!data || !sig) return null;

  const expected = sign(data);
  try {
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as Record<string, string | number>;
  } catch {
    return null;
  }
}

function randomOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendMail(to: string, subject: string, html: string) {
  const email = await getEmailSettings();

  if (email.provider === 'resend' && email.resendApiKey) {
    const resend = new Resend(email.resendApiKey);
    await resend.emails.send({
      from: `${email.fromName} <${email.fromEmail}>`,
      to,
      subject,
      html,
      replyTo: email.resendReplyTo || email.fromEmail
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: email.smtpHost,
    port: email.smtpPort,
    secure: email.smtpSecure,
    auth: email.smtpUser && email.smtpPass ? { user: email.smtpUser, pass: email.smtpPass } : undefined
  });

  await transporter.sendMail({
    from: `${email.fromName} <${email.fromEmail}>`,
    to,
    subject,
    html
  });
}

export async function sendReservationAccessOtp(input: { reservationId: string; email: string }) {
  const reservation = await db.reservation.findUnique({ where: { id: input.reservationId } });
  if (!reservation) throw new Error('Reservation not found.');

  const email = input.email.trim().toLowerCase();
  if (reservation.email.trim().toLowerCase() !== email) {
    throw new Error('Reservation email does not match.');
  }

  const security = await getPaymentSecuritySettings();
  const code = randomOtp();
  const expiresAt = Date.now() + security.customerOtpTtlMinutes * 60 * 1000;

  const otpToken = encode({
    reservationId: reservation.id,
    email,
    codeHash: sha(code),
    exp: expiresAt
  });

  const jar = await cookies();
  jar.set(OTP_COOKIE, otpToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires: new Date(expiresAt)
  });

  await sendMail(
    reservation.email,
    `AS LOF TOUR payment access code · ${reservation.code}`,
    `<p>Hello ${reservation.fullName || ''},</p>
     <p>Your one-time payment access code for reservation <strong>${reservation.code}</strong> is:</p>
     <p style="font-size:28px;font-weight:700;letter-spacing:6px;">${code}</p>
     <p>This code expires in ${security.customerOtpTtlMinutes} minutes.</p>`
  );
}

export async function verifyReservationAccessOtp(input: {
  reservationId: string;
  email: string;
  code: string;
}) {
  const reservation = await db.reservation.findUnique({ where: { id: input.reservationId } });
  if (!reservation) throw new Error('Reservation not found.');

  const email = input.email.trim().toLowerCase();
  if (reservation.email.trim().toLowerCase() !== email) {
    throw new Error('Reservation email does not match.');
  }

  const jar = await cookies();
  const token = jar.get(OTP_COOKIE)?.value;
  const payload = decode(token);
  if (!payload) throw new Error('Invalid verification code.');

  if (String(payload.reservationId || '') !== reservation.id || String(payload.email || '') !== email) {
    throw new Error('Invalid verification code.');
  }

  const exp = Number(payload.exp || 0);
  if (!exp || exp < Date.now()) {
    throw new Error('Verification code expired.');
  }

  if (String(payload.codeHash || '') !== sha(input.code.trim())) {
    throw new Error('Invalid verification code.');
  }

  const accessExpiresAt = Date.now() + 12 * 60 * 60 * 1000;
  const accessToken = encode({
    reservationId: reservation.id,
    email,
    exp: accessExpiresAt
  });

  jar.set(OTP_COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: true, path: '/', expires: new Date(0) });

  return { token: accessToken, expiresAt: accessExpiresAt };
}

export async function persistCustomerAccessCookie(token: string, expiresAt: number) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires: new Date(expiresAt)
  });
}

export async function hasReservationAccess(reservationId: string, email?: string) {
  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE)?.value;
  const payload = decode(token);
  if (!payload) return false;

  const exp = Number(payload.exp || 0);
  if (!exp || exp < Date.now()) return false;
  if (String(payload.reservationId || '') !== reservationId) return false;
  if (email && String(payload.email || '') !== email.trim().toLowerCase()) return false;

  return true;
}
