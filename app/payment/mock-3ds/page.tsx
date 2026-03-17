import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

export default async function Mock3DSPage({ searchParams }: { searchParams: Promise<{ attempt?: string }> }) {
  const { attempt } = await searchParams;
  if (!attempt) notFound();
  const paymentAttempt = await db.paymentAttempt.findUnique({ where: { id: attempt }, include: { payment: true } });
  if (!paymentAttempt) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-card p-8 shadow-panel">
        <div className="text-sm uppercase tracking-[0.2em] text-white/50">Mock 3D Secure</div>
        <h1 className="mt-4 text-3xl font-semibold">Test payment challenge</h1>
        <p className="mt-4 text-sm leading-7 text-white/66">This internal testing screen simulates a hosted 3D Secure approval step and posts back to the payment callback route.</p>
        <div className="mt-6 text-sm text-white/60">Payment ID: {paymentAttempt.paymentId}</div>
        <div className="mt-8 grid gap-3">
          <form action="/api/payments/callback/mock" method="post">
            <input type="hidden" name="attemptId" value={paymentAttempt.id} />
            <input type="hidden" name="approved" value="true" />
            <input type="hidden" name="reference" value={`MOCK-${paymentAttempt.id.slice(0, 10)}`} />
            <input type="hidden" name="cardBrand" value="Mastercard" />
            <button className="w-full rounded-full bg-gold px-5 py-3 text-sm font-medium text-black">Approve payment</button>
          </form>
          <form action="/api/payments/callback/mock" method="post">
            <input type="hidden" name="attemptId" value={paymentAttempt.id} />
            <input type="hidden" name="approved" value="false" />
            <button className="w-full rounded-full border border-white/14 px-5 py-3 text-sm font-medium text-white">Decline payment</button>
          </form>
        </div>
      </div>
    </div>
  );
}
