# AS LOF TOUR — Next.js Premium Website

Bu proje Next.js App Router ile hazırlanmıştır.

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda aç:

```text
http://localhost:3000
```

Kök dizin otomatik olarak `/tr` sayfasına yönlenir.

## Dil Yapısı

- Türkçe: `/tr`
- İngilizce: `/en`
- Arapça: `/ar`

Arapça sürüm RTL olarak çalışır.

## Sayfalar

- `app/[locale]/page.tsx` — ana sayfa
- `app/[locale]/experiences/page.tsx` — deneyimler
- `app/[locale]/booking/page.tsx` — rezervasyon
- `app/[locale]/payment/page.tsx` — ödeme
- `app/[locale]/about/page.tsx` — hakkımızda
- `app/[locale]/contact/page.tsx` — iletişim
- `app/[locale]/policies/page.tsx` — önemli bilgiler / SSS

## İçerik

Metinler ve deneyim verileri `lib/site-content.ts` dosyasındadır.

## Not

Bu sürüm ön yüz, kullanıcı akışı ve çok dilli yapı için hazırlanmıştır.
Canlı ödeme almak için daha sonra Akbank / Halkbank sanal POS backend entegrasyonu eklenmelidir.
