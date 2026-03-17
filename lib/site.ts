import { AppLocale } from '@/i18n/routing';

export const company = {
  name: 'AS LOF TOUR',
  slogan: 'Private journeys, rare places',
  legalName: 'AS LOF TOUR TURİZM ORGANİZASYON VE DANIŞMANLIK HİZMETLERİ LİMİTED ŞİRKETİ',
  address: 'Mesihpaşa Mah. Ordu Cad. Kardeşler İş Hanı No: 105 İç Kapı No: 33, Fatih / İstanbul',
  phone: '+90 531 918 51 63',
  email: 'asloftour@gmail.com'
};

export const localeLabels: Record<AppLocale, string> = {
  tr: 'TR',
  en: 'EN',
  ar: 'AR'
};

export const experienceCategories = {
  YACHT: { tr: 'Yat Charter', en: 'Yacht Charter', ar: 'يخت خاص' },
  ACCOMMODATION: { tr: 'Konaklama', en: 'Accommodation', ar: 'إقامة' },
  BALLOON: { tr: 'Balon Uçuşu', en: 'Balloon Flight', ar: 'رحلة منطاد' },
  VILLA: { tr: 'Özel Villa', en: 'Private Villa', ar: 'فيلا خاصة' },
  VIP_TRANSFER: { tr: 'VIP Transfer', en: 'VIP Transfer', ar: 'نقل فاخر' },
  GASTRONOMY: { tr: 'Gastronomi Rotası', en: 'Gastronomy Route', ar: 'مسار تذوق' },
  CUSTOM: { tr: 'Özel Deneyim', en: 'Bespoke Experience', ar: 'تجربة مخصصة' }
} as const;
