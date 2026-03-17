import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { RoleKey } from '@prisma/client';

export async function requireAdminSession(allowedRoles?: RoleKey[]) {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }
  const role = (session.user.role as RoleKey | undefined) || undefined;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    redirect('/admin');
  }
  return session;
}
