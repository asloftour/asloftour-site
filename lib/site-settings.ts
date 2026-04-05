import { db } from '@/lib/db';
import { decryptSecret, encryptSecret } from '@/lib/encryption';

export type PaymentSecuritySettings = {
  requireCustomerVerification: boolean;
  customerOtpTtlMinutes: number;
  maxPaymentsPerDayPerEmail: number;
  maxPaymentAttemptsPerHourPerIp: number;
  activeAttemptWindowMinutes: number;
  paymentLinkExpiryHours: number;
  paymentLinkMaxUses: number;
  captchaEnabled: boolean;
  blockedIps: string[];
  turnstileSiteKey: string;
};

export type ExchangeRateSettings = {
  baseCurrency: 'TRY';
  rates: Record<string, number>;
};

export const defaultPaymentSecuritySettings: PaymentSecuritySettings = {
  requireCustomerVerification: true,
  customerOtpTtlMinutes: 10,
  maxPaymentsPerDayPerEmail: 3,
  maxPaymentAttemptsPerHourPerIp: 5,
  activeAttemptWindowMinutes: 15,
  paymentLinkExpiryHours: 24,
  paymentLinkMaxUses: 1,
  captchaEnabled: false,
  blockedIps: [],
  turnstileSiteKey: ''
};

export const defaultExchangeRateSettings: ExchangeRateSettings = {
  baseCurrency: 'TRY',
  rates: {
    TRY: 1,
    USD: 0.031,
    EUR: 0.029,
    GBP: 0.024
  }
};

function toPositiveNumber(value: unknown, fallback: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function normalizeBlockedIps(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

export function normalizePaymentSecuritySettings(value: unknown): PaymentSecuritySettings {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;

  return {
    requireCustomerVerification: raw.requireCustomerVerification !== false,
    customerOtpTtlMinutes: Math.min(
      60,
      Math.max(5, toPositiveNumber(raw.customerOtpTtlMinutes, defaultPaymentSecuritySettings.customerOtpTtlMinutes))
    ),
    maxPaymentsPerDayPerEmail: Math.min(
      10,
      Math.max(1, toPositiveNumber(raw.maxPaymentsPerDayPerEmail, defaultPaymentSecuritySettings.maxPaymentsPerDayPerEmail))
    ),
    maxPaymentAttemptsPerHourPerIp: Math.min(
      20,
      Math.max(
        1,
        toPositiveNumber(raw.maxPaymentAttemptsPerHourPerIp, defaultPaymentSecuritySettings.maxPaymentAttemptsPerHourPerIp)
      )
    ),
    activeAttemptWindowMinutes: Math.min(
      60,
      Math.max(5, toPositiveNumber(raw.activeAttemptWindowMinutes, defaultPaymentSecuritySettings.activeAttemptWindowMinutes))
    ),
    paymentLinkExpiryHours: Math.min(
      168,
      Math.max(1, toPositiveNumber(raw.paymentLinkExpiryHours, defaultPaymentSecuritySettings.paymentLinkExpiryHours))
    ),
    paymentLinkMaxUses: Math.min(
      5,
      Math.max(1, toPositiveNumber(raw.paymentLinkMaxUses, defaultPaymentSecuritySettings.paymentLinkMaxUses))
    ),
    captchaEnabled: raw.captchaEnabled === true,
    blockedIps: normalizeBlockedIps(raw.blockedIps),
    turnstileSiteKey: String(raw.turnstileSiteKey || '')
  };
}

export function normalizeExchangeRateSettings(value: unknown): ExchangeRateSettings {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const sourceRates = (raw.rates && typeof raw.rates === 'object' ? raw.rates : {}) as Record<string, unknown>;

  return {
    baseCurrency: 'TRY',
    rates: {
      TRY: 1,
      USD: toPositiveNumber(sourceRates.USD, defaultExchangeRateSettings.rates.USD),
      EUR: toPositiveNumber(sourceRates.EUR, defaultExchangeRateSettings.rates.EUR),
      GBP: toPositiveNumber(sourceRates.GBP, defaultExchangeRateSettings.rates.GBP)
    }
  };
}

export async function getPaymentSecuritySettings() {
  const setting = await db.siteSetting.findUnique({ where: { key: 'paymentSecurity' } });
  return normalizePaymentSecuritySettings(setting?.value);
}

export async function getExchangeRateSettings() {
  const setting = await db.siteSetting.findUnique({ where: { key: 'exchangeRates' } });
  return normalizeExchangeRateSettings(setting?.value);
}

export async function saveExtendedPaymentSettings(input: {
  paymentSecurity: PaymentSecuritySettings;
  exchangeRates: ExchangeRateSettings;
  turnstileSecret?: string;
}) {
  await db.siteSetting.upsert({
    where: { key: 'paymentSecurity' },
    update: { value: input.paymentSecurity as never, type: 'json' },
    create: { key: 'paymentSecurity', value: input.paymentSecurity as never, type: 'json' }
  });

  await db.siteSetting.upsert({
    where: { key: 'exchangeRates' },
    update: { value: input.exchangeRates as never, type: 'json' },
    create: { key: 'exchangeRates', value: input.exchangeRates as never, type: 'json' }
  });

  if (typeof input.turnstileSecret === 'string') {
    const existing = await db.siteSetting.findUnique({
      where: { key: 'turnstileSecretEncrypted' }
    });

    const secret = input.turnstileSecret.trim();
    const encrypted = secret
      ? (encryptSecret(secret) ?? '')
      : (typeof existing?.value === 'string' ? existing.value : '');

    await db.siteSetting.upsert({
      where: { key: 'turnstileSecretEncrypted' },
      update: { value: encrypted as never, type: 'secret' },
      create: { key: 'turnstileSecretEncrypted', value: encrypted as never, type: 'secret' }
    });
  }
}

export async function getTurnstileSecret() {
  const setting = await db.siteSetting.findUnique({
    where: { key: 'turnstileSecretEncrypted' }
  });

  const encrypted = typeof setting?.value === 'string' ? setting.value : '';
  return decryptSecret(encrypted) || '';
}