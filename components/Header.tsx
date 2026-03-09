'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BrandMark } from './BrandMark';
import { company, Locale, getDictionary, locales } from '@/lib/site-content';

type Props = {
  locale: Locale;
};

export function Header({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = getDictionary(locale);

  const nav = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/experiences`, label: t.nav.experiences },
    { href: `/${locale}/booking`, label: t.nav.booking },
    { href: `/${locale}/payment`, label: t.nav.payment },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  const localeLinks = useMemo(() => {
    const stripped = pathname.replace(/^\/(tr|en|ar)/, '');
    return locales.map((item) => ({
      locale: item,
      href: `/${item}${stripped || ''}`,
    }));
  }, [pathname]);

  const whatsappUrl = `https://wa.me/${company.phoneIntl}?text=${encodeURIComponent(
    locale === 'tr'
      ? 'Merhaba AS LOF TOUR, bilgi almak istiyorum.'
      : locale === 'en'
        ? 'Hello AS LOF TOUR, I would like to receive information.'
        : 'مرحبًا، أود الحصول على معلومات عن خدمات AS LOF TOUR.'
  )}`;

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href={`/${locale}`} className="site-header__brand" aria-label={company.brand}>
          <BrandMark />
        </Link>

        <nav className="site-nav desktop-only" aria-label="Main navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`site-nav__link ${pathname === item.href ? 'is-active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions desktop-only">
          <div className="locale-switcher" aria-label="Language switcher">
            {localeLinks.map((item) => (
              <Link key={item.locale} href={item.href} className={`locale-switcher__link ${item.locale === locale ? 'is-active' : ''}`}>
                {item.locale.toUpperCase()}
              </Link>
            ))}
          </div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button--ghost">
            {t.actions.whatsapp}
          </a>
          <Link href={`/${locale}/booking`} className="button">
            {t.actions.reserve}
          </Link>
        </div>

        <button className="menu-button mobile-only" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="mobile-panel mobile-only">
          <div className="shell mobile-panel__inner">
            <div className="mobile-nav">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="mobile-nav__link" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mobile-panel__footer">
              <div className="locale-switcher">
                {localeLinks.map((item) => (
                  <Link key={item.locale} href={item.href} className={`locale-switcher__link ${item.locale === locale ? 'is-active' : ''}`}>
                    {item.locale.toUpperCase()}
                  </Link>
                ))}
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button--block">
                {t.actions.whatsapp}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
