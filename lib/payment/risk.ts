import { getPaymentSecuritySettings } from '@/lib/site-settings';

export async function ensureIpNotBlocked(ip: string) {
  const security = await getPaymentSecuritySettings();
  const blocked = new Set((security.blockedIps || []).map((item) => String(item).trim()).filter(Boolean));
  if (ip && blocked.has(ip)) {
    throw new Error('This IP address is blocked.');
  }
}

export async function getPaymentLinkConfig(payment: { providerResponse: unknown }) {
  const security = await getPaymentSecuritySettings();
  const raw = (payment.providerResponse && typeof payment.providerResponse === 'object'
    ? payment.providerResponse
    : {}) as Record<string, unknown>;
  const linkConfig = (raw.linkConfig && typeof raw.linkConfig === 'object'
    ? raw.linkConfig
    : {}) as Record<string, unknown>;

  return {
    expiresAt: String(
      linkConfig.expiresAt ||
        new Date(Date.now() + security.paymentLinkExpiryHours * 60 * 60 * 1000).toISOString()
    ),
    maxUses: Math.max(1, Number(linkConfig.maxUses || security.paymentLinkMaxUses || 1)),
    uses: Math.max(0, Number(linkConfig.uses || 0)),
    specialCustomerBypass: linkConfig.specialCustomerBypass === true
  };
}

export function isPaymentLinkExpired(config: {
  expiresAt?: string | null;
  maxUses?: number | null;
  uses?: number | null;
}) {
  const expiresAt = config.expiresAt ? new Date(config.expiresAt).getTime() : Number.POSITIVE_INFINITY;
  const maxUses = Math.max(1, Number(config.maxUses ?? 1));
  const uses = Math.max(0, Number(config.uses ?? 0));
  return expiresAt < Date.now() || uses >= maxUses;
}
