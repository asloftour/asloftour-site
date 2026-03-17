import Image from 'next/image';
import Link from 'next/link';
import { ExperienceCategory, PricingMode } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLocale } from '@/i18n/routing';
import { experienceCategories } from '@/lib/site';
import { formatCurrency } from '@/lib/utils';
import { tLocale, ui } from '@/lib/public-copy';

const pricingMap: Record<PricingMode, { tr: string; en: string; ar: string }> = {
  PER_BOOKING: { tr: 'rezervasyon bazlı', en: 'per booking', ar: 'لكل حجز' },
  PER_PERSON: { tr: 'kişi başı', en: 'per person', ar: 'لكل شخص' },
  PER_NIGHT: { tr: 'gecelik', en: 'per night', ar: 'لكل ليلة' },
  PER_WEEK: { tr: 'haftalık', en: 'per week', ar: 'لكل أسبوع' },
  PER_TRANSFER: { tr: 'transfer başı', en: 'per transfer', ar: 'لكل رحلة' },
  CUSTOM: { tr: 'özel', en: 'custom', ar: 'مخصص' }
};

export function ExperienceCard({
  locale,
  item
}: {
  locale: AppLocale;
  item: {
    id?: string;
    title: string;
    slug: string;
    shortDescription: string;
    category: ExperienceCategory;
    basePrice: number;
    currency: string;
    pricingMode: PricingMode;
    image: string;
    location?: string;
  };
}) {
  const imageSrc = item.image || '/images/default-card.svg';

  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/18">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={imageSrc} alt={item.title} fill className="object-cover transition duration-500 hover:scale-105" />
      </div>
      <CardContent>
        <Badge>{experienceCategories[item.category as keyof typeof experienceCategories][locale]}</Badge>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/66">{item.shortDescription}</p>
            {item.location ? <div className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">{item.location}</div> : null}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-white/48">{tLocale(ui.common.from, locale)}</div>
            <div className="mt-1 text-lg font-medium text-white">{formatCurrency(item.basePrice, item.currency, locale)}</div>
            <div className="text-sm text-white/48">{pricingMap[item.pricingMode][locale]}</div>
          </div>
          <Link href={`/${locale}/experiences/${item.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-gold hover:text-gold">
            {tLocale(ui.common.details, locale)}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
