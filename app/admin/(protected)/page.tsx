import { db } from '@/lib/db';
import { StatCard } from '@/components/admin/stat-card';

export default async function AdminDashboardPage() {
  const [reservations, payments, inquiries, contacts] = await Promise.all([
    db.reservation.count(),
    db.payment.count(),
    db.inquiry.count(),
    db.contactSubmission.count()
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm uppercase tracking-[0.25em] text-white/50">Dashboard</div>
        <h1 className="mt-3 text-3xl font-semibold text-white">Operations overview</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reservations" value={reservations} help="Includes all statuses" />
        <StatCard label="Payments" value={payments} help="Card, transfer and link flows" />
        <StatCard label="Inquiries" value={inquiries} help="Private planning and appointments" />
        <StatCard label="Contact submissions" value={contacts} help="Website contact records" />
      </div>
    </div>
  );
}
