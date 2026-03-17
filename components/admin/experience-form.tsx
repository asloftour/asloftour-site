'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export function ExperienceForm({ experience }: { experience?: any }) {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setStatus(null);
    const response = await fetch('/api/admin/experiences', {
      method: experience ? 'PUT' : 'POST',
      body: formData
    });
    setStatus(response.ok ? 'Saved successfully.' : 'Unable to save experience.');
  }

  return (
    <Card>
      <CardContent>
        <form action={onSubmit} className="grid gap-5 md:grid-cols-2">
          {experience ? <input type="hidden" name="id" value={experience.id} /> : null}
          <div>
            <Label>Category</Label>
            <Select name="category" defaultValue={experience?.category || 'YACHT'}>
              {['YACHT', 'ACCOMMODATION', 'BALLOON', 'VILLA', 'VIP_TRANSFER', 'GASTRONOMY', 'CUSTOM'].map((item) => <option key={item}>{item}</option>)}
            </Select>
          </div>
          <div>
            <Label>Location</Label>
            <Input name="location" defaultValue={experience?.location || ''} />
          </div>
          <div>
            <Label>Pricing Mode</Label>
            <Select name="pricingMode" defaultValue={experience?.pricingMode || 'PER_BOOKING'}>
              {['PER_BOOKING', 'PER_PERSON', 'PER_NIGHT', 'PER_WEEK', 'PER_TRANSFER', 'CUSTOM'].map((item) => <option key={item}>{item}</option>)}
            </Select>
          </div>
          <div>
            <Label>Base Price</Label>
            <Input name="basePrice" type="number" defaultValue={experience?.basePrice || ''} />
          </div>
          <div>
            <Label>Currency</Label>
            <Input name="currency" defaultValue={experience?.currency || 'TRY'} />
          </div>
          <div>
            <Label>Min guests</Label>
            <Input name="minGuests" type="number" defaultValue={experience?.minGuests || 1} />
          </div>
          <div>
            <Label>Max guests</Label>
            <Input name="maxGuests" type="number" defaultValue={experience?.maxGuests || 2} />
          </div>
          <div>
            <Label>Min nights</Label>
            <Input name="minNights" type="number" defaultValue={experience?.minNights || ''} />
          </div>
          <div>
            <Label>Min weeks</Label>
            <Input name="minWeeks" type="number" defaultValue={experience?.minWeeks || ''} />
          </div>
          <div className="md:col-span-2">
            <Label>Gallery Images (one path per line)</Label>
            <Textarea name="galleryImages" defaultValue={(experience?.galleryImages || []).join('\n')} />
          </div>
          <div className="md:col-span-2">
            <Label>Highlights (one line per item)</Label>
            <Textarea name="highlights" defaultValue={(experience?.highlights || []).join('\n')} />
          </div>
          {['TR', 'EN', 'AR'].map((locale) => (
            <div key={locale} className="md:col-span-2 rounded-3xl border border-white/10 p-5">
              <div className="mb-4 text-sm font-semibold text-white">{locale} Translation</div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input name={`title_${locale}`} defaultValue={experience?.translations?.find((t: any) => t.locale === locale)?.title || ''} />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input name={`slug_${locale}`} defaultValue={experience?.translations?.find((t: any) => t.locale === locale)?.slug || ''} />
                </div>
                <div className="md:col-span-2">
                  <Label>Short description</Label>
                  <Textarea name={`short_${locale}`} defaultValue={experience?.translations?.find((t: any) => t.locale === locale)?.shortDescription || ''} />
                </div>
                <div className="md:col-span-2">
                  <Label>Long description</Label>
                  <Textarea name={`long_${locale}`} defaultValue={experience?.translations?.find((t: any) => t.locale === locale)?.longDescription || ''} />
                </div>
                <div>
                  <Label>SEO title</Label>
                  <Input name={`seoTitle_${locale}`} defaultValue={experience?.translations?.find((t: any) => t.locale === locale)?.seoTitle || ''} />
                </div>
                <div>
                  <Label>SEO description</Label>
                  <Input name={`seoDescription_${locale}`} defaultValue={experience?.translations?.find((t: any) => t.locale === locale)?.seoDescription || ''} />
                </div>
              </div>
            </div>
          ))}
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
            <input type="checkbox" name="active" defaultChecked={experience?.active ?? true} /> Active
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
            <input type="checkbox" name="featured" defaultChecked={experience?.featured ?? false} /> Featured
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/80">
            <input type="checkbox" name="paymentEligibility" defaultChecked={experience?.paymentEligibility ?? true} /> Payment eligible
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Save experience</Button>
          </div>
        </form>
        {status ? <p className="mt-4 text-sm text-white/70">{status}</p> : null}
      </CardContent>
    </Card>
  );
}
