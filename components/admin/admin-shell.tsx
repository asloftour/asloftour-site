import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090d] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
