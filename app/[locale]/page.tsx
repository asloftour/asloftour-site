import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionIntro } from '@/components/SectionIntro';
import { ExperienceCard } from '@/components/ExperienceCard';
import { Locale, company, experiences, getDictionary, isLocale, localizedExperience } from '@/lib/site-content';

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  const featured = experiences.slice(0, 4).map((item) => localizedExperience(locale, item));
  const serviceCards = t.home.serviceCards;
  const homeBlocks = t.home.blocks.items;
  const partnerItems = t.home.partnerItems;

  return (
    <main>
      <section className="hero shell">
        <div className="hero__grid">
          <div>
            <div className="pill hero__badge">{t.hero.badge}</div>
            <h1 className="hero__title">{t.hero.title}</h1>
            <p className="hero__text">{t.hero.text}</p>
            <div className="hero__actions">
              <Link href={`/${locale}/experiences`} className="button">{t.actions.explore}</Link>
              <Link href={`/${locale}/booking`} className="button button--ghost">{t.actions.buildPlan}</Link>
            </div>
            <div className="hero-cards">
              {serviceCards.map((item) => (
                <article key={item.title} className="mini-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80" alt={company.brand} />
            <div className="hero-visual__panel">
              <div className="section-intro__eyebrow">{t.hero.visualEyebrow}</div>
              <h2>{t.hero.visualTitle}</h2>
              <p>{t.hero.visualText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell page-section">
        <SectionIntro
          eyebrow={t.sections.experiencesEyebrow}
          title={t.sections.experiencesTitle}
          description={t.sections.experiencesText}
        />
        <div className="experience-grid">
          {featured.map((item) => (
            <ExperienceCard
              key={item.id}
              locale={locale}
              item={item}
              reserveHref={`/${locale}/booking?experience=${item.id}`}
              reserveLabel={t.actions.reserveNow}
              detailLabel={t.actions.viewDetails}
            />
          ))}
        </div>
        <div className="center-actions">
          <Link href={`/${locale}/experiences`} className="button button--ghost">{t.actions.explore}</Link>
        </div>
      </section>

      <section className="shell page-section page-section--tight">
        <div className="two-panel-grid">
          <article className="panel">
            <div className="panel__eyebrow">{t.home.highlightTitle}</div>
            <h2>{t.home.blocks.title}</h2>
            <div className="info-grid info-grid--three">
              {homeBlocks.map((item) => (
                <div className="info-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <div className="panel__eyebrow">{t.home.partnerTitle}</div>
            <div className="stack-grid">
              {partnerItems.map((item) => (
                <div className="info-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="shell page-section">
        <SectionIntro eyebrow={t.sections.faqEyebrow} title={t.sections.faqTitle} center />
        <div className="faq-grid">
          {t.faq.slice(0, 6).map((item) => (
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
