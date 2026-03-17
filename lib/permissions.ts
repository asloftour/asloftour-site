import { RoleKey } from '@prisma/client';

export function canManageUsers(role?: RoleKey | null) {
  return role === 'SUPER_ADMIN';
}

export function canEditOperations(role?: RoleKey | null) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'SALES';
}

export function canViewAdmin(role?: RoleKey | null) {
  return Boolean(role);
}
