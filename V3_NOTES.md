# AS LOF TOUR V3 Notes

Bu sürümde yapılan ana düzeltmeler:

- `/[locale]/payment` artık rezervasyon parametresi olmadan 404 vermez; ödeme yöntemlerini ve yasal akışı gösteren bir ön izleme ekranı olarak çalışır.
- Gerçek POS aktif değilse kart yöntemi ekranda görünür ama durum etiketi ile test / pasif / hazır ayrımı gösterilir.
- `/admin/payment-settings` içine IBAN alanları, ödeme yöntemi toggle'ları ve MOCK test akışı kontrolü eklendi.
- Çerez kabul / reddet banner'ı eklendi.
- Header ve footer sloganı el yazısı tarzında sunuldu.
- Seed veri seti 50 deneyime çıkarıldı.
- Her deneyim için ayrı görsel dosyası üretildi: `public/images/experiences/exp-01.svg` ... `exp-50.svg` ve detail varyantları.
- Metin tonu daha premium ve rafine olacak şekilde güncellendi.

## Kurulum sonrası zorunlu komutlar

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

## Önemli

50 ürün ve yeni görsellerin görünmesi için `npm run db:seed` komutunu tekrar çalıştırman gerekir.
