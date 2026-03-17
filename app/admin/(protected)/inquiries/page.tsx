import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead } from '@/components/ui/table';
import { StatusBadge } from '@/components/admin/status-badge';

export default async function InquiriesPage() {
  const rows = await db.inquiry.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <Card><CardContent><div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-semibold text-white">Inquiries</h1><Link href="/api/admin/export?type=inquiries" className="text-sm text-gold">CSV export</Link></div><div className="overflow-x-auto"><Table><THead><tr><TH>Name</TH><TH>Type</TH><TH>Status</TH><TH>Message</TH></tr></THead><TBody>{rows.map((row) => <tr key={row.id}><TD><Link href={`/admin/inquiries/${row.id}`} className="text-gold">{row.name}</Link><div className="text-xs text-white/44">{row.email}</div></TD><TD>{row.type}</TD><TD><StatusBadge value={row.status} /></TD><TD>{row.message.slice(0,120)}</TD></tr>)}</TBody></Table></div></CardContent></Card>
  );
}
