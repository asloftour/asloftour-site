import { notFound } from 'next/navigation';
import { SectionIntro } from '@/components/SectionIntro';
import { Locale, company, getDictionary, isLocale } from '@/lib/site-content';

export default function ContactPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <main className="shell page-section">
      <SectionIntro
        eyebrow={t.sections.contactEyebrow}
        title={t.sections.contactTitle}
        description={t.sections.contactText}
      />
      <div className="two-panel-grid">
        <article className="panel">
          <div className="stack-grid">
            <div className="info-card">
              <h3>{t.contact.labels.phone}</h3>
              <p>{company.phoneDisplay}</p>
            </div>
            <div className="info-card">
              <h3>{t.contact.labels.email}</h3>
              <p>{company.email}</p>
            </div>
            <div className="info-card">
              <h3>{t.contact.labels.address}</h3>
              <p>{company.address}</p>
            </div>
          </div>
        </article>
        <article className="panel">
          <div className="panel__eyebrow">{t.contact.formLabel}</div>
          <h2>{t.contact.formTitle}</h2>
          <div className="form-grid">
            <label className="field"><span>{locale === 'tr' ? 'Ad Soyad' : locale === 'en' ? 'Full name' : 'الاسم الكامل'}</span><input type="text" placeholder={locale === 'tr' ? 'Ad Soyad' : locale === 'en' ? 'Full name' : 'الاسم الكامل'} /></label>
            <label className="field"><span>{t.contact.labels.phone}</span><input type="text" placeholder={t.contact.labels.phone} /></label>
            <label className="field field--full"><span>{t.contact.labels.email}</span><input type="email" placeholder={t.contact.labels.email} /></label>
            <label className="field field--full"><span>{locale === 'tr' ? 'Talebiniz' : locale === 'en' ? 'Your request' : 'طلبك'}</span><textarea placeholder={t.contact.formText} /></label>
          </div>
          <div className="button-row">
            <button className="button" type="button">{t.actions.sendInquiry}</button>
            <a className="button button--ghost" href={`https://wa.me/${company.phoneIntl}?text=${encodeURIComponent(locale === 'tr' ? 'Merhaba AS LOF TOUR, bilgi almak istiyorum.' : locale === 'en' ? 'Hello AS LOF TOUR, I would like to receive information.' : 'مرحبًا، أود الحصول على معلومات عن خدمات AS LOF TOUR.')}`} target="_blank" rel="noreferrer">
              {t.actions.openWhatsapp}
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
