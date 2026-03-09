'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExperienceCard } from './ExperienceCard';
import { Locale, experiences, getCategories, localizedExperience } from '@/lib/site-content';

type Props = {
  locale: Locale;
  reserveLabel: string;
  detailLabel: string;
};

export function ExperienceFilterGrid({ locale, reserveLabel, detailLabel }: Props) {
  const categories = getCategories(locale);
  const [active, setActive] = useState<(typeof categories)[number]['id']>('all');

  const filtered = useMemo(() => {
    const mapped = experiences.map((item) => localizedExperience(locale, item));
    return active === 'all' ? mapped : mapped.filter((item) => item.type === active);
  }, [active, locale]);

  return (
    <div>
      <div className="filter-bar">
        {categories.map((item) => (
          <button key={item.id} className={`filter-pill ${active === item.id ? 'is-active' : ''}`} onClick={() => setActive(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="experience-grid">
        {filtered.map((item) => (
          <ExperienceCard
            key={item.id}
            locale={locale}
            item={item}
            reserveHref={`/${locale}/booking?experience=${item.id}`}
            reserveLabel={reserveLabel}
            detailLabel={detailLabel}
          />
        ))}
      </div>
      <div className="center-actions">
        <Link href={`/${locale}/contact`} className="button button--ghost">
          {locale === 'tr' ? 'Özel talep oluştur' : locale === 'en' ? 'Create a custom request' : 'أنشئ طلبًا خاصًا'}
        </Link>
      </div>
    </div>
  );
}
