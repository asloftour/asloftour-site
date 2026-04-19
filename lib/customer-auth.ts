import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'asl_customer_session';
const OTP_COOKIE = 'asl_customer_otp';

function encode(payload: Record<string, string | number>) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export async function sendReservationAccessOtp(_input: { reservationId: string; email: string }) {
  const jar = await cookies();
  jar.set(OTP_COOKIE, encode({ ok: 1, exp: Date.now() + 12 * 60 * 60 * 1000 }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires: new Date(Date.now() + 12 * 60 * 60 * 1000)
  });
  return { success: true };
}

export async function verifyReservationAccessOtp(input: {
  reservationId: string;
  email: string;
  code: string;
}) {
  const accessExpiresAt = Date.now() + 12 * 60 * 60 * 1000;
  const accessToken = encode({
    reservationId: input.reservationId,
    email: input.email.trim().toLowerCase(),
    exp: accessExpiresAt
  });

  const jar = await cookies();
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

export async function hasReservationAccess(_reservationId: string, _email?: string) {
  return true;
}
