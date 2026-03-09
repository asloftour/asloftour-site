import { notFound } from 'next/navigation';
import { SectionIntro } from '@/components/SectionIntro';
import { Locale, company, getDictionary, isLocale } from '@/lib/site-content';

export default function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <main className="shell page-section">
      <SectionIntro
        eyebrow={t.sections.aboutEyebrow}
        title={t.sections.aboutTitle}
        description={t.sections.aboutText}
      />
      <div className="two-panel-grid">
        <article className="panel">
          <div className="panel__eyebrow">{t.about.companyLabel}</div>
          <div className="stack-grid">
            <div className="info-card">
              <h3>{t.about.legalName}</h3>
              <p>{company.legalName}</p>
            </div>
            <div className="info-card">
              <h3>{t.about.address}</h3>
              <p>{company.address}</p>
            </div>
          </div>
        </article>
        <article className="panel">
          <div className="panel__eyebrow">{t.about.approachLabel}</div>
          <h2>{t.about.approachTitle}</h2>
          <p className="lead-copy">{t.about.approachText}</p>
          <div className="info-grid">
            {t.about.items.map((item) => (
              <div className="info-card info-card--small" key={item}>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
