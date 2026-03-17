'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { tLocale, ui } from '@/lib/public-copy';

export function TransferProofForm({ paymentId, locale }: { paymentId: string; locale: 'tr' | 'en' | 'ar' }) {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setStatus(null);
    const response = await fetch('/api/public/transfer-proof', { method: 'POST', body: formData });
    setStatus(response.ok ? tLocale(ui.forms.transferProof.success, locale) : tLocale(ui.forms.transferProof.error, locale));
  }

  return (
    <Card>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <input type="hidden" name="paymentId" value={paymentId} />
          <input type="file" name="file" className="block w-full text-sm text-white/80" />
          <textarea name="note" placeholder={tLocale(ui.forms.transferProof.note, locale)} className="min-h-28 w-full rounded-2xl border border-white/12 bg-white/4 p-4 text-sm text-white" />
          <Button type="submit">{tLocale(ui.common.uploadProof, locale)}</Button>
        </form>
        {status ? <p className="mt-4 text-sm text-white/70">{status}</p> : null}
      </CardContent>
    </Card>
  );
}
