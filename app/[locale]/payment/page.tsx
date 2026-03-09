import { notFound } from 'next/navigation';
import { PaymentClient } from '@/components/PaymentClient';
import { SectionIntro } from '@/components/SectionIntro';
import { Locale, getDictionary, isLocale } from '@/lib/site-content';

export default function PaymentPage({
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
        eyebrow={t.sections.paymentEyebrow}
        title={t.sections.paymentTitle}
        description={t.sections.paymentText}
      />
      <PaymentClient
        locale={locale}
        selectedId={searchParams.experience}
        guests={searchParams.guests}
        startDate={searchParams.start}
        endDate={searchParams.end}
      />
    </main>
  );
}
