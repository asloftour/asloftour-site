'use client';

import { Dispatch, SetStateAction } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { RichText } from '@/components/public/rich-text';

const consentCopy = {
  tr: {
    contracts: 'Ön bilgilendirme, mesafeli satış ve hizmet çerçevesi metinlerini okudum; rezervasyon ve ödeme akışında bu koşulların geçerli olduğunu kabul ediyorum.',
    privacy: 'KVKK, gizlilik, çerez ve iptal / değişiklik koşullarını okudum; bu kapsamda işlem yapılmasına onay veriyorum.',
    marketing: 'Kampanya, ayrıcalık ve rezervasyon güncellemeleri için benimle iletişime geçilmesine izin veriyorum.',
    optional: 'İsteğe bağlı'
  },
  en: {
    contracts: 'I have reviewed the pre-information, distance-sales and service framework texts, and I accept that these terms apply to my reservation and payment flow.',
    privacy: 'I have reviewed the privacy, cookie and cancellation / amendment terms, and I consent to the related processing within this scope.',
    marketing: 'I agree to be contacted for campaign updates, privileged offers and reservation follow-ups.',
    optional: 'Optional'
  },
  ar: {
    contracts: 'اطلعت على نصوص المعلومات المسبقة والبيع عن بُعد وإطار الخدمة، وأوافق على سريان هذه الشروط على الحجز والدفع الخاص بي.',
    privacy: 'اطلعت على شروط الخصوصية وملفات الارتباط والإلغاء / التعديل وأوافق على المعالجة المرتبطة بها ضمن هذا النطاق.',
    marketing: 'أوافق على التواصل معي بخصوص العروض الخاصة والتحديثات والحملات المتعلقة بالحجز.',
    optional: 'اختياري'
  }
} as const;

export function LegalConsents({
  accepted,
  setAccepted,
  documents,
  locale
}: {
  accepted: Record<string, boolean>;
  setAccepted: Dispatch<SetStateAction<Record<string, boolean>>>;
  documents: Array<{ id: string; title: string; content: string; type: string }>;
  locale: 'tr' | 'en' | 'ar';
}) {
  const copy = consentCopy[locale];

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
        <label className="flex items-start gap-3 text-sm leading-7 text-white/78">
          <Checkbox checked={accepted.contracts} onCheckedChange={(checked) => setAccepted((prev) => ({ ...prev, contracts: Boolean(checked) }))} />
          <span>{copy.contracts}</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-7 text-white/78">
          <Checkbox checked={accepted.privacy} onCheckedChange={(checked) => setAccepted((prev) => ({ ...prev, privacy: Boolean(checked) }))} />
          <span>{copy.privacy}</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-7 text-white/72">
          <Checkbox checked={accepted.marketing} onCheckedChange={(checked) => setAccepted((prev) => ({ ...prev, marketing: Boolean(checked) }))} />
          <span>{copy.marketing} <span className="text-white/38">({copy.optional})</span></span>
        </label>
      </div>
    </div>
  );
}
