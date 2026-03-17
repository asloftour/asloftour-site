import { db } from '@/lib/db';

export async function writeAuditLog(input: {
  actorUserId?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string | null;
}) {
  await db.auditLog.create({
    data: {
      actorUserId: input.actorUserId || undefined,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      before: input.before as never,
      after: input.after as never,
      ipAddress: input.ipAddress || undefined
    }
  });
}
