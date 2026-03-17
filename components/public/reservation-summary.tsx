import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';
import { getPricingMeta } from '@/lib/pricing-copy';

const pricingLabels = {
  PER_BOOKING: { tr: 'rezervasyon planı', en: 'reservation plan', ar: 'خطة الحجز' },
  PER_PERSON: { tr: 'kişi başı', en: 'per person', ar: 'لكل شخص' },
  PER_NIGHT: { tr: 'gecelik', en: 'per night', ar: 'لكل ليلة' },
  PER_WEEK: { tr: 'haftalık', en: 'per week', ar: 'لكل أسبوع' },
  PER_TRANSFER: { tr: 'transfer başı', en: 'per transfer', ar: 'لكل رحلة' },
  CUSTOM: { tr: 'özel teklif', en: 'bespoke', ar: 'مخصص' }
} as const;

export function ReservationSummary({
  locale,
  title,
  startDate,
  endDate,
  guestCount,
  amount,
  currency,
  pricingLabel,
  code,
  image,
  description,
  location,
  categoryLabel
}: {
  locale: AppLocale;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  guestCount: number;
  amount: number;
  currency: string;
  pricingLabel: string;
  code: string;
  image?: string;
  description?: string;
  location?: string;
  categoryLabel?: string;
}) {
  const pricingMeta = getPricingMeta(pricingLabel as any, locale as any);

  return (
    <Card className="overflow-hidden lg:sticky lg:top-24">
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
          <Image src={image} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {categoryLabel ? <Badge>{categoryLabel}</Badge> : null}
            {location ? <Badge className="border-white/10 bg-black/35 text-white/76">{location}</Badge> : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-white/46">{tLocale(ui.common.selectedExperience, locale)}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{title}</div>
          </div>
        </div>
      ) : null}
      <CardContent>
        {!image ? <div className="text-sm uppercase tracking-[0.2em] text-white/50">{tLocale(ui.common.summary, locale)}</div> : null}
        {description ? <p className="text-sm leading-7 text-white/68">{description}</p> : null}
        <div className="mt-6 space-y-4 text-sm text-white/72">
          <div className="flex justify-between gap-4"><span>{tLocale(ui.common.reference, locale)}</span><span>{code}</span></div>
          <div className="flex justify-between gap-4"><span>{tLocale(ui.common.dates, locale)}</span><span>{formatDate(startDate, locale)} → {formatDate(endDate, locale)}</span></div>
          <div className="flex justify-between gap-4"><span>{tLocale(ui.common.guests, locale)}</span><span>{guestCount}</span></div>
          <div className="flex items-center justify-between gap-4">
            <span>{tLocale(ui.common.pricing, locale)}</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80">{pricingMeta?.label || (pricingLabels as any)[pricingLabel]?.[locale] || pricingLabel}</span>
              {pricingMeta ? (
                <span className="inline-flex rounded-full border border-[#D6B36A]/30 bg-[#D6B36A]/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#E7C982]">
                  {pricingMeta.badge}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {pricingMeta ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/68">
            {pricingMeta.hint}
          </div>
        ) : null}
        <div className="mt-7 rounded-2xl border border-gold/30 bg-gold/10 p-4">
          <div className="text-sm text-white/52">{tLocale(ui.common.total, locale)}</div>
          <div className="mt-1 text-3xl font-semibold text-white">{formatCurrency(amount, currency, locale)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
