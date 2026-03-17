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
  CUSTOM: { tr: 'özel teklif', en: 'custom', ar: 'مخصص' }
};

export function ExperienceCard({
  locale,
  item
}: {
  locale: AppLocale;
  item: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    category: ExperienceCategory;
    basePrice: number;
    currency: string;
    pricingMode: PricingMode;
    image: string;
    location: string;
  };
}) {
  const categoryLabel = experienceCategories[item.category as keyof typeof experienceCategories][locale];

  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/18">
      <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
        <Image src={item.image} alt={item.title} fill className="object-cover transition duration-500 hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 right-4 rounded-2xl border border-white/10 bg-black/65 px-4 py-3 text-right backdrop-blur-sm">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/48">{tLocale(ui.common.from, locale)}</div>
          <div className="mt-1 text-lg font-semibold text-white">{formatCurrency(item.basePrice, item.currency, locale)}</div>
        </div>
      </div>
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge>{categoryLabel}</Badge>
          <Badge className="border-white/10 bg-black/35 text-white/76">{item.location}</Badge>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
          <p className="mt-3 min-h-[84px] text-sm leading-7 text-white/68">{item.shortDescription}</p>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="text-sm text-white/48">{pricingMap[item.pricingMode][locale]}</div>
          <div className="flex items-center gap-3">
            <Link href={`/${locale}/experiences/${item.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-gold hover:text-gold">
              {tLocale(ui.common.details, locale)}
            </Link>
            <Link href={`/${locale}/booking?experience=${item.id}`} className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-black transition hover:opacity-90">
              {tLocale(ui.hero.book, locale)}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
