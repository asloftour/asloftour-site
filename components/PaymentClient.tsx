'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Locale,
  experiences,
  formatCurrency,
  getChargeLabel,
  getDateRangeLabel,
  getDateSummaryLabel,
  getDictionary,
  getReturnBookingQuery,
  getTotalPrice,
  getUnitPriceLabel,
  localizedExperience,
} from '@/lib/site-content';

type Props = {
  locale: Locale;
  selectedId?: string;
  guests?: string;
  startDate?: string;
  endDate?: string;
};

export function PaymentClient({ locale, selectedId, guests, startDate = '', endDate = '' }: Props) {
  const t = getDictionary(locale);
  const raw = experiences.find((item) => item.id === selectedId) ?? experiences[0];
  const localized = useMemo(() => localizedExperience(locale, raw), [locale, raw]);
  const guestCount = Math.max(Number(guests || 1), 1);
  const pricing = getTotalPrice({
    type: localized.type,
    basePrice: localized.price,
    guests: guestCount,
    startDate,
    endDate,
  });

  const dateLabel = getDateSummaryLabel(locale, localized.type);
  const unitPriceLabel = getUnitPriceLabel(locale, localized.type);
  const chargeLabel = getChargeLabel(locale, localized.type, pricing.units);
  const dateRangeLabel = getDateRangeLabel(locale, startDate, endDate);
  const bookingHref = getReturnBookingQuery({
    locale,
    experienceId: localized.id,
    guests: guestCount,
    startDate,
    endDate,
  });

  return (
    <div className="two-column-layout two-column-layout--balanced">
      <section className="panel panel--form">
        <div className="panel__eyebrow">{t.payment.cardInfo}</div>
        <h2>{localized.name}</h2>
        <div className="form-grid form-grid--comfortable">
          <label className="field field--full">
            <span>{t.payment.cardName}</span>
            <input type="text" placeholder={t.payment.cardName} />
          </label>
          <label className="field field--full">
            <span>{t.payment.cardNumber}</span>
            <input type="text" placeholder="0000 0000 0000 0000" />
          </label>
          <label className="field">
            <span>{t.payment.expiry}</span>
            <input type="text" placeholder="MM / YY" />
          </label>
          <label className="field">
            <span>{t.payment.cvv}</span>
            <input type="text" placeholder="CVV" />
          </label>
          <label className="field">
            <span>{t.payment.phone}</span>
            <input type="text" placeholder={t.payment.phone} />
          </label>
          <label className="field">
            <span>{t.payment.email}</span>
            <input type="email" placeholder={t.payment.email} />
          </label>
        </div>
        <div className="info-box">{t.payment.text}</div>
        <div className="button-row button-row--booking">
          <button className="button" type="button">{t.actions.confirmPayment}</button>
          <Link className="button button--ghost" href={bookingHref}>
            {t.actions.backToBooking}
          </Link>
        </div>
      </section>

      <aside className="panel panel--sticky panel--summary">
        <div className="panel__eyebrow">{t.payment.summary}</div>
        <h3>{localized.name}</h3>
        <p className="muted">{localized.label} • {localized.location}</p>
        <div className="summary-list summary-list--comfortable">
          <div><span>{dateLabel}</span><strong>{dateRangeLabel}</strong></div>
          <div><span>{locale === 'tr' ? 'Fiyat tipi' : locale === 'en' ? 'Pricing type' : 'نوع التسعير'}</span><strong>{chargeLabel}</strong></div>
          <div><span>{unitPriceLabel}</span><strong>{formatCurrency(localized.price, locale)}</strong></div>
          <div><span>{t.payment.productTotal}</span><strong>{formatCurrency(pricing.subtotal, locale)}</strong></div>
          <div><span>{t.payment.serviceFee}</span><strong>{formatCurrency(pricing.serviceFee, locale)}</strong></div>
          <div className="summary-list__total"><span>{t.payment.amountDue}</span><strong>{formatCurrency(pricing.total, locale)}</strong></div>
        </div>
        <div className="note-stack">
          {t.payment.notes.map((item) => (
            <div key={item} className="note-item">{item}</div>
          ))}
        </div>
      </aside>
    </div>
  );
}
