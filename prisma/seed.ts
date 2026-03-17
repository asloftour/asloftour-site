
import bcrypt from 'bcryptjs';
import { PrismaClient, PricingMode, ExperienceCategory, LegalDocumentType, PaymentProvider } from '@prisma/client';

const prisma = new PrismaClient();

const legalTemplates = {
  "tr": {
    "PRIVACY": [
      "KVKK Aydınlatma Metni",
      "<h2>Kişisel verilerin korunması</h2><p>AS LOF TOUR, rezervasyon ve ödeme süreçlerinde paylaşılan kişisel verileri yalnızca hizmet sunumu, operasyon koordinasyonu, muhasebe yükümlülükleri ve yasal gereklilikler kapsamında işler.</p><p>İletişim ve rezervasyon formlarından toplanan veriler güvenli veri tabanı kayıtları ile saklanır. İlgili mevzuat kapsamındaki haklarınızı kayıtlı e-posta veya yazılı başvuru yoluyla kullanabilirsiniz.</p>"
    ],
    "COOKIES": [
      "Çerez Politikası",
      "<h2>Çerez kullanımı</h2><p>Site performansı, dil tercihi ve oturum güvenliği için zorunlu çerezler kullanılır. Zorunlu olmayan çerezler açık rıza olmadan etkinleştirilmez.</p>"
    ],
    "DISTANCE_SALES": [
      "Mesafeli Satış Koşulları",
      "<h2>Mesafeli satış</h2><p>Web sitesi üzerinden oluşturulan rezervasyonlar, ön bilgilendirme, hizmet sözleşmesi ve iptal/iade koşullarının onaylanmasının ardından işleme alınır. Tedarikçi kuralları ve hizmet kapsamı ödeme öncesinde rezervasyon özeti ile görünür durumdadır.</p>"
    ],
    "CANCELLATION_REFUND": [
      "İptal / İade / Değişiklik",
      "<h2>İptal ve değişiklik</h2><p>İptal ve değişiklik talepleri, hizmet türü, tedarikçi kuralı ve hizmete kalan süre dikkate alınarak değerlendirilir. İade doğması halinde süreç ödeme yöntemi ve finansal kuruluş kurallarına göre sonuçlandırılır.</p>"
    ],
    "PRE_INFORMATION": [
      "Ön Bilgilendirme Formu",
      "<h2>Satın alma öncesi bilgi</h2><p>Satın alınan hizmetin kapsamı, başlangıç fiyatı, ödeme yöntemi ve iptal koşulları ödeme öncesinde erişilebilir durumda sunulur.</p>"
    ],
    "SERVICE_AGREEMENT": [
      "Hizmet Sözleşmesi",
      "<h2>Hizmet çerçevesi</h2><p>AS LOF TOUR, teyit edilen rezervasyon kapsamında seyahat organizasyonu, tedarik koordinasyonu ve operasyon takibini yürütür. Hava koşulları, resmi kısıtlar veya mücbir sebepler aynı kalite seviyesinde alternatif yönetim yaklaşımı ile ele alınır.</p>"
    ],
    "POLICIES": [
      "Politikalar",
      "<h2>Politika özeti</h2><p>Gizlilik, çerez, ön bilgilendirme, mesafeli satış ve hizmet sözleşmesi metinleri bu alanda birlikte sunulur.</p>"
    ]
  },
  "en": {
    "PRIVACY": [
      "Privacy Policy",
      "<h2>Protection of personal data</h2><p>AS LOF TOUR processes personal data only for reservation handling, payment processing, service fulfilment, accounting obligations and legal compliance.</p>"
    ],
    "COOKIES": [
      "Cookie Policy",
      "<h2>Cookie use</h2><p>Necessary cookies support session security, language preference and platform stability. Non-essential cookies are not activated without consent.</p>"
    ],
    "DISTANCE_SALES": [
      "Distance Sales Terms",
      "<h2>Distance sales</h2><p>Reservations created online move into operation after guests review pre-information, service terms and cancellation rules.</p>"
    ],
    "CANCELLATION_REFUND": [
      "Cancellation / Refund / Change",
      "<h2>Cancellation and change</h2><p>Cancellation and amendment requests are assessed according to service type, supplier rules and the timing before delivery.</p>"
    ],
    "PRE_INFORMATION": [
      "Pre-Information Form",
      "<h2>Before purchase</h2><p>The scope of service, base pricing, payment options and cancellation terms are made available before payment completion.</p>"
    ],
    "SERVICE_AGREEMENT": [
      "Service Agreement",
      "<h2>Service framework</h2><p>AS LOF TOUR coordinates confirmed travel services, supplier alignment and operational follow-through for approved reservations.</p>"
    ],
    "POLICIES": [
      "Policies",
      "<h2>Policy overview</h2><p>Privacy, cookies, pre-information, distance sales and service agreement texts are grouped under this policy hub.</p>"
    ]
  },
  "ar": {
    "PRIVACY": [
      "سياسة الخصوصية",
      "<h2>حماية البيانات الشخصية</h2><p>تعالج AS LOF TOUR البيانات الشخصية لأغراض الحجز والدفع وتنفيذ الخدمة والالتزامات المحاسبية والامتثال القانوني فقط.</p>"
    ],
    "COOKIES": [
      "سياسة ملفات تعريف الارتباط",
      "<h2>استخدام ملفات الارتباط</h2><p>تُستخدم ملفات الارتباط الضرورية لأمان الجلسة وحفظ اللغة واستقرار المنصة. لا يتم تفعيل ملفات الارتباط غير الضرورية دون موافقة.</p>"
    ],
    "DISTANCE_SALES": [
      "شروط البيع عن بُعد",
      "<h2>البيع عن بُعد</h2><p>تتحول الحجوزات الإلكترونية إلى التنفيذ بعد مراجعة معلومات ما قبل الشراء وشروط الخدمة وسياسة الإلغاء.</p>"
    ],
    "CANCELLATION_REFUND": [
      "الإلغاء والاسترداد والتعديل",
      "<h2>الإلغاء والتعديل</h2><p>تُقيّم طلبات الإلغاء أو التعديل وفق نوع الخدمة وشروط المورد والفترة المتبقية قبل التنفيذ.</p>"
    ],
    "PRE_INFORMATION": [
      "نموذج المعلومات المسبقة",
      "<h2>قبل الشراء</h2><p>يتم عرض نطاق الخدمة والسعر الأساسي وطرق الدفع وشروط الإلغاء قبل إتمام الدفع.</p>"
    ],
    "SERVICE_AGREEMENT": [
      "اتفاقية الخدمة",
      "<h2>إطار الخدمة</h2><p>تتولى AS LOF TOUR تنسيق خدمات السفر المؤكدة ومتابعة التنفيذ التشغيلي للحجوزات المعتمدة.</p>"
    ],
    "POLICIES": [
      "السياسات",
      "<h2>نظرة عامة على السياسات</h2><p>تجتمع نصوص الخصوصية وملفات الارتباط والمعلومات المسبقة وشروط البيع واتفاقية الخدمة في هذا القسم.</p>"
    ]
  }
} as const;

