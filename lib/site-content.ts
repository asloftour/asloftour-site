export const locales = ['tr', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const company = {
  brand: 'AS LOF TOUR',
  tagline: 'Private journeys, rare places',
  phoneDisplay: '+90 531 918 51 63',
  phoneIntl: '905319185163',
  email: 'rezervasyon@asloftour.com',
  address: 'Mesihpaşa Mah. Ordu Cad. Kardeşler İş Hanı No: 105 İç Kapı No: 33, Fatih / İstanbul',
  legalName: 'AS LOF TOUR TURİZM ORGANİZASYON VE DANIŞMANLIK HİZMETLERİ LİMİTED ŞİRKETİ',
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isRtl(locale: Locale) {
  return locale === 'ar';
}

export type ExperienceType = 'yacht' | 'stay' | 'balloon' | 'villa' | 'transfer' | 'gastronomy';

type LocalizedText = Record<Locale, string>;

type Experience = {
  id: string;
  type: ExperienceType;
  name: LocalizedText;
  label: LocalizedText;
  location: LocalizedText;
  duration: LocalizedText;
  capacity: LocalizedText;
  price: number;
  image: string;
  description: LocalizedText;
  highlights: Record<Locale, string[]>;
};

export const experiences: Experience[] = [
  {
    id: 'yacht-1',
    type: 'yacht',
    name: { tr: 'Azure Pearl 24M', en: 'Azure Pearl 24M', ar: 'أزور بيرل 24M' },
    label: { tr: 'Yat Kiralama', en: 'Yacht Charter', ar: 'استئجار يخت' },
    location: { tr: 'Bodrum / Yalıkavak', en: 'Bodrum / Yalikavak', ar: 'بودروم / ياليكافاك' },
    duration: { tr: 'Özel günlük kiralama', en: 'Private day charter', ar: 'رحلة خاصة ليوم كامل' },
    capacity: { tr: '12 misafir', en: '12 guests', ar: '12 ضيفًا' },
    price: 185000,
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Gün batımı davetleri, özel kutlamalar ve seçkin deniz günleri için tasarlanmış rafine bir yat deneyimi.',
      en: 'A refined charter option for sunset gatherings, private celebrations and elevated sea days along the Bodrum coast.',
      ar: 'خيار يخت راقٍ لتجارب الغروب والاحتفالات الخاصة والأيام البحرية الهادئة على ساحل بودروم.',
    },
    highlights: {
      tr: ['Özel mürettebat', 'Premium ikram', 'Marina çıkışlı', 'Fotoğraf dostu rota'],
      en: ['Dedicated crew', 'Premium refreshment service', 'Marina departure', 'Photo-friendly route'],
      ar: ['طاقم خاص', 'ضيافة راقية', 'انطلاق من المارينا', 'مسار مناسب للتصوير'],
    },
  },
  {
    id: 'yacht-2',
    type: 'yacht',
    name: { tr: 'Golden Tide 28M', en: 'Golden Tide 28M', ar: 'غولدن تايد 28M' },
    label: { tr: 'Yat Kiralama', en: 'Yacht Charter', ar: 'استئجار يخت' },
    location: { tr: 'Göcek / Fethiye', en: 'Gocek / Fethiye', ar: 'غوجك / فتحية' },
    duration: { tr: 'Tam gün kiralama', en: 'Full-day charter', ar: 'استئجار ليوم كامل' },
    capacity: { tr: '14 misafir', en: '14 guests', ar: '14 ضيفًا' },
    price: 245000,
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Daha geniş güverte düzeni ve güçlü ev sahipliği yapısıyla özel gruplar için daha üst segment bir charter seçeneği.',
      en: 'Designed for polished entertaining, private groups and premium day-at-sea itineraries with a larger footprint.',
      ar: 'خيار أوسع وأكثر فخامة مصمم للمجموعات الخاصة والضيافة الراقية والرحلات البحرية اليومية.',
    },
    highlights: {
      tr: ['Geniş güverte', 'VIP servis', 'Rota planlama', 'Etkinlik uyumu'],
      en: ['Large deck layout', 'VIP hosting', 'Route planning', 'Event-ready setup'],
      ar: ['سطح واسع', 'ضيافة VIP', 'تخطيط المسار', 'مناسب للمناسبات'],
    },
  },
  {
    id: 'yacht-3',
    type: 'yacht',
    name: { tr: 'Royal Horizon 31M', en: 'Royal Horizon 31M', ar: 'رويال هورايزن 31M' },
    label: { tr: 'Yat Kiralama', en: 'Yacht Charter', ar: 'استئجار يخت' },
    location: { tr: 'Marmaris', en: 'Marmaris', ar: 'مرمريس' },
    duration: { tr: 'Günlük / geceleme opsiyonu', en: 'Day charter / overnight option', ar: 'رحلة يومية / خيار مبيت' },
    capacity: { tr: '16 misafir', en: '16 guests', ar: '16 ضيفًا' },
    price: 325000,
    image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Büyük kutlamalar ve daha ayrıcalıklı bir deniz deneyimi arayan misafirler için portföyün en güçlü seçeneklerinden biri.',
      en: 'The statement vessel in the collection, created for larger celebrations and guests seeking a more exclusive day at sea.',
      ar: 'أقوى يخوت المجموعة لمن يبحث عن احتفالات أكبر وتجربة بحرية أكثر خصوصية وتميزًا.',
    },
    highlights: {
      tr: ['Geceleme opsiyonu', 'Özel yemek servisi', 'Geniş alan', 'Yüksek segment deneyim'],
      en: ['Overnight option', 'Private dining', 'Large entertaining areas', 'Top-tier experience'],
      ar: ['خيار مبيت', 'عشاء خاص', 'مساحات واسعة', 'تجربة عالية المستوى'],
    },
  },
  {
    id: 'stay-1',
    type: 'stay',
    name: { tr: 'CLUB FLIPPER Yalıkavak', en: 'CLUB FLIPPER Yalikavak', ar: 'كلوب فليبر ياليكافاك' },
    label: { tr: 'Konaklama', en: 'Resort Stay', ar: 'إقامة منتجعية' },
    location: { tr: 'Bodrum / Yalıkavak', en: 'Bodrum / Yalikavak', ar: 'بودروم / ياليكافاك' },
    duration: { tr: '2 gece / 3 gün', en: '2 nights / 3 days', ar: 'ليلتان / 3 أيام' },
    capacity: { tr: '2–4 misafir', en: '2–4 guests', ar: '2–4 ضيوف' },
    price: 54900,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Yalıkavak’ta denize yakın konum, daha seçkin bir resort atmosferi ve sezonluk partner yapısıyla öne çıkan konaklama seçeneği.',
      en: 'A coastal resort stay in Yalikavak with a stronger seasonal partner profile and a polished leisure atmosphere.',
      ar: 'إقامة منتجعية بالقرب من البحر في ياليكافاك بطابع هادئ وشراكة موسمية مميزة.',
    },
    highlights: {
      tr: ['Sezonluk partner tesis', 'Modern odalar', 'Sahil konumu', 'Ailelere uygun'],
      en: ['Seasonal partner property', 'Modern rooms', 'Coastal location', 'Family-friendly'],
      ar: ['شريك موسمي', 'غرف حديثة', 'موقع ساحلي', 'مناسب للعائلات'],
    },
  },
  {
    id: 'stay-2',
    type: 'stay',
    name: { tr: 'Ege İmza Kaçamağı', en: 'Aegean Signature Escape', ar: 'ملاذ إيجه المميز' },
    label: { tr: 'Konaklama', en: 'Resort Stay', ar: 'إقامة منتجعية' },
    location: { tr: 'Bodrum', en: 'Bodrum', ar: 'بودروم' },
    duration: { tr: '3 gece / 4 gün', en: '3 nights / 4 days', ar: '3 ليال / 4 أيام' },
    capacity: { tr: '2 misafir', en: '2 guests', ar: 'ضيفان' },
    price: 68900,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Özel transfer opsiyonu ve daha rafine bir resort kurgusuyla kısa ama yüksek konforlu kaçamaklar için hazırlandı.',
      en: 'A resort-led short escape with private transfer options and a quieter premium atmosphere.',
      ar: 'إقامة قصيرة راقية مع خيار نقل خاص وأجواء أكثر هدوءًا وفخامة.',
    },
    highlights: {
      tr: ['Kahvaltı dahil', 'Transfer opsiyonu', 'Çiftlere özel', 'Sakin atmosfer'],
      en: ['Breakfast included', 'Transfer option', 'Couples-focused', 'Quiet premium mood'],
      ar: ['إفطار مشمول', 'خيار نقل', 'مثالي للأزواج', 'أجواء هادئة'],
    },
  },
  {
    id: 'stay-3',
    type: 'stay',
    name: { tr: 'Sahil Grand Retreat', en: 'Coastal Grand Retreat', ar: 'الملاذ الساحلي الكبير' },
    label: { tr: 'Konaklama', en: 'Resort Stay', ar: 'إقامة منتجعية' },
    location: { tr: 'Çeşme', en: 'Cesme', ar: 'تشيشمه' },
    duration: { tr: '4 gece / 5 gün', en: '4 nights / 5 days', ar: '4 ليال / 5 أيام' },
    capacity: { tr: '2–3 misafir', en: '2–3 guests', ar: '2–3 ضيوف' },
    price: 82900,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Daha uzun sahil konaklamaları için tasarlanmış, şık sunum dili ve sakin lüks hissi taşıyan yüksek segment bir seçenek.',
      en: 'A more spacious coastal stay for longer escapes with understated luxury and a calm design language.',
      ar: 'إقامة ساحلية أطول بلمسة هادئة وأناقة رفيعة تناسب الباحثين عن الهدوء والراحة.',
    },
    highlights: {
      tr: ['Executive oda', 'Beach access', 'Karşılama desteği', 'Uzun konaklama profili'],
      en: ['Executive room', 'Beach access', 'Arrival assistance', 'Longer stay profile'],
      ar: ['غرفة تنفيذية', 'وصول للشاطئ', 'مساعدة عند الوصول', 'ملائم للإقامات الأطول'],
    },
  },
  {
    id: 'balloon-1',
    type: 'balloon',
    name: { tr: 'Kapadokya Gün Doğumu Klasiği', en: 'Cappadocia Sunrise Classic', ar: 'كلاسيك شروق كابادوكيا' },
    label: { tr: 'Balon Turu', en: 'Balloon Flight', ar: 'رحلة منطاد' },
    location: { tr: 'Kapadokya', en: 'Cappadocia', ar: 'كابادوكيا' },
    duration: { tr: 'Gün doğumu uçuşu', en: 'Sunrise flight', ar: 'رحلة شروق الشمس' },
    capacity: { tr: '1–2 misafir', en: '1–2 guests', ar: '1–2 ضيف' },
    price: 14900,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Kapadokya’nın görsel etkisini güçlü biçimde hissettiren, gün doğumu odaklı imza deneyimlerden biri.',
      en: 'A sunrise flight designed around the dramatic scenery of Cappadocia and its signature visual appeal.',
      ar: 'تجربة شروق شمس فوق كابادوكيا تمنح واحدة من أكثر اللحظات البصرية تميزًا في الرحلة.',
    },
    highlights: {
      tr: ['Sunrise kalkış', 'Transfer opsiyonu', 'İkonik rota', 'Yüksek talep'],
      en: ['Sunrise departure', 'Transfer option', 'Iconic route', 'High-demand experience'],
      ar: ['انطلاق وقت الشروق', 'خيار نقل', 'مسار أيقوني', 'طلب مرتفع'],
    },
  },
  {
    id: 'balloon-2',
    type: 'balloon',
    name: { tr: 'Kapadokya Altın Uçuş', en: 'Cappadocia Gold Flight', ar: 'رحلة كابادوكيا الذهبية' },
    label: { tr: 'Balon Turu', en: 'Balloon Flight', ar: 'رحلة منطاد' },
    location: { tr: 'Kapadokya', en: 'Cappadocia', ar: 'كابادوكيا' },
    duration: { tr: 'VIP uçuş formatı', en: 'VIP flight format', ar: 'صيغة طيران VIP' },
    capacity: { tr: '2 misafir', en: '2 guests', ar: 'ضيفان' },
    price: 26500,
    image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Daha özel ve daha sakin bir uçuş deneyimi arayan misafirler için konumlandırılmış premium balon seçeneği.',
      en: 'A more intimate balloon format for couples and guests seeking privacy and a calmer premium experience.',
      ar: 'خيار منطاد أكثر خصوصية وهدوءًا لمن يبحث عن تجربة أرقى وأكثر حميمية.',
    },
    highlights: {
      tr: ['Daha az yolcu', 'Özel araç opsiyonu', 'Premium format', 'Çiftler için ideal'],
      en: ['Fewer passengers', 'Private vehicle option', 'Premium format', 'Ideal for couples'],
      ar: ['عدد أقل من الركاب', 'خيار سيارة خاصة', 'صيغة راقية', 'مثالي للأزواج'],
    },
  },
  {
    id: 'villa-1',
    type: 'villa',
    name: { tr: 'Deniz Kenarı Özel Villa', en: 'Seaside Private Villa', ar: 'فيلا خاصة على البحر' },
    label: { tr: 'Özel Villa', en: 'Private Villa', ar: 'فيلا خاصة' },
    location: { tr: 'Bodrum', en: 'Bodrum', ar: 'بودروم' },
    duration: { tr: 'Haftalık konaklama', en: 'Weekly stay', ar: 'إقامة أسبوعية' },
    capacity: { tr: '6–8 misafir', en: '6–8 guests', ar: '6–8 ضيوف' },
    price: 245000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Deniz manzaralı özel villa seçeneği; mahremiyet, yüksek konfor ve aile ya da küçük grup konaklamaları için uygun yapı sunar.',
      en: 'A sea-view villa alternative for guests who prefer privacy, larger living space and a more residential luxury format.',
      ar: 'فيلا خاصة بإطلالة بحرية تناسب من يفضلون الخصوصية والمساحة الأوسع وأسلوب الإقامة السكنية الفاخرة.',
    },
    highlights: {
      tr: ['Özel havuz', 'Geniş yaşam alanı', 'Housekeeping opsiyonu', 'Aile ve grup uyumu'],
      en: ['Private pool', 'Generous living space', 'Housekeeping option', 'Family and small-group fit'],
      ar: ['مسبح خاص', 'مساحات واسعة', 'خيار خدمة منزلية', 'مناسب للعائلات والمجموعات'],
    },
  },
  {
    id: 'transfer-1',
    type: 'transfer',
    name: { tr: 'VIP Transfer & Karşılama', en: 'VIP Transfer & Greeting', ar: 'نقل وترحيب VIP' },
    label: { tr: 'VIP Transfer', en: 'VIP Transfer', ar: 'نقل VIP' },
    location: { tr: 'İstanbul / Bodrum / Kapadokya', en: 'Istanbul / Bodrum / Cappadocia', ar: 'إسطنبول / بودروم / كابادوكيا' },
    duration: { tr: 'Tek yön / çift yön', en: 'One-way / round trip', ar: 'اتجاه واحد / ذهاب وإياب' },
    capacity: { tr: '1–6 misafir', en: '1–6 guests', ar: '1–6 ضيوف' },
    price: 9500,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Havalimanı karşılama, özel sürücülü transfer ve deneyime daha akıcı bir başlangıç sağlayan premium ulaşım hizmeti.',
      en: 'A premium mobility service covering airport greeting, chauffeured transfer and a smoother start to the overall itinerary.',
      ar: 'خدمة تنقل راقية تشمل الاستقبال من المطار والنقل الخاص مع سائق وبداية أكثر سلاسة للرحلة.',
    },
    highlights: {
      tr: ['Özel araç', 'Şoförlü transfer', 'Zamanında karşılama', 'Yüksek konfor'],
      en: ['Private vehicle', 'Chauffeured transfer', 'Timed arrival support', 'High comfort'],
      ar: ['سيارة خاصة', 'سائق خاص', 'استقبال منظم', 'راحة عالية'],
    },
  },
  {
    id: 'gastronomy-1',
    type: 'gastronomy',
    name: { tr: 'Özel Gastronomi Rotası', en: 'Private Gastronomy Route', ar: 'مسار فن الطهو الخاص' },
    label: { tr: 'Özel Deneyim', en: 'Private Experience', ar: 'تجربة خاصة' },
    location: { tr: 'İstanbul / Ege', en: 'Istanbul / Aegean Coast', ar: 'إسطنبول / ساحل إيجه' },
    duration: { tr: 'Yarım gün / tam gün', en: 'Half day / full day', ar: 'نصف يوم / يوم كامل' },
    capacity: { tr: '2–8 misafir', en: '2–8 guests', ar: '2–8 ضيوف' },
    price: 18500,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
    description: {
      tr: 'Seçkin restoranlar, özel masa organizasyonları ve destinasyona özel tat duraklarıyla planlanan deneyim odaklı rota.',
      en: 'A curated route built around select restaurants, private table planning and destination-led tasting stops.',
      ar: 'مسار مُنتقى بعناية يضم مطاعم مميزة وحجوزات طاولات خاصة ومحطات تذوق مرتبطة بالوجهة.',
    },
    highlights: {
      tr: ['Özel masa planlaması', 'Yerel lezzet durakları', 'Şoför opsiyonu', 'Kişiye özel kurgu'],
      en: ['Private table planning', 'Local tasting stops', 'Driver option', 'Tailored flow'],
      ar: ['تنسيق طاولات خاصة', 'محطات تذوق محلية', 'خيار سائق', 'برنامج مخصص'],
    },
  },
];

