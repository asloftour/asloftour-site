import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { ContactForm } from '@/components/public/contact-form';
import { InquiryForm } from '@/components/public/inquiry-form';
import { Card, CardContent } from '@/components/ui/card';
import { getExperienceOptions } from '@/lib/queries';
import { AppLocale } from '@/i18n/routing';
import { company } from '@/lib/site';
import { tLocale, ui } from '@/lib/public-copy';

export default async function ContactPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  const experiences = await getExperienceOptions(locale);

  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.contact.eyebrow, locale)} title={tLocale(ui.contact.title, locale)} description={tLocale(ui.contact.description, locale)} />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <ContactForm locale={locale} />
          <div className="space-y-6">
            <Card><CardContent><h2 className="text-xl font-semibold text-white">{tLocale(ui.contact.directChannels, locale)}</h2><div className="mt-4 space-y-2 text-sm leading-7 text-white/68"><div>{company.legalName}</div><div>{company.address}</div><div>{company.phone}</div><div>{company.email}</div></div></CardContent></Card>
            <InquiryForm locale={locale} experiences={experiences} type="APPOINTMENT" />
          </div>
        </div>
      </Container>
    </>
  );
}
