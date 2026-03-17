import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { ExperienceCategory } from '@prisma/client';
import { AppLocale } from '@/i18n/routing';

export type LocaleCopy = Record<AppLocale, string>;

export const EXPERIENCE_IMAGE_MAP = {
  "azure-pearl-24m": "/images/experiences/azure-pearl-24m.jpg",
  "golden-tide-28m": "/images/experiences/golden-tide-28m.jpg",
  "royal-horizon-31m": "/images/experiences/royal-horizon-31m.jpg",
  "bosphorus-signature-cruise": "/images/experiences/bosphorus-signature-cruise.jpg",
  "moonwake-26m": "/images/experiences/moonwake-26m.jpg",
  "celeste-mare-32m": "/images/experiences/celeste-mare-32m.jpg",
  "aegean-reverie-27m": "/images/experiences/aegean-reverie-27m.jpg",
  "marina-noir-29m": "/images/experiences/marina-noir-29m.jpg",
  "dolce-riva-25m": "/images/experiences/dolce-riva-25m.jpg",
  "serenity-deck-30m": "/images/experiences/serenity-deck-30m.jpg",
  "club-flipper-yalikavak": "/images/experiences/club-flipper-yalikavak.jpg",
  "ege-signature-escape": "/images/experiences/ege-signature-escape.jpg",
  "coastal-grand-retreat": "/images/experiences/coastal-grand-retreat.jpg",
  "old-city-grand-suite": "/images/experiences/old-city-grand-suite.jpg",
  "bosphorus-terrace-residence": "/images/experiences/bosphorus-terrace-residence.jpg",
  "cappadocia-stone-mansion": "/images/experiences/cappadocia-stone-mansion.jpg",
  "bodrum-marina-loft": "/images/experiences/bodrum-marina-loft.jpg",
  "gocek-bay-residence": "/images/experiences/gocek-bay-residence.jpg",
  "alacati-courtyard-suite": "/images/experiences/alacati-courtyard-suite.jpg",
  "antalya-riviera-penthouse": "/images/experiences/antalya-riviera-penthouse.jpg",
  "kapadokya-sunrise-classic": "/images/experiences/kapadokya-sunrise-classic.jpg",
  "kapadokya-gold-flight": "/images/experiences/kapadokya-gold-flight.jpg",
  "fairy-valley-private-flight": "/images/experiences/fairy-valley-private-flight.jpg",
  "sunrise-photo-chase": "/images/experiences/sunrise-photo-chase.jpg",
  "deluxe-dawn-balloon": "/images/experiences/deluxe-dawn-balloon.jpg",
  "red-valley-signature": "/images/experiences/red-valley-signature.jpg",
  "family-comfort-balloon": "/images/experiences/family-comfort-balloon.jpg",
  "proposal-balloon-flight": "/images/experiences/proposal-balloon-flight.jpg",
  "seaside-private-villa": "/images/experiences/seaside-private-villa.jpg",
  "mediterranean-cliff-villa": "/images/experiences/mediterranean-cliff-villa.jpg",
  "yalikavak-panorama-estate": "/images/experiences/yalikavak-panorama-estate.jpg",
  "gocek-pine-retreat": "/images/experiences/gocek-pine-retreat.jpg",
  "kas-horizon-house": "/images/experiences/kas-horizon-house.jpg",
  "alacati-garden-villa": "/images/experiences/alacati-garden-villa.jpg",
  "fethiye-cove-residence": "/images/experiences/fethiye-cove-residence.jpg",
  "bodrum-platinum-villa": "/images/experiences/bodrum-platinum-villa.jpg",
  "vip-transfer-and-karsilama": "/images/experiences/vip-transfer-and-karsilama.jpg",
  "executive-airport-arrival": "/images/experiences/executive-airport-arrival.jpg",
  "bodrum-chauffeur-day": "/images/experiences/bodrum-chauffeur-day.jpg",
  "i-stanbul-executive-drive": "/images/experiences/i-stanbul-executive-drive.jpg",
  "marina-transfer-suite": "/images/experiences/marina-transfer-suite.jpg",
  "cappadocia-private-driver": "/images/experiences/cappadocia-private-driver.jpg",
  "private-gastronomy-route": "/images/experiences/private-gastronomy-route.jpg",
  "bosphorus-supper-trail": "/images/experiences/bosphorus-supper-trail.jpg",
  "bodrum-chefs-table-route": "/images/experiences/bodrum-chefs-table-route.jpg",
  "cappadocia-cellar-journey": "/images/experiences/cappadocia-cellar-journey.jpg",
  "ege-harvest-and-table": "/images/experiences/ege-harvest-and-table.jpg",
  "private-celebration-design": "/images/experiences/private-celebration-design.jpg",
  "corporate-retreat-curation": "/images/experiences/corporate-retreat-curation.jpg",
  "family-heritage-journey": "/images/experiences/family-heritage-journey.jpg"
} as const;

