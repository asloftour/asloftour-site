import { Container } from '@/components/layout/container';
import { PageHero } from '@/components/layout/page-hero';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';

const faqs = {
  tr: [
    ['Rezervasyon sonrası süreç nasıl işler?', 'Talebiniz veritabanına kaydedilir, uygunluk ve detaylar kontrol edilir, ardından ödeme ve operasyon teyidi aşamasına geçilir.'],
    ['Ödeme nasıl alınır?', '3D Secure kart ödemesi, havale/EFT ve güvenli ödeme linki talebi seçenekleri sunulur.'],
    ['Transfer eklenebilir mi?', 'Evet. Rezervasyon formunda transfer seçeneği eklenebilir ve operasyon ekibi rota doğrulaması yapar.'],
    ['Birden fazla hizmet tek rezervasyonda birleşebilir mi?', 'Özel planlama taleplerinde yat, konaklama, transfer ve gastronomi gibi birden fazla hizmet tek seyahat planında birleştirilebilir.'],
    ['İptal veya değişiklik nasıl değerlendirilir?', 'Hizmet tipi, tedarikçi kuralı ve tarihe kalan süreye göre iptal/değişiklik hükümleri uygulanır.'],
    ['Yatlarda yemek ve servis dahil mi?', 'Seçilen tekne ve paket yapısına göre değişir; detaylar teklif ve rezervasyon özetinde netleştirilir.'],
    ['Çocuklu ailelere uygun seçenekler var mı?', 'Evet. Yaşa, güvenlik beklentisine ve rota karakterine göre uygun deneyimler önerilir.']
  ],
  en: [
    ['What happens after a reservation request?', 'Your request is stored, availability is checked and the team proceeds with payment readiness and confirmation.'],
    ['How can payment be made?', '3D Secure card payment, bank transfer and secure payment link request are available.'],
    ['Can transfer be added?', 'Yes. Transfer can be added during booking and the route is confirmed by operations.'],
    ['Can multiple services be combined in one reservation?', 'Yes. Yachts, stays, transfers and gastronomy can be assembled into one private journey plan.'],
    ['How are cancellation and changes handled?', 'Rules depend on the service type, supplier policy and time remaining before delivery.'],
    ['Are food and service included on yachts?', 'It depends on the selected vessel and package. Details are clarified in the quote and reservation summary.'],
    ['Are there options suitable for families with children?', 'Yes. We propose experiences according to age, safety expectations and route character.']
  ],
  ar: [
    ['ماذا يحدث بعد طلب الحجز؟', 'يُحفظ طلبك ويتم التحقق من التوفر ثم ينتقل الفريق إلى جاهزية الدفع والتأكيد.'],
    ['كيف يتم الدفع؟', 'تتوفر البطاقة ثلاثية الأبعاد والتحويل البنكي وطلب رابط دفع آمن.'],
    ['هل يمكن إضافة نقل؟', 'نعم. يمكن إضافة النقل أثناء الحجز ويقوم فريق العمليات بتأكيد المسار.'],
    ['هل يمكن دمج أكثر من خدمة في حجز واحد؟', 'نعم. يمكن جمع اليخوت والإقامة والنقل والتذوق في خطة رحلة خاصة واحدة.'],
    ['كيف يتم التعامل مع الإلغاء أو التغيير؟', 'تعتمد القواعد على نوع الخدمة وسياسة المورّد والوقت المتبقي قبل التنفيذ.'],
    ['هل الطعام والخدمة مشمولان في اليخوت؟', 'يعتمد ذلك على اليخت والباقة المختارة، ويتم توضيح التفاصيل في العرض وملخص الحجز.'],
    ['هل توجد خيارات مناسبة للعائلات مع الأطفال؟', 'نعم. نقترح تجارب وفق العمر ومتطلبات الأمان وطبيعة المسار.']
  ]
} as const;

export default async function FaqPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;
  return (
    <>
      <PageHero locale={locale} eyebrow={tLocale(ui.faq.eyebrow, locale)} title={tLocale(ui.faq.title, locale)} description={tLocale(ui.faq.description, locale)} />
      <Container className="py-16 max-w-4xl">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs[locale].map(([title, content], index) => (
            <AccordionItem key={title} value={`item-${index}`}>
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>{content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </>
  );
}
