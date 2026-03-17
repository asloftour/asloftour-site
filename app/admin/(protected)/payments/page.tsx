import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead } from '@/components/ui/table';
import { StatusBadge } from '@/components/admin/status-badge';

export default async function PaymentsPage() {
  const rows = await db.payment.findMany({ orderBy: { createdAt: 'desc' }, include: { reservation: true, transferProofs: true } });
  return (
    <Card><CardContent><div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-semibold text-white">Payments</h1><Link href="/api/admin/export?type=payments" className="text-sm text-gold">CSV export</Link></div><div className="overflow-x-auto"><Table><THead><tr><TH>Reservation</TH><TH>Method</TH><TH>Provider</TH><TH>Status</TH><TH>Amount</TH><TH>Proofs</TH></tr></THead><TBody>{rows.map((row) => <tr key={row.id}><TD><Link href={`/admin/payments/${row.id}`} className="text-gold">{row.reservation.code}</Link></TD><TD>{row.method}</TD><TD>{row.provider}</TD><TD><StatusBadge value={row.status} /></TD><TD>{row.amount.toString()} {row.currency}</TD><TD>{row.transferProofs.length}</TD></tr>)}</TBody></Table></div></CardContent></Card>
  );
}
