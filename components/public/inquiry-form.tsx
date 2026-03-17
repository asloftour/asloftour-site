'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { inquirySchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { tLocale, ui } from '@/lib/public-copy';

const schema = inquirySchema;
type Values = z.infer<typeof schema>;

export function InquiryForm({
  locale,
  experiences,
  type = 'PRIVATE_PLANNING'
}: {
  locale: 'tr' | 'en' | 'ar';
  experiences: Array<{ value: string; label: string }>;
  type?: 'GENERAL' | 'PRIVATE_PLANNING' | 'APPOINTMENT';
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      locale,
      type,
      experienceId: '',
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      preferredDate: '',
      website: ''
    }
  });

  async function onSubmit(values: Values) {
    setLoading(true);
    setStatus(null);
    const response = await fetch('/api/public/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    setLoading(false);
    setStatus(response.ok ? tLocale(ui.forms.inquiry.success, locale) : tLocale(ui.forms.inquiry.error, locale));
  }

  return (
    <Card>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <input type="hidden" {...form.register('website')} />
          <div>
            <Label>{tLocale(ui.forms.inquiry.experience, locale)}</Label>
            <Select {...form.register('experienceId')}>
              <option value="">{tLocale(ui.forms.inquiry.selectExperience, locale)}</option>
              {experiences.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.inquiry.fullName, locale)}</Label>
              <Input {...form.register('name')} />
            </div>
            <div>
              <Label>{tLocale(ui.forms.inquiry.phone, locale)}</Label>
              <Input {...form.register('phone')} />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.inquiry.email, locale)}</Label>
              <Input type="email" {...form.register('email')} />
            </div>
            <div>
              <Label>{tLocale(ui.forms.inquiry.company, locale)}</Label>
              <Input {...form.register('company')} />
            </div>
          </div>
          <div>
            <Label>{tLocale(ui.forms.inquiry.preferredDate, locale)}</Label>
            <Input type="datetime-local" onChange={(e) => form.setValue('preferredDate', e.target.value ? new Date(e.target.value).toISOString() : '')} />
          </div>
          <div>
            <Label>{tLocale(ui.forms.inquiry.message, locale)}</Label>
            <Textarea {...form.register('message')} />
          </div>
          {status ? <p className="text-sm text-white/72">{status}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? tLocale(ui.forms.inquiry.pleaseWait, locale) : tLocale(ui.forms.inquiry.submit, locale)}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
