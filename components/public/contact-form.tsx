'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { tLocale, ui } from '@/lib/public-copy';

const schema = contactSchema;
type Values = z.infer<typeof schema>;

export function ContactForm({ locale }: { locale: 'tr' | 'en' | 'ar' }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { locale, name: '', email: '', phone: '', message: '', website: '' }
  });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: Values) {
    setLoading(true);
    setStatus(null);
    const response = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    setLoading(false);
    setStatus(response.ok ? tLocale(ui.forms.contact.success, locale) : tLocale(ui.forms.contact.error, locale));
    if (response.ok) form.reset({ locale, name: '', email: '', phone: '', message: '', website: '' });
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-6 text-xl font-semibold text-white">{tLocale(ui.forms.contact.title, locale)}</div>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <input type="hidden" {...form.register('website')} />
          <div>
            <Label>{tLocale(ui.forms.contact.fullName, locale)}</Label>
            <Input {...form.register('name')} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.contact.email, locale)}</Label>
              <Input type="email" {...form.register('email')} />
            </div>
            <div>
              <Label>{tLocale(ui.forms.contact.phone, locale)}</Label>
              <Input {...form.register('phone')} />
            </div>
          </div>
          <div>
            <Label>{tLocale(ui.forms.contact.message, locale)}</Label>
            <Textarea {...form.register('message')} />
          </div>
          {status ? <p className="text-sm text-white/72">{status}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? tLocale(ui.forms.contact.pleaseWait, locale) : tLocale(ui.forms.contact.submit, locale)}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
