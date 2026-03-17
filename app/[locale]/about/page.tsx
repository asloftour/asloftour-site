import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { Card, CardContent } from '@/components/ui/card';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';

const items = {
  tr: [
    ['Mahrem planlama', 'Talepler sakin, hızlı ve seçkin bir iletişim diliyle ele alınır.'],
    ['Nitelikli tedarik ağı', 'Hizmetler katalog kalabalığına değil, kalite ve misafir uyumuna göre seçilir.'],
    ['Operasyon görünürlüğü', 'Rezervasyon, ödeme, dekont ve yasal onaylar tek arka ofiste görünür kalır.']
  ],
  en: [
    ['Discreet planning', 'Requests are handled with calm, responsive communication and tailored follow-through.'],
    ['Qualified supplier curation', 'Experiences are chosen for quality and guest fit, not catalogue volume.'],
    ['Operational visibility', 'Reservations, payments, proofs and legal acknowledgements remain visible in one back office.']
  ],
  ar: [
    ['تخطيط بخصوصية', 'تُدار الطلبات بهدوء وسرعة واستجابة مصممة لكل حالة.'],
    ['شبكة توريد منتقاة', 'يتم اختيار التجارب على أساس الجودة وملاءمة الضيف لا على كثرة الكتالوج.'],
    ['رؤية تشغيلية', 'تبقى الحجوزات والمدفوعات والإيصالات والموافقات القانونية مرئية في لوحة واحدة.']
  ]
} as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.about.eyebrow, locale)} title={tLocale(ui.about.title, locale)} description={tLocale(ui.about.description, locale)} />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {items[locale].map(([title, description]) => (
            <Card key={title}><CardContent><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-4 text-sm leading-7 text-white/68">{description}</p></CardContent></Card>
          ))}
        </div>
      </Container>
    </>
  );
}
