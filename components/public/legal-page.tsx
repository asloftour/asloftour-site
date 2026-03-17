import { notFound } from 'next/navigation';
import { LegalDocumentType } from '@prisma/client';
import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { RichText } from '@/components/public/rich-text';
import { getLegalDocument } from '@/lib/queries';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';

export async function LegalPage({ locale, type, title }: { locale: AppLocale; type: LegalDocumentType; title: string }) {
  const document = await getLegalDocument(locale, type);
  if (!document) notFound();
  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.common.legal, locale)} title={title} description={document.excerpt || document.title} showActions={false} />
      <Container className="max-w-4xl py-16">
        <RichText html={document.content} />
      </Container>
    </>
  );
}
