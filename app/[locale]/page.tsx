import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { ExperienceCard } from '@/components/public/experience-card';
import { getExperiences } from '@/lib/queries';
import { resolveLocaleParam } from '@/lib/locale';
import { tLocale, ui } from '@/lib/public-copy';

const pillars = {
  tr: [
    ['Tek dosyada rezervasyon yönetimi', 'Rezervasyon, ödeme, dekont ve durum takibi tek operasyon akışı içinde ilerler.'],
    ['Disiplinli ödeme kurgusu', 'Kart, IBAN ve ödeme linki seçenekleri yasal metinlerle birlikte aynı akışta görünür.'],
    ['Görünür teslim standardı', 'Misafir tarafındaki netlik, operasyon tarafındaki kontrol ve premium sunum dili birlikte korunur.']
  ],
  en: [
    ['One-file reservation control', 'Reservations, payments, transfer proofs and status tracking move inside one operational file.'],
    ['Disciplined payment setup', 'Card, IBAN and payment-link options stay visible inside one legal and operational flow.'],
    ['Visible delivery standard', 'Guest clarity, operational control and premium presentation are protected together.']
  ],
  ar: [
    ['إدارة الحجز ضمن ملف واحد', 'تتحرك الحجوزات والمدفوعات والإيصالات وحالات الطلب داخل ملف تشغيلي واحد.'],
    ['هيكل دفع منضبط', 'تبقى البطاقة والآيبان ورابط الدفع ظاهرة ضمن مسار قانوني وتشغيلي واحد.'],
    ['معيار تسليم واضح', 'تجتمع وضوح تجربة الضيف مع السيطرة التشغيلية واللغة البصرية الراقية.']
  ]
} as const;

const destinationCards = {
  tr: [
    ['Bodrum & Yalıkavak', 'Yat charter, sahil konaklamaları ve özel villa çizgisi.'],
    ['Göcek & Fethiye', 'Koy rotaları, çok günlük deniz planları ve sakin premium tempo.'],
    ['Kapadokya & İstanbul', 'Balon uçuşları, kültürel ritim ve şehir içi VIP akışları.']
  ],
  en: [
    ['Bodrum & Yalıkavak', 'Yacht charters, coastal stays and private-villa inventory.'],
    ['Göcek & Fethiye', 'Bay routes, multi-day sea plans and a calm premium pace.'],
    ['Cappadocia & Istanbul', 'Balloon flights, cultural rhythm and VIP city movement.']
  ],
  ar: [
    ['بودروم وياليكافاك', 'يخوت خاصة وإقامات ساحلية ومخزون فلل خاصة.'],
    ['جوتشيك وفتحية', 'مسارات خلجان وخطط بحرية متعددة الأيام وإيقاع فاخر هادئ.'],
    ['كابادوكيا وإسطنبول', 'رحلات منطاد وإيقاع ثقافي وتنقلات VIP داخل المدينة.']
  ]
} as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
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
                <Image src="/images/experiences/exp-01.svg" alt="Luxury route" fill className="object-cover" />
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/5]">
                <Image src="/images/experiences/exp-43.svg" alt="Gastronomy route" fill className="object-cover" />
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
  image:
    Array.isArray(item.galleryImages) && item.galleryImages.length > 0
      ? String(item.galleryImages[0])
      : '/images/default-card.svg',
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
        <div className="grid gap-6 md:grid-cols-3">
          {destinationCards[locale].map(([title, description], index) => (
            <Card key={title} className="overflow-hidden border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3]">
                <Image src={['/images/experiences/exp-09.svg', '/images/experiences/exp-18.svg', '/images/experiences/exp-23.svg'][index]} alt={title} fill className="object-cover" />
              </div>
              <CardContent>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">{description}</p>
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