export const EXPERIENCE_COPY_MAP: Record<string, LocaleCopy> = {
  "azure-pearl-24m": {
    "tr": "Bodrum kıyılarında, güne zarif bir ritim kazandıran seçkin bir özel charter deneyimi.",
    "en": "A refined private charter in Bodrum, shaped for an elegant pace from the very first departure.",
    "ar": "تجربة يخت خاصة راقية في بودروم، صيغت بإيقاع أنيق منذ لحظة الانطلاق."
  },
  "golden-tide-28m": {
    "tr": "Göcek koylarında mahremiyet ve konfor odağında tasarlanmış sakin bir deniz günü.",
    "en": "A calm sea-day concept in Göcek, designed around privacy, comfort and an unhurried rhythm.",
    "ar": "يوم بحري هادئ في جوتشيك، مصمم حول الخصوصية والراحة وإيقاع غير متعجل."
  },
  "royal-horizon-31m": {
    "tr": "Yalıkavak çıkışlı, rota ve servis kalitesiyle ayrışan rafine charter seçeneği.",
    "en": "A Yalıkavak departure defined by polished service and a more distinguished charter rhythm.",
    "ar": "انطلاق من ياليكافاك يتميز بخدمة مصقولة وإيقاع أكثر تميزاً في الإبحار الخاص."
  },
  "bosphorus-signature-cruise": {
    "tr": "Boğaz hattında, şehir siluetini özel servis diliyle bir araya getiren zarif seyir.",
    "en": "An elegant Bosphorus cruise pairing the city skyline with a discreet, polished service style.",
    "ar": "رحلة أنيقة في البوسفور تجمع أفق المدينة مع أسلوب خدمة رصين ومصقول."
  },
  "moonwake-26m": {
    "tr": "Akşamüstü akışına uyumlanan, daha samimi ve rafine bir özel deniz rotası.",
    "en": "A more intimate private sea route designed for a graceful late-afternoon tempo.",
    "ar": "مسار بحري خاص أكثر حميمية، صُمم لوتيرة مسائية أنيقة."
  },
  "celeste-mare-32m": {
    "tr": "Daha geniş yaşam alanı ve konforlu akışıyla uzun deniz günlerine uygun seçkin yat.",
    "en": "A larger-yacht choice for extended sea days, with generous living space and an easy rhythm.",
    "ar": "خيار يخت أكبر للأيام البحرية الممتدة، مع مساحات رحبة وإيقاع مريح."
  },
  "aegean-reverie-27m": {
    "tr": "Ege hattında hafif tempolu, özenli servisli ve manzaraya odaklı bir charter kurgusu.",
    "en": "An Aegean charter composed around light pacing, careful service and a scenic route.",
    "ar": "إبحار خاص في بحر إيجه يرتكز على وتيرة خفيفة وخدمة متقنة ومسار بصري جميل."
  },
  "marina-noir-29m": {
    "tr": "Marina çıkışlı, modern çizgisi ve sessiz konforuyla öne çıkan özel deniz günü.",
    "en": "A modern marina departure distinguished by quiet comfort and a clean, contemporary line.",
    "ar": "انطلاق حديث من المرسى يتميز بالراحة الهادئة وخط بصري معاصر."
  },
  "dolce-riva-25m": {
    "tr": "Kısa kaçamaklar ve öğle sonrası seyirler için ideal, hafif ve zarif charter deneyimi.",
    "en": "A light, elegant charter format suited to shorter escapes and polished afternoon cruises.",
    "ar": "صيغة يخت أنيقة وخفيفة تناسب الهروب القصير والرحلات الهادئة بعد الظهر."
  },
  "serenity-deck-30m": {
    "tr": "Daha dingin koy rotaları ve ölçülü servis temposu arayan misafirler için kuruldu.",
    "en": "Built for guests seeking quieter bays, measured service and a calmer pace at sea.",
    "ar": "معد لضيوف يبحثون عن خلجان أكثر هدوءاً وخدمة متزنة وإيقاع بحري أهدأ."
  },
  "club-flipper-yalikavak": {
    "tr": "Yalıkavak’ta sahile yakın, güçlü servis standardı ve konforlu yer duygusu sunan seçkin konaklama.",
    "en": "A refined Yalıkavak stay close to the waterfront, balancing comfort with a polished service standard.",
    "ar": "إقامة راقية في ياليكافاك قرب الواجهة البحرية، تجمع بين الراحة ومعيار خدمة مصقول."
  },
  "ege-signature-escape": {
    "tr": "Daha sakin bir Ege konaklaması için seçilmiş, mahremiyet ve ritim odağı yüksek adres.",
    "en": "A carefully selected Aegean address for guests seeking privacy, calm and a slower stay rhythm.",
    "ar": "عنوان مختار بعناية في بحر إيجه لمن يبحثون عن الخصوصية والهدوء وإقامة أبطأ إيقاعاً."
  },
  "coastal-grand-retreat": {
    "tr": "Kıyı hattında, geniş hacim ve yumuşak servis diliyle ayrışan premium konaklama.",
    "en": "A coastal premium stay defined by generous volume and a softer, more discreet service tone.",
    "ar": "إقامة ساحلية فاخرة تتميز بالمساحة الرحبة ونبرة خدمة أكثر هدوءاً ورقياً."
  },
  "old-city-grand-suite": {
    "tr": "Tarihi merkezde, şehir temposunu rafine bir iç mekân konforuyla dengeleyen süit deneyimi.",
    "en": "A city-suite experience in the historic centre, balancing urban access with refined interior comfort.",
    "ar": "تجربة جناح في قلب المدينة التاريخية توازن بين سهولة الوصول وراحة داخلية راقية."
  },
  "bosphorus-terrace-residence": {
    "tr": "Boğaz manzarasını daha özel ve sakin bir konaklama akışıyla buluşturan seçili rezidans.",
    "en": "A selected residence pairing Bosphorus views with a more private and settled stay rhythm.",
    "ar": "إقامة مختارة تجمع إطلالة البوسفور مع إيقاع أكثر خصوصية وهدوءاً."
  },
  "cappadocia-stone-mansion": {
    "tr": "Kapadokya’nın yer duygusunu taşıyan, taş mimarili ve karakterli bir konaklama seçeneği.",
    "en": "A characterful stone stay in Cappadocia, carrying a strong sense of place and quiet refinement.",
    "ar": "إقامة حجرية ذات طابع خاص في كابادوكيا، تحمل إحساساً قوياً بالمكان ورقياً هادئاً."
  },
  "bodrum-marina-loft": {
    "tr": "Marina çevresinde, çağdaş çizgili ve rahat akışlı kısa konaklamalar için ideal loft.",
    "en": "A contemporary marina loft suited to shorter Bodrum stays with an easy, polished rhythm.",
    "ar": "لوفت معاصر قرب المرسى يناسب الإقامات الأقصر في بودروم بإيقاع مريح ومصقول."
  },
  "gocek-bay-residence": {
    "tr": "Göcek’te deniz günü ile konaklamayı doğal bir akışta birleştiren zarif rezidans.",
    "en": "An elegant Göcek residence designed to pair sea days and stay nights in one fluid rhythm.",
    "ar": "إقامة أنيقة في جوتشيك صيغت لربط أيام البحر وليالي الإقامة ضمن إيقاع واحد سلس."
  },
  "alacati-courtyard-suite": {
    "tr": "Alaçatı atmosferini daha rafine, daha sakin ve daha mahrem bir dilde sunan süit.",
    "en": "A suite that frames Alaçatı in a calmer, more private and more refined register.",
    "ar": "جناح يقدّم أجواء ألاتشاتي بلغة أكثر هدوءاً وخصوصية وأناقة."
  },
  "antalya-riviera-penthouse": {
    "tr": "Daha yüksek hacim, açık manzara ve şehir-konfor dengesini bir araya getiren penthouse.",
    "en": "A penthouse stay balancing open views, generous volume and polished urban comfort.",
    "ar": "إقامة بنتهاوس توازن بين الإطلالات المفتوحة والمساحة الرحبة والراحة الحضرية الراقية."
  },
  "kapadokya-sunrise-classic": {
    "tr": "Kapadokya semalarında gün doğumunu zarif ve dengeli bir uçuşla karşılayan imza deneyim.",
    "en": "A signature Cappadocia flight designed to meet sunrise with poise, calm and a polished pace.",
    "ar": "تجربة منطاد مميزة في كابادوكيا تستقبل شروق الشمس بهدوء واتزان وإيقاع راقٍ."
  },
  "kapadokya-gold-flight": {
    "tr": "Daha özel ve daha sakin bir uçuş formatı arayan misafirler için premium seçenek.",
    "en": "A premium option for guests seeking a more private, more measured balloon format.",
    "ar": "خيار فاخر للضيوف الباحثين عن صيغة طيران أكثر خصوصية وهدوءاً."
  },
  "fairy-valley-private-flight": {
    "tr": "Vadi dokusunu daha mahrem bir perspektiften izlemeye imkân veren özel uçuş.",
    "en": "A private-flight format offering a more intimate perspective over Cappadocia’s valley lines.",
    "ar": "صيغة طيران خاصة تمنح منظوراً أكثر حميمية فوق وديان كابادوكيا."
  },
  "sunrise-photo-chase": {
    "tr": "Görsel ritmi öne çıkan, günün ilk ışıklarıyla planlanan seçili uçuş kurgusu.",
    "en": "A selected dawn-flight concept shaped around first light, visual rhythm and clean timing.",
    "ar": "صيغة طيران مختارة عند الفجر ترتكز على الضوء الأول والإيقاع البصري والتوقيت الدقيق."
  },
  "deluxe-dawn-balloon": {
    "tr": "Daha konforlu hazırlık, daha rafine servis ve daha yumuşak tempo arayanlar için.",
    "en": "For travellers seeking smoother pacing, finer service and a more comfortable dawn ritual.",
    "ar": "للمسافرين الباحثين عن إيقاع أكثر سلاسة وخدمة أرقى وتجربة فجر أكثر راحة."
  },
  "red-valley-signature": {
    "tr": "Kızıl Vadi hattında, manzara etkisini güçlü biçimde hissettiren seçkin uçuş anı.",
    "en": "A distinguished flight over Red Valley, chosen for its strong visual impact and measured rhythm.",
    "ar": "رحلة منطاد مميزة فوق الوادي الأحمر، اختيرت لقوة أثرها البصري وإيقاعها المتزن."
  },
  "family-comfort-balloon": {
    "tr": "Çocuklu aileler için daha rahat hazırlık ve daha dengeli akış sunan uçuş seçeneği.",
    "en": "A family-comfort format with easier preparation, smoother pacing and a more settled rhythm.",
    "ar": "صيغة ملائمة للعائلات، تمنح استعداداً أسهل وإيقاعاً أكثر سلاسة واستقراراً."
  },
  "proposal-balloon-flight": {
    "tr": "Özel anlara daha mahrem ve unutulmaz bir atmosfer kazandırmak için kurgulandı.",
    "en": "Designed to frame milestone moments with a more private and memorable atmosphere.",
    "ar": "صيغت لتمنح اللحظات الخاصة أجواءً أكثر خصوصية ورسوخاً في الذاكرة."
  },
  "seaside-private-villa": {
    "tr": "Denize yakın konum, mahrem yaşam alanı ve yavaş yaz temposunu bir araya getirir.",
    "en": "A private villa pairing sea proximity, residential privacy and an easy summer rhythm.",
    "ar": "فيلا خاصة تجمع قرب البحر مع خصوصية الإقامة وإيقاع صيفي مريح."
  },
  "mediterranean-cliff-villa": {
    "tr": "Akdeniz hattında, manzara etkisini yüksek konfor ve sessiz servisle buluşturan villa.",
    "en": "A Mediterranean cliffside villa blending strong views with quiet comfort and discreet service.",
    "ar": "فيلا على جرف متوسطي تمزج الإطلالات القوية مع الراحة الهادئة والخدمة الرصينة."
  },
  "yalikavak-panorama-estate": {
    "tr": "Yalıkavak’ta geniş kullanım alanı ve açık manzarayla ayrışan özel mülk.",
    "en": "A Yalıkavak estate distinguished by open views, generous space and a composed stay rhythm.",
    "ar": "ملكية خاصة في ياليكافاك تتميز بإطلالات مفتوحة ومساحات واسعة وإقامة متزنة."
  },
  "gocek-pine-retreat": {
    "tr": "Doğa dokusu içinde, deniz günleriyle kolay eşleşen sakin ve seçkin villa konaklaması.",
    "en": "A serene Göcek villa retreat that pairs naturally with sea days and a quieter travel tempo.",
    "ar": "ملاذ فيلا هادئ في جوتشيك ينسجم طبيعياً مع الأيام البحرية وإيقاع سفر أكثر هدوءاً."
  },
  "kas-horizon-house": {
    "tr": "Kaş hattında, gün batımı manzarası ve konut konforunu bir araya getiren özel ev.",
    "en": "A private house in Kaş bringing together sunset views and the ease of a refined residence.",
    "ar": "منزل خاص في كاش يجمع بين إطلالات الغروب وسهولة الإقامة السكنية الراقية."
  },
  "alacati-garden-villa": {
    "tr": "Bahçe kullanımı, mahremiyet ve yazlık yaşam rahatlığını öne çıkaran villa seçeneği.",
    "en": "A garden-led villa option prioritising privacy, ease and a softer summer-living feel.",
    "ar": "خيار فيلا يركز على الحديقة والخصوصية وسهولة الحياة الصيفية الهادئة."
  },
  "fethiye-cove-residence": {
    "tr": "Koylara yakın, daha rahat ve geniş bir aile veya arkadaş konaklaması için ideal.",
    "en": "Ideal for relaxed group stays near the coves, with a more open and comfortable residential feel.",
    "ar": "مثالية للإقامات الجماعية الهادئة قرب الخلجان، بطابع سكني أكثر رحابة وراحة."
  },
  "bodrum-platinum-villa": {
    "tr": "Bodrum’da servis kalitesi, manzara ve villa konforunu güçlü biçimde birleştiren adres.",
    "en": "A Bodrum villa address that brings together service quality, views and elevated comfort.",
    "ar": "عنوان فيلا في بودروم يجمع بقوة بين جودة الخدمة والإطلالات والراحة الرفيعة."
  },
  "vip-transfer-and-karsilama": {
    "tr": "Havalimanı, otel ve marina arasında sakin, konforlu ve zamanlaması güçlü bir ulaşım akışı.",
    "en": "A smooth premium transfer rhythm between airport, hotel and marina, guided by precise timing.",
    "ar": "إيقاع نقل فاخر سلس بين المطار والفندق والمرسى، تقوده دقة عالية في التوقيت."
  },
  "executive-airport-arrival": {
    "tr": "İlk karşılamadan itibaren daha ölçülü, daha konforlu ve daha kusursuz bir giriş deneyimi.",
    "en": "A more polished airport-arrival sequence from the first greeting onward.",
    "ar": "تجربة وصول إلى المطار أكثر أناقة وانضباطاً منذ لحظة الاستقبال الأولى."
  },
  "bodrum-chauffeur-day": {
    "tr": "Gün boyu şehir ve marina geçişleri için planlanmış şoförlü premium araç hizmeti.",
    "en": "A chauffeur-driven premium vehicle planned for Bodrum city, hotel and marina transitions.",
    "ar": "خدمة سيارة فاخرة مع سائق، خُططت لتنقلات بودروم بين المدينة والفندق والمرسى."
  },
  "i-stanbul-executive-drive": {
    "tr": "İstanbul içi yoğun programları daha akıcı ve daha konforlu hâle getiren özel sürüş hizmeti.",
    "en": "A private executive-drive service for navigating Istanbul with greater ease, calm and precision.",
    "ar": "خدمة تنقل تنفيذية خاصة تجعل الحركة داخل إسطنبول أكثر سهولة وهدوءاً ودقة."
  },
  "marina-transfer-suite": {
    "tr": "Marina bağlantıları ve deniz günü başlangıçları için daha rafine bir transfer kurgusu.",
    "en": "A more refined transfer format for marina connections and elegant sea-day departures.",
    "ar": "صيغة نقل أكثر رصانة لاتصالات المرسى وبدايات الأيام البحرية الأنيقة."
  },
  "cappadocia-private-driver": {
    "tr": "Kapadokya’da otel, uçuş alanı ve özel ziyaretler arasında ölçülü özel sürücü hizmeti.",
    "en": "A discreet private-driver service in Cappadocia for hotel, launch-site and bespoke local transfers.",
    "ar": "خدمة سائق خاص رصينة في كابادوكيا للتنقل بين الفندق وموقع الإقلاع والزيارات الخاصة."
  },
  "private-gastronomy-route": {
    "tr": "Seçilmiş masaları, özel tadım anlarını ve zarif servis dilini aynı rotada buluşturur.",
    "en": "Brings selected tables, private tastings and an elegant service language into one curated route.",
    "ar": "يجمع بين الطاولات المختارة وتجارب التذوق الخاصة ولغة خدمة أنيقة ضمن مسار واحد."
  },
  "bosphorus-supper-trail": {
    "tr": "Boğaz hattında akşamı manzara, ritim ve seçilmiş mutfaklarla buluşturan akış.",
    "en": "An evening route along the Bosphorus pairing views, pacing and carefully chosen kitchens.",
    "ar": "مسار مسائي على امتداد البوسفور يجمع الإطلالات والإيقاع والمطابخ المختارة."
  },
  "bodrum-chefs-table-route": {
    "tr": "Bodrum’da mutfak kalitesi ve atmosfer duygusunu öne çıkaran seçkin masa kurgusu.",
    "en": "A Bodrum dining route built around chef-led moments, atmosphere and a stronger culinary point of view.",
    "ar": "مسار تذوق في بودروم يرتكز على لحظات يقودها الطهاة وأجواء مدروسة ورؤية مذاقية أوضح."
  },
  "cappadocia-cellar-journey": {
    "tr": "Mahzen ziyaretleri, seçili eşleşmeler ve yerel lezzetleri rafine bir çizgide birleştirir.",
    "en": "Pairs cellar visits, selected matches and local flavours within a more refined tasting rhythm.",
    "ar": "يجمع زيارات الأقبية والمواءمات المختارة والنكهات المحلية ضمن إيقاع تذوق أكثر رقياً."
  },
  "ege-harvest-and-table": {
    "tr": "Üretim ve masa arasındaki bağı daha yavaş ve daha karakterli bir tempoda hissettirir.",
    "en": "Frames the link between produce and table through a slower, more characterful Aegean rhythm.",
    "ar": "يبرز الصلة بين المنتج والمائدة من خلال إيقاع إيجي أبطأ وأكثر شخصية."
  },
  "private-celebration-design": {
    "tr": "Kutlamaları, konaklamayı ve servis akışını tek bir zarif plan altında birleştiren özel kurgu.",
    "en": "A bespoke format that unifies celebrations, stay design and guest flow under one elegant plan.",
    "ar": "صيغة مخصصة توحّد الاحتفال والإقامة وتدفق الضيوف ضمن خطة واحدة أنيقة."
  },
  "corporate-retreat-curation": {
    "tr": "Kurumsal buluşmalar için daha düzenli, seçkin ve kusursuz bir deneyim çerçevesi sunar.",
    "en": "Creates a more structured, elevated and seamless frame for corporate retreats and gatherings.",
    "ar": "يوفر إطاراً أكثر تنظيماً ورقياً وسلاسة للملتقيات والرحلات المؤسسية."
  },
  "family-heritage-journey": {
    "tr": "Aile ritmini, kuşaklar arası konforu ve özel anları aynı akışta buluşturan seyahat tasarımı.",
    "en": "A bespoke journey design balancing family rhythm, intergenerational comfort and meaningful moments.",
    "ar": "تصميم رحلة مخصص يوازن بين إيقاع العائلة وراحة الأجيال واللحظات ذات المعنى."
  }
};

