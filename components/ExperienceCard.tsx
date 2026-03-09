import { Locale, formatCurrency, localizedExperience } from '@/lib/site-content';

type Props = {
  locale: Locale;
  item: ReturnType<typeof localizedExperience>;
  reserveHref?: string;
  detailLabel?: string;
  reserveLabel?: string;
};

export function ExperienceCard({ locale, item, reserveHref, detailLabel, reserveLabel }: Props) {
  return (
    <article className="experience-card">
      <div className="experience-card__media">
        <img src={item.image} alt={item.name} />
        <div className="experience-card__badges">
          <span className="pill pill--dark">{item.label}</span>
          <span className="pill pill--light">{item.location}</span>
        </div>
        <div className="experience-card__price">
          <span>{locale === 'tr' ? 'Başlangıç' : locale === 'en' ? 'From' : 'ابتداءً من'}</span>
          <strong>{formatCurrency(item.price, locale)}</strong>
        </div>
      </div>
      <div className="experience-card__body">
        <h3>{item.name}</h3>
        <p className="muted">{item.duration}</p>
        <p>{item.description}</p>
        <div className="experience-card__meta">
          <div>
            <span>{locale === 'tr' ? 'Kapasite' : locale === 'en' ? 'Capacity' : 'السعة'}</span>
            <strong>{item.capacity}</strong>
          </div>
          <div>
            <span>{locale === 'tr' ? 'Süre' : locale === 'en' ? 'Duration' : 'المدة'}</span>
            <strong>{item.duration}</strong>
          </div>
        </div>
        <div className="experience-card__tags">
          {item.highlights.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        {reserveHref ? (
          <div className="experience-card__actions">
            <a className="button" href={reserveHref}>
              {reserveLabel}
            </a>
            <a className="button button--ghost" href={reserveHref}>
              {detailLabel}
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
