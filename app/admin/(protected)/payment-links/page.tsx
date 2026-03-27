import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';
import { PaymentLinkGenerator } from '@/components/admin/payment-link-generator';

export default async function PaymentLinksPage() {
  const rows = await db.payment.findMany({
    where: { paymentLinkToken: { not: null } },
    include: { reservation: true },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const recentLinks = rows.map((row) => ({
    id: row.id,
    url: absoluteUrl(`/${row.reservation.locale.toLowerCase()}/pay/${row.paymentLinkToken}`),
    amount: row.amount.toString(),
    currency: row.currency,
    description: row.reservation.specialRequests || '',
    status: row.reservation.status,
    createdAt: row.createdAt.toLocaleString('tr-TR')
  }));

  return <PaymentLinkGenerator recentLinks={recentLinks} />;
}