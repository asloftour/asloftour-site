import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead } from '@/components/ui/table';

export default async function ExperiencesAdminPage() {
  const rows = await db.experience.findMany({ include: { translations: true }, orderBy: { createdAt: 'desc' } });
  return (
    <Card><CardContent><div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-semibold text-white">Experiences</h1><Link href="/admin/experiences/new" className="text-sm text-gold">New experience</Link></div><div className="overflow-x-auto"><Table><THead><tr><TH>Title</TH><TH>Category</TH><TH>Pricing</TH><TH>Active</TH></tr></THead><TBody>{rows.map((row) => <tr key={row.id}><TD><Link href={`/admin/experiences/${row.id}/edit`} className="text-gold">{row.translations.find((t) => t.locale === 'TR')?.title || row.id}</Link></TD><TD>{row.category}</TD><TD>{row.basePrice.toString()} {row.currency}</TD><TD>{row.active ? 'Yes' : 'No'}</TD></tr>)}</TBody></Table></div></CardContent></Card>
  );
}
