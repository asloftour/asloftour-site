import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reservation = await db.reservation.findUnique({ where: { id }, include: { items: true, payments: true } });
  if (!reservation) notFound();

  async function updateReservation(formData: FormData) {
    'use server';
    await db.reservation.update({
      where: { id },
      data: {
        status: String(formData.get('status')) as any,
        internalNotes: String(formData.get('internalNotes') || '')
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card><CardContent className="space-y-4"><h1 className="text-3xl font-semibold text-white">{reservation.code}</h1><div className="text-sm text-white/68">{reservation.fullName} • {reservation.email} • {reservation.phone}</div><div className="text-sm leading-7 text-white/70">{reservation.specialRequests || 'No special requests.'}</div><div className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/70">{reservation.items[0]?.titleSnapshot} · {reservation.totalAmount.toString()} {reservation.currency}</div></CardContent></Card>
      <Card><CardContent><form action={updateReservation} className="grid gap-4"><select name="status" defaultValue={reservation.status} className="h-12 rounded-2xl border border-white/12 bg-[#111117] px-4 text-sm text-white">{['NEW','PENDING_CONFIRMATION','PENDING_PAYMENT','PENDING_TRANSFER','PAID','FAILED','CANCELLED','REFUNDED'].map((item) => <option key={item}>{item}</option>)}</select><textarea name="internalNotes" defaultValue={reservation.internalNotes || ''} className="min-h-32 rounded-2xl border border-white/12 bg-white/4 p-4 text-sm text-white" /><Button type="submit">Save reservation</Button></form></CardContent></Card>
    </div>
  );
}
