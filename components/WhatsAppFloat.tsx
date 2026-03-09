import { Locale, company } from '@/lib/site-content';

type Props = {
  locale: Locale;
};

export function WhatsAppFloat({ locale }: Props) {
  const label = locale === 'tr' ? 'WhatsApp' : locale === 'en' ? 'WhatsApp' : 'واتساب';
  const message =
    locale === 'tr'
      ? 'Merhaba AS LOF TOUR, bilgi almak istiyorum.'
      : locale === 'en'
        ? 'Hello AS LOF TOUR, I would like to receive information.'
        : 'مرحبًا، أود الحصول على معلومات عن خدمات AS LOF TOUR.';

  return (
    <a
      href={`https://wa.me/${company.phoneIntl}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label={label}
    >
      <span className="whatsapp-float__icon">✦</span>
      <span>{label}</span>
    </a>
  );
}
