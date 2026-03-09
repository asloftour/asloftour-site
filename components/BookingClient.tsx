'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Locale,
  company,
  experiences,
  formatCurrency,
  getBookingQuery,
  getChargeLabel,
  getDateRangeCopy,
  getDateRangeLabel,
  getDateSummaryLabel,
  getDefaultGuestCount,
  getDictionary,
  getInitialEndDate,
  getMaxGuestCount,
  getSupportsDateRange,
  getTotalPrice,
  getUnitPriceLabel,
  localizedExperience,
} from '@/lib/site-content';

type Props = {
  locale: Locale;
  selectedId?: string;
  initialGuests?: string;
  initialStart?: string;
  initialEnd?: string;
};

export function BookingClient({ locale, selectedId, initialGuests, initialStart, initialEnd }: Props) {
  const t = getDictionary(locale);
  const fallbackId = selectedId && experiences.some((item) => item.id === selectedId) ? selectedId : experiences[0].id;
  const [experienceId, setExperienceId] = useState(fallbackId);

  const selectedRaw = useMemo(() => experiences.find((item) => item.id === experienceId) ?? experiences[0], [experienceId]);
  const localized = useMemo(() => localizedExperience(locale, selectedRaw), [locale, selectedRaw]);
  const supportsRange = getSupportsDateRange(localized.type);
  const maxGuests = getMaxGuestCount(localized.type);

  const [guests, setGuests] = useState(initialGuests || String(getDefaultGuestCount(selectedRaw.type)));
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(initialStart || '');
  const [endDate, setEndDate] = useState(initialEnd || '');

  useEffect(() => {
    const currentGuests = Number(guests || getDefaultGuestCount(selectedRaw.type));
    if (currentGuests > maxGuests) {
      setGuests(String(maxGuests));
    }
  }, [guests, maxGuests, selectedRaw.type]);

  useEffect(() => {
    if (!startDate || endDate) return;
    setEndDate(getInitialEndDate(localized.type, startDate));
  }, [startDate, endDate, localized.type]);

  useEffect(() => {
    if (!supportsRange && startDate && endDate !== startDate) {
      setEndDate(startDate);
    }
  }, [supportsRange, startDate, endDate]);

  const guestCount = Math.min(Math.max(Number(guests || getDefaultGuestCount(selectedRaw.type)), 1), maxGuests);
  const pricing = getTotalPrice({
    type: localized.type,
    basePrice: localized.price,
    guests: guestCount,
    startDate,
    endDate,
  });

  const today = new Date().toISOString().split('T')[0];
  const rangeCopy = getDateRangeCopy(locale, localized.type);
  const unitPriceLabel = getUnitPriceLabel(locale, localized.type);
  const dateLabel = getDateSummaryLabel(locale, localized.type);
  const chargeLabel = getChargeLabel(locale, localized.type, pricing.units);
  const dateRangeLabel = getDateRangeLabel(locale, startDate, endDate);

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);
  const whatsappMessage =
    locale === 'tr'
      ? `Merhaba AS LOF TOUR, ${localized.name} için rezervasyon oluşturmak istiyorum.`
      : locale === 'en'
        ? `Hello AS LOF TOUR, I would like to reserve ${localized.name}.`
        : `مرحبًا، أود حجز ${localized.name} مع AS LOF TOUR.`;

  const paymentHref = getBookingQuery({
    locale,
    experienceId: localized.id,
    guests: guestCount,
    startDate,
    endDate: supportsRange ? endDate : startDate,
  });

  return (
    <div className="two-column-layout two-column-layout--balanced">
      <section className="panel panel--form">
        <div className="panel__header">
          <div className="panel__eyebrow">{t.booking.selectedExperience}</div>
          <h2>{localized.name}</h2>
          <div className="panel__chips">
            <span className="chip">{localized.label}</span>
            <span className="chip">{localized.location}</span>
            <span className="chip">{localized.duration}</span>
          </div>
        </div>

        <div className="form-grid form-grid--comfortable">
          <label className="field field--full">
            <span>{t.booking.selectExperience}</span>
            <select value={experienceId} onChange={(e) => setExperienceId(e.target.value)}>
              {experiences.map((item) => {
                const localizedOption = localizedExperience(locale, item);
                return (
                  <option key={item.id} value={item.id}>
                    {localizedOption.name}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="field">
            <span>{t.booking.fullName}</span>
            <input type="text" placeholder={t.booking.fullName} />
          </label>

          <label className="field">
            <span>{t.booking.phone}</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.booking.phone} inputMode="tel" />
          </label>

          <label className="field">
            <span>{t.booking.email}</span>
            <input type="email" placeholder={t.booking.email} />
          </label>

          <label className="field">
            <span>{rangeCopy.start}</span>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => {
                const value = e.target.value;
                setStartDate(value);
                if (!supportsRange) {
                  setEndDate(value);
                  return;
                }
                if (!endDate || (value && endDate < value)) {
                  setEndDate(getInitialEndDate(localized.type, value));
                }
              }}
            />
          </label>

          {supportsRange ? (
            <label className="field">
              <span>{rangeCopy.end}</span>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          ) : (
            <label className="field">
              <span>{t.booking.guests}</span>
              <select value={String(guestCount)} onChange={(e) => setGuests(e.target.value)}>
                {guestOptions.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          )}

          {supportsRange ? (
            <label className="field">
              <span>{t.booking.guests}</span>
              <select value={String(guestCount)} onChange={(e) => setGuests(e.target.value)}>
                {guestOptions.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="field field--full">
            <span>{t.booking.notes}</span>
            <textarea placeholder={t.booking.notesPlaceholder} />
          </label>
        </div>

        <div className="button-row button-row--booking">
          <Link className="button" href={paymentHref}>
            {t.actions.continueToPayment}
          </Link>
          <a className="button button--ghost" href={`https://wa.me/${company.phoneIntl}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noreferrer">
            {t.actions.sendWhatsapp}
          </a>
        </div>
      </section>

      <aside className="panel panel--sticky panel--summary">
        <img className="summary-image" src={localized.image} alt={localized.name} />
        <div className="panel__eyebrow">{t.booking.summary}</div>
        <h3>{localized.name}</h3>
        <p className="muted">{localized.location} • {localized.duration}</p>
        <div className="summary-list summary-list--comfortable">
          <div><span>{dateLabel}</span><strong>{dateRangeLabel}</strong></div>
          <div><span>{locale === 'tr' ? 'Fiyat tipi' : locale === 'en' ? 'Pricing type' : 'نوع التسعير'}</span><strong>{chargeLabel}</strong></div>
          <div><span>{unitPriceLabel}</span><strong>{formatCurrency(localized.price, locale)}</strong></div>
          <div><span>{t.booking.personCount}</span><strong>{guestCount}</strong></div>
          <div><span>{t.booking.subtotal}</span><strong>{formatCurrency(pricing.subtotal, locale)}</strong></div>
          <div><span>{t.booking.serviceFee}</span><strong>{formatCurrency(pricing.serviceFee, locale)}</strong></div>
          <div className="summary-list__total"><span>{t.booking.total}</span><strong>{formatCurrency(pricing.total, locale)}</strong></div>
        </div>
        <div className="info-box">{t.booking.summaryText}</div>
      </aside>
    </div>
  );
}