export const CATEGORY_SECTION_COPY: Record<ExperienceCategory, LocaleCopy> = {
  "YACHT": {
    "tr": "Günlük charter’lardan çok duraklı deniz rotalarına uzanan seçili yat deneyimleri.",
    "en": "Selected yacht experiences ranging from elegant day charters to longer sea routes.",
    "ar": "تجارب يخوت مختارة تمتد من الرحلات اليومية الأنيقة إلى المسارات البحرية الأطول."
  },
  "ACCOMMODATION": {
    "tr": "Mahremiyet, konfor ve güçlü yer duygusunu öne çıkaran seçkin konaklamalar.",
    "en": "Refined stays built around privacy, comfort and a stronger sense of place.",
    "ar": "إقامات راقية ترتكز على الخصوصية والراحة وإحساس أقوى بالمكان."
  },
  "BALLOON": {
    "tr": "Kapadokya semalarında gün doğumunu rafine bir ritimle karşılayan uçuşlar.",
    "en": "Cappadocia balloon flights composed around sunrise, calm pacing and visual clarity.",
    "ar": "رحلات منطاد في كابادوكيا صيغت حول الشروق والإيقاع الهادئ والوضوح البصري."
  },
  "VILLA": {
    "tr": "Kıyı hatlarında mahremiyet ve ikamet konforunu bir araya getiren özel villalar.",
    "en": "Private villas along the coast where residential ease meets privacy and polished comfort.",
    "ar": "فلل خاصة على الخط الساحلي تلتقي فيها سهولة الإقامة مع الخصوصية والراحة الراقية."
  },
  "VIP_TRANSFER": {
    "tr": "Havalimanı, marina ve şehir içi rotalarda kusursuz zamanlamalı premium ulaşım.",
    "en": "Premium transfer formats for airport, marina and in-city routes, led by precise timing.",
    "ar": "صيغ نقل فاخرة للمطار والمرسى والمدينة، يقودها توقيت دقيق."
  },
  "GASTRONOMY": {
    "tr": "Şehrin öne çıkan masalarını ve özel tadım anlarını bir araya getiren rotalar.",
    "en": "Curated routes bringing together standout tables, chef moments and private tastings.",
    "ar": "مسارات منسقة تجمع بين الطاولات البارزة ولحظات الطهاة وتجارب التذوق الخاصة."
  },
  "CUSTOM": {
    "tr": "Kutlamalar, aile seyahatleri ve kurumsal buluşmalar için özel kurgular.",
    "en": "Bespoke formats for celebrations, family journeys and corporate gatherings.",
    "ar": "صيغ مخصصة للاحتفالات والرحلات العائلية واللقاءات المؤسسية."
  }
};

