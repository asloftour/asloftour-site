import Link from 'next/link';
import { LayoutDashboard, BookOpenText, CircleDollarSign, MessageSquareText, Files, Settings, Users, ImageIcon, CreditCard } from 'lucide-react';

const items = [
  ['/admin', 'Dashboard', LayoutDashboard],
  ['/admin/reservations', 'Reservations', BookOpenText],
  ['/admin/inquiries', 'Inquiries', MessageSquareText],
  ['/admin/payments', 'Payments', CircleDollarSign],
  ['/admin/experiences', 'Experiences', Files],
  ['/admin/legal', 'Legal', Files],
  ['/admin/settings', 'Settings', Settings],
  ['/admin/payment-settings', 'Payment Settings', CreditCard],
  ['/admin/users', 'Users', Users],
  ['/admin/media', 'Media', ImageIcon]
] as const;

export function AdminSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#0d0d12] p-5 lg:block">
      <div className="mb-8 px-3 pt-2 text-sm font-semibold uppercase tracking-[0.3em] text-white">AS LOF TOUR</div>
      <nav className="space-y-2">
        {items.map(([href, label, Icon]) => (
          <Link key={href} href={href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/72 transition hover:bg-white/6 hover:text-white">
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
