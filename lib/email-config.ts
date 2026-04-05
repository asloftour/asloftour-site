import { db } from '@/lib/db';
import { decryptSecret, encryptSecret } from '@/lib/encryption';

export type EmailSettings = {
  provider: 'smtp' | 'resend';
  fromEmail: string;
  fromName: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  resendReplyTo: string;
};

export const defaultEmailSettings: EmailSettings = {
  provider: 'smtp',
  fromEmail: 'asloftour@gmail.com',
  fromName: 'AS LOF TOUR',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: 'asloftour@gmail.com',
  resendReplyTo: 'asloftour@gmail.com'
};

export function normalizeEmailSettings(value: Partial<EmailSettings> | Record<string, unknown> | null | undefined): EmailSettings {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;

  const provider = String(raw.provider || defaultEmailSettings.provider).toLowerCase() === 'resend' ? 'resend' : 'smtp';
  const smtpPortNum = Number(raw.smtpPort ?? defaultEmailSettings.smtpPort);

  return {
    provider,
    fromEmail: String(raw.fromEmail || defaultEmailSettings.fromEmail),
    fromName: String(raw.fromName || defaultEmailSettings.fromName),
    smtpHost: String(raw.smtpHost || defaultEmailSettings.smtpHost),
    smtpPort: Number.isFinite(smtpPortNum) && smtpPortNum > 0 ? smtpPortNum : defaultEmailSettings.smtpPort,
    smtpSecure: raw.smtpSecure === true || raw.smtpSecure === 'true',
    smtpUser: String(raw.smtpUser || defaultEmailSettings.smtpUser),
    resendReplyTo: String(raw.resendReplyTo || raw.fromEmail || defaultEmailSettings.resendReplyTo)
  };
}

export async function saveEmailSettings(input: {
  settings: EmailSettings;
  resendApiKey?: string;
  smtpPass?: string;
}) {
  await db.siteSetting.upsert({
    where: { key: 'emailSettings' },
    update: { value: input.settings as never, type: 'json' },
    create: { key: 'emailSettings', value: input.settings as never, type: 'json' }
  });

  if (typeof input.resendApiKey === 'string') {
    const trimmed = input.resendApiKey.trim();
    const encrypted = trimmed ? (encryptSecret(trimmed) ?? '') : '';
    await db.siteSetting.upsert({
      where: { key: 'resendApiKeyEncrypted' },
      update: { value: encrypted as never, type: 'secret' },
      create: { key: 'resendApiKeyEncrypted', value: encrypted as never, type: 'secret' }
    });
  }

  if (typeof input.smtpPass === 'string') {
    const trimmed = input.smtpPass.trim();
    const encrypted = trimmed ? (encryptSecret(trimmed) ?? '') : '';
    await db.siteSetting.upsert({
      where: { key: 'smtpPassEncrypted' },
      update: { value: encrypted as never, type: 'secret' },
      create: { key: 'smtpPassEncrypted', value: encrypted as never, type: 'secret' }
    });
  }
}

export async function getEmailSettings() {
  const [settingsRow, resendRow, smtpPassRow] = await Promise.all([
    db.siteSetting.findUnique({ where: { key: 'emailSettings' } }),
    db.siteSetting.findUnique({ where: { key: 'resendApiKeyEncrypted' } }),
    db.siteSetting.findUnique({ where: { key: 'smtpPassEncrypted' } })
  ]);

  const settings = normalizeEmailSettings(settingsRow?.value as Record<string, unknown> | undefined);

  const resendApiKeyEncrypted = typeof resendRow?.value === 'string' ? resendRow.value : '';
  const smtpPassEncrypted = typeof smtpPassRow?.value === 'string' ? smtpPassRow.value : '';

  return {
    ...settings,
    resendApiKey: decryptSecret(resendApiKeyEncrypted) || '',
    smtpPass: decryptSecret(smtpPassEncrypted) || ''
  };
}
