import { notFound } from 'next/navigation';
import { SectionIntro } from '@/components/SectionIntro';
import { Locale, getDictionary, isLocale } from '@/lib/site-content';

export default function PoliciesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <main className="shell page-section">
      <SectionIntro
        eyebrow={t.sections.policiesEyebrow}
        title={t.sections.policiesTitle}
        description={t.sections.policiesText}
      />
      <div className="info-grid">
        {t.policies.map((item) => (
          <article className="info-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>

      <section className="page-section page-section--tight">
        <SectionIntro eyebrow={t.sections.faqEyebrow} title={t.sections.faqTitle} center />
        <div className="faq-grid">
          {t.faq.map((item) => (
            <article className="faq-card" key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
