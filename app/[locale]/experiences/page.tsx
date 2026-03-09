import { notFound } from 'next/navigation';
import { ExperienceFilterGrid } from '@/components/ExperienceFilterGrid';
import { SectionIntro } from '@/components/SectionIntro';
import { Locale, getDictionary, isLocale } from '@/lib/site-content';

export default function ExperiencesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <main className="shell page-section">
      <SectionIntro
        eyebrow={t.sections.experiencesEyebrow}
        title={t.sections.experiencesTitle}
        description={t.sections.experiencesText}
      />
      <ExperienceFilterGrid locale={locale} reserveLabel={t.actions.reserveNow} detailLabel={t.actions.viewDetails} />
    </main>
  );
}
