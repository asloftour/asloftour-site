import { notFound } from 'next/navigation';
import { BookingClient } from '@/components/BookingClient';
import { SectionIntro } from '@/components/SectionIntro';
import { Locale, getDictionary, isLocale } from '@/lib/site-content';

export default function BookingPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { experience?: string; guests?: string; start?: string; end?: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <main className="shell page-section">
      <SectionIntro
        eyebrow={t.sections.bookingEyebrow}
        title={t.sections.bookingTitle}
        description={t.sections.bookingText}
      />
      <BookingClient
        locale={locale}
        selectedId={searchParams.experience}
        initialGuests={searchParams.guests}
        initialStart={searchParams.start}
        initialEnd={searchParams.end}
      />
    </main>
  );
}
