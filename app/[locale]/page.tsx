import Link from 'next/link';
import Image from 'next/image';
import { ExperienceCategory } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { ExperienceCard } from '@/components/public/experience-card';
import { getExperiences } from '@/lib/queries';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';
import { experienceCategories } from '@/lib/site';
import { getCategoryCover, getCategorySectionCopy } from '@/lib/experience-media';

const pillars = {
  tr: [
    ['Özel planlama disiplini', 'Her yolculuk; doğru tempo, doğru servis dili ve misafire uygun akış düşünülerek şekillendirilir.'],
    ['Şeffaf ödeme kurgusu', 'Kart, IBAN ve ödeme linki seçenekleri; rezervasyon kaydıyla birlikte görünür ve kontrollü şekilde ilerler.'],
    ['Sakin operasyon standardı', 'İlk talepten teslim anına kadar iletişim dili ölçülü, akış berrak ve deneyim odağı nettir.']
  ],
  en: [
    ['Bespoke planning discipline', 'Each journey is shaped around the right pace, the right service language and a guest-specific flow.'],
    ['Clear payment architecture', 'Card, IBAN and payment-link options remain visible and controlled alongside the reservation record.'],
    ['Quiet operational standard', 'From first request to final delivery, communication stays measured and the flow remains clear.']
  ],
  ar: [
    ['انضباط في التخطيط المخصص', 'تُصاغ كل رحلة وفق الإيقاع المناسب ولغة الخدمة الصحيحة وتدفق ملائم للضيف.'],
    ['هيكل دفع واضح', 'تظل خيارات البطاقة والآيبان ورابط الدفع ظاهرة ومضبوطة إلى جانب سجل الحجز.'],
    ['معيار تشغيلي هادئ', 'من أول طلب وحتى التنفيذ النهائي يبقى التواصل متزناً ويظل المسار واضحاً.']
  ]
} as const;

const categoryOrder: ExperienceCategory[] = ['YACHT', 'ACCOMMODATION', 'BALLOON', 'VILLA', 'VIP_TRANSFER', 'GASTRONOMY', 'CUSTOM'];

export default async function HomePage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const featured = await getExperiences(locale, true);
  const featuredItems = featured.slice(0, 8);

  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.home.eyebrow, locale)} title={tLocale(ui.home.title, locale)} description={tLocale(ui.home.intro, locale)} />

      <Container className="py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>{tLocale(ui.home.eyebrow, locale)}</Badge>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">{tLocale(ui.home.sectionTitle, locale)}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{tLocale(ui.home.sectionText, locale)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><Link href={`/${locale}/experiences`}>{tLocale(ui.hero.explore, locale)}</Link></Button>
              <Button variant="secondary" asChild><Link href={`/${locale}/booking`}>{tLocale(ui.hero.book, locale)}</Link></Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="overflow-hidden md:col-span-2">
              <div className="relative aspect-[16/10]">
                <Image src="/images/categories/yacht-charter.jpg" alt="Luxury sea route" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/5]">
                <Image src="/images/categories/gastronomy.jpg" alt="Fine dining route" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              </div>
            </Card>
          </div>
        </div>
      </Container>

      <Container className="pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-white/46">AS LOF TOUR</div>
            <h2 className="mt-3 text-3xl font-semibold text-white">{tLocale(ui.home.featured, locale)}</h2>
          </div>
          <Link href={`/${locale}/experiences`} className="text-sm text-gold">{tLocale(ui.home.featuredLink, locale)}</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredItems.map((item) => (
            <ExperienceCard
              key={item.id}
              locale={locale}
              item={{
                id: item.id,
                title: item.translation?.title || item.location,
                slug: item.translation?.slug || item.id,
                shortDescription: item.translation?.shortDescription || '',
                category: item.category,
                basePrice: Number(item.basePrice),
                currency: item.currency,
                pricingMode: item.pricingMode,
                image: Array.isArray(item.galleryImages) ? item.galleryImages[0] : '/images/default-card.svg',
                location: item.location
              }}
            />
          ))}
        </div>
      </Container>

      <Container className="pb-20">
        <div className="mb-8">
          <div className="text-sm uppercase tracking-[0.3em] text-white/46">AS LOF TOUR</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">{tLocale(ui.home.destinationsTitle, locale)}</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">{tLocale(ui.home.destinationsText, locale)}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categoryOrder.map((category) => (
            <Card key={category} className="overflow-hidden border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/10]">
                <Image src={getCategoryCover(category)} alt={experienceCategories[category as keyof typeof experienceCategories][locale]} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              </div>
              <CardContent>
                <h3 className="text-xl font-semibold text-white">{experienceCategories[category as keyof typeof experienceCategories][locale]}</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">{getCategorySectionCopy(category, locale)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      <Container className="pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars[locale].map(([title, description]) => (
            <Card key={title} className="border-white/10 bg-white/[0.03]">
              <CardContent>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
