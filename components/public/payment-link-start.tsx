'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PaymentLinkStart({
  locale,
  reservationId
}: {
  locale: 'tr' | 'en' | 'ar';
  reservationId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function startPayment() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          reservationId,
          method: 'CARD_3D',
          provider: 'HALKBANK',
          installment: 1
        })
      });

      const payload = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(payload.message || 'Ödeme baþlatýlamadý.');
        return;
      }

      if (payload.mode === 'redirect') {
        window.location.href = payload.redirectUrl;
        return;
      }

      if (payload.mode === 'post') {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payload.action;

        Object.entries(payload.fields || {}).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value ?? '');
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      setError('Beklenmeyen ödeme yanýtý alýndý.');
    } catch (err) {
      setLoading(false);
      setError('Ödeme baþlatýlýrken bir hata oluþtu.');
    }
  }

  return (
    <div className="space-y-4">
      {error ? <div className="text-sm text-red-300">{error}</div> : null}
      <Button type="button" onClick={startPayment} disabled={loading} className="w-full">
        {loading ? 'Yönlendiriliyor...' : 'Güvenli ödemeye devam et'}
      </Button>
    </div>
  );
}