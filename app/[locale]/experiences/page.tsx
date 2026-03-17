import { PageHero } from '@/components/layout/page-hero';
import { Container } from '@/components/layout/container';
import { ExperienceCard } from '@/components/public/experience-card';
import { getExperiences } from '@/lib/queries';
import { resolveLocaleParam } from '@/lib/locale';
import { tLocale, ui } from '@/lib/public-copy';

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  const experiences = await getExperiences(locale);

  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.experiences.eyebrow, locale)} title={tLocale(ui.experiences.title, locale)} description={tLocale(ui.experiences.description, locale)} />
      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((item) => (
            <ExperienceCard
              key={item.id}
              locale={locale}
              item={{
                title: item.translation?.title || item.location,
                slug: item.translation?.slug || item.id,
                shortDescription: item.translation?.shortDescription || '',
                category: item.category,
                basePrice: Number(item.basePrice),
                currency: item.currency,
                pricingMode: item.pricingMode,
                image: Array.isArray(item.galleryImages) ? item.galleryImages[0] : '/images/default-card.svg'
              }}
            />
          ))}
        </div>
      </Container>
    </>
  );
}
