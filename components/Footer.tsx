import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { Locale, company, getDictionary } from '@/lib/site-content';

type Props = {
  locale: Locale;
};

export function Footer({ locale }: Props) {
  const t = getDictionary(locale);

  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/experiences`, label: t.nav.experiences },
    { href: `/${locale}/booking`, label: t.nav.booking },
    { href: `/${locale}/payment`, label: t.nav.payment },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
    { href: `/${locale}/policies`, label: t.nav.policies },
  ];

  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <BrandMark compact />
          <p className="footer-copy">{t.footer.text}</p>
        </div>
        <div>
          <div className="footer-title">{t.footer.sections}</div>
          <div className="footer-links">
            {links.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="footer-title">{t.footer.contact}</div>
          <div className="footer-contact">
            <div>{company.legalName}</div>
            <div>{company.address}</div>
            <div>{company.phoneDisplay}</div>
            <div>{company.email}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
