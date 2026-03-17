import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { getExperienceBySlug } from '@/lib/queries';
import { formatCurrency } from '@/lib/utils';
import { resolveAppLocale } from '@/lib/locale';
import { experienceCategories } from '@/lib/site';
import { tLocale, ui } from '@/lib/public-copy';

const pricingMap = {
  PER_BOOKING: { tr: 'rezervasyon bazlı', en: 'per booking', ar: 'لكل حجز' },
  PER_PERSON: { tr: 'kişi başı', en: 'per person', ar: 'لكل kişi' },
  PER_NIGHT: { tr: 'gecelik', en: 'per night', ar: 'لكل ليلة' },
  PER_WEEK: { tr: 'haftalık', en: 'per week', ar: 'لكل أسبوع' },
  PER_TRANSFER: { tr: 'transfer başı', en: 'per transfer', ar: 'لكل رحلة' },
  CUSTOM: { tr: 'özel plan', en: 'custom plan', ar: 'خطة مخصصة' }
} as const;

export default async function ExperienceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveAppLocale(rawLocale);
  const item = await getExperienceBySlug(locale, slug);

  if (!item) notFound();

  const images =
    Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? item.galleryImages.filter((image): image is string => typeof image === 'string')
      : ['/images/default-card.svg'];

  const highlights =
    Array.isArray(item.highlights)
      ? item.highlights.filter((h): h is string => typeof h === 'string')
      : [];

  return (
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">

        <div>
          <Badge>
            {experienceCategories[item.category as keyof typeof experienceCategories][locale]}
          </Badge>

          <h1 className="mt-5 text-4xl font-semibold text-white">
            {item.translation.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
            {item.translation.longDescription}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {images.map((image, index) => (
              <Card key={`${image}-${index}`} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image}
                    alt={item.translation.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight, index) => (
              <Card key={`${highlight}-${index}`}>
                <CardContent>
                  <div className="text-sm text-white/76">{highlight}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="lg:sticky lg:top-24">
          <CardContent>

            <div className="text-sm uppercase tracking-[0.2em] text-white/50">
              {tLocale(ui.common.from, locale)}
            </div>

            <div className="mt-4 text-3xl font-semibold text-white">
              {formatCurrency(Number(item.basePrice), item.currency, locale)}
            </div>

            <div className="mt-2 text-sm text-white/56">
              {pricingMap[item.pricingMode as keyof typeof pricingMap][locale]}
            </div>

            <div className="mt-8 space-y-4 text-sm text-white/70">
              <div className="flex justify-between">
                <span>{tLocale(ui.common.guests, locale)}</span>
                <span>{item.minGuests} - {item.maxGuests}</span>
              </div>

              <div className="flex justify-between">
                <span>{tLocale(ui.common.location, locale)}</span>
                <span>{item.location}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button asChild>
                <Link href={`/${locale}/booking?experience=${item.id}`}>
                  {tLocale(ui.hero.book, locale)}
                </Link>
              </Button>

              <Button variant="secondary" asChild>
                <Link href={`/${locale}/contact`}>
                  {tLocale(ui.common.contactSupport, locale)}
                </Link>
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </Container>
  );
}