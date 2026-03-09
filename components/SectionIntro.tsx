type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
};

export function SectionIntro({ eyebrow, title, description, center = false }: Props) {
  return (
    <div className={`section-intro ${center ? 'section-intro--center' : ''}`}>
      <div className="section-intro__eyebrow">{eyebrow}</div>
      <h2 className="section-intro__title">{title}</h2>
      {description ? <p className="section-intro__description">{description}</p> : null}
    </div>
  );
}
