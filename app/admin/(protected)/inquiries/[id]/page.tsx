import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await db.inquiry.findUnique({ where: { id } });
  if (!inquiry) notFound();

  async function updateInquiry(formData: FormData) {
    'use server';
    await db.inquiry.update({ where: { id }, data: { status: String(formData.get('status')) as any, internalNotes: String(formData.get('internalNotes') || '') } });
  }

  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><Card><CardContent><h1 className="text-3xl font-semibold text-white">{inquiry.name}</h1><div className="mt-4 text-sm text-white/60">{inquiry.email} • {inquiry.phone}</div><div className="mt-6 text-sm leading-7 text-white/70">{inquiry.message}</div></CardContent></Card><Card><CardContent><form action={updateInquiry} className="grid gap-4"><select name="status" defaultValue={inquiry.status} className="h-12 rounded-2xl border border-white/12 bg-[#111117] px-4 text-sm text-white">{['NEW','CONTACTED','QUALIFIED','CLOSED','SPAM'].map((item) => <option key={item}>{item}</option>)}</select><textarea name="internalNotes" defaultValue={inquiry.internalNotes || ''} className="min-h-32 rounded-2xl border border-white/12 bg-white/4 p-4 text-sm text-white" /><Button type="submit">Save inquiry</Button></form></CardContent></Card></div>;
}