export const CATEGORY_COVER_MAP: Record<ExperienceCategory, string> = {
  "YACHT": "/images/categories/yacht-charter.jpg",
  "ACCOMMODATION": "/images/categories/accommodation.jpg",
  "BALLOON": "/images/categories/balloon-flights.jpg",
  "VILLA": "/images/categories/private-villas.jpg",
  "VIP_TRANSFER": "/images/categories/vip-transfer.jpg",
  "GASTRONOMY": "/images/categories/gastronomy.jpg",
  "CUSTOM": "/images/categories/bespoke-experiences.jpg"
};

function assertExperienceAssets() {
  const publicDir = path.join(process.cwd(), 'public');
  const values = Object.values(EXPERIENCE_IMAGE_MAP);
  const seen = new Set<string>();
  for (const imagePath of values) {
    if (seen.has(imagePath)) {
      throw new Error(`Duplicate experience image mapping detected: ${imagePath}`);
    }
    seen.add(imagePath);
    const absolute = path.join(publicDir, imagePath.replace(/^\//, ''));
    if (!fs.existsSync(absolute)) {
      throw new Error(`Missing local experience image: ${imagePath}`);
    }
  }
  for (const imagePath of Object.values(CATEGORY_COVER_MAP)) {
    const absolute = path.join(publicDir, imagePath.replace(/^\//, ''));
    if (!fs.existsSync(absolute)) {
      throw new Error(`Missing category cover image: ${imagePath}`);
    }
  }
}

assertExperienceAssets();

export function getExperienceImage(slug?: string | null) {
  if (!slug) return '/images/default-card.svg';
  return EXPERIENCE_IMAGE_MAP[slug as keyof typeof EXPERIENCE_IMAGE_MAP] ?? '/images/default-card.svg';
}

export function getExperienceCopy(slug: string | undefined, locale: AppLocale, fallback: string) {
  if (!slug) return fallback;
  return EXPERIENCE_COPY_MAP[slug]?.[locale] ?? fallback;
}

export function getCategoryCover(category: ExperienceCategory) {
  return CATEGORY_COVER_MAP[category];
}

export function getCategorySectionCopy(category: ExperienceCategory, locale: AppLocale) {
  return CATEGORY_SECTION_COPY[category]?.[locale] ?? '';
}
