'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

type RecentLink = {
  id: string;
  url: string;
  amount: string;
  currency: string;
  description: string;
  status: string;
  createdAt: string;
};

export function PaymentLinkGenerator({ recentLinks }: { recentLinks: RecentLink[] }) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [locale, setLocale] = useState('tr');
  const [description, setDescription] = useState('Turizm danýþmanlýk ücreti');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function createLink() {
    setError('');
    setGeneratedUrl('');

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Lütfen geçerli bir tutar girin.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/payment-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericAmount, currency, locale, description })
      });

      const payload = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(payload.message || 'Link oluþturulamadý.');
        return;
      }

      setGeneratedUrl(payload.url || '');
    } catch (err) {
      setLoading(false);
      setError('Link oluþturulurken bir hata oluþtu.');
    }
  }

  async function copyLink() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-white">Payment Link Generator</h1>
            <p className="mt-2 text-sm text-white/64">
              Hýzlý tahsilat için tutar gir, link üret ve müþteriye gönder.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-white/82">Tutar</div>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-white/82">Para birimi</div>
              <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="TRY">TRY</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </Select>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-white/82">Dil</div>
              <Select value={locale} onChange={(e) => setLocale(e.target.value)}>
                <option value="tr">TR</option>
                <option value="en">EN</option>
                <option value="ar">AR</option>
              </Select>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium text-white/82">Açýklama</div>
              <Input
                placeholder="Turizm danýþmanlýk ücreti"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={createLink} disabled={loading}>
              {loading ? 'Oluþturuluyor...' : 'Ödeme linki oluþtur'}
            </Button>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          {generatedUrl ? (
            <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/10 p-4">
              <div className="mb-2 text-sm font-medium text-white">Oluþan link</div>
              <Input value={generatedUrl} readOnly />
              <div className="mt-3 flex gap-3">
                <Button type="button" onClick={copyLink}>
                  Linki kopyala
                </Button>
                <Button type="button" variant="secondary" onClick={() => window.open(generatedUrl, '_blank')}>
                  Yeni sekmede aç
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="mb-4 text-xl font-semibold text-white">Son oluþturulan linkler</h2>
          <div className="space-y-3">
            {recentLinks.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-white">
                    {item.amount} {item.currency}
                  </div>
                  <div className="text-xs uppercase tracking-[0.16em] text-white/46">
                    {item.status}
                  </div>
                </div>
                <div className="mt-2 text-sm text-white/70">{item.description || '—'}</div>
                <div className="mt-2 break-all text-xs text-gold">{item.url}</div>
                <div className="mt-2 text-xs text-white/46">{item.createdAt}</div>
              </div>
            ))}

            {!recentLinks.length ? (
              <div className="text-sm text-white/56">Henüz oluþturulmuþ ödeme linki yok.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}