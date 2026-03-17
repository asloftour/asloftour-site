'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ExperienceCategory } from '@prisma/client';
import { bookingSchema } from '@/lib/validation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { calculateTotal } from '@/lib/pricing';
import { tLocale, ui } from '@/lib/public-copy';
import { experienceCategories } from '@/lib/site';
import { getPricingMeta } from '@/lib/pricing-copy';

const schema = bookingSchema;
type FormValues = z.infer<typeof schema>;

function toInputDate(value: string | Date) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toIsoDate(value: string) {
  return new Date(`${value}T12:00:00`).toISOString();
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toInputDate(date);
}

export function BookingForm({
  locale,
  experiences
}: {
  locale: 'tr' | 'en' | 'ar';
  experiences: Array<{
    value: string;
    label: string;
    minGuests: number;
    maxGuests: number;
    basePrice: number;
    pricingMode: 'PER_BOOKING' | 'PER_PERSON' | 'PER_NIGHT' | 'PER_WEEK' | 'PER_TRANSFER' | 'CUSTOM';
    image: string;
    shortDescription: string;
    location: string;
    category: ExperienceCategory;
  }>;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const todayInput = toInputDate(new Date());
  const tomorrowInput = addDays(todayInput, 1);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      locale,
      experienceId: experiences[0]?.value || '',
      guestCount: experiences[0]?.minGuests || 1,
      fullName: '',
      phone: '',
      email: '',
      specialRequests: '',
      addTransfer: false,
      billingType: '',
      billingFullName: '',
      billingCompany: '',
      billingTaxOffice: '',
      billingTaxNumber: '',
      billingAddress: '',
      website: '',
      startDate: toIsoDate(todayInput),
      endDate: toIsoDate(tomorrowInput)
    }
  });

  const experienceId = form.watch('experienceId');
  const guestCount = form.watch('guestCount');
  const startDateWatch = form.watch('startDate');
  const endDateWatch = form.watch('endDate');

  const selectedExperience = useMemo(
    () => experiences.find((item) => item.value === experienceId) || experiences[0],
    [experiences, experienceId]
  );

  const startDateInput = toInputDate(startDateWatch || toIsoDate(todayInput));
  const endDateInput = toInputDate(endDateWatch || toIsoDate(tomorrowInput));
  const minEndDateInput = addDays(startDateInput, 1);

  useEffect(() => {
    if (!selectedExperience) return;
    const currentGuests = Number(form.getValues('guestCount') || 1);
    if (currentGuests < selectedExperience.minGuests) {
      form.setValue('guestCount', selectedExperience.minGuests);
    }
    if (currentGuests > selectedExperience.maxGuests) {
      form.setValue('guestCount', selectedExperience.maxGuests);
    }
  }, [selectedExperience, form]);

  useEffect(() => {
    if (endDateInput < minEndDateInput) {
      form.setValue('endDate', toIsoDate(minEndDateInput), { shouldValidate: true, shouldDirty: true });
    }
  }, [endDateInput, minEndDateInput, form]);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setServerError(null);
    const response = await fetch('/api/public/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json();
      setServerError(payload.message || tLocale(ui.forms.booking.error, locale));
      return;
    }
    const payload = await response.json();
    router.push(`/${locale}/payment?reservation=${payload.reservationId}`);
  }

  const estimatedTotal = selectedExperience
    ? calculateTotal({
        pricingMode: selectedExperience.pricingMode as any,
        basePrice: selectedExperience.basePrice,
        guestCount: Math.max(guestCount || 1, 1),
        startDate: new Date(startDateWatch || toIsoDate(todayInput)),
        endDate: new Date(endDateWatch || toIsoDate(tomorrowInput))
      })
    : 0;

  const categoryLabel = selectedExperience
    ? experienceCategories[selectedExperience.category as keyof typeof experienceCategories][locale]
    : '';

  const pricingMeta = selectedExperience
    ? getPricingMeta(selectedExperience.pricingMode as any, locale as any)
    : null;

  return (
    <Card>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <input type="hidden" {...form.register('website')} />

          {selectedExperience ? (
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={selectedExperience.image} alt={selectedExperience.label} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge>{categoryLabel}</Badge>
                  <Badge className="border-white/10 bg-black/35 text-white/76">{selectedExperience.location}</Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/46">{tLocale(ui.booking.previewTitle, locale)}</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{selectedExperience.label}</div>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">{selectedExperience.shortDescription}</p>
                </div>
              </div>
              <div className="grid gap-3 border-t border-white/10 bg-black/25 p-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/74">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/42">{tLocale(ui.forms.booking.summary, locale)}</div>
                  {pricingMeta ? (
                    <span className="mt-3 inline-flex w-fit rounded-full border border-[#D6B36A]/30 bg-[#D6B36A]/10 px-3 py-1 text-xs font-medium tracking-wide text-[#E7C982]">
                      {pricingMeta.badge}
                    </span>
                  ) : null}
                  <div className="mt-3 text-2xl font-semibold text-white">{formatCurrency(estimatedTotal, 'TRY', locale)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/70">
                  {pricingMeta?.hint || tLocale(ui.booking.previewText, locale)}
                </div>
              </div>
            </div>
          ) : null}

          <div>
            <Label>{tLocale(ui.forms.booking.experience, locale)}</Label>
            <Select {...form.register('experienceId')}>
              {experiences.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.booking.startDate, locale)}</Label>
              <Input
                type="date"
                min={todayInput}
                value={startDateInput}
                onChange={(e) => {
                  const nextStart = e.target.value;
                  form.setValue('startDate', toIsoDate(nextStart), { shouldValidate: true, shouldDirty: true });
                  if (endDateInput <= nextStart) {
                    form.setValue('endDate', toIsoDate(addDays(nextStart, 1)), { shouldValidate: true, shouldDirty: true });
                  }
                }}
              />
            </div>
            <div>
              <Label>{tLocale(ui.forms.booking.endDate, locale)}</Label>
              <Input
                type="date"
                min={minEndDateInput}
                value={endDateInput}
                onChange={(e) => {
                  const nextEnd = e.target.value;
                  if (nextEnd < minEndDateInput) {
                    form.setValue('endDate', toIsoDate(minEndDateInput), { shouldValidate: true, shouldDirty: true });
                    return;
                  }
                  form.setValue('endDate', toIsoDate(nextEnd), { shouldValidate: true, shouldDirty: true });
                }}
              />
            </div>
          </div>

          <div>
            <Label>{tLocale(ui.forms.booking.guests, locale)}</Label>
            <Input
              type="number"
              min={selectedExperience?.minGuests || 1}
              max={selectedExperience?.maxGuests || 20}
              {...form.register('guestCount', {
                valueAsNumber: true,
                onChange: (event) => {
                  const raw = Number(event.target.value || 1);
                  const nextValue = Math.max(
                    selectedExperience?.minGuests || 1,
                    Math.min(raw, selectedExperience?.maxGuests || 20)
                  );
                  form.setValue('guestCount', nextValue, { shouldValidate: true, shouldDirty: true });
                }
              })}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.booking.fullName, locale)}</Label>
              <Input {...form.register('fullName')} />
            </div>
            <div>
              <Label>{tLocale(ui.forms.booking.phone, locale)}</Label>
              <Input {...form.register('phone')} />
            </div>
          </div>

          <div>
            <Label>{tLocale(ui.forms.booking.email, locale)}</Label>
            <Input type="email" {...form.register('email')} />
          </div>

          <div>
            <Label>{tLocale(ui.forms.booking.specialRequests, locale)}</Label>
            <Textarea {...form.register('specialRequests')} />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
            <input type="checkbox" {...form.register('addTransfer')} /> {tLocale(ui.forms.booking.addTransfer, locale)}
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.booking.billingType, locale)}</Label>
              <Select {...form.register('billingType')}>
                <option value="">-</option>
                <option value="INDIVIDUAL">{tLocale(ui.forms.booking.individual, locale)}</option>
                <option value="COMPANY">{tLocale(ui.forms.booking.corporate, locale)}</option>
              </Select>
            </div>
            <div>
              <Label>{tLocale(ui.forms.booking.companyName, locale)}</Label>
              <Input {...form.register('billingCompany')} />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>{tLocale(ui.forms.booking.taxOffice, locale)}</Label>
              <Input {...form.register('billingTaxOffice')} />
            </div>
            <div>
              <Label>{tLocale(ui.forms.booking.taxNumber, locale)}</Label>
              <Input {...form.register('billingTaxNumber')} />
            </div>
          </div>

          {serverError ? <p className="text-sm text-red-300">{serverError}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? tLocale(ui.forms.booking.pleaseWait, locale) : tLocale(ui.forms.booking.submit, locale)}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
