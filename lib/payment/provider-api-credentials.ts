import { PaymentProvider } from '@prisma/client';
import { db } from '@/lib/db';
import { decryptSecret, encryptSecret } from '@/lib/encryption';
import { maskedSecret } from '@/lib/utils';

type CredentialMap = Record<string, {
  usernameEncrypted?: string | null;
  passwordEncrypted?: string | null;
}>;

function parse(raw: unknown): CredentialMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw as CredentialMap;
}

export async function getProviderApiCredential(provider: PaymentProvider) {
  const row = await db.siteSetting.findUnique({ where: { key: 'paymentApiCredentials' } });
  const data = parse(row?.value);
  const current = data[provider] || {};

  return {
    username: decryptSecret(current.usernameEncrypted || null) || '',
    password: decryptSecret(current.passwordEncrypted || null) || ''
  };
}

export async function getAllProviderApiCredentials() {
  const row = await db.siteSetting.findUnique({ where: { key: 'paymentApiCredentials' } });
  const data = parse(row?.value);

  return Object.entries(data).reduce<Record<string, { username: string; hasPassword: boolean; maskedPassword: string }>>((acc, [provider, value]) => {
    const username = decryptSecret(value?.usernameEncrypted || null) || '';
    const password = decryptSecret(value?.passwordEncrypted || null) || '';
    acc[provider] = {
      username,
      hasPassword: Boolean(password),
      maskedPassword: maskedSecret(password)
    };
    return acc;
  }, {});
}

export async function saveProviderApiCredential(input: {
  provider: PaymentProvider;
  username?: string;
  password?: string;
}) {
  const row = await db.siteSetting.findUnique({ where: { key: 'paymentApiCredentials' } });
  const data = parse(row?.value);
  const current = data[input.provider] || {};

  const usernameEncrypted = input.username
    ? encryptSecret(input.username)
    : current.usernameEncrypted || null;

  const passwordEncrypted = input.password
    ? encryptSecret(input.password)
    : current.passwordEncrypted || null;

  data[input.provider] = {
    usernameEncrypted,
    passwordEncrypted
  };

  await db.siteSetting.upsert({
    where: { key: 'paymentApiCredentials' },
    update: { value: data, type: 'json' },
    create: { key: 'paymentApiCredentials', value: data, type: 'json' }
  });
}
