import { getPaymentSecuritySettings, getTurnstileSecret } from '@/lib/site-settings';

export async function verifyTurnstileToken(input: {
  token?: string | null;
  ip?: string | null;
}) {
  const security = await getPaymentSecuritySettings();
  if (!security.captchaEnabled) {
    return { success: true, skipped: true };
  }

  const token = String(input.token || '').trim();
  if (!token) {
    return { success: false, skipped: false, message: 'Captcha doğrulaması zorunlu.' };
  }

  const secret = await getTurnstileSecret();
  if (!secret) {
    return { success: false, skipped: false, message: 'Captcha gizli anahtarı tanımlı değil.' };
  }

  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (input.ip) form.set('remoteip', input.ip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      cache: 'no-store'
    });

    const payload = (await response.json()) as { success?: boolean };
    return {
      success: payload.success === true,
      skipped: false,
      message: payload.success === true ? undefined : 'Captcha doğrulaması başarısız.'
    };
  } catch {
    return { success: false, skipped: false, message: 'Captcha doğrulaması sırasında bağlantı hatası oluştu.' };
  }
}
