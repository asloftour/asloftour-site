import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead } from '@/components/ui/table';
import { StatusBadge } from '@/components/admin/status-badge';
import { formatDate } from '@/lib/utils';

export default async function ReservationsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const rows = await db.reservation.findMany({
    where: {
      ...(q ? { OR: [{ fullName: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }, { code: { contains: q, mode: 'insensitive' } }] } : {}),
      ...(status ? { status: status as any } : {})
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true }
  });

  return (
    <Card>
      <CardContent>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-white">Reservations</h1>
          <Link href="/api/admin/export?type=reservations" className="text-sm text-gold">CSV export</Link>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <THead><tr><TH>Code</TH><TH>Guest</TH><TH>Experience</TH><TH>Status</TH><TH>Total</TH><TH>Created</TH></tr></THead>
            <TBody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <TD><Link href={`/admin/reservations/${row.id}`} className="text-gold">{row.code}</Link></TD>
                  <TD>{row.fullName}<div className="text-xs text-white/44">{row.email}</div></TD>
                  <TD>{row.items[0]?.titleSnapshot || '-'}</TD>
                  <TD><StatusBadge value={row.status} /></TD>
                  <TD>{String(row.totalAmount)} {row.currency}</TD>
                  <TD>{formatDate(row.createdAt, 'tr')}</TD>
                </tr>
              ))}
            </TBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
