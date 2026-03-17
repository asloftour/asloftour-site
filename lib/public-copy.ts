import { AppLocale } from '@/i18n/routing';

export type LocaleText = Record<AppLocale, string>;

export const ui = {
  hero: {
    book: { tr: 'Rezervasyona geç', en: 'Begin reservation', ar: 'ابدأ الحجز' },
    explore: { tr: 'Seçkiyi keşfet', en: 'Explore the collection', ar: 'استكشف المجموعة' },
    signature: { tr: 'İmza seçki', en: 'Signature collection', ar: 'المجموعة المميزة' },
    yacht: { tr: 'Özel yat charter', en: 'Private yacht charters', ar: 'يخوت خاصة' },
    villa: { tr: 'Özel villalar', en: 'Private villas', ar: 'فلل خاصة' },
    balloon: { tr: 'Gün doğumu balon uçuşları', en: 'Sunrise balloon flights', ar: 'رحلات منطاد الشروق' }
  },
  common: {
    from: { tr: 'Başlangıç', en: 'From', ar: 'ابتداءً من' },
    details: { tr: 'Detayları görüntüle', en: 'View details', ar: 'عرض التفاصيل' },
    readDocument: { tr: 'Metni incele', en: 'Review document', ar: 'راجع المستند' },
    returnHome: { tr: 'Ana sayfaya dön', en: 'Return home', ar: 'العودة للرئيسية' },
    retryPayment: { tr: 'Ödemeyi yeniden dene', en: 'Retry payment', ar: 'إعادة المحاولة' },
    contactSupport: { tr: 'Rezervasyon masası ile görüş', en: 'Contact the reservations desk', ar: 'تواصل مع فريق الحجوزات' },
    uploadProof: { tr: 'Dekont yükle', en: 'Upload proof', ar: 'رفع الإيصال' },
    total: { tr: 'Toplam', en: 'Total', ar: 'الإجمالي' },
    reference: { tr: 'Referans', en: 'Reference', ar: 'المرجع' },
    dates: { tr: 'Tarihler', en: 'Dates', ar: 'التواريخ' },
    guests: { tr: 'Misafir', en: 'Guests', ar: 'الضيوف' },
    location: { tr: 'Konum', en: 'Location', ar: 'الموقع' },
    pricing: { tr: 'Fiyatlama', en: 'Pricing', ar: 'التسعير' },
    summary: { tr: 'Rezervasyon özeti', en: 'Reservation summary', ar: 'ملخص الحجز' },
    legal: { tr: 'Yasal metinler', en: 'Legal texts', ar: 'النصوص القانونية' },
    selectedExperience: { tr: 'Seçilen deneyim', en: 'Selected experience', ar: 'التجربة المختارة' },
    curatedForYou: { tr: 'Size özel seçildi', en: 'Selected for you', ar: 'مختارة لك' }
  },
  footer: {
    explore: { tr: 'Keşfet', en: 'Explore', ar: 'استكشف' },
    legal: { tr: 'Yasal', en: 'Legal', ar: 'القانوني' },
    privacy: { tr: 'Gizlilik Politikası', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    cookies: { tr: 'Çerez Politikası', en: 'Cookie Policy', ar: 'سياسة ملفات الارتباط' },
    distanceSales: { tr: 'Mesafeli Satış Koşulları', en: 'Distance Sales Terms', ar: 'شروط البيع عن بُعد' },
    cancellationRefund: { tr: 'İptal / İade Koşulları', en: 'Cancellation / Refund Terms', ar: 'شروط الإلغاء والاسترداد' },
    preInformation: { tr: 'Ön Bilgilendirme Formu', en: 'Pre-Information Form', ar: 'نموذج المعلومات المسبقة' },
    serviceAgreement: { tr: 'Hizmet Sözleşmesi', en: 'Service Agreement', ar: 'اتفاقية الخدمة' }
  },
  home: {
    eyebrow: { tr: 'AS LOF TOUR', en: 'AS LOF TOUR', ar: 'AS LOF TOUR' },
    title: {
      tr: 'Özenle kurgulanmış ayrıcalıklı özel anlar.',
      en: 'Private journeys, carefully composed.',
      ar: 'رحلات خاصة صيغت بعناية.'
    },
    intro: {
      tr: 'AS LOF TOUR; denizde, karada ve gökyüzünde, temposu size göre şekillenen seçkin seyahat deneyimleri tasarlar. Yat kiralama, özel konaklama, VIP transfer ve imza rotalar; baştan sona sakin, zarif ve kusursuz bir akışla planlanır.',
      en: 'AS LOF TOUR curates private travel across sea, land and sky. Yacht charters, refined stays, VIP transfers and signature routes are planned with a calm, elegant and seamless flow from beginning to end.',
      ar: 'تنسق AS LOF TOUR رحلات خاصة عبر البحر والبر والسماء. اليخوت والإقامات الراقية والتنقلات الفاخرة والمسارات المميزة تُخطط جميعها بإيقاع هادئ وأنيق ومنسجم من البداية إلى النهاية.'
    },
    sectionTitle: {
      tr: 'Her detay, yolculuğun hissi için düşünülür.',
      en: 'Every detail is considered for how the journey should feel.',
      ar: 'كل تفصيل يُفكَّر فيه من أجل الإحساس الذي يجب أن تمنحه الرحلة.'
    },
    sectionText: {
      tr: 'Doğru rota, doğru tempo ve doğru servis dili bir araya geldiğinde, seyahat yalnızca bir plan olmaktan çıkar; hatırlanmaya değer bir deneyime dönüşür.',
      en: 'When the route, the pace and the service language are right, travel becomes more than a plan; it becomes a memory worth keeping.',
      ar: 'عندما يكون المسار والإيقاع ولغة الخدمة في مكانها الصحيح، لا تبقى الرحلة مجرد خطة؛ بل تصبح تجربة تستحق أن تُحفظ في الذاكرة.'
    },
    featured: { tr: 'İmza deneyimler', en: 'Signature experiences', ar: 'التجارب المميزة' },
    featuredLink: { tr: 'Tüm seçki', en: 'View full collection', ar: 'عرض المجموعة كاملة' },
    destinationsTitle: { tr: 'Seçilmiş kategoriler', en: 'Selected categories', ar: 'فئات مختارة' },
    destinationsText: {
      tr: 'Denizde, karada ve gökyüzünde; farklı ihtiyaçlara aynı ölçülü hizmet anlayışıyla yaklaşan seçkin bir koleksiyon.',
      en: 'A refined collection across sea, land and sky, united by the same measured standard of service.',
      ar: 'مجموعة راقية عبر البحر والبر والسماء، يجمعها معيار خدمة واحد متزن.'
    }
  },
  experiences: {
    eyebrow: { tr: 'Seçki', en: 'Collection', ar: 'المجموعة' },
    title: { tr: 'Deneyimler', en: 'Experiences', ar: 'التجارب' },
    description: {
      tr: 'Yat kiralama, konaklama, balon uçuşları, özel villalar, VIP transfer ve gastronomi rotalarını kategori bazında keşfedin.',
      en: 'Explore yacht charters, refined stays, balloon flights, private villas, VIP transfer and gastronomy by category.',
      ar: 'استكشف اليخوت والإقامات الراقية ورحلات المنطاد والفلل الخاصة والتنقلات الفاخرة ومسارات التذوق بحسب الفئة.'
    }
  },
  booking: {
    eyebrow: { tr: 'Rezervasyon', en: 'Booking', ar: 'الحجز' },
    title: { tr: 'Rezervasyon talebinizi oluşturun', en: 'Create your reservation request', ar: 'أنشئ طلب حجزك' },
    description: {
      tr: 'Deneyiminizi, tarih aralığınızı ve misafir sayınızı seçin. Talebiniz doğrulanır, kaydedilir ve rezervasyon masasına aktarılır.',
      en: 'Select your experience, travel window and guest count. Your request is validated, recorded and routed to the reservations desk.',
      ar: 'اختر تجربتك وفترة السفر وعدد الضيوف. يتم التحقق من طلبك وتسجيله وتحويله إلى فريق الحجوزات.'
    },
    nextTitle: { tr: 'Sıradaki adım', en: 'What follows next', ar: 'ما الخطوة التالية' },
    nextText: {
      tr: 'Talebiniz ön doğrulama, uygunluk teyidi ve ödeme hazırlığı adımlarından geçerek kişiselleştirilmiş bir akışa taşınır.',
      en: 'Your request moves into a personalised flow covering preliminary review, availability confirmation and payment readiness.',
      ar: 'ينتقل طلبك إلى مسار مخصص يشمل المراجعة الأولية وتأكيد التوفر والاستعداد للدفع.'
    },
    previewTitle: { tr: 'Seçtiğiniz deneyim', en: 'Your selected experience', ar: 'التجربة التي اخترتها' },
    previewText: {
      tr: 'Tarih ve misafir sayısını güncelledikçe tahmini toplam anlık olarak yenilenir.',
      en: 'As you adjust dates and guests, the estimated total refreshes in real time.',
      ar: 'عند تعديل التواريخ وعدد الضيوف يتم تحديث الإجمالي التقديري فوراً.'
    }
  },
  contact: {
    eyebrow: { tr: 'İletişim', en: 'Contact', ar: 'التواصل' },
    title: { tr: 'Rezervasyon masasıyla görüşün', en: 'Speak with the reservations desk', ar: 'تحدث مع فريق الحجوزات' },
    description: {
      tr: 'Özel planlama, kurumsal talepler, uygunluk kontrolleri ve teslim öncesi netleştirmeler için ekibimizle doğrudan iletişime geçin.',
      en: 'Reach the team directly for bespoke planning, corporate requests, availability checks and pre-arrival clarifications.',
      ar: 'تواصل مباشرة مع الفريق للتخطيط الخاص والطلبات المؤسسية والتحقق من التوفر والتفاصيل السابقة للوصول.'
    },
    directChannels: { tr: 'Doğrudan kanallar', en: 'Direct channels', ar: 'قنوات مباشرة' }
  },
  about: {
    eyebrow: { tr: 'Hakkımızda', en: 'About', ar: 'من نحن' },
    title: {
      tr: 'Planlama ile teslim kalitesini aynı sahnede tutan seyahat evi.',
      en: 'A travel house where planning discipline and delivery quality remain on the same stage.',
      ar: 'دار سفر تجمع بين انضباط التخطيط وجودة التنفيذ على المسرح نفسه.'
    },
    description: {
      tr: 'AS LOF TOUR; deneyim seçkisini, rezervasyon disiplini, görünür ödeme akışı ve kontrollü operasyon takibiyle birlikte sunar.',
      en: 'AS LOF TOUR presents its curated collection alongside reservation discipline, visible payment flow and controlled operational follow-through.',
      ar: 'تقدم AS LOF TOUR مجموعتها المختارة مع انضباط الحجز ووضوح الدفع والمتابعة التشغيلية المنضبطة.'
    }
  },
  faq: {
    eyebrow: { tr: 'SSS', en: 'FAQ', ar: 'الأسئلة الشائعة' },
    title: { tr: 'Sık sorulan sorular', en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
    description: {
      tr: 'Misafirlerin ödeme ve teyit öncesinde en çok yönelttiği sorulara net yanıtlar.',
      en: 'Clear answers to the questions guests ask most often before confirmation and payment.',
      ar: 'إجابات واضحة للأسئلة التي يطرحها الضيوف غالباً قبل التأكيد والدفع.'
    }
  },
  policies: {
    eyebrow: { tr: 'Politikalar', en: 'Policies', ar: 'السياسات' },
    title: { tr: 'Yasal ve bilgilendirici metinler', en: 'Legal and information documents', ar: 'المستندات القانونية والمعلوماتية' },
    description: {
      tr: 'Rezervasyon ve ödeme öncesinde görünür kalan tüm metinler admin panelden güncellenebilir yapıda yönetilir.',
      en: 'All texts that remain visible before reservation and payment are maintained from the admin panel in an updatable structure.',
      ar: 'تدار جميع النصوص الظاهرة قبل الحجز والدفع من لوحة التحكم ضمن بنية قابلة للتحديث.'
    },
    cardText: {
      tr: 'Ödeme öncesinde erişilebilir ve sürümlenmiş yasal içerik olarak saklanır.',
      en: 'Accessible before payment and stored as versioned legal content.',
      ar: 'متاحة قبل الدفع ومحفوظة كمحتوى قانوني بإصدارات.'
    }
  },
  success: {
    eyebrow: { tr: 'Onaylandı', en: 'Confirmed', ar: 'تم التأكيد' },
    title: { tr: 'Ödeme kaydedildi', en: 'Payment recorded', ar: 'تم تسجيل الدفع' },
    description: {
      tr: 'İşleminiz kaydedildi. Rezervasyon akışı güncellendi ve operasyon ekibi bir sonraki teslim adımına geçti.',
      en: 'Your transaction has been recorded. The reservation flow is updated and operations move to the next delivery step.',
      ar: 'تم تسجيل المعاملة. تم تحديث مسار الحجز وانتقل فريق العمليات إلى الخطوة التالية.'
    }
  },
  fail: {
    eyebrow: { tr: 'Ödeme durumu', en: 'Payment status', ar: 'حالة الدفع' },
    title: { tr: 'Ödeme tamamlanmadı', en: 'Payment was not completed', ar: 'لم يكتمل الدفع' },
    description: {
      tr: 'Herhangi bir tahsilat onayı alınmadı. Kart ödemesini yeniden deneyebilir, banka transferine geçebilir veya rezervasyon masasıyla görüşebilirsiniz.',
      en: 'No capture was confirmed. You can retry card payment, switch to bank transfer or speak with the reservations desk.',
      ar: 'لم يتم تأكيد التحصيل. يمكنك إعادة محاولة الدفع بالبطاقة أو التحويل البنكي أو التواصل مع فريق الحجوزات.'
    }
  },
  bankTransfer: {
    eyebrow: { tr: 'Banka transferi', en: 'Bank transfer', ar: 'تحويل بنكي' },
    title: { tr: 'IBAN ödeme talimatı', en: 'IBAN payment instructions', ar: 'تعليمات الدفع عبر الآيبان' },
    description: {
      tr: 'Transfer ödemeleri, dekont yüklenip operasyon ekibi tarafından doğrulanana kadar incelemede kalır.',
      en: 'Transfer payments remain in review until proof is uploaded and verified by operations.',
      ar: 'تبقى مدفوعات التحويل قيد المراجعة حتى يتم رفع الإيصال والتحقق منه من قبل العمليات.'
    },
    accountName: { tr: 'Hesap adı', en: 'Account name', ar: 'اسم الحساب' },
    bank: { tr: 'Banka', en: 'Bank', ar: 'البنك' },
    iban: { tr: 'IBAN', en: 'IBAN', ar: 'آيبان' },
    referenceNote: { tr: 'Açıklama alanında rezervasyon referansınızı kullanın.', en: 'Use your reservation reference in the transfer description.', ar: 'استخدم مرجع الحجز في خانة الوصف.' },
    status: { tr: 'Durum', en: 'Status', ar: 'الحالة' },
    configureAdmin: { tr: 'Admin ayarlarından girin', en: 'Configure from admin settings', ar: 'قم بالإعداد من لوحة التحكم' }
  },
  notFound: {
    title: { tr: 'Sayfa bulunamadı', en: 'Page not found', ar: 'الصفحة غير موجودة' },
    description: { tr: 'İstediğiniz sayfa bulunamadı.', en: 'The page you requested could not be located.', ar: 'تعذر العثور على الصفحة المطلوبة.' }
  },
  error: {
    title: { tr: 'Bir hata oluştu', en: 'Something went wrong', ar: 'حدث خطأ ما' },
    description: { tr: 'Uygulamada kurtarılabilir bir hata oluştu.', en: 'A recoverable application error occurred.', ar: 'حدث خطأ يمكن استعادته في التطبيق.' },
    retry: { tr: 'Tekrar dene', en: 'Try again', ar: 'أعد المحاولة' }
  },
  forms: {
    booking: {
      experience: { tr: 'Deneyim', en: 'Experience', ar: 'التجربة' },
      startDate: { tr: 'Başlangıç tarihi', en: 'Start date', ar: 'تاريخ البداية' },
      endDate: { tr: 'Bitiş tarihi', en: 'End date', ar: 'تاريخ الانتهاء' },
      guests: { tr: 'Misafir sayısı', en: 'Guests', ar: 'عدد الضيوف' },
      fullName: { tr: 'Ad soyad', en: 'Full name', ar: 'الاسم الكامل' },
      phone: { tr: 'Telefon', en: 'Phone', ar: 'الهاتف' },
      email: { tr: 'E-posta', en: 'Email', ar: 'البريد الإلكتروني' },
      specialRequests: { tr: 'Özel talepler', en: 'Special requests', ar: 'طلبات خاصة' },
      billingType: { tr: 'Fatura tipi', en: 'Billing type', ar: 'نوع الفاتورة' },
      companyName: { tr: 'Şirket adı', en: 'Company name', ar: 'اسم الشركة' },
      taxOffice: { tr: 'Vergi dairesi', en: 'Tax office', ar: 'مكتب الضريبة' },
      taxNumber: { tr: 'Vergi numarası', en: 'Tax number', ar: 'رقم الضريبة' },
      addTransfer: { tr: 'VIP transfer talebi ekle', en: 'Add VIP transfer request', ar: 'إضافة طلب نقل VIP' },
      summary: { tr: 'Tahmini toplam', en: 'Estimated total', ar: 'الإجمالي التقديري' },
      successRedirect: { tr: 'Rezervasyon oluşturuldu, ödeme adımına yönlendiriliyorsunuz.', en: 'Reservation created, forwarding to payment.', ar: 'تم إنشاء الحجز، وسيتم تحويلك إلى الدفع.' },
      error: { tr: 'Rezervasyon oluşturulamadı.', en: 'Unable to create reservation.', ar: 'تعذر إنشاء الحجز.' },
      submit: { tr: 'Rezervasyon oluştur', en: 'Create reservation', ar: 'إنشاء الحجز' },
      pleaseWait: { tr: 'İşleniyor...', en: 'Please wait...', ar: 'يرجى الانتظار...' },
      individual: { tr: 'Bireysel', en: 'Individual', ar: 'فردي' },
      corporate: { tr: 'Kurumsal', en: 'Corporate', ar: 'شركة' }
    },
    contact: {
      title: { tr: 'Bize yazın', en: 'Send a message', ar: 'أرسل رسالة' },
      fullName: { tr: 'Ad soyad', en: 'Full name', ar: 'الاسم الكامل' },
      email: { tr: 'E-posta', en: 'Email', ar: 'البريد الإلكتروني' },
      phone: { tr: 'Telefon', en: 'Phone', ar: 'الهاتف' },
      message: { tr: 'Mesaj', en: 'Message', ar: 'الرسالة' },
      success: { tr: 'Mesajınız başarıyla gönderildi.', en: 'Message sent successfully.', ar: 'تم إرسال رسالتك بنجاح.' },
      error: { tr: 'Mesaj gönderilemedi.', en: 'Unable to send your message.', ar: 'تعذر إرسال رسالتك.' },
      submit: { tr: 'Mesaj gönder', en: 'Send message', ar: 'إرسال الرسالة' },
      pleaseWait: { tr: 'İşleniyor...', en: 'Please wait...', ar: 'يرجى الانتظار...' }
    },
    inquiry: {
      experience: { tr: 'Deneyim', en: 'Experience', ar: 'التجربة' },
      selectExperience: { tr: 'Deneyim seçin', en: 'Select experience', ar: 'اختر تجربة' },
      fullName: { tr: 'Ad soyad', en: 'Full name', ar: 'الاسم الكامل' },
      phone: { tr: 'Telefon', en: 'Phone', ar: 'الهاتف' },
      email: { tr: 'E-posta', en: 'Email', ar: 'البريد الإلكتروني' },
      company: { tr: 'Şirket', en: 'Company', ar: 'الشركة' },
      preferredDate: { tr: 'Tercih edilen tarih', en: 'Preferred date', ar: 'التاريخ المفضل' },
      message: { tr: 'Talep detayı', en: 'Request details', ar: 'تفاصيل الطلب' },
      success: { tr: 'Talebiniz başarıyla alındı.', en: 'Request submitted successfully.', ar: 'تم استلام طلبك بنجاح.' },
      error: { tr: 'Talep gönderilemedi.', en: 'Unable to submit your request.', ar: 'تعذر إرسال الطلب.' },
      submit: { tr: 'Talebi gönder', en: 'Submit request', ar: 'إرسال الطلب' },
      pleaseWait: { tr: 'İşleniyor...', en: 'Please wait...', ar: 'يرجى الانتظار...' }
    },
    payment: {
      method: { tr: 'Ödeme yöntemi', en: 'Payment method', ar: 'طريقة الدفع' },
      card3d: { tr: '3D Secure kart ödemesi', en: '3D Secure card payment', ar: 'دفع البطاقة ثلاثي الأبعاد' },
      bankTransfer: { tr: 'IBAN / havale-EFT', en: 'IBAN / bank transfer', ar: 'الآيبان / التحويل البنكي' },
      paymentLink: { tr: 'Güvenli ödeme linki talebi', en: 'Secure payment link request', ar: 'طلب رابط دفع آمن' },
      provider: { tr: 'Sağlayıcı', en: 'Provider', ar: 'المزوّد' },
      installment: { tr: 'Taksit', en: 'Installment', ar: 'التقسيط' },
      legalError: { tr: 'Ödeme öncesi zorunlu onayları tamamlamanız gerekir.', en: 'Please complete the required consents before payment.', ar: 'يرجى إكمال الموافقات المطلوبة قبل الدفع.' },
      paymentError: { tr: 'Ödeme adımına geçilemedi.', en: 'Unable to continue payment.', ar: 'تعذر متابعة الدفع.' },
      continue: { tr: 'Ödemeye devam et', en: 'Continue to payment', ar: 'متابعة الدفع' },
      pleaseWait: { tr: 'İşleniyor...', en: 'Please wait...', ar: 'يرجى الانتظار...' },
      brands: { tr: 'Visa • Mastercard • TROY', en: 'Visa • Mastercard • TROY', ar: 'Visa • Mastercard • TROY' }
    },
    transferProof: {
      note: { tr: 'Ödeme notu veya gönderen bilgisi', en: 'Payment note or sender information', ar: 'ملاحظة الدفع أو بيانات المُرسِل' },
      success: { tr: 'Dekont başarıyla yüklendi.', en: 'Transfer proof uploaded successfully.', ar: 'تم رفع الإيصال بنجاح.' },
      error: { tr: 'Dekont yüklenemedi.', en: 'Unable to upload proof.', ar: 'تعذر رفع الإيصال.' }
    }
  }
} as const;

export function tLocale(text: LocaleText, locale: AppLocale) {
  return text[locale];
}
