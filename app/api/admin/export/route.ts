import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { toCsv } from '@/lib/csv';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const type = request.nextUrl.searchParams.get('type');

  let rows: Record<string, unknown>[] = [];
  if (type === 'reservations') {
    rows = (await db.reservation.findMany({ include: { items: true } })).map((row) => ({
      code: row.code,
      fullName: row.fullName,
      email: row.email,
      status: row.status,
      totalAmount: row.totalAmount.toString(),
      currency: row.currency,
      experience: row.items[0]?.titleSnapshot || ''
    }));
  }
  if (type === 'inquiries') {
    rows = (await db.inquiry.findMany()).map((row) => ({ name: row.name, email: row.email, phone: row.phone, type: row.type, status: row.status, message: row.message }));
  }
  if (type === 'payments') {
    rows = (await db.payment.findMany()).map((row) => ({ id: row.id, reservationId: row.reservationId, method: row.method, provider: row.provider, status: row.status, amount: row.amount.toString(), currency: row.currency }));
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename=${type}.csv` } });
}
