'use client';

import { Dispatch, SetStateAction } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { RichText } from '@/components/public/rich-text';

const copy = {
  tr: {
    required:
      'Ön bilgilendirme, hizmet / mesafeli satış koşulları, iptal-iade esasları ve gizlilik metinlerini okudum, kabul ediyorum.',
    marketing:
      'Kampanya, teklif, yeni deneyim ve rezervasyon süreçlerine ilişkin bilgilendirmeler için benimle iletişime geçilmesine izin veriyorum.'
  },
  en: {
    required:
      'I have read and accept the pre-information, service / distance sales terms, cancellation-refund principles and privacy texts.',
    marketing:
      'I allow contact regarding campaigns, offers, new experiences and reservation updates.'
  },
  ar: {
    required:
      'لقد قرأت وأوافق على نصوص التنوير المسبق وشروط الخدمة / البيع عن بعد وأسس الإلغاء والاسترداد ونصوص الخصوصية.',
    marketing:
      'أوافق على التواصل معي بخصوص الحملات والعروض والتجارب الجديدة وتحديثات الحجز.'
  }
} as const;

export function LegalConsents({
  requiredAccepted,
  setRequiredAccepted,
  marketingAccepted,
  setMarketingAccepted,
  documents,
  locale
}: {
  requiredAccepted: boolean;
  setRequiredAccepted: Dispatch<SetStateAction<boolean>>;
  marketingAccepted: boolean;
  setMarketingAccepted: Dispatch<SetStateAction<boolean>>;
  documents: Array<{ id: string; title: string; content: string; type?: string }>;
  locale: 'tr' | 'en' | 'ar';
}) {
  const t = copy[locale];

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-3">
        {documents.map((doc) => (
          <AccordionItem key={doc.id} value={doc.id}>
            <AccordionTrigger>{doc.title}</AccordionTrigger>
            <AccordionContent>
              <RichText html={doc.content} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/4 p-5">
        <label className="flex items-start gap-3 text-sm text-white/78">
          <Checkbox
            checked={requiredAccepted}
            onCheckedChange={(checked) => setRequiredAccepted(Boolean(checked))}
          />
          <span>{t.required}</span>
        </label>

        <label className="flex items-start gap-3 text-sm text-white/78">
          <Checkbox
            checked={marketingAccepted}
            onCheckedChange={(checked) => setMarketingAccepted(Boolean(checked))}
          />
          <span>{t.marketing}</span>
        </label>
      </div>
    </div>
  );
}