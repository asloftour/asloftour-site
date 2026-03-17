import Link from 'next/link';
import { ExperienceCategory } from '@prisma/client';
import { PageHero } from '@/components/layout/page-hero';
import { Container } from '@/components/layout/container';
import { ExperienceCard } from '@/components/public/experience-card';
import { getExperiences } from '@/lib/queries';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';
import { experienceCategories } from '@/lib/site';
import { getCategorySectionCopy } from '@/lib/experience-media';

const categoryOrder: ExperienceCategory[] = [
  'YACHT',
  'ACCOMMODATION',
  'BALLOON',
  'VILLA',
  'VIP_TRANSFER',
  'GASTRONOMY',
  'CUSTOM'
];

function categoryId(category: ExperienceCategory) {
  return `category-${category.toLowerCase().replace(/_/g, '-')}`;
}

export default async function ExperiencesPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const experiences = await getExperiences(locale);

  const groups = categoryOrder
    .map((category) => ({
      category,
      items: experiences.filter((item) => item.category === category)
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.experiences.eyebrow, locale)} title={tLocale(ui.experiences.title, locale)} description={tLocale(ui.experiences.description, locale)} />
      <Container className="py-10">
        <div className="flex flex-wrap gap-3">
          {groups.map((group) => (
            <Link
              key={group.category}
              href={`#${categoryId(group.category)}`}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/78 transition hover:border-[#D6B36A] hover:text-[#D6B36A]"
            >
              {experienceCategories[group.category][locale]}
            </Link>
          ))}
        </div>
      </Container>
      <Container className="space-y-16 pb-20">
        {groups.map((group) => (
          <section id={categoryId(group.category)} key={group.category} className="scroll-mt-28">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-white/42">AS LOF TOUR</div>
                <h2 className="mt-3 text-3xl font-semibold text-white">{experienceCategories[group.category][locale]}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/66">{getCategorySectionCopy(group.category, locale)}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item) => {
                const image =
                  Array.isArray(item.galleryImages) && item.galleryImages.length > 0
                    ? String(item.galleryImages.find((entry) => typeof entry === 'string') || '/images/default-card.svg')
                    : '/images/default-card.svg';

                return (
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
                      image,
                      location: item.location
                    }}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
