import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { BookingForm } from '@/components/public/booking-form';
import { InquiryForm } from '@/components/public/inquiry-form';
import { Card, CardContent } from '@/components/ui/card';
import { getExperienceOptions } from '@/lib/queries';
import { resolveLocaleParam } from '@/lib/locale';
import { tLocale, ui } from '@/lib/public-copy';

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocaleParam(params);
  const experiences = await getExperienceOptions(locale);

  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.booking.eyebrow, locale)} title={tLocale(ui.booking.title, locale)} description={tLocale(ui.booking.description, locale)} />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <BookingForm locale={locale} experiences={experiences} />
          <div className="space-y-6">
            <Card><CardContent><h2 className="text-xl font-semibold text-white">{tLocale(ui.booking.nextTitle, locale)}</h2><p className="mt-4 text-sm leading-7 text-white/68">{tLocale(ui.booking.nextText, locale)}</p></CardContent></Card>
            <InquiryForm locale={locale} experiences={experiences} type="PRIVATE_PLANNING" />
          </div>
        </div>
      </Container>
    </>
  );
}