const experiences = [
  {
    "category": "YACHT",
    "location": "Bodrum",
    "pricingMode": "PER_BOOKING",
    "basePrice": 145000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 12,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-01.svg",
      "/images/experiences/exp-01-detail.svg"
    ],
    "translations": {
      "TR": [
        "Azure Pearl 24M",
        "azure-pearl-24m",
        "Bodrum çıkışlı özel charter deneyimi.",
        "Azure Pearl 24M, Bodrum kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Azure Pearl 24M | AS LOF TOUR",
        "Bodrum çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Azure Pearl 24M",
        "azure-pearl-24m",
        "Private charter experience departing from Bodrum.",
        "Azure Pearl 24M is a refined yacht charter in Bodrum with private boarding, polished service and a carefully paced route plan.",
        "Azure Pearl 24M | AS LOF TOUR",
        "Private charter experience departing from Bodrum."
      ],
      "AR": [
        "Azure Pearl 24M",
        "azure-pearl-24m",
        "تجربة يخت خاص تنطلق من بودروم.",
        "Azure Pearl 24M هو خيار يخت فاخر في بودروم مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Azure Pearl 24M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من بودروم."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Göcek",
    "pricingMode": "PER_BOOKING",
    "basePrice": 198000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 14,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-02.svg",
      "/images/experiences/exp-02-detail.svg"
    ],
    "translations": {
      "TR": [
        "Golden Tide 28M",
        "golden-tide-28m",
        "Göcek çıkışlı özel charter deneyimi.",
        "Golden Tide 28M, Göcek kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Golden Tide 28M | AS LOF TOUR",
        "Göcek çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Golden Tide 28M",
        "golden-tide-28m",
        "Private charter experience departing from Göcek.",
        "Golden Tide 28M is a refined yacht charter in Göcek with private boarding, polished service and a carefully paced route plan.",
        "Golden Tide 28M | AS LOF TOUR",
        "Private charter experience departing from Göcek."
      ],
      "AR": [
        "Golden Tide 28M",
        "golden-tide-28m",
        "تجربة يخت خاص تنطلق من جوتشيك.",
        "Golden Tide 28M هو خيار يخت فاخر في جوتشيك مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Golden Tide 28M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من جوتشيك."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Yalıkavak",
    "pricingMode": "PER_BOOKING",
    "basePrice": 260000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 16,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-03.svg",
      "/images/experiences/exp-03-detail.svg"
    ],
    "translations": {
      "TR": [
        "Royal Horizon 31M",
        "royal-horizon-31m",
        "Yalıkavak çıkışlı özel charter deneyimi.",
        "Royal Horizon 31M, Yalıkavak kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Royal Horizon 31M | AS LOF TOUR",
        "Yalıkavak çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Royal Horizon 31M",
        "royal-horizon-31m",
        "Private charter experience departing from Yalıkavak.",
        "Royal Horizon 31M is a refined yacht charter in Yalıkavak with private boarding, polished service and a carefully paced route plan.",
        "Royal Horizon 31M | AS LOF TOUR",
        "Private charter experience departing from Yalıkavak."
      ],
      "AR": [
        "Royal Horizon 31M",
        "royal-horizon-31m",
        "تجربة يخت خاص تنطلق من ياليكافاك.",
        "Royal Horizon 31M هو خيار يخت فاخر في ياليكافاك مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Royal Horizon 31M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من ياليكافاك."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "İstanbul",
    "pricingMode": "PER_BOOKING",
    "basePrice": 118000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-04.svg",
      "/images/experiences/exp-04-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bosphorus Signature Cruise",
        "bosphorus-signature-cruise",
        "İstanbul çıkışlı özel charter deneyimi.",
        "Bosphorus Signature Cruise, İstanbul kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Bosphorus Signature Cruise | AS LOF TOUR",
        "İstanbul çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Bosphorus Signature Cruise",
        "bosphorus-signature-cruise",
        "Private charter experience departing from İstanbul.",
        "Bosphorus Signature Cruise is a refined yacht charter in İstanbul with private boarding, polished service and a carefully paced route plan.",
        "Bosphorus Signature Cruise | AS LOF TOUR",
        "Private charter experience departing from İstanbul."
      ],
      "AR": [
        "Bosphorus Signature Cruise",
        "bosphorus-signature-cruise",
        "تجربة يخت خاص تنطلق من إسطنبول.",
        "Bosphorus Signature Cruise هو خيار يخت فاخر في إسطنبول مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Bosphorus Signature Cruise | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من إسطنبول."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Marmaris",
    "pricingMode": "PER_BOOKING",
    "basePrice": 162000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 12,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-05.svg",
      "/images/experiences/exp-05-detail.svg"
    ],
    "translations": {
      "TR": [
        "Moonwake 26M",
        "moonwake-26m",
        "Marmaris çıkışlı özel charter deneyimi.",
        "Moonwake 26M, Marmaris kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Moonwake 26M | AS LOF TOUR",
        "Marmaris çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Moonwake 26M",
        "moonwake-26m",
        "Private charter experience departing from Marmaris.",
        "Moonwake 26M is a refined yacht charter in Marmaris with private boarding, polished service and a carefully paced route plan.",
        "Moonwake 26M | AS LOF TOUR",
        "Private charter experience departing from Marmaris."
      ],
      "AR": [
        "Moonwake 26M",
        "moonwake-26m",
        "تجربة يخت خاص تنطلق من مرماريس.",
        "Moonwake 26M هو خيار يخت فاخر في مرماريس مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Moonwake 26M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من مرماريس."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Göcek",
    "pricingMode": "PER_BOOKING",
    "basePrice": 275000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 16,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-06.svg",
      "/images/experiences/exp-06-detail.svg"
    ],
    "translations": {
      "TR": [
        "Celeste Mare 32M",
        "celeste-mare-32m",
        "Göcek çıkışlı özel charter deneyimi.",
        "Celeste Mare 32M, Göcek kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Celeste Mare 32M | AS LOF TOUR",
        "Göcek çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Celeste Mare 32M",
        "celeste-mare-32m",
        "Private charter experience departing from Göcek.",
        "Celeste Mare 32M is a refined yacht charter in Göcek with private boarding, polished service and a carefully paced route plan.",
        "Celeste Mare 32M | AS LOF TOUR",
        "Private charter experience departing from Göcek."
      ],
      "AR": [
        "Celeste Mare 32M",
        "celeste-mare-32m",
        "تجربة يخت خاص تنطلق من جوتشيك.",
        "Celeste Mare 32M هو خيار يخت فاخر في جوتشيك مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Celeste Mare 32M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من جوتشيك."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Fethiye",
    "pricingMode": "PER_BOOKING",
    "basePrice": 171000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 12,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-07.svg",
      "/images/experiences/exp-07-detail.svg"
    ],
    "translations": {
      "TR": [
        "Aegean Reverie 27M",
        "aegean-reverie-27m",
        "Fethiye çıkışlı özel charter deneyimi.",
        "Aegean Reverie 27M, Fethiye kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Aegean Reverie 27M | AS LOF TOUR",
        "Fethiye çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Aegean Reverie 27M",
        "aegean-reverie-27m",
        "Private charter experience departing from Fethiye.",
        "Aegean Reverie 27M is a refined yacht charter in Fethiye with private boarding, polished service and a carefully paced route plan.",
        "Aegean Reverie 27M | AS LOF TOUR",
        "Private charter experience departing from Fethiye."
      ],
      "AR": [
        "Aegean Reverie 27M",
        "aegean-reverie-27m",
        "تجربة يخت خاص تنطلق من فتحية.",
        "Aegean Reverie 27M هو خيار يخت فاخر في فتحية مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Aegean Reverie 27M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من فتحية."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Yalıkavak",
    "pricingMode": "PER_BOOKING",
    "basePrice": 224000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 14,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-08.svg",
      "/images/experiences/exp-08-detail.svg"
    ],
    "translations": {
      "TR": [
        "Marina Noir 29M",
        "marina-noir-29m",
        "Yalıkavak çıkışlı özel charter deneyimi.",
        "Marina Noir 29M, Yalıkavak kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Marina Noir 29M | AS LOF TOUR",
        "Yalıkavak çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Marina Noir 29M",
        "marina-noir-29m",
        "Private charter experience departing from Yalıkavak.",
        "Marina Noir 29M is a refined yacht charter in Yalıkavak with private boarding, polished service and a carefully paced route plan.",
        "Marina Noir 29M | AS LOF TOUR",
        "Private charter experience departing from Yalıkavak."
      ],
      "AR": [
        "Marina Noir 29M",
        "marina-noir-29m",
        "تجربة يخت خاص تنطلق من ياليكافاك.",
        "Marina Noir 29M هو خيار يخت فاخر في ياليكافاك مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Marina Noir 29M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من ياليكافاك."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "Bodrum",
    "pricingMode": "PER_BOOKING",
    "basePrice": 154000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-09.svg",
      "/images/experiences/exp-09-detail.svg"
    ],
    "translations": {
      "TR": [
        "Dolce Riva 25M",
        "dolce-riva-25m",
        "Bodrum çıkışlı özel charter deneyimi.",
        "Dolce Riva 25M, Bodrum kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Dolce Riva 25M | AS LOF TOUR",
        "Bodrum çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Dolce Riva 25M",
        "dolce-riva-25m",
        "Private charter experience departing from Bodrum.",
        "Dolce Riva 25M is a refined yacht charter in Bodrum with private boarding, polished service and a carefully paced route plan.",
        "Dolce Riva 25M | AS LOF TOUR",
        "Private charter experience departing from Bodrum."
      ],
      "AR": [
        "Dolce Riva 25M",
        "dolce-riva-25m",
        "تجربة يخت خاص تنطلق من بودروم.",
        "Dolce Riva 25M هو خيار يخت فاخر في بودروم مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Dolce Riva 25M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من بودروم."
      ]
    }
  },
  {
    "category": "YACHT",
    "location": "İstanbul",
    "pricingMode": "PER_BOOKING",
    "basePrice": 205000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 14,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Private boarding coordination",
      "On-board service team",
      "Sunset route pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-10.svg",
      "/images/experiences/exp-10-detail.svg"
    ],
    "translations": {
      "TR": [
        "Serenity Deck 30M",
        "serenity-deck-30m",
        "İstanbul çıkışlı özel charter deneyimi.",
        "Serenity Deck 30M, İstanbul kıyılarında özel boarding, servis ekibi ve kontrollü rota planlamasıyla sunulan rafine bir yat charter seçeneğidir.",
        "Serenity Deck 30M | AS LOF TOUR",
        "İstanbul çıkışlı özel charter deneyimi."
      ],
      "EN": [
        "Serenity Deck 30M",
        "serenity-deck-30m",
        "Private charter experience departing from İstanbul.",
        "Serenity Deck 30M is a refined yacht charter in İstanbul with private boarding, polished service and a carefully paced route plan.",
        "Serenity Deck 30M | AS LOF TOUR",
        "Private charter experience departing from İstanbul."
      ],
      "AR": [
        "Serenity Deck 30M",
        "serenity-deck-30m",
        "تجربة يخت خاص تنطلق من إسطنبول.",
        "Serenity Deck 30M هو خيار يخت فاخر في إسطنبول مع صعود خاص وخدمة راقية ومسار مدروس بعناية.",
        "Serenity Deck 30M | AS LOF TOUR",
        "تجربة يخت خاص تنطلق من إسطنبول."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Yalıkavak",
    "pricingMode": "PER_NIGHT",
    "basePrice": 24500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 2,
    "minNights": 2,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-11.svg",
      "/images/experiences/exp-11-detail.svg"
    ],
    "translations": {
      "TR": [
        "CLUB FLIPPER Yalıkavak",
        "club-flipper-yalikavak",
        "Yalıkavak için seçkin konaklama stoğu.",
        "CLUB FLIPPER Yalıkavak, Yalıkavak konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "CLUB FLIPPER Yalıkavak | AS LOF TOUR",
        "Yalıkavak için seçkin konaklama stoğu."
      ],
      "EN": [
        "CLUB FLIPPER Yalıkavak",
        "club-flipper-yalikavak",
        "Refined accommodation inventory for Yalıkavak.",
        "CLUB FLIPPER Yalıkavak combines privacy, concierge support and premium room or suite continuity for stays in Yalıkavak.",
        "CLUB FLIPPER Yalıkavak | AS LOF TOUR",
        "Refined accommodation inventory for Yalıkavak."
      ],
      "AR": [
        "CLUB FLIPPER Yalıkavak",
        "club-flipper-yalikavak",
        "إقامة راقية في ياليكافاك.",
        "CLUB FLIPPER Yalıkavak يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في ياليكافاك.",
        "CLUB FLIPPER Yalıkavak | AS LOF TOUR",
        "إقامة راقية في ياليكافاك."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Bodrum",
    "pricingMode": "PER_NIGHT",
    "basePrice": 26800,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 3,
    "minNights": 2,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-12.svg",
      "/images/experiences/exp-12-detail.svg"
    ],
    "translations": {
      "TR": [
        "Ege Signature Escape",
        "ege-signature-escape",
        "Bodrum için seçkin konaklama stoğu.",
        "Ege Signature Escape, Bodrum konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Ege Signature Escape | AS LOF TOUR",
        "Bodrum için seçkin konaklama stoğu."
      ],
      "EN": [
        "Ege Signature Escape",
        "ege-signature-escape",
        "Refined accommodation inventory for Bodrum.",
        "Ege Signature Escape combines privacy, concierge support and premium room or suite continuity for stays in Bodrum.",
        "Ege Signature Escape | AS LOF TOUR",
        "Refined accommodation inventory for Bodrum."
      ],
      "AR": [
        "Ege Signature Escape",
        "ege-signature-escape",
        "إقامة راقية في بودروم.",
        "Ege Signature Escape يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في بودروم.",
        "Ege Signature Escape | AS LOF TOUR",
        "إقامة راقية في بودروم."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Göcek",
    "pricingMode": "PER_NIGHT",
    "basePrice": 31200,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 3,
    "minNights": 2,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-13.svg",
      "/images/experiences/exp-13-detail.svg"
    ],
    "translations": {
      "TR": [
        "Coastal Grand Retreat",
        "coastal-grand-retreat",
        "Göcek için seçkin konaklama stoğu.",
        "Coastal Grand Retreat, Göcek konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Coastal Grand Retreat | AS LOF TOUR",
        "Göcek için seçkin konaklama stoğu."
      ],
      "EN": [
        "Coastal Grand Retreat",
        "coastal-grand-retreat",
        "Refined accommodation inventory for Göcek.",
        "Coastal Grand Retreat combines privacy, concierge support and premium room or suite continuity for stays in Göcek.",
        "Coastal Grand Retreat | AS LOF TOUR",
        "Refined accommodation inventory for Göcek."
      ],
      "AR": [
        "Coastal Grand Retreat",
        "coastal-grand-retreat",
        "إقامة راقية في جوتشيك.",
        "Coastal Grand Retreat يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في جوتشيك.",
        "Coastal Grand Retreat | AS LOF TOUR",
        "إقامة راقية في جوتشيك."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "İstanbul",
    "pricingMode": "PER_NIGHT",
    "basePrice": 28500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 3,
    "minNights": 2,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-14.svg",
      "/images/experiences/exp-14-detail.svg"
    ],
    "translations": {
      "TR": [
        "Old City Grand Suite",
        "old-city-grand-suite",
        "İstanbul için seçkin konaklama stoğu.",
        "Old City Grand Suite, İstanbul konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Old City Grand Suite | AS LOF TOUR",
        "İstanbul için seçkin konaklama stoğu."
      ],
      "EN": [
        "Old City Grand Suite",
        "old-city-grand-suite",
        "Refined accommodation inventory for İstanbul.",
        "Old City Grand Suite combines privacy, concierge support and premium room or suite continuity for stays in İstanbul.",
        "Old City Grand Suite | AS LOF TOUR",
        "Refined accommodation inventory for İstanbul."
      ],
      "AR": [
        "Old City Grand Suite",
        "old-city-grand-suite",
        "إقامة راقية في إسطنبول.",
        "Old City Grand Suite يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في إسطنبول.",
        "Old City Grand Suite | AS LOF TOUR",
        "إقامة راقية في إسطنبول."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "İstanbul",
    "pricingMode": "PER_NIGHT",
    "basePrice": 33800,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 4,
    "minNights": 2,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-15.svg",
      "/images/experiences/exp-15-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bosphorus Terrace Residence",
        "bosphorus-terrace-residence",
        "İstanbul için seçkin konaklama stoğu.",
        "Bosphorus Terrace Residence, İstanbul konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Bosphorus Terrace Residence | AS LOF TOUR",
        "İstanbul için seçkin konaklama stoğu."
      ],
      "EN": [
        "Bosphorus Terrace Residence",
        "bosphorus-terrace-residence",
        "Refined accommodation inventory for İstanbul.",
        "Bosphorus Terrace Residence combines privacy, concierge support and premium room or suite continuity for stays in İstanbul.",
        "Bosphorus Terrace Residence | AS LOF TOUR",
        "Refined accommodation inventory for İstanbul."
      ],
      "AR": [
        "Bosphorus Terrace Residence",
        "bosphorus-terrace-residence",
        "إقامة راقية في إسطنبول.",
        "Bosphorus Terrace Residence يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في إسطنبول.",
        "Bosphorus Terrace Residence | AS LOF TOUR",
        "إقامة راقية في إسطنبول."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Kapadokya",
    "pricingMode": "PER_NIGHT",
    "basePrice": 21900,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 3,
    "minNights": 2,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-16.svg",
      "/images/experiences/exp-16-detail.svg"
    ],
    "translations": {
      "TR": [
        "Cappadocia Stone Mansion",
        "cappadocia-stone-mansion",
        "Kapadokya için seçkin konaklama stoğu.",
        "Cappadocia Stone Mansion, Kapadokya konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Cappadocia Stone Mansion | AS LOF TOUR",
        "Kapadokya için seçkin konaklama stoğu."
      ],
      "EN": [
        "Cappadocia Stone Mansion",
        "cappadocia-stone-mansion",
        "Refined accommodation inventory for Kapadokya.",
        "Cappadocia Stone Mansion combines privacy, concierge support and premium room or suite continuity for stays in Kapadokya.",
        "Cappadocia Stone Mansion | AS LOF TOUR",
        "Refined accommodation inventory for Kapadokya."
      ],
      "AR": [
        "Cappadocia Stone Mansion",
        "cappadocia-stone-mansion",
        "إقامة راقية في كابادوكيا.",
        "Cappadocia Stone Mansion يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في كابادوكيا.",
        "Cappadocia Stone Mansion | AS LOF TOUR",
        "إقامة راقية في كابادوكيا."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Bodrum",
    "pricingMode": "PER_NIGHT",
    "basePrice": 19800,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 2,
    "minNights": 2,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-17.svg",
      "/images/experiences/exp-17-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bodrum Marina Loft",
        "bodrum-marina-loft",
        "Bodrum için seçkin konaklama stoğu.",
        "Bodrum Marina Loft, Bodrum konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Bodrum Marina Loft | AS LOF TOUR",
        "Bodrum için seçkin konaklama stoğu."
      ],
      "EN": [
        "Bodrum Marina Loft",
        "bodrum-marina-loft",
        "Refined accommodation inventory for Bodrum.",
        "Bodrum Marina Loft combines privacy, concierge support and premium room or suite continuity for stays in Bodrum.",
        "Bodrum Marina Loft | AS LOF TOUR",
        "Refined accommodation inventory for Bodrum."
      ],
      "AR": [
        "Bodrum Marina Loft",
        "bodrum-marina-loft",
        "إقامة راقية في بودروم.",
        "Bodrum Marina Loft يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في بودروم.",
        "Bodrum Marina Loft | AS LOF TOUR",
        "إقامة راقية في بودروم."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Göcek",
    "pricingMode": "PER_NIGHT",
    "basePrice": 27600,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 4,
    "minNights": 2,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-18.svg",
      "/images/experiences/exp-18-detail.svg"
    ],
    "translations": {
      "TR": [
        "Göcek Bay Residence",
        "gocek-bay-residence",
        "Göcek için seçkin konaklama stoğu.",
        "Göcek Bay Residence, Göcek konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Göcek Bay Residence | AS LOF TOUR",
        "Göcek için seçkin konaklama stoğu."
      ],
      "EN": [
        "Göcek Bay Residence",
        "gocek-bay-residence",
        "Refined accommodation inventory for Göcek.",
        "Göcek Bay Residence combines privacy, concierge support and premium room or suite continuity for stays in Göcek.",
        "Göcek Bay Residence | AS LOF TOUR",
        "Refined accommodation inventory for Göcek."
      ],
      "AR": [
        "Göcek Bay Residence",
        "gocek-bay-residence",
        "إقامة راقية في جوتشيك.",
        "Göcek Bay Residence يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في جوتشيك.",
        "Göcek Bay Residence | AS LOF TOUR",
        "إقامة راقية في جوتشيك."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Alaçatı",
    "pricingMode": "PER_NIGHT",
    "basePrice": 23200,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 2,
    "minNights": 2,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-19.svg",
      "/images/experiences/exp-19-detail.svg"
    ],
    "translations": {
      "TR": [
        "Alaçatı Courtyard Suite",
        "alacati-courtyard-suite",
        "Alaçatı için seçkin konaklama stoğu.",
        "Alaçatı Courtyard Suite, Alaçatı konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Alaçatı Courtyard Suite | AS LOF TOUR",
        "Alaçatı için seçkin konaklama stoğu."
      ],
      "EN": [
        "Alaçatı Courtyard Suite",
        "alacati-courtyard-suite",
        "Refined accommodation inventory for Alaçatı.",
        "Alaçatı Courtyard Suite combines privacy, concierge support and premium room or suite continuity for stays in Alaçatı.",
        "Alaçatı Courtyard Suite | AS LOF TOUR",
        "Refined accommodation inventory for Alaçatı."
      ],
      "AR": [
        "Alaçatı Courtyard Suite",
        "alacati-courtyard-suite",
        "إقامة راقية في ألاتشاتي.",
        "Alaçatı Courtyard Suite يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في ألاتشاتي.",
        "Alaçatı Courtyard Suite | AS LOF TOUR",
        "إقامة راقية في ألاتشاتي."
      ]
    }
  },
  {
    "category": "ACCOMMODATION",
    "location": "Antalya",
    "pricingMode": "PER_NIGHT",
    "basePrice": 35900,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 4,
    "minNights": 2,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Concierge coordination",
      "Premium room category",
      "Discreet arrival support"
    ],
    "galleryImages": [
      "/images/experiences/exp-20.svg",
      "/images/experiences/exp-20-detail.svg"
    ],
    "translations": {
      "TR": [
        "Antalya Riviera Penthouse",
        "antalya-riviera-penthouse",
        "Antalya için seçkin konaklama stoğu.",
        "Antalya Riviera Penthouse, Antalya konaklamaları için mahremiyet, concierge desteği ve premium oda/suite sürekliliğini aynı çizgide buluşturur.",
        "Antalya Riviera Penthouse | AS LOF TOUR",
        "Antalya için seçkin konaklama stoğu."
      ],
      "EN": [
        "Antalya Riviera Penthouse",
        "antalya-riviera-penthouse",
        "Refined accommodation inventory for Antalya.",
        "Antalya Riviera Penthouse combines privacy, concierge support and premium room or suite continuity for stays in Antalya.",
        "Antalya Riviera Penthouse | AS LOF TOUR",
        "Refined accommodation inventory for Antalya."
      ],
      "AR": [
        "Antalya Riviera Penthouse",
        "antalya-riviera-penthouse",
        "إقامة راقية في أنطاليا.",
        "Antalya Riviera Penthouse يجمع بين الخصوصية ودعم الكونسيرج واستمرارية الغرف أو الأجنحة الراقية في أنطاليا.",
        "Antalya Riviera Penthouse | AS LOF TOUR",
        "إقامة راقية في أنطاليا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_PERSON",
    "basePrice": 9500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 12,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-21.svg",
      "/images/experiences/exp-21-detail.svg"
    ],
    "translations": {
      "TR": [
        "Kapadokya Sunrise Classic",
        "kapadokya-sunrise-classic",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Kapadokya Sunrise Classic, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Kapadokya Sunrise Classic | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Kapadokya Sunrise Classic",
        "kapadokya-sunrise-classic",
        "Refined balloon flight over Kapadokya.",
        "Kapadokya Sunrise Classic is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Kapadokya Sunrise Classic | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Kapadokya Sunrise Classic",
        "kapadokya-sunrise-classic",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Kapadokya Sunrise Classic للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Kapadokya Sunrise Classic | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_PERSON",
    "basePrice": 12500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-22.svg",
      "/images/experiences/exp-22-detail.svg"
    ],
    "translations": {
      "TR": [
        "Kapadokya Gold Flight",
        "kapadokya-gold-flight",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Kapadokya Gold Flight, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Kapadokya Gold Flight | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Kapadokya Gold Flight",
        "kapadokya-gold-flight",
        "Refined balloon flight over Kapadokya.",
        "Kapadokya Gold Flight is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Kapadokya Gold Flight | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Kapadokya Gold Flight",
        "kapadokya-gold-flight",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Kapadokya Gold Flight للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Kapadokya Gold Flight | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_BOOKING",
    "basePrice": 78000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-23.svg",
      "/images/experiences/exp-23-detail.svg"
    ],
    "translations": {
      "TR": [
        "Fairy Valley Private Flight",
        "fairy-valley-private-flight",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Fairy Valley Private Flight, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Fairy Valley Private Flight | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Fairy Valley Private Flight",
        "fairy-valley-private-flight",
        "Refined balloon flight over Kapadokya.",
        "Fairy Valley Private Flight is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Fairy Valley Private Flight | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Fairy Valley Private Flight",
        "fairy-valley-private-flight",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Fairy Valley Private Flight للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Fairy Valley Private Flight | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_PERSON",
    "basePrice": 14500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-24.svg",
      "/images/experiences/exp-24-detail.svg"
    ],
    "translations": {
      "TR": [
        "Sunrise Photo Chase",
        "sunrise-photo-chase",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Sunrise Photo Chase, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Sunrise Photo Chase | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Sunrise Photo Chase",
        "sunrise-photo-chase",
        "Refined balloon flight over Kapadokya.",
        "Sunrise Photo Chase is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Sunrise Photo Chase | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Sunrise Photo Chase",
        "sunrise-photo-chase",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Sunrise Photo Chase للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Sunrise Photo Chase | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_PERSON",
    "basePrice": 13800,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-25.svg",
      "/images/experiences/exp-25-detail.svg"
    ],
    "translations": {
      "TR": [
        "Deluxe Dawn Balloon",
        "deluxe-dawn-balloon",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Deluxe Dawn Balloon, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Deluxe Dawn Balloon | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Deluxe Dawn Balloon",
        "deluxe-dawn-balloon",
        "Refined balloon flight over Kapadokya.",
        "Deluxe Dawn Balloon is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Deluxe Dawn Balloon | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Deluxe Dawn Balloon",
        "deluxe-dawn-balloon",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Deluxe Dawn Balloon للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Deluxe Dawn Balloon | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_PERSON",
    "basePrice": 11000,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-26.svg",
      "/images/experiences/exp-26-detail.svg"
    ],
    "translations": {
      "TR": [
        "Red Valley Signature",
        "red-valley-signature",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Red Valley Signature, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Red Valley Signature | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Red Valley Signature",
        "red-valley-signature",
        "Refined balloon flight over Kapadokya.",
        "Red Valley Signature is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Red Valley Signature | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Red Valley Signature",
        "red-valley-signature",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Red Valley Signature للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Red Valley Signature | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_BOOKING",
    "basePrice": 52000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-27.svg",
      "/images/experiences/exp-27-detail.svg"
    ],
    "translations": {
      "TR": [
        "Family Comfort Balloon",
        "family-comfort-balloon",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Family Comfort Balloon, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Family Comfort Balloon | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Family Comfort Balloon",
        "family-comfort-balloon",
        "Refined balloon flight over Kapadokya.",
        "Family Comfort Balloon is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Family Comfort Balloon | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Family Comfort Balloon",
        "family-comfort-balloon",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Family Comfort Balloon للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Family Comfort Balloon | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "BALLOON",
    "location": "Kapadokya",
    "pricingMode": "PER_BOOKING",
    "basePrice": 84500,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 4,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Sunrise departure slot",
      "Launch comfort coordination",
      "Private vehicle option"
    ],
    "galleryImages": [
      "/images/experiences/exp-28.svg",
      "/images/experiences/exp-28-detail.svg"
    ],
    "translations": {
      "TR": [
        "Proposal Balloon Flight",
        "proposal-balloon-flight",
        "Kapadokya üzerinde seçkin balon uçuşu.",
        "Proposal Balloon Flight, gün doğumu saatlerinde Kapadokya silüetini sakin, güvenli ve özenli bir akışla deneyimlemek isteyen misafirler için planlanır.",
        "Proposal Balloon Flight | AS LOF TOUR",
        "Kapadokya üzerinde seçkin balon uçuşu."
      ],
      "EN": [
        "Proposal Balloon Flight",
        "proposal-balloon-flight",
        "Refined balloon flight over Kapadokya.",
        "Proposal Balloon Flight is designed for guests who want to experience the Kapadokya skyline at dawn with calm pacing and elevated service.",
        "Proposal Balloon Flight | AS LOF TOUR",
        "Refined balloon flight over Kapadokya."
      ],
      "AR": [
        "Proposal Balloon Flight",
        "proposal-balloon-flight",
        "رحلة منطاد راقية فوق كابادوكيا.",
        "صُممت Proposal Balloon Flight للضيوف الذين يرغبون في اختبار أفق كابادوكيا عند الفجر بإيقاع هادئ وخدمة عالية.",
        "Proposal Balloon Flight | AS LOF TOUR",
        "رحلة منطاد راقية فوق كابادوكيا."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Bodrum",
    "pricingMode": "PER_WEEK",
    "basePrice": 210000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": 1,
    "featured": true,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-29.svg",
      "/images/experiences/exp-29-detail.svg"
    ],
    "translations": {
      "TR": [
        "Seaside Private Villa",
        "seaside-private-villa",
        "Bodrum için özel villa konaklaması.",
        "Seaside Private Villa, Bodrum bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Seaside Private Villa | AS LOF TOUR",
        "Bodrum için özel villa konaklaması."
      ],
      "EN": [
        "Seaside Private Villa",
        "seaside-private-villa",
        "Private villa stay in Bodrum.",
        "Seaside Private Villa offers a private villa format in Bodrum with elevated privacy, household service planning and long-stay comfort.",
        "Seaside Private Villa | AS LOF TOUR",
        "Private villa stay in Bodrum."
      ],
      "AR": [
        "Seaside Private Villa",
        "seaside-private-villa",
        "إقامة فيلا خاصة في بودروم.",
        "Seaside Private Villa تقدم صيغة فيلا خاصة في بودروم مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Seaside Private Villa | AS LOF TOUR",
        "إقامة فيلا خاصة في بودروم."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Kaş",
    "pricingMode": "PER_WEEK",
    "basePrice": 185000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": 1,
    "featured": true,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-30.svg",
      "/images/experiences/exp-30-detail.svg"
    ],
    "translations": {
      "TR": [
        "Mediterranean Cliff Villa",
        "mediterranean-cliff-villa",
        "Kaş için özel villa konaklaması.",
        "Mediterranean Cliff Villa, Kaş bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Mediterranean Cliff Villa | AS LOF TOUR",
        "Kaş için özel villa konaklaması."
      ],
      "EN": [
        "Mediterranean Cliff Villa",
        "mediterranean-cliff-villa",
        "Private villa stay in Kaş.",
        "Mediterranean Cliff Villa offers a private villa format in Kaş with elevated privacy, household service planning and long-stay comfort.",
        "Mediterranean Cliff Villa | AS LOF TOUR",
        "Private villa stay in Kaş."
      ],
      "AR": [
        "Mediterranean Cliff Villa",
        "mediterranean-cliff-villa",
        "إقامة فيلا خاصة في كاش.",
        "Mediterranean Cliff Villa تقدم صيغة فيلا خاصة في كاش مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Mediterranean Cliff Villa | AS LOF TOUR",
        "إقامة فيلا خاصة في كاش."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Yalıkavak",
    "pricingMode": "PER_WEEK",
    "basePrice": 295000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": 1,
    "featured": true,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-31.svg",
      "/images/experiences/exp-31-detail.svg"
    ],
    "translations": {
      "TR": [
        "Yalıkavak Panorama Estate",
        "yalikavak-panorama-estate",
        "Yalıkavak için özel villa konaklaması.",
        "Yalıkavak Panorama Estate, Yalıkavak bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Yalıkavak Panorama Estate | AS LOF TOUR",
        "Yalıkavak için özel villa konaklaması."
      ],
      "EN": [
        "Yalıkavak Panorama Estate",
        "yalikavak-panorama-estate",
        "Private villa stay in Yalıkavak.",
        "Yalıkavak Panorama Estate offers a private villa format in Yalıkavak with elevated privacy, household service planning and long-stay comfort.",
        "Yalıkavak Panorama Estate | AS LOF TOUR",
        "Private villa stay in Yalıkavak."
      ],
      "AR": [
        "Yalıkavak Panorama Estate",
        "yalikavak-panorama-estate",
        "إقامة فيلا خاصة في ياليكافاك.",
        "Yalıkavak Panorama Estate تقدم صيغة فيلا خاصة في ياليكافاك مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Yalıkavak Panorama Estate | AS LOF TOUR",
        "إقامة فيلا خاصة في ياليكافاك."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Göcek",
    "pricingMode": "PER_WEEK",
    "basePrice": 238000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": 1,
    "featured": false,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-32.svg",
      "/images/experiences/exp-32-detail.svg"
    ],
    "translations": {
      "TR": [
        "Göcek Pine Retreat",
        "gocek-pine-retreat",
        "Göcek için özel villa konaklaması.",
        "Göcek Pine Retreat, Göcek bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Göcek Pine Retreat | AS LOF TOUR",
        "Göcek için özel villa konaklaması."
      ],
      "EN": [
        "Göcek Pine Retreat",
        "gocek-pine-retreat",
        "Private villa stay in Göcek.",
        "Göcek Pine Retreat offers a private villa format in Göcek with elevated privacy, household service planning and long-stay comfort.",
        "Göcek Pine Retreat | AS LOF TOUR",
        "Private villa stay in Göcek."
      ],
      "AR": [
        "Göcek Pine Retreat",
        "gocek-pine-retreat",
        "إقامة فيلا خاصة في جوتشيك.",
        "Göcek Pine Retreat تقدم صيغة فيلا خاصة في جوتشيك مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Göcek Pine Retreat | AS LOF TOUR",
        "إقامة فيلا خاصة في جوتشيك."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Kaş",
    "pricingMode": "PER_WEEK",
    "basePrice": 198000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": 1,
    "featured": false,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-33.svg",
      "/images/experiences/exp-33-detail.svg"
    ],
    "translations": {
      "TR": [
        "Kaş Horizon House",
        "kas-horizon-house",
        "Kaş için özel villa konaklaması.",
        "Kaş Horizon House, Kaş bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Kaş Horizon House | AS LOF TOUR",
        "Kaş için özel villa konaklaması."
      ],
      "EN": [
        "Kaş Horizon House",
        "kas-horizon-house",
        "Private villa stay in Kaş.",
        "Kaş Horizon House offers a private villa format in Kaş with elevated privacy, household service planning and long-stay comfort.",
        "Kaş Horizon House | AS LOF TOUR",
        "Private villa stay in Kaş."
      ],
      "AR": [
        "Kaş Horizon House",
        "kas-horizon-house",
        "إقامة فيلا خاصة في كاش.",
        "Kaş Horizon House تقدم صيغة فيلا خاصة في كاش مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Kaş Horizon House | AS LOF TOUR",
        "إقامة فيلا خاصة في كاش."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Alaçatı",
    "pricingMode": "PER_WEEK",
    "basePrice": 176000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": 1,
    "featured": false,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-34.svg",
      "/images/experiences/exp-34-detail.svg"
    ],
    "translations": {
      "TR": [
        "Alaçatı Garden Villa",
        "alacati-garden-villa",
        "Alaçatı için özel villa konaklaması.",
        "Alaçatı Garden Villa, Alaçatı bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Alaçatı Garden Villa | AS LOF TOUR",
        "Alaçatı için özel villa konaklaması."
      ],
      "EN": [
        "Alaçatı Garden Villa",
        "alacati-garden-villa",
        "Private villa stay in Alaçatı.",
        "Alaçatı Garden Villa offers a private villa format in Alaçatı with elevated privacy, household service planning and long-stay comfort.",
        "Alaçatı Garden Villa | AS LOF TOUR",
        "Private villa stay in Alaçatı."
      ],
      "AR": [
        "Alaçatı Garden Villa",
        "alacati-garden-villa",
        "إقامة فيلا خاصة في ألاتشاتي.",
        "Alaçatı Garden Villa تقدم صيغة فيلا خاصة في ألاتشاتي مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Alaçatı Garden Villa | AS LOF TOUR",
        "إقامة فيلا خاصة في ألاتشاتي."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Fethiye",
    "pricingMode": "PER_WEEK",
    "basePrice": 189000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": 1,
    "featured": false,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-35.svg",
      "/images/experiences/exp-35-detail.svg"
    ],
    "translations": {
      "TR": [
        "Fethiye Cove Residence",
        "fethiye-cove-residence",
        "Fethiye için özel villa konaklaması.",
        "Fethiye Cove Residence, Fethiye bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Fethiye Cove Residence | AS LOF TOUR",
        "Fethiye için özel villa konaklaması."
      ],
      "EN": [
        "Fethiye Cove Residence",
        "fethiye-cove-residence",
        "Private villa stay in Fethiye.",
        "Fethiye Cove Residence offers a private villa format in Fethiye with elevated privacy, household service planning and long-stay comfort.",
        "Fethiye Cove Residence | AS LOF TOUR",
        "Private villa stay in Fethiye."
      ],
      "AR": [
        "Fethiye Cove Residence",
        "fethiye-cove-residence",
        "إقامة فيلا خاصة في فتحية.",
        "Fethiye Cove Residence تقدم صيغة فيلا خاصة في فتحية مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Fethiye Cove Residence | AS LOF TOUR",
        "إقامة فيلا خاصة في فتحية."
      ]
    }
  },
  {
    "category": "VILLA",
    "location": "Bodrum",
    "pricingMode": "PER_WEEK",
    "basePrice": 335000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": 1,
    "featured": true,
    "highlights": [
      "Private housekeeping rhythm",
      "Outdoor living areas",
      "Long-stay ready inventory"
    ],
    "galleryImages": [
      "/images/experiences/exp-36.svg",
      "/images/experiences/exp-36-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bodrum Platinum Villa",
        "bodrum-platinum-villa",
        "Bodrum için özel villa konaklaması.",
        "Bodrum Platinum Villa, Bodrum bölgesinde yüksek mahremiyet, ev servis planlaması ve uzun konaklama konforunu bir araya getiren özel villa seçeneğidir.",
        "Bodrum Platinum Villa | AS LOF TOUR",
        "Bodrum için özel villa konaklaması."
      ],
      "EN": [
        "Bodrum Platinum Villa",
        "bodrum-platinum-villa",
        "Private villa stay in Bodrum.",
        "Bodrum Platinum Villa offers a private villa format in Bodrum with elevated privacy, household service planning and long-stay comfort.",
        "Bodrum Platinum Villa | AS LOF TOUR",
        "Private villa stay in Bodrum."
      ],
      "AR": [
        "Bodrum Platinum Villa",
        "bodrum-platinum-villa",
        "إقامة فيلا خاصة في بودروم.",
        "Bodrum Platinum Villa تقدم صيغة فيلا خاصة في بودروم مع خصوصية مرتفعة وتخطيط خدمات منزلية وراحة للإقامات الطويلة.",
        "Bodrum Platinum Villa | AS LOF TOUR",
        "إقامة فيلا خاصة في بودروم."
      ]
    }
  },
  {
    "category": "VIP_TRANSFER",
    "location": "İstanbul",
    "pricingMode": "PER_TRANSFER",
    "basePrice": 6500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Chauffeur coordination",
      "Airport or marina support",
      "Executive vehicle class"
    ],
    "galleryImages": [
      "/images/experiences/exp-37.svg",
      "/images/experiences/exp-37-detail.svg"
    ],
    "translations": {
      "TR": [
        "VIP Transfer & Karşılama",
        "vip-transfer-and-karsilama",
        "İstanbul için sürücülü premium transfer.",
        "VIP Transfer & Karşılama, İstanbul varış ve şehir içi akışlarında zaman kontrollü karşılama, premium araç sınıfı ve sürücü koordinasyonu sunar.",
        "VIP Transfer & Karşılama | AS LOF TOUR",
        "İstanbul için sürücülü premium transfer."
      ],
      "EN": [
        "VIP Transfer & Karşılama",
        "vip-transfer-and-karsilama",
        "Chauffeured premium transfer in İstanbul.",
        "VIP Transfer & Karşılama offers time-controlled arrival management, premium vehicle class and chauffeur coordination across İstanbul.",
        "VIP Transfer & Karşılama | AS LOF TOUR",
        "Chauffeured premium transfer in İstanbul."
      ],
      "AR": [
        "VIP Transfer & Karşılama",
        "vip-transfer-and-karsilama",
        "نقل فاخر مع سائق في إسطنبول.",
        "توفر VIP Transfer & Karşılama إدارة دقيقة للوصول مع مركبة فاخرة وتنسيق سائق عبر إسطنبول.",
        "VIP Transfer & Karşılama | AS LOF TOUR",
        "نقل فاخر مع سائق في إسطنبول."
      ]
    }
  },
  {
    "category": "VIP_TRANSFER",
    "location": "İstanbul Airport",
    "pricingMode": "PER_TRANSFER",
    "basePrice": 9500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Chauffeur coordination",
      "Airport or marina support",
      "Executive vehicle class"
    ],
    "galleryImages": [
      "/images/experiences/exp-38.svg",
      "/images/experiences/exp-38-detail.svg"
    ],
    "translations": {
      "TR": [
        "Executive Airport Arrival",
        "executive-airport-arrival",
        "İstanbul Airport için sürücülü premium transfer.",
        "Executive Airport Arrival, İstanbul Airport varış ve şehir içi akışlarında zaman kontrollü karşılama, premium araç sınıfı ve sürücü koordinasyonu sunar.",
        "Executive Airport Arrival | AS LOF TOUR",
        "İstanbul Airport için sürücülü premium transfer."
      ],
      "EN": [
        "Executive Airport Arrival",
        "executive-airport-arrival",
        "Chauffeured premium transfer in İstanbul Airport.",
        "Executive Airport Arrival offers time-controlled arrival management, premium vehicle class and chauffeur coordination across İstanbul Airport.",
        "Executive Airport Arrival | AS LOF TOUR",
        "Chauffeured premium transfer in İstanbul Airport."
      ],
      "AR": [
        "Executive Airport Arrival",
        "executive-airport-arrival",
        "نقل فاخر مع سائق في مطار إسطنبول.",
        "توفر Executive Airport Arrival إدارة دقيقة للوصول مع مركبة فاخرة وتنسيق سائق عبر مطار إسطنبول.",
        "Executive Airport Arrival | AS LOF TOUR",
        "نقل فاخر مع سائق في مطار إسطنبول."
      ]
    }
  },
  {
    "category": "VIP_TRANSFER",
    "location": "Bodrum",
    "pricingMode": "PER_TRANSFER",
    "basePrice": 18500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Chauffeur coordination",
      "Airport or marina support",
      "Executive vehicle class"
    ],
    "galleryImages": [
      "/images/experiences/exp-39.svg",
      "/images/experiences/exp-39-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bodrum Chauffeur Day",
        "bodrum-chauffeur-day",
        "Bodrum için sürücülü premium transfer.",
        "Bodrum Chauffeur Day, Bodrum varış ve şehir içi akışlarında zaman kontrollü karşılama, premium araç sınıfı ve sürücü koordinasyonu sunar.",
        "Bodrum Chauffeur Day | AS LOF TOUR",
        "Bodrum için sürücülü premium transfer."
      ],
      "EN": [
        "Bodrum Chauffeur Day",
        "bodrum-chauffeur-day",
        "Chauffeured premium transfer in Bodrum.",
        "Bodrum Chauffeur Day offers time-controlled arrival management, premium vehicle class and chauffeur coordination across Bodrum.",
        "Bodrum Chauffeur Day | AS LOF TOUR",
        "Chauffeured premium transfer in Bodrum."
      ],
      "AR": [
        "Bodrum Chauffeur Day",
        "bodrum-chauffeur-day",
        "نقل فاخر مع سائق في بودروم.",
        "توفر Bodrum Chauffeur Day إدارة دقيقة للوصول مع مركبة فاخرة وتنسيق سائق عبر بودروم.",
        "Bodrum Chauffeur Day | AS LOF TOUR",
        "نقل فاخر مع سائق في بودروم."
      ]
    }
  },
  {
    "category": "VIP_TRANSFER",
    "location": "İstanbul",
    "pricingMode": "PER_TRANSFER",
    "basePrice": 12500,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 4,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Chauffeur coordination",
      "Airport or marina support",
      "Executive vehicle class"
    ],
    "galleryImages": [
      "/images/experiences/exp-40.svg",
      "/images/experiences/exp-40-detail.svg"
    ],
    "translations": {
      "TR": [
        "İstanbul Executive Drive",
        "i-stanbul-executive-drive",
        "İstanbul için sürücülü premium transfer.",
        "İstanbul Executive Drive, İstanbul varış ve şehir içi akışlarında zaman kontrollü karşılama, premium araç sınıfı ve sürücü koordinasyonu sunar.",
        "İstanbul Executive Drive | AS LOF TOUR",
        "İstanbul için sürücülü premium transfer."
      ],
      "EN": [
        "İstanbul Executive Drive",
        "i-stanbul-executive-drive",
        "Chauffeured premium transfer in İstanbul.",
        "İstanbul Executive Drive offers time-controlled arrival management, premium vehicle class and chauffeur coordination across İstanbul.",
        "İstanbul Executive Drive | AS LOF TOUR",
        "Chauffeured premium transfer in İstanbul."
      ],
      "AR": [
        "İstanbul Executive Drive",
        "i-stanbul-executive-drive",
        "نقل فاخر مع سائق في إسطنبول.",
        "توفر İstanbul Executive Drive إدارة دقيقة للوصول مع مركبة فاخرة وتنسيق سائق عبر إسطنبول.",
        "İstanbul Executive Drive | AS LOF TOUR",
        "نقل فاخر مع سائق في إسطنبول."
      ]
    }
  },
  {
    "category": "VIP_TRANSFER",
    "location": "Yalıkavak",
    "pricingMode": "PER_TRANSFER",
    "basePrice": 8900,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Chauffeur coordination",
      "Airport or marina support",
      "Executive vehicle class"
    ],
    "galleryImages": [
      "/images/experiences/exp-41.svg",
      "/images/experiences/exp-41-detail.svg"
    ],
    "translations": {
      "TR": [
        "Marina Transfer Suite",
        "marina-transfer-suite",
        "Yalıkavak için sürücülü premium transfer.",
        "Marina Transfer Suite, Yalıkavak varış ve şehir içi akışlarında zaman kontrollü karşılama, premium araç sınıfı ve sürücü koordinasyonu sunar.",
        "Marina Transfer Suite | AS LOF TOUR",
        "Yalıkavak için sürücülü premium transfer."
      ],
      "EN": [
        "Marina Transfer Suite",
        "marina-transfer-suite",
        "Chauffeured premium transfer in Yalıkavak.",
        "Marina Transfer Suite offers time-controlled arrival management, premium vehicle class and chauffeur coordination across Yalıkavak.",
        "Marina Transfer Suite | AS LOF TOUR",
        "Chauffeured premium transfer in Yalıkavak."
      ],
      "AR": [
        "Marina Transfer Suite",
        "marina-transfer-suite",
        "نقل فاخر مع سائق في ياليكافاك.",
        "توفر Marina Transfer Suite إدارة دقيقة للوصول مع مركبة فاخرة وتنسيق سائق عبر ياليكافاك.",
        "Marina Transfer Suite | AS LOF TOUR",
        "نقل فاخر مع سائق في ياليكافاك."
      ]
    }
  },
  {
    "category": "VIP_TRANSFER",
    "location": "Kapadokya",
    "pricingMode": "PER_TRANSFER",
    "basePrice": 14200,
    "currency": "TRY",
    "minGuests": 1,
    "maxGuests": 6,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Chauffeur coordination",
      "Airport or marina support",
      "Executive vehicle class"
    ],
    "galleryImages": [
      "/images/experiences/exp-42.svg",
      "/images/experiences/exp-42-detail.svg"
    ],
    "translations": {
      "TR": [
        "Cappadocia Private Driver",
        "cappadocia-private-driver",
        "Kapadokya için sürücülü premium transfer.",
        "Cappadocia Private Driver, Kapadokya varış ve şehir içi akışlarında zaman kontrollü karşılama, premium araç sınıfı ve sürücü koordinasyonu sunar.",
        "Cappadocia Private Driver | AS LOF TOUR",
        "Kapadokya için sürücülü premium transfer."
      ],
      "EN": [
        "Cappadocia Private Driver",
        "cappadocia-private-driver",
        "Chauffeured premium transfer in Kapadokya.",
        "Cappadocia Private Driver offers time-controlled arrival management, premium vehicle class and chauffeur coordination across Kapadokya.",
        "Cappadocia Private Driver | AS LOF TOUR",
        "Chauffeured premium transfer in Kapadokya."
      ],
      "AR": [
        "Cappadocia Private Driver",
        "cappadocia-private-driver",
        "نقل فاخر مع سائق في كابادوكيا.",
        "توفر Cappadocia Private Driver إدارة دقيقة للوصول مع مركبة فاخرة وتنسيق سائق عبر كابادوكيا.",
        "Cappadocia Private Driver | AS LOF TOUR",
        "نقل فاخر مع سائق في كابادوكيا."
      ]
    }
  },
  {
    "category": "GASTRONOMY",
    "location": "İstanbul",
    "pricingMode": "PER_PERSON",
    "basePrice": 12000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Table coordination",
      "Curated culinary stops",
      "Private pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-43.svg",
      "/images/experiences/exp-43-detail.svg"
    ],
    "translations": {
      "TR": [
        "Private Gastronomy Route",
        "private-gastronomy-route",
        "İstanbul için rafine gastronomi planı.",
        "Private Gastronomy Route, İstanbul içinde masa koordinasyonu, seçkin mutfak adresleri ve doğru tempoda ilerleyen özel bir gastronomi kurgusu sunar.",
        "Private Gastronomy Route | AS LOF TOUR",
        "İstanbul için rafine gastronomi planı."
      ],
      "EN": [
        "Private Gastronomy Route",
        "private-gastronomy-route",
        "Refined gastronomy plan for İstanbul.",
        "Private Gastronomy Route delivers a curated gastronomy rhythm in İstanbul with table coordination, select culinary addresses and measured pacing.",
        "Private Gastronomy Route | AS LOF TOUR",
        "Refined gastronomy plan for İstanbul."
      ],
      "AR": [
        "Private Gastronomy Route",
        "private-gastronomy-route",
        "خطة تذوق راقية في إسطنبول.",
        "تقدم Private Gastronomy Route إيقاعاً منسقاً للتذوق في إسطنبول مع حجوزات طاولات وعناوين طهو مختارة وإيقاع مدروس.",
        "Private Gastronomy Route | AS LOF TOUR",
        "خطة تذوق راقية في إسطنبول."
      ]
    }
  },
  {
    "category": "GASTRONOMY",
    "location": "İstanbul",
    "pricingMode": "PER_PERSON",
    "basePrice": 18500,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Table coordination",
      "Curated culinary stops",
      "Private pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-44.svg",
      "/images/experiences/exp-44-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bosphorus Supper Trail",
        "bosphorus-supper-trail",
        "İstanbul için rafine gastronomi planı.",
        "Bosphorus Supper Trail, İstanbul içinde masa koordinasyonu, seçkin mutfak adresleri ve doğru tempoda ilerleyen özel bir gastronomi kurgusu sunar.",
        "Bosphorus Supper Trail | AS LOF TOUR",
        "İstanbul için rafine gastronomi planı."
      ],
      "EN": [
        "Bosphorus Supper Trail",
        "bosphorus-supper-trail",
        "Refined gastronomy plan for İstanbul.",
        "Bosphorus Supper Trail delivers a curated gastronomy rhythm in İstanbul with table coordination, select culinary addresses and measured pacing.",
        "Bosphorus Supper Trail | AS LOF TOUR",
        "Refined gastronomy plan for İstanbul."
      ],
      "AR": [
        "Bosphorus Supper Trail",
        "bosphorus-supper-trail",
        "خطة تذوق راقية في إسطنبول.",
        "تقدم Bosphorus Supper Trail إيقاعاً منسقاً للتذوق في إسطنبول مع حجوزات طاولات وعناوين طهو مختارة وإيقاع مدروس.",
        "Bosphorus Supper Trail | AS LOF TOUR",
        "خطة تذوق راقية في إسطنبول."
      ]
    }
  },
  {
    "category": "GASTRONOMY",
    "location": "Bodrum",
    "pricingMode": "PER_PERSON",
    "basePrice": 14800,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Table coordination",
      "Curated culinary stops",
      "Private pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-45.svg",
      "/images/experiences/exp-45-detail.svg"
    ],
    "translations": {
      "TR": [
        "Bodrum Chef's Table Route",
        "bodrum-chefs-table-route",
        "Bodrum için rafine gastronomi planı.",
        "Bodrum Chef's Table Route, Bodrum içinde masa koordinasyonu, seçkin mutfak adresleri ve doğru tempoda ilerleyen özel bir gastronomi kurgusu sunar.",
        "Bodrum Chef's Table Route | AS LOF TOUR",
        "Bodrum için rafine gastronomi planı."
      ],
      "EN": [
        "Bodrum Chef's Table Route",
        "bodrum-chefs-table-route",
        "Refined gastronomy plan for Bodrum.",
        "Bodrum Chef's Table Route delivers a curated gastronomy rhythm in Bodrum with table coordination, select culinary addresses and measured pacing.",
        "Bodrum Chef's Table Route | AS LOF TOUR",
        "Refined gastronomy plan for Bodrum."
      ],
      "AR": [
        "Bodrum Chef's Table Route",
        "bodrum-chefs-table-route",
        "خطة تذوق راقية في بودروم.",
        "تقدم Bodrum Chef's Table Route إيقاعاً منسقاً للتذوق في بودروم مع حجوزات طاولات وعناوين طهو مختارة وإيقاع مدروس.",
        "Bodrum Chef's Table Route | AS LOF TOUR",
        "خطة تذوق راقية في بودروم."
      ]
    }
  },
  {
    "category": "GASTRONOMY",
    "location": "Kapadokya",
    "pricingMode": "PER_PERSON",
    "basePrice": 13200,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 8,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Table coordination",
      "Curated culinary stops",
      "Private pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-46.svg",
      "/images/experiences/exp-46-detail.svg"
    ],
    "translations": {
      "TR": [
        "Cappadocia Cellar Journey",
        "cappadocia-cellar-journey",
        "Kapadokya için rafine gastronomi planı.",
        "Cappadocia Cellar Journey, Kapadokya içinde masa koordinasyonu, seçkin mutfak adresleri ve doğru tempoda ilerleyen özel bir gastronomi kurgusu sunar.",
        "Cappadocia Cellar Journey | AS LOF TOUR",
        "Kapadokya için rafine gastronomi planı."
      ],
      "EN": [
        "Cappadocia Cellar Journey",
        "cappadocia-cellar-journey",
        "Refined gastronomy plan for Kapadokya.",
        "Cappadocia Cellar Journey delivers a curated gastronomy rhythm in Kapadokya with table coordination, select culinary addresses and measured pacing.",
        "Cappadocia Cellar Journey | AS LOF TOUR",
        "Refined gastronomy plan for Kapadokya."
      ],
      "AR": [
        "Cappadocia Cellar Journey",
        "cappadocia-cellar-journey",
        "خطة تذوق راقية في كابادوكيا.",
        "تقدم Cappadocia Cellar Journey إيقاعاً منسقاً للتذوق في كابادوكيا مع حجوزات طاولات وعناوين طهو مختارة وإيقاع مدروس.",
        "Cappadocia Cellar Journey | AS LOF TOUR",
        "خطة تذوق راقية في كابادوكيا."
      ]
    }
  },
  {
    "category": "GASTRONOMY",
    "location": "Urla",
    "pricingMode": "PER_PERSON",
    "basePrice": 15800,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 10,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Table coordination",
      "Curated culinary stops",
      "Private pacing"
    ],
    "galleryImages": [
      "/images/experiences/exp-47.svg",
      "/images/experiences/exp-47-detail.svg"
    ],
    "translations": {
      "TR": [
        "Ege Harvest & Table",
        "ege-harvest-and-table",
        "Urla için rafine gastronomi planı.",
        "Ege Harvest & Table, Urla içinde masa koordinasyonu, seçkin mutfak adresleri ve doğru tempoda ilerleyen özel bir gastronomi kurgusu sunar.",
        "Ege Harvest & Table | AS LOF TOUR",
        "Urla için rafine gastronomi planı."
      ],
      "EN": [
        "Ege Harvest & Table",
        "ege-harvest-and-table",
        "Refined gastronomy plan for Urla.",
        "Ege Harvest & Table delivers a curated gastronomy rhythm in Urla with table coordination, select culinary addresses and measured pacing.",
        "Ege Harvest & Table | AS LOF TOUR",
        "Refined gastronomy plan for Urla."
      ],
      "AR": [
        "Ege Harvest & Table",
        "ege-harvest-and-table",
        "خطة تذوق راقية في أورلا.",
        "تقدم Ege Harvest & Table إيقاعاً منسقاً للتذوق في أورلا مع حجوزات طاولات وعناوين طهو مختارة وإيقاع مدروس.",
        "Ege Harvest & Table | AS LOF TOUR",
        "خطة تذوق راقية في أورلا."
      ]
    }
  },
  {
    "category": "CUSTOM",
    "location": "Türkiye",
    "pricingMode": "CUSTOM",
    "basePrice": 95000,
    "currency": "TRY",
    "minGuests": 2,
    "maxGuests": 40,
    "minNights": null,
    "minWeeks": null,
    "featured": true,
    "highlights": [
      "Single-file planning",
      "Concierge coordination",
      "Multi-service itinerary"
    ],
    "galleryImages": [
      "/images/experiences/exp-48.svg",
      "/images/experiences/exp-48-detail.svg"
    ],
    "translations": {
      "TR": [
        "Private Celebration Design",
        "private-celebration-design",
        "İsteğe göre tasarlanan özel seyahat kurgusu.",
        "Private Celebration Design, hizmet bileşenlerinin rezervasyon, transfer, konaklama ve özel deneyimler etrafında tek dosyada birleştirildiği bespoke planlama çözümüdür.",
        "Private Celebration Design | AS LOF TOUR",
        "İsteğe göre tasarlanan özel seyahat kurgusu."
      ],
      "EN": [
        "Private Celebration Design",
        "private-celebration-design",
        "Bespoke travel design tailored around your brief.",
        "Private Celebration Design is a bespoke planning solution that combines reservations, transfers, stays and private experiences into one controlled file.",
        "Private Celebration Design | AS LOF TOUR",
        "Bespoke travel design tailored around your brief."
      ],
      "AR": [
        "Private Celebration Design",
        "private-celebration-design",
        "تصميم رحلة مخصص وفقاً للطلب.",
        "Private Celebration Design هو حل تخطيط مخصص يجمع الحجوزات والنقل والإقامة والتجارب الخاصة ضمن ملف واحد منضبط.",
        "Private Celebration Design | AS LOF TOUR",
        "تصميم رحلة مخصص وفقاً للطلب."
      ]
    }
  },
  {
    "category": "CUSTOM",
    "location": "Türkiye",
    "pricingMode": "CUSTOM",
    "basePrice": 180000,
    "currency": "TRY",
    "minGuests": 8,
    "maxGuests": 60,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Single-file planning",
      "Concierge coordination",
      "Multi-service itinerary"
    ],
    "galleryImages": [
      "/images/experiences/exp-49.svg",
      "/images/experiences/exp-49-detail.svg"
    ],
    "translations": {
      "TR": [
        "Corporate Retreat Curation",
        "corporate-retreat-curation",
        "İsteğe göre tasarlanan özel seyahat kurgusu.",
        "Corporate Retreat Curation, hizmet bileşenlerinin rezervasyon, transfer, konaklama ve özel deneyimler etrafında tek dosyada birleştirildiği bespoke planlama çözümüdür.",
        "Corporate Retreat Curation | AS LOF TOUR",
        "İsteğe göre tasarlanan özel seyahat kurgusu."
      ],
      "EN": [
        "Corporate Retreat Curation",
        "corporate-retreat-curation",
        "Bespoke travel design tailored around your brief.",
        "Corporate Retreat Curation is a bespoke planning solution that combines reservations, transfers, stays and private experiences into one controlled file.",
        "Corporate Retreat Curation | AS LOF TOUR",
        "Bespoke travel design tailored around your brief."
      ],
      "AR": [
        "Corporate Retreat Curation",
        "corporate-retreat-curation",
        "تصميم رحلة مخصص وفقاً للطلب.",
        "Corporate Retreat Curation هو حل تخطيط مخصص يجمع الحجوزات والنقل والإقامة والتجارب الخاصة ضمن ملف واحد منضبط.",
        "Corporate Retreat Curation | AS LOF TOUR",
        "تصميم رحلة مخصص وفقاً للطلب."
      ]
    }
  },
  {
    "category": "CUSTOM",
    "location": "Türkiye",
    "pricingMode": "CUSTOM",
    "basePrice": 125000,
    "currency": "TRY",
    "minGuests": 4,
    "maxGuests": 16,
    "minNights": null,
    "minWeeks": null,
    "featured": false,
    "highlights": [
      "Single-file planning",
      "Concierge coordination",
      "Multi-service itinerary"
    ],
    "galleryImages": [
      "/images/experiences/exp-50.svg",
      "/images/experiences/exp-50-detail.svg"
    ],
    "translations": {
      "TR": [
        "Family Heritage Journey",
        "family-heritage-journey",
        "İsteğe göre tasarlanan özel seyahat kurgusu.",
        "Family Heritage Journey, hizmet bileşenlerinin rezervasyon, transfer, konaklama ve özel deneyimler etrafında tek dosyada birleştirildiği bespoke planlama çözümüdür.",
        "Family Heritage Journey | AS LOF TOUR",
        "İsteğe göre tasarlanan özel seyahat kurgusu."
      ],
      "EN": [
        "Family Heritage Journey",
        "family-heritage-journey",
        "Bespoke travel design tailored around your brief.",
        "Family Heritage Journey is a bespoke planning solution that combines reservations, transfers, stays and private experiences into one controlled file.",
        "Family Heritage Journey | AS LOF TOUR",
        "Bespoke travel design tailored around your brief."
      ],
      "AR": [
        "Family Heritage Journey",
        "family-heritage-journey",
        "تصميم رحلة مخصص وفقاً للطلب.",
        "Family Heritage Journey هو حل تخطيط مخصص يجمع الحجوزات والنقل والإقامة والتجارب الخاصة ضمن ملف واحد منضبط.",
        "Family Heritage Journey | AS LOF TOUR",
        "تصميم رحلة مخصص وفقاً للطلب."
      ]
    }
  }
] as const;

async function main() {
  await prisma.paymentAttempt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.transferProof.deleteMany();
  await prisma.reservationItem.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.experienceTranslation.deleteMany();
  await prisma.experience.deleteMany();

  const roles = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'VIEWER'] as const;
  for (const key of roles) {
    await prisma.role.upsert({ where: { key }, update: { name: key }, create: { key, name: key } });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { key: 'SUPER_ADMIN' } });
  const email = process.env.SEED_ADMIN_EMAIL || 'asloftour@gmail.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.SEED_ADMIN_NAME || 'AS LOF TOUR Admin';

  await prisma.user.upsert({
    where: { email },
    update: { name, roleId: adminRole.id, passwordHash: await bcrypt.hash(password, 12) },
    create: { name, email, roleId: adminRole.id, passwordHash: await bcrypt.hash(password, 12) }
  });

  for (const item of experiences) {
    await prisma.experience.create({
      data: {
        category: item.category as ExperienceCategory,
        location: item.location,
        pricingMode: item.pricingMode as PricingMode,
        basePrice: item.basePrice,
        currency: item.currency,
        minGuests: item.minGuests,
        maxGuests: item.maxGuests,
        minNights: item.minNights || null,
        minWeeks: item.minWeeks || null,
        highlights: item.highlights,
        galleryImages: item.galleryImages,
        active: true,
        featured: item.featured,
        paymentEligibility: true,
        availabilityNotes: 'Availability is reconfirmed before payment capture.',
        bookingRules: ['Availability is confirmed before payment capture.', 'Operational feasibility is rechecked before final service dispatch.'],
        translations: {
          create: Object.entries(item.translations).map(([locale, value]) => ({
            locale: locale as any,
            title: value[0],
            slug: value[1],
            shortDescription: value[2],
            longDescription: value[3],
            seoTitle: value[4],
            seoDescription: value[5]
          }))
        }
      }
    });
  }

  for (const [locale, docs] of Object.entries(legalTemplates)) {
    for (const [type, content] of Object.entries(docs)) {
      await prisma.legalDocument.upsert({
        where: { type_locale: { type: type as LegalDocumentType, locale: locale.toUpperCase() as any } },
        update: { title: content[0], excerpt: content[0], content: content[1], isActive: true },
        create: {
          type: type as LegalDocumentType,
          locale: locale.toUpperCase() as any,
          slug: type.toLowerCase(),
          title: content[0],
          excerpt: content[0],
          content: content[1],
          isActive: true
        }
      });
    }
  }

  const settings = {
    bankTransfer: {
      accountName: 'AS LOF TOUR',
      bankName: '',
      iban: '',
      enabled: true
    },
    paymentOptions: {
      enableCard: true,
      enableBankTransfer: true,
      enablePaymentLink: true,
      allowMockProvider: true
    },
    whatsapp: { number: '+90 531 918 51 63' },
    companyInfo: {
      legalName: 'AS LOF TOUR TURİZM ORGANİZASYON VE DANIŞMANLIK HİZMETLERİ LİMİTED ŞİRKETİ',
      phone: '+90 531 918 51 63',
      email: 'asloftour@gmail.com'
    }
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value, type: 'json' }, create: { key, value, type: 'json' } });
  }

  for (const provider of [PaymentProvider.MOCK, PaymentProvider.GENERIC_VPOS, PaymentProvider.AKBANK, PaymentProvider.HALKBANK]) {
    await prisma.paymentProviderSetting.upsert({
      where: { provider },
      update: {
        testMode: true,
        active: provider === PaymentProvider.MOCK,
        apiUrl: provider === PaymentProvider.MOCK ? 'INTERNAL' : ''
      },
      create: {
        provider,
        testMode: true,
        active: provider === PaymentProvider.MOCK,
        apiUrl: provider === PaymentProvider.MOCK ? 'INTERNAL' : ''
      }
    });
  }
}

main().finally(() => prisma.$disconnect());
