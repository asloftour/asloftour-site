import { db } from '@/lib/db';

export async function enforceRateLimit(scope: string, key: string, limit = 5, windowMinutes = 10) {
  const now = new Date();
  const threshold = new Date(now.getTime() - windowMinutes * 60 * 1000);
  const existing = await db.rateLimitHit.findUnique({ where: { scope_key: { scope, key } } });

  if (!existing) {
    await db.rateLimitHit.create({ data: { scope, key, count: 1, lastHitAt: now } });
    return;
  }

  if (existing.lastHitAt < threshold) {
    await db.rateLimitHit.update({
      where: { id: existing.id },
      data: { count: 1, lastHitAt: now }
    });
    return;
  }

  if (existing.count >= limit) {
    throw new Error('Too many requests. Please try again shortly.');
  }

  await db.rateLimitHit.update({
    where: { id: existing.id },
    data: { count: { increment: 1 }, lastHitAt: now }
  });
}
