import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AppLocale } from '@/i18n/routing';
import { company } from '@/lib/site';
import { Container } from '@/components/layout/container';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { Button } from '@/components/ui/button';

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations();
  const nav = [
    ['/', t('nav.home')],
    ['/experiences', t('nav.experiences')],
    ['/booking', t('nav.booking')],
    ['/payment', t('nav.payment')],
    ['/about', t('nav.about')],
    ['/contact', t('nav.contact')],
    ['/faq', t('nav.faq')]
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b0b0ecc] backdrop-blur">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/${locale}`} className="block min-w-0 text-white">
              <div className="text-lg font-semibold tracking-[0.28em] text-white sm:text-xl whitespace-nowrap">{company.name}</div>
              <div className="brand-script mt-1 text-[15px] text-[#d5c28a] sm:text-[16px]">{company.slogan}</div>
            </Link>
          </div>
          <nav className="hidden items-center gap-5 lg:flex">
            {nav.map(([href, label]) => (
              <Link key={href} href={`/${locale}${href}`} className="text-sm text-white/74 transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <Button asChild variant="secondary" className="hidden md:inline-flex">
              <Link href={`/${locale}/booking`}>{t('cta.book')}</Link>
            </Button>
          </div>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={`/${locale}${href}`}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/78 transition hover:bg-white/10"
            >
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
