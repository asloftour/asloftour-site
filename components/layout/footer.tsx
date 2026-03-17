import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AppLocale } from '@/i18n/routing';
import { Container } from '@/components/layout/container';
import { company } from '@/lib/site';
import { tLocale, ui } from '@/lib/public-copy';

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations();
  const legalLinks = [
    ['/privacy', tLocale(ui.footer.privacy, locale)],
    ['/cookies', tLocale(ui.footer.cookies, locale)],
    ['/distance-sales', tLocale(ui.footer.distanceSales, locale)],
    ['/cancellation-refund', tLocale(ui.footer.cancellationRefund, locale)],
    ['/pre-information', tLocale(ui.footer.preInformation, locale)],
    ['/service-agreement', tLocale(ui.footer.serviceAgreement, locale)]
  ] as const;

  return (
    <footer className="border-t border-white/8 bg-black/30 py-14">
      <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="text-xl font-semibold tracking-[0.35em] text-white">{company.name}</div>
          <p className="brand-script mt-3 max-w-md text-lg text-[#d5c28a]">{company.slogan}</p>
          <p className="mt-5 text-sm leading-7 text-white/64">{t('footer.company')}</p>
          <p className="mt-3 text-sm leading-7 text-white/64">{t('footer.address')}</p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{tLocale(ui.footer.explore, locale)}</div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/68">
            <Link href={`/${locale}/experiences`} className="hover:text-white">{t('nav.experiences')}</Link>
            <Link href={`/${locale}/booking`} className="hover:text-white">{t('nav.booking')}</Link>
            <Link href={`/${locale}/payment`} className="hover:text-white">{t('nav.payment')}</Link>
            <Link href={`/${locale}/contact`} className="hover:text-white">{t('nav.contact')}</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">{tLocale(ui.footer.legal, locale)}</div>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/68">
            {legalLinks.map(([href, label]) => (
              <Link key={href} href={`/${locale}${href}`} className="hover:text-white">
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-sm text-white/68">
            <div>{t('footer.phone')}</div>
            <div>{t('footer.email')}</div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
