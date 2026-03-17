import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PaymentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const payment = await db.payment.findUnique({
    where: { id },
    include: { reservation: true, transferProofs: true }
  });

  if (!payment) notFound();

  const reservationId = payment.reservationId;

  async function updatePayment(formData: FormData) {
    'use server';

    const status = String(formData.get('status')) as any;

    await db.payment.update({
      where: { id },
      data: { status }
    });

    if (status === 'PAID') {
      await db.reservation.update({
        where: { id: reservationId },
        data: { status: 'PAID' }
      });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardContent>
          <h1 className="text-3xl font-semibold text-white">{payment.reservation.code}</h1>

          <div className="mt-4 space-y-2 text-sm text-white/70">
            <div>Method: {payment.method}</div>
            <div>Provider: {payment.provider}</div>
            <div>
              Amount: {payment.amount.toString()} {payment.currency}
            </div>
            <div>Transaction: {payment.transactionReference || '-'}</div>
          </div>

          <div className="mt-6 space-y-3">
            {payment.transferProofs.map((proof) => (
              <div
                key={proof.id}
                className="rounded-2xl border border-white/10 bg-white/4 p-4 text-sm text-white/70"
              >
                <a href={proof.fileUrl} className="text-gold">
                  {proof.originalName}
                </a>
                <div className="mt-2">Status: {proof.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <form action={updatePayment} className="grid gap-4">
            <select
              name="status"
              defaultValue={payment.status}
              className="h-12 rounded-2xl border border-white/12 bg-[#111117] px-4 text-sm text-white"
            >
              {[
                'NEW',
                'PENDING',
                'PENDING_TRANSFER',
                'PENDING_REVIEW',
                'AUTHORIZED',
                'PAID',
                'FAILED',
                'CANCELLED',
                'REFUNDED'
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <Button type="submit">Save payment</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