export function formatCurrency(value: number, locale: Locale) {
  const target = locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.NumberFormat(target, {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCategories(locale: Locale) {
  return [
    { id: 'all', label: locale === 'tr' ? 'Tümü' : locale === 'en' ? 'All' : 'الكل' },
    { id: 'yacht', label: locale === 'tr' ? 'Yat Kiralama' : locale === 'en' ? 'Yacht Charter' : 'استئجار اليخوت' },
    { id: 'stay', label: locale === 'tr' ? 'Konaklama' : locale === 'en' ? 'Stays' : 'الإقامة' },
    { id: 'balloon', label: locale === 'tr' ? 'Balon Turları' : locale === 'en' ? 'Balloon Flights' : 'رحلات المنطاد' },
    { id: 'villa', label: locale === 'tr' ? 'Özel Villalar' : locale === 'en' ? 'Private Villas' : 'فلل خاصة' },
    { id: 'transfer', label: locale === 'tr' ? 'VIP Transfer' : locale === 'en' ? 'VIP Transfer' : 'نقل VIP' },
    { id: 'gastronomy', label: locale === 'tr' ? 'Özel Deneyimler' : locale === 'en' ? 'Private Experiences' : 'تجارب خاصة' },
  ] as const;
}

export const dictionaries = {
  tr: {
    nav: {
      home: 'Ana Sayfa',
      experiences: 'Deneyimler',
      booking: 'Rezervasyon',
      payment: 'Ödeme',
      about: 'Hakkımızda',
      contact: 'İletişim',
      policies: 'Bilgiler',
    },
    actions: {
      whatsapp: 'WhatsApp',
      reserve: 'Rezervasyon',
      explore: 'Deneyimleri Keşfet',
      buildPlan: 'Planını Oluştur',
      viewDetails: 'Detayları Gör',
      reserveNow: 'Rezervasyon Oluştur',
      continueToPayment: 'Ödeme Adımına Geç',
      sendWhatsapp: 'WhatsApp ile Gönder',
      confirmPayment: 'Ödemeyi Onayla',
      backToBooking: 'Rezervasyona Dön',
      sendInquiry: 'Talep Gönder',
      openWhatsapp: 'WhatsApp Aç',
    },
    hero: {
      badge: 'Yat kiralama, konaklama ve özel deneyimler',
      title: 'Denizden sahile, seçkin seyahatleri daha rafine bir çizgide sunuyoruz.',
      text: 'AS LOF TOUR; özel yat kiralama, premium konaklama, balon turları ve kişiye özel planlanan seyahat deneyimlerini tek bir seçkin koleksiyon altında bir araya getirir.',
      visualEyebrow: 'Bodrum • Yalıkavak • Göcek • Kapadokya',
      visualTitle: 'Seçkin sahil kaçamakları ve imza deneyimler tek bir koleksiyonda.',
      visualText: 'Kısa ama rafine tatillerden özel yat günlerine, daha mahrem konaklamalardan deneyim odaklı rotalara kadar uzanan bir seçki.',
    },
    home: {
      highlightTitle: 'Öne çıkan hizmetler',
      serviceCards: [
        { title: 'Özel yat deneyimleri', text: 'Günübirlik charter, gün batımı planları ve daha ayrıcalıklı deniz günleri için seçkin seçenekler.' },
        { title: 'Seçkin konaklama', text: 'Sahil resortları, premium kısa tatiller ve daha özel konaklama seçenekleri tek koleksiyonda.' },
        { title: 'Özel villalar', text: 'Daha fazla mahremiyet ve alan arayan misafirler için villa alternatifleri sunulabilir.' },
        { title: 'VIP transfer', text: 'Havalimanı karşılama ve özel şoförlü transfer ile deneyimin her adımı daha akıcı ilerler.' },
      ],
      blocks: {
        title: 'Yalnızca otel ve yat değil',
        items: [
          { title: 'Mavi yolculuk ve charter planları', text: 'Bodrum, Göcek ve Marmaris çıkışlı rotalarla özel deniz günleri veya çok duraklı mavi yolculuk planları hazırlanabilir.' },
          { title: 'Gastronomi ve özel masa rezervasyonları', text: 'Özel akşam yemekleri, şef deneyimleri ve özenle seçilmiş restoran rezervasyonları organize edilebilir.' },
          { title: 'İmza deneyimler', text: 'Balon turları, kutlama günleri, sürpriz planlar ve destinasyona özel deneyimler ayrı bir akışta kurgulanabilir.' },
        ],
      },
      partnerTitle: 'Seçili partner ve portföy',
      partnerItems: [
        { title: 'CLUB FLIPPER — Bodrum / Yalıkavak', text: 'Sezonluk partner yapısı içinde sunulabilecek seçkin resort konaklamalarından biri.' },
        { title: '3 yatlık özel portföy', text: 'Özel deniz deneyimleri için farklı segmentlerde kurgulanmış charter seçenekleri.' },
        { title: 'Transfer ve özel planlama', text: 'Karşılama, araç tahsisi ve deneyim planlaması aynı akışa dahil edilebilir.' },
      ],
    },
    sections: {
      experiencesEyebrow: 'DENEYİMLER',
      experiencesTitle: 'Tek koleksiyon altında tüm seçkin hizmetler',
      experiencesText: 'Yat kiralama, resort konaklamaları, balon turları, villa alternatifleri ve özel hizmetler daha sakin bir görsel dil ve daha net bir seçim akışıyla sunuluyor.',
      bookingEyebrow: 'REZERVASYON',
      bookingTitle: 'Tarih, kişi sayısı ve deneyim tercihinizi bırakın',
      bookingText: 'Deneyiminizi seçin, temel bilgilerinizi iletin ve planınızı oluşturmaya başlayın. Son detaylar ekibimizle birlikte netleştirilir.',
      paymentEyebrow: 'ÖDEME',
      paymentTitle: 'Ödeme ekranı, seçiminizi tek bakışta sunar',
      paymentText: 'Rezervasyon özetinizi gördükten sonra ödeme adımına geçebilir, süreç tamamlandığında hizmet kapsamınızı onaylayabilirsiniz.',
      aboutEyebrow: 'HAKKIMIZDA',
      aboutTitle: 'AS LOF TOUR',
      aboutText: 'Yat kiralama, konaklama, transfer ve özel deneyim planlamasını daha sakin ve seçkin bir çizgide bir araya getirir.',
      contactEyebrow: 'İLETİŞİM',
      contactTitle: 'Bize ulaşın',
      contactText: 'Talebinizi iletin; deneyim kapsamı, tarih ve özel detaylar birlikte netleştirilsin.',
      policiesEyebrow: 'ÖNEMLİ BİLGİLER',
      policiesTitle: 'Rezervasyon öncesi merak edilen temel detaylar',
      policiesText: 'Ödeme, iptal, özel talepler ve rezervasyon akışına dair temel bilgiler rezervasyon öncesinde açık biçimde paylaşılır.',
      faqEyebrow: 'SIKÇA SORULAN SORULAR',
      faqTitle: 'Misafirlerimizin en çok sorduğu sorular',
    },
    booking: {
      selectedExperience: 'Seçilen deneyim',
      selectExperience: 'Deneyim seçin',
      fullName: 'Ad Soyad',
      phone: 'Telefon',
      email: 'E-posta',
      startDate: 'Başlangıç Tarihi',
      endDate: 'Bitiş Tarihi',
      dateRange: 'Tarih Aralığı',
      guests: 'Kişi Sayısı',
      notes: 'Notlar',
      notesPlaceholder: 'Transfer, kutlama planı, masa rezervasyonu veya diğer özel taleplerinizi yazabilirsiniz',
      summary: 'Rezervasyon özeti',
      unitPrice: 'Birim fiyat',
      personCount: 'Kişi sayısı',
      subtotal: 'Ara toplam',
      serviceFee: 'Hizmet bedeli',
      total: 'Toplam',
      summaryText: 'Seçiminiz, tarih tercihiniz ve misafir sayınız doğrultusunda son detaylar netleştirilerek rezervasyon akışı tamamlanır.',
    },
    payment: {
      cardInfo: 'Kart bilgileri',
      cardName: 'Kart üzerindeki ad soyad',
      cardNumber: 'Kart numarası',
      expiry: 'Son kullanma',
      cvv: 'CVV',
      phone: 'Telefon',
      email: 'E-posta',
      text: 'Ödeme canlıya alındığında banka doğrulama ekranı üzerinden güvenli şekilde tamamlanacaktır.',
      summary: 'Ödeme özeti',
      productTotal: 'Ürün toplamı',
      serviceFee: 'Hizmet bedeli',
      amountDue: 'Ödenecek tutar',
      notes: ['Rezervasyon özetiniz ödeme adımında da görünür', 'Onay sonrası süreç ekibimizle hızla netleştirilir', 'Ödeme adımı tek ekranda ve sade biçimde ilerler'],
    },
    about: {
      companyLabel: 'Şirket bilgileri',
      legalName: 'Ticari unvan',
      address: 'Adres',
      approachLabel: 'Yaklaşım',
      approachTitle: 'Deneyim, konfor ve özenli planlama',
      approachText: 'Sahil konaklamaları, private charter, özel villalar, transfer ve destinasyon deneyimleri; ihtiyaç duyulan kapsam kadar sade, gerektiğinde ise daha kapsamlı biçimde planlanabilir.',
      items: ['Yat kiralama', 'Resort konaklama', 'Özel villa alternatifleri', 'Transfer ve deneyim planlaması'],
    },
    contact: {
      formLabel: 'Talep formu',
      formTitle: 'İhtiyacınızı yazın',
      formText: 'Yat kiralama, konaklama, balon turu, villa, transfer veya özel deneyim talebinizi yazabilirsiniz',
      labels: { phone: 'Telefon', email: 'E-posta', address: 'Adres' },
    },
    policies: [
      { title: 'Rezervasyon süreci', text: 'Tarih, kişi sayısı ve deneyim tercihi ile birlikte talep alınır; son onay öncesinde detaylar ekibimiz tarafından netleştirilir.' },
      { title: 'Ödeme', text: 'Ödeme adımı canlıya alındığında banka doğrulamalı güvenli ödeme akışı üzerinden işlem tamamlanacaktır.' },
      { title: 'Özel talepler', text: 'Transfer, kutlama planı, özel masa, rota değişikliği veya kişiye özel hizmetler not alanında belirtilebilir.' },
      { title: 'İptal ve değişiklik', text: 'Hizmet tipine, tarihe ve partner yapısına göre değişen koşullar rezervasyon onayı öncesinde açık şekilde paylaşılır.' },
    ],
    faq: [
      { q: 'Rezervasyon yaptıktan sonra süreç nasıl ilerliyor?', a: 'Talebiniz alındıktan sonra tarih, kişi sayısı, hizmet kapsamı ve varsa özel istekleriniz ekibimiz tarafından netleştirilir; ardından son onay sürecine geçilir.' },
      { q: 'Ödeme tek seferde mi alınıyor?', a: 'Seçilen hizmete göre ön ödeme ya da toplam tutar üzerinden ilerlenebilir. Kesin ödeme yapısı rezervasyon onayı sırasında paylaşılır.' },
      { q: 'Transfer veya ekstra hizmet ekleyebilir miyim?', a: 'Evet. VIP transfer, özel masa planlaması, kutlama kurgusu ve benzeri ek hizmetler rezervasyonunuza dahil edilebilir.' },
      { q: 'Balon, konaklama ve transferi tek rezervasyonda birleştirebilir miyim?', a: 'Evet. Birden fazla hizmet aynı seyahat planı içinde bir araya getirilerek size özel tek bir akış halinde hazırlanabilir.' },
      { q: 'Yat kiralamalarında yemek ve servis dahil mi?', a: 'Seçilen yata ve planlanan deneyime göre ikram, yemek, servis ve rota detayları farklılaşabilir. Tüm kapsam rezervasyon öncesinde netleştirilir.' },
      { q: 'Çocuklu aileler için uygun seçenekler var mı?', a: 'Evet. Konaklama, transfer ve bazı deniz deneyimleri çocuklu ailelerin kullanımına uygun seçeneklerle planlanabilir.' },
    ],
    footer: {
      text: 'Yat kiralama, seçkin konaklama, transfer ve özel deneyim planlaması için tek noktada daha rafine bir seyahat koleksiyonu.',
      sections: 'Bölümler',
      contact: 'İletişim',
    },
  },
  en: {
    nav: { home: 'Home', experiences: 'Experiences', booking: 'Booking', payment: 'Payment', about: 'About', contact: 'Contact', policies: 'Info' },
    actions: { whatsapp: 'WhatsApp', reserve: 'Reserve', explore: 'Explore Experiences', buildPlan: 'Build Your Plan', viewDetails: 'View Details', reserveNow: 'Reserve Now', continueToPayment: 'Continue to Payment', sendWhatsapp: 'Send on WhatsApp', confirmPayment: 'Confirm Payment', backToBooking: 'Back to Booking', sendInquiry: 'Send Inquiry', openWhatsapp: 'Open WhatsApp' },
    hero: {
      badge: 'Yacht charter, stays and private experiences',
      title: 'From sea to shore, refined travel presented through a quieter premium lens.',
      text: 'AS LOF TOUR brings together private yacht charter, premium stays, balloon flights and tailor-made travel experiences under one curated collection.',
      visualEyebrow: 'Bodrum • Yalikavak • Gocek • Cappadocia',
      visualTitle: 'Coastal escapes and signature moments in one collection.',
      visualText: 'From short refined breaks to private yacht days, villa stays and destination-led experiences, the collection is designed to feel polished across every screen.',
    },
    home: {
      highlightTitle: 'Signature services',
      serviceCards: [
        { title: 'Private yacht experiences', text: 'Curated day charters, sunset plans and select sea days for guests seeking a more exclusive rhythm.' },
        { title: 'Premium stays', text: 'Resort stays, short coastal escapes and more private accommodation options in one collection.' },
        { title: 'Private villas', text: 'Villa alternatives for guests who prefer more privacy, more space and a residential luxury format.' },
        { title: 'VIP transfer', text: 'Airport greeting and chauffeured transfer help the journey feel seamless from the first step.' },
      ],
      blocks: {
        title: 'More than hotels and yachts',
        items: [
          { title: 'Blue cruise and charter plans', text: 'Private sea days or multi-stop coastal routes can be created from Bodrum, Gocek and Marmaris.' },
          { title: 'Gastronomy and private table planning', text: 'Private dining, chef-led evenings and carefully selected restaurant reservations can be added to the itinerary.' },
          { title: 'Signature moments', text: 'Balloon flights, celebration planning, surprise touches and destination-specific add-ons can be built into the trip.' },
        ],
      },
      partnerTitle: 'Selected partners and portfolio',
      partnerItems: [
        { title: 'CLUB FLIPPER — Bodrum / Yalikavak', text: 'A featured seasonal resort partner within the premium stay collection.' },
        { title: 'Three-yacht private portfolio', text: 'A curated charter range designed across different levels of entertaining and privacy.' },
        { title: 'Transfer and private planning', text: 'Greeting, transport and experience design can move together within the same itinerary flow.' },
      ],
    },
    sections: {
      experiencesEyebrow: 'EXPERIENCES',
      experiencesTitle: 'A single collection for every premium service line',
      experiencesText: 'Yacht charter, resort stays, balloon flights, villa options and private add-ons are presented through a calmer visual hierarchy and a clearer selection flow.',
      bookingEyebrow: 'BOOKING',
      bookingTitle: 'Share your dates, guest count and preferred experience',
      bookingText: 'Choose the experience, leave your details and start shaping the trip. Final details are clarified with our team before confirmation.',
      paymentEyebrow: 'PAYMENT',
      paymentTitle: 'A payment screen built around your selection',
      paymentText: 'Review the reservation summary, continue to the payment step and complete the final approval once the service scope is confirmed.',
      aboutEyebrow: 'ABOUT',
      aboutTitle: 'AS LOF TOUR',
      aboutText: 'A calmer, more curated approach to yacht charter, stays, private transfer and destination-led planning.',
      contactEyebrow: 'CONTACT',
      contactTitle: 'Get in touch',
      contactText: 'Share your request and let us shape the details around your dates, service scope and personal preferences.',
      policiesEyebrow: 'IMPORTANT INFORMATION',
      policiesTitle: 'Key details before reservation',
      policiesText: 'Payment, cancellation, private requests and reservation flow details are shared clearly before confirmation.',
      faqEyebrow: 'FREQUENTLY ASKED QUESTIONS',
      faqTitle: 'Questions guests ask most often',
    },
    booking: {
      selectedExperience: 'Selected experience', selectExperience: 'Choose an experience', fullName: 'Full name', phone: 'Phone', email: 'Email', startDate: 'Start date', endDate: 'End date', dateRange: 'Date range', guests: 'Guest count', notes: 'Notes', notesPlaceholder: 'You can mention transfer, celebration planning, restaurant reservation or any other private request', summary: 'Reservation summary', unitPrice: 'Unit price', personCount: 'Guests', subtotal: 'Subtotal', serviceFee: 'Service fee', total: 'Total', summaryText: 'Your selection, preferred dates and guest count are reviewed together before the reservation is finalized.',
    },
    payment: {
      cardInfo: 'Card details', cardName: 'Name on card', cardNumber: 'Card number', expiry: 'Expiry date', cvv: 'CVV', phone: 'Phone', email: 'Email', text: 'Once payment goes live, the transaction will be completed through the bank’s secure verification screen.', summary: 'Payment summary', productTotal: 'Product total', serviceFee: 'Service fee', amountDue: 'Amount due', notes: ['Your reservation summary remains visible during checkout', 'The process is finalized quickly after confirmation', 'The payment flow remains simple and discreet on a single screen'],
    },
    about: {
      companyLabel: 'Company details', legalName: 'Legal name', address: 'Address', approachLabel: 'Approach', approachTitle: 'Experience, comfort and considered planning', approachText: 'Coastal stays, private charters, villas, transfers and destination experiences can be planned as simply or as comprehensively as the guest requires.', items: ['Yacht charter', 'Resort stays', 'Private villa options', 'Transfer and experience planning'],
    },
    contact: {
      formLabel: 'Inquiry form', formTitle: 'Tell us what you need', formText: 'You can write about yacht charter, stays, balloon flights, villas, transfers or a private multi-service request.', labels: { phone: 'Phone', email: 'Email', address: 'Address' },
    },
    policies: [
      { title: 'Reservation flow', text: 'Requests are received with date, guest count and experience preference. Final details are clarified before confirmation.' },
      { title: 'Payment', text: 'When payment goes live, the transaction will be completed through a bank-verified secure flow.' },
      { title: 'Private requests', text: 'Transfer, celebration planning, private tables, route adjustments and custom services can be noted during reservation.' },
      { title: 'Cancellation and changes', text: 'Conditions vary by service type, date and partner structure, and are shared clearly before final approval.' },
    ],
    faq: [
      { q: 'What happens after I submit a reservation request?', a: 'We review your dates, guest count, service scope and any private requests, then move forward with the final confirmation details.' },
      { q: 'Is payment collected in one step?', a: 'Depending on the service, we may proceed with a deposit or the full amount. The final structure is shared during confirmation.' },
      { q: 'Can I add transfer or extras?', a: 'Yes. VIP transfer, table planning, celebration design and similar add-ons can be included in your reservation.' },
      { q: 'Can balloon, stay and transfer be combined in one reservation?', a: 'Yes. Multiple services can be combined into a single tailored itinerary.' },
      { q: 'Are food and service included on yacht charters?', a: 'It depends on the selected yacht and the planned format. Inclusions are clarified before the reservation is finalized.' },
      { q: 'Are there options for families with children?', a: 'Yes. Stays, transfers and selected sea experiences can be planned around family-friendly options.' },
    ],
    footer: { text: 'A more refined travel collection for yacht charter, premium stays, private transfer and tailor-made experiences.', sections: 'Sections', contact: 'Contact' },
  },
  ar: {
    nav: { home: 'الرئيسية', experiences: 'التجارب', booking: 'الحجز', payment: 'الدفع', about: 'من نحن', contact: 'اتصل بنا', policies: 'معلومات' },
    actions: { whatsapp: 'واتساب', reserve: 'احجز', explore: 'اكتشف التجارب', buildPlan: 'أنشئ خطتك', viewDetails: 'عرض التفاصيل', reserveNow: 'أنشئ الحجز', continueToPayment: 'الانتقال إلى الدفع', sendWhatsapp: 'إرسال عبر واتساب', confirmPayment: 'تأكيد الدفع', backToBooking: 'العودة إلى الحجز', sendInquiry: 'إرسال الطلب', openWhatsapp: 'فتح واتساب' },
    hero: {
      badge: 'استئجار اليخوت والإقامة والتجارب الخاصة',
      title: 'من البحر إلى الشاطئ، نقدم السفر الراقي ضمن إطار أكثر هدوءًا وأناقة.',
      text: 'يجمع AS LOF TOUR بين استئجار اليخوت الخاصة والإقامات الراقية ورحلات المنطاد وتجارب السفر المصممة خصيصًا ضمن مجموعة واحدة منتقاة بعناية.',
      visualEyebrow: 'بودروم • ياليكافاك • غوجك • كابادوكيا',
      visualTitle: 'الهروب الساحلي واللحظات المميزة في مجموعة واحدة.',
      visualText: 'من الإقامات القصيرة الراقية إلى أيام اليخوت الخاصة والفيلات وتجارب الوجهات، تم تصميم المجموعة لتبدو أنيقة على كل شاشة.',
    },
    home: {
      highlightTitle: 'الخدمات المميزة',
      serviceCards: [
        { title: 'تجارب يخوت خاصة', text: 'رحلات يومية منتقاة وخطط غروب وتجارب بحرية أكثر خصوصية للضيوف الباحثين عن إيقاع أهدأ وأرقى.' },
        { title: 'إقامات راقية', text: 'منتجعات ساحلية وعطلات قصيرة وإقامات أكثر خصوصية ضمن مجموعة واحدة.' },
        { title: 'فلل خاصة', text: 'بدائل مناسبة لمن يفضلون مزيدًا من الخصوصية والمساحة وأسلوب إقامة سكني فاخر.' },
        { title: 'نقل VIP', text: 'الاستقبال من المطار والنقل الخاص يساعدان على جعل الرحلة سلسة من الخطوة الأولى.' },
      ],
      blocks: {
        title: 'أكثر من فنادق ويخوت',
        items: [
          { title: 'خطط الرحلات البحرية الزرقاء', text: 'يمكن تنظيم أيام بحرية خاصة أو مسارات ساحلية متعددة التوقفات من بودروم وغوجك ومرمريس.' },
          { title: 'تجارب الطهي والحجوزات الخاصة', text: 'يمكن إضافة عشاء خاص وتجارب مع الطهاة وحجوزات مطاعم مختارة بعناية إلى الرحلة.' },
          { title: 'لحظات مميزة', text: 'يمكن دمج رحلات المنطاد والتخطيط للاحتفالات والمفاجآت والتجارب المرتبطة بالوجهة داخل الرحلة.' },
        ],
      },
      partnerTitle: 'الشركاء المختارون والمجموعة',
      partnerItems: [
        { title: 'CLUB FLIPPER — بودروم / ياليكافاك', text: 'شريك منتجع موسمي مميز ضمن مجموعة الإقامات الراقية.' },
        { title: 'مجموعة خاصة من ثلاثة يخوت', text: 'مجموعة منتقاة بعناية تناسب درجات مختلفة من الخصوصية والضيافة.' },
        { title: 'النقل والتخطيط الخاص', text: 'يمكن دمج الاستقبال والنقل وتصميم التجربة ضمن مسار واحد متكامل.' },
      ],
    },
    sections: {
      experiencesEyebrow: 'التجارب',
      experiencesTitle: 'مجموعة واحدة لكل الخدمات الراقية',
      experiencesText: 'استئجار اليخوت والإقامات ورحلات المنطاد والفيلات والخدمات الخاصة تُعرض الآن ضمن تسلسل بصري أهدأ ومسار اختيار أوضح.',
      bookingEyebrow: 'الحجز',
      bookingTitle: 'شاركنا التاريخ وعدد الضيوف والتجربة المفضلة',
      bookingText: 'اختر التجربة واترك بياناتك وابدأ في تشكيل الرحلة. يتم توضيح التفاصيل النهائية مع فريقنا قبل التأكيد.',
      paymentEyebrow: 'الدفع',
      paymentTitle: 'واجهة دفع مبنية حول اختيارك',
      paymentText: 'راجع ملخص الحجز ثم انتقل إلى خطوة الدفع وأكمل الموافقة النهائية بعد تأكيد نطاق الخدمة.',
      aboutEyebrow: 'من نحن',
      aboutTitle: 'AS LOF TOUR',
      aboutText: 'مقاربة أكثر هدوءًا وانتقاءً لاستئجار اليخوت والإقامات والنقل الخاص والتخطيط المرتبط بالوجهة.',
      contactEyebrow: 'اتصل بنا',
      contactTitle: 'تواصل معنا',
      contactText: 'شاركنا طلبك ودعنا نصوغ التفاصيل حول تاريخك ونطاق الخدمة وتفضيلاتك الشخصية.',
      policiesEyebrow: 'معلومات مهمة',
      policiesTitle: 'تفاصيل أساسية قبل الحجز',
      policiesText: 'يتم توضيح تفاصيل الدفع والإلغاء والطلبات الخاصة ومسار الحجز بوضوح قبل التأكيد.',
      faqEyebrow: 'الأسئلة الشائعة',
      faqTitle: 'الأسئلة الأكثر شيوعًا من الضيوف',
    },
    booking: {
      selectedExperience: 'التجربة المختارة', selectExperience: 'اختر تجربة', fullName: 'الاسم الكامل', phone: 'الهاتف', email: 'البريد الإلكتروني', startDate: 'تاريخ البداية', endDate: 'تاريخ النهاية', dateRange: 'نطاق التاريخ', guests: 'عدد الضيوف', notes: 'ملاحظات', notesPlaceholder: 'يمكنك ذكر النقل أو التخطيط للاحتفال أو حجز الطاولة أو أي طلب خاص آخر', summary: 'ملخص الحجز', unitPrice: 'سعر الوحدة', personCount: 'عدد الضيوف', subtotal: 'الإجمالي الفرعي', serviceFee: 'رسوم الخدمة', total: 'الإجمالي', summaryText: 'تتم مراجعة اختيارك والتواريخ المفضلة وعدد الضيوف معًا قبل إنهاء الحجز.',
    },
    payment: {
      cardInfo: 'بيانات البطاقة', cardName: 'الاسم على البطاقة', cardNumber: 'رقم البطاقة', expiry: 'تاريخ الانتهاء', cvv: 'CVV', phone: 'الهاتف', email: 'البريد الإلكتروني', text: 'عند تفعيل الدفع سيتم إكمال العملية عبر شاشة التحقق الآمنة الخاصة بالبنك.', summary: 'ملخص الدفع', productTotal: 'إجمالي الخدمة', serviceFee: 'رسوم الخدمة', amountDue: 'المبلغ المستحق', notes: ['يبقى ملخص الحجز ظاهرًا أثناء الدفع', 'يتم استكمال العملية بسرعة بعد التأكيد', 'تدفق الدفع بسيط وواضح على شاشة واحدة'],
    },
    about: {
      companyLabel: 'بيانات الشركة', legalName: 'الاسم القانوني', address: 'العنوان', approachLabel: 'المنهج', approachTitle: 'تجربة وراحة وتخطيط مدروس', approachText: 'يمكن التخطيط للإقامات الساحلية واليخوت الخاصة والفيلات والنقل والتجارب المرتبطة بالوجهة ببساطة أو بتفصيل أكبر حسب ما يحتاجه الضيف.', items: ['استئجار اليخوت', 'إقامات منتجعية', 'خيارات الفلل الخاصة', 'النقل وتخطيط التجارب'],
    },
    contact: {
      formLabel: 'نموذج الطلب', formTitle: 'أخبرنا بما تحتاجه', formText: 'يمكنك الكتابة عن استئجار اليخوت أو الإقامة أو رحلات المنطاد أو الفيلات أو النقل أو طلب خاص متعدد الخدمات.', labels: { phone: 'الهاتف', email: 'البريد الإلكتروني', address: 'العنوان' },
    },
    policies: [
      { title: 'مسار الحجز', text: 'يتم استلام الطلب مع التاريخ وعدد الضيوف والتجربة المطلوبة، ثم توضيح التفاصيل النهائية قبل التأكيد.' },
      { title: 'الدفع', text: 'عند تفعيل الدفع سيتم إكمال العملية من خلال مسار آمن موثّق من البنك.' },
      { title: 'الطلبات الخاصة', text: 'يمكن إضافة النقل والتخطيط للاحتفال والطاولات الخاصة وتعديلات المسار والخدمات المخصصة أثناء الحجز.' },
      { title: 'الإلغاء والتعديلات', text: 'تختلف الشروط حسب نوع الخدمة والتاريخ والشريك، ويتم توضيحها بوضوح قبل الموافقة النهائية.' },
    ],
    faq: [
      { q: 'ماذا يحدث بعد إرسال طلب الحجز؟', a: 'نراجع التاريخ وعدد الضيوف ونطاق الخدمة وأي طلبات خاصة ثم ننتقل إلى تفاصيل التأكيد النهائي.' },
      { q: 'هل يتم تحصيل الدفع دفعة واحدة؟', a: 'بحسب الخدمة قد يتم التحصيل كمقدم أو كمبلغ كامل. يتم توضيح الهيكل النهائي أثناء التأكيد.' },
      { q: 'هل يمكن إضافة النقل أو خدمات إضافية؟', a: 'نعم، يمكن إضافة نقل VIP أو تخطيط الطاولات أو تنسيق الاحتفالات وخدمات مشابهة إلى حجزك.' },
      { q: 'هل يمكن دمج المنطاد والإقامة والنقل في حجز واحد؟', a: 'نعم، يمكن جمع عدة خدمات ضمن برنامج واحد مصمم خصيصًا لك.' },
      { q: 'هل يشمل استئجار اليخت الطعام والخدمة؟', a: 'يعتمد ذلك على اليخت المختار وطبيعة التجربة. يتم توضيح كل ما هو مشمول قبل إنهاء الحجز.' },
      { q: 'هل توجد خيارات مناسبة للعائلات مع الأطفال؟', a: 'نعم، يمكن التخطيط للإقامات والنقل وبعض التجارب البحرية بما يتناسب مع العائلات.' },
    ],
    footer: { text: 'مجموعة سفر أكثر رقيًا لاستئجار اليخوت والإقامات الراقية والنقل الخاص والتجارب المصممة خصيصًا.', sections: 'الأقسام', contact: 'اتصل بنا' },
  },
} as const;


export function formatDisplayDate(value: string, locale: Locale) {
  if (!value) return '—';
  const target = locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.DateTimeFormat(target, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function dateDiffInDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return Math.max(diff, 1);
}

export function getChargeUnits(type: ExperienceType, startDate: string, endDate: string) {
  if (type === 'stay') {
    return dateDiffInDays(startDate, endDate);
  }
  if (type === 'villa') {
    return Math.max(Math.ceil(dateDiffInDays(startDate, endDate) / 7), 1);
  }
  return 1;
}

export function getChargeLabel(locale: Locale, type: ExperienceType, units: number) {
  if (type === 'stay') {
    return locale === 'tr'
      ? `${units} gece`
      : locale === 'en'
        ? `${units} night${units > 1 ? 's' : ''}`
        : `${units} ليلة`;
  }
  if (type === 'villa') {
    return locale === 'tr'
      ? `${units} hafta`
      : locale === 'en'
        ? `${units} week${units > 1 ? 's' : ''}`
        : `${units} أسبوع`;
  }
  return locale === 'tr' ? 'Tek deneyim' : locale === 'en' ? 'Single experience' : 'تجربة واحدة';
}

export function getUnitPriceLabel(locale: Locale, type: ExperienceType) {
  if (type === 'stay') return locale === 'tr' ? 'Gecelik fiyat' : locale === 'en' ? 'Nightly rate' : 'السعر لليلة';
  if (type === 'villa') return locale === 'tr' ? 'Haftalık fiyat' : locale === 'en' ? 'Weekly rate' : 'السعر الأسبوعي';
  return locale === 'tr' ? 'Birim fiyat' : locale === 'en' ? 'Unit price' : 'سعر الوحدة';
}

export function getDateSummaryLabel(locale: Locale, type: ExperienceType) {
  if (type === 'stay') return locale === 'tr' ? 'Konaklama süresi' : locale === 'en' ? 'Length of stay' : 'مدة الإقامة';
  if (type === 'villa') return locale === 'tr' ? 'Villa süresi' : locale === 'en' ? 'Villa stay length' : 'مدة إقامة الفيلا';
  return locale === 'tr' ? 'Tarih' : locale === 'en' ? 'Preferred date' : 'التاريخ';
}

export function getDateRangeLabel(locale: Locale, startDate: string, endDate: string) {
  if (!startDate && !endDate) return '—';
  if (!endDate || startDate === endDate) return formatDisplayDate(startDate || endDate, locale);
  return `${formatDisplayDate(startDate, locale)} — ${formatDisplayDate(endDate, locale)}`;
}

export function getSupportsDateRange(type: ExperienceType) {
  return type === 'stay' || type === 'villa';
}

export function getDefaultGuestCount(type: ExperienceType) {
  return type === 'villa' ? 4 : type === 'stay' ? 2 : 2;
}

export function getMaxGuestCount(type: ExperienceType) {
  const maxGuestsByType = {
    yacht: 16,
    stay: 8,
    balloon: 4,
    villa: 8,
    transfer: 6,
    gastronomy: 8,
  } as const;
  return maxGuestsByType[type];
}

export function getDateRangeCopy(locale: Locale, type: ExperienceType) {
  if (type === 'stay') {
    return locale === 'tr'
      ? { start: 'Giriş Tarihi', end: 'Çıkış Tarihi' }
      : locale === 'en'
        ? { start: 'Check-in', end: 'Check-out' }
        : { start: 'تاريخ الوصول', end: 'تاريخ المغادرة' };
  }
  if (type === 'villa') {
    return locale === 'tr'
      ? { start: 'Başlangıç Tarihi', end: 'Bitiş Tarihi' }
      : locale === 'en'
        ? { start: 'Start date', end: 'End date' }
        : { start: 'تاريخ البداية', end: 'تاريخ النهاية' };
  }
  return locale === 'tr'
    ? { start: 'Tarih', end: 'Tarih' }
    : locale === 'en'
      ? { start: 'Preferred date', end: 'Preferred date' }
      : { start: 'التاريخ', end: 'التاريخ' };
}

export function getInitialEndDate(type: ExperienceType, startDate: string) {
  if (!startDate) return '';
  const start = new Date(startDate);
  if (type === 'stay') {
    start.setDate(start.getDate() + 1);
    return start.toISOString().split('T')[0];
  }
  if (type === 'villa') {
    start.setDate(start.getDate() + 7);
    return start.toISOString().split('T')[0];
  }
  return startDate;
}

export function getMinEndDate(type: ExperienceType, startDate: string, today: string) {
  if (!startDate) return today;
  return type === 'stay' || type === 'villa' ? startDate : startDate;
}

export function getBookingQuery(params: { locale: Locale; experienceId: string; guests: number; startDate?: string; endDate?: string }) {
  const search = new URLSearchParams();
  search.set('experience', params.experienceId);
  search.set('guests', String(params.guests));
  if (params.startDate) search.set('start', params.startDate);
  if (params.endDate) search.set('end', params.endDate);
  return `/${params.locale}/payment?${search.toString()}`;
}

export function getReturnBookingQuery(params: { locale: Locale; experienceId: string; guests: number; startDate?: string; endDate?: string }) {
  const search = new URLSearchParams();
  search.set('experience', params.experienceId);
  search.set('guests', String(params.guests));
  if (params.startDate) search.set('start', params.startDate);
  if (params.endDate) search.set('end', params.endDate);
  return `/${params.locale}/booking?${search.toString()}`;
}

export function getGuestPricingMode(type: ExperienceType) {
  return type === 'balloon' || type === 'gastronomy' ? 'perGuest' : 'perBooking';
}

export function getTotalPrice(params: { type: ExperienceType; basePrice: number; guests: number; startDate: string; endDate: string }) {
  const units = getChargeUnits(params.type, params.startDate, params.endDate);
  const guestMultiplier = getGuestPricingMode(params.type) === 'perGuest' ? params.guests : 1;
  const subtotal = params.basePrice * units * guestMultiplier;
  const serviceFee = Math.round(subtotal * 0.06);
  const total = subtotal + serviceFee;
  return { units, subtotal, serviceFee, total };
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getExperienceById(id: string) {
  return experiences.find((item) => item.id === id) ?? experiences[0];
}

export function localizedExperience(locale: Locale, item: Experience) {
  return {
    ...item,
    name: item.name[locale],
    label: item.label[locale],
    location: item.location[locale],
    duration: item.duration[locale],
    capacity: item.capacity[locale],
    description: item.description[locale],
    highlights: item.highlights[locale],
  };
}
