export type SupportedLocale = 'tr' | 'en' | 'ar';
export type PricingMode =
  | 'PER_BOOKING'
  | 'PER_PERSON'
  | 'PER_NIGHT'
  | 'PER_WEEK'
  | 'PER_TRANSFER'
  | 'CUSTOM';

const PRICING_COPY = {
  tr: {
    PER_BOOKING: {
      badge: 'Plan bazlı',
      label: 'Rezervasyon planı',
      hint: 'Toplam tutar seçilen tarih aralığı ve misafir sayısına göre güncellenir.',
    },
    PER_PERSON: {
      badge: 'Kişi bazlı',
      label: 'Kişi başı',
      hint: 'Toplam tutar misafir sayısına göre güncellenir.',
    },
    PER_NIGHT: {
      badge: 'Gece bazlı',
      label: 'Gece bazlı',
      hint: 'Toplam tutar konaklama gecesi arttıkça güncellenir.',
    },
    PER_WEEK: {
      badge: 'Hafta bazlı',
      label: 'Hafta bazlı',
      hint: 'Toplam tutar hafta bazında hesaplanır.',
    },
    PER_TRANSFER: {
      badge: 'Transfer bazlı',
      label: 'Transfer bazlı',
      hint: 'Transfer hizmetleri araç ve rota bazlı sabit tutarla ilerler.',
    },
    CUSTOM: {
      badge: 'Özel teklif',
      label: 'Özel fiyatlama',
      hint: 'Bu deneyim özel teklif yapısıyla ilerler; görünen tutar başlangıç referansıdır.',
    },
  },
  en: {
    PER_BOOKING: {
      badge: 'Plan-based',
      label: 'Reservation plan',
      hint: 'The total updates according to selected dates and guest count.',
    },
    PER_PERSON: {
      badge: 'Per person',
      label: 'Per person',
      hint: 'The total updates according to the number of guests.',
    },
    PER_NIGHT: {
      badge: 'Per night',
      label: 'Per night',
      hint: 'The total updates as the number of nights increases.',
    },
    PER_WEEK: {
      badge: 'Per week',
      label: 'Per week',
      hint: 'The total updates according to the number of booked weeks.',
    },
    PER_TRANSFER: {
      badge: 'Per transfer',
      label: 'Per transfer',
      hint: 'Transfer services follow a fixed amount based on route and vehicle.',
    },
    CUSTOM: {
      badge: 'Bespoke',
      label: 'Custom pricing',
      hint: 'This experience follows a bespoke pricing structure; the shown amount is a starting reference.',
    },
  },
  ar: {
    PER_BOOKING: {
      badge: 'بحسب الخطة',
      label: 'خطة الحجز',
      hint: 'يتم تحديث الإجمالي بحسب التواريخ المختارة وعدد الضيوف.',
    },
    PER_PERSON: {
      badge: 'لكل شخص',
      label: 'لكل شخص',
      hint: 'يتم تحديث الإجمالي بحسب عدد الضيوف.',
    },
    PER_NIGHT: {
      badge: 'لكل ليلة',
      label: 'لكل ليلة',
      hint: 'يتم تحديث الإجمالي مع زيادة عدد الليالي.',
    },
    PER_WEEK: {
      badge: 'لكل أسبوع',
      label: 'لكل أسبوع',
      hint: 'يتم تحديث الإجمالي بحسب عدد الأسابيع المحجوزة.',
    },
    PER_TRANSFER: {
      badge: 'لكل رحلة',
      label: 'لكل رحلة',
      hint: 'تتبع خدمات النقل سعراً ثابتاً بحسب المسار ونوع المركبة.',
    },
    CUSTOM: {
      badge: 'عرض خاص',
      label: 'تسعير خاص',
      hint: 'تعتمد هذه التجربة على تسعير خاص؛ والمبلغ الظاهر هو مرجع ابتدائي.',
    },
  },
} as const;

export function getPricingMeta(
  mode: PricingMode,
  locale: SupportedLocale
) {
  return PRICING_COPY[locale][mode];
}
