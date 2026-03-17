'use client';

import { Dispatch, SetStateAction } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { RichText } from '@/components/public/rich-text';

const lines = {
  tr: 'metnini okudum ve kabul ediyorum.',
  en: 'I have read and accept this text.',
  ar: 'لقد قرأت هذا النص وأوافق عليه.'
} as const;

export function LegalConsents({
  accepted,
  setAccepted,
  documents,
  locale
}: {
  accepted: Record<string, boolean>;
  setAccepted: Dispatch<SetStateAction<Record<string, boolean>>>;
  documents: Array<{ id: string; title: string; content: string; type?: string }>;
  locale: 'tr' | 'en' | 'ar';
}) {
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
        {documents.map((doc) => (
          <label key={doc.id} className="flex items-start gap-3 text-sm text-white/78">
            <Checkbox checked={accepted[doc.id]} onCheckedChange={(checked) => setAccepted((prev) => ({ ...prev, [doc.id]: Boolean(checked) }))} />
            <span>{doc.title} {lines[locale]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
