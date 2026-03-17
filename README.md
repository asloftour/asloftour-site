# AS LOF TOUR

Production-grade Next.js booking and payment platform for AS LOF TOUR.

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- next-intl
- PostgreSQL + Prisma
- Auth.js credentials auth for admin
- Zod + React Hook Form
- Resend or SMTP email delivery
- Vercel Blob or local upload fallback
- Provider-based Turkish virtual POS architecture with working MOCK 3D Secure flow

## Routes
### Public
- /tr, /en, /ar
- /[locale]/experiences
- /[locale]/experiences/[slug]
- /[locale]/booking
- /[locale]/payment
- /[locale]/about
- /[locale]/contact
- /[locale]/faq
- /[locale]/policies
- /[locale]/success
- /[locale]/fail
- /[locale]/bank-transfer
- /[locale]/privacy
- /[locale]/cookies
- /[locale]/distance-sales
- /[locale]/cancellation-refund
- /[locale]/pre-information
- /[locale]/service-agreement

### Admin
- /admin/login
- /admin
- /admin/reservations
- /admin/reservations/[id]
- /admin/inquiries
- /admin/inquiries/[id]
- /admin/payments
- /admin/payments/[id]
- /admin/experiences
- /admin/experiences/new
- /admin/experiences/[id]/edit
- /admin/legal
- /admin/settings
- /admin/users
- /admin/media
- /admin/payment-settings

## Local setup
1. Copy `.env.example` to `.env`.
2. Create PostgreSQL database.
3. Install packages: `npm install`
4. Run migrations: `npx prisma migrate deploy`
5. Seed data: `npm run db:seed`
6. Start dev server: `npm run dev`

## Default admin
Configured through env values:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_ADMIN_NAME`

Default fallback values:
- Email: `asloftour@gmail.com`
- Password: `ChangeMe123!`

Rotate these immediately after first login.

## Deployment on Vercel
1. Create a Vercel project from the repository.
2. Provision PostgreSQL (Neon, Supabase, RDS, Vercel Postgres, or existing managed Postgres).
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` to the live domain.
5. Set a strong `AUTH_SECRET` and `ENCRYPTION_KEY`.
6. Run `prisma migrate deploy` during build or as a post-deploy step.
7. Seed once with `npm run db:seed` from a secure environment.
8. Log into `/admin`, update payment settings, IBAN, legal texts, and merchant credentials.

## Payment provider architecture
- Flow logic calls one service: `lib/payment/service.ts`
- Service reads encrypted provider config from database on every transaction
- Provider is selected dynamically from `PaymentProviderSetting`
- Working end-to-end provider: `MOCK`
- Real-bank-ready adapters included: `AKBANK`, `HALKBANK`, `GENERIC_VPOS`
- Credentials are edited from `/admin/payment-settings`
- `storeKey` is encrypted at rest and masked in admin UI
- TEST/LIVE switching is stored in DB and does not require redeploy

## Environment variables for bank integrations
- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ENCRYPTION_KEY`
- `EMAIL_FROM`
- `RESEND_API_KEY` or SMTP credentials
- `BLOB_READ_WRITE_TOKEN` for uploads on Vercel
- `WHATSAPP_NUMBER`

Merchant credentials themselves are not stored in env. They are stored in the database and managed from `/admin/payment-settings`.

## Live launch checklist
- [ ] Production domain connected
- [ ] PostgreSQL backups enabled
- [ ] AUTH_SECRET rotated
- [ ] ENCRYPTION_KEY rotated
- [ ] Resend or SMTP configured
- [ ] Blob token configured for uploads
- [ ] Real IBAN entered in admin settings
- [ ] Legal documents reviewed by counsel
- [ ] Payment provider credentials entered in admin panel
- [ ] Payment callback URLs whitelisted by provider
- [ ] Admin default password changed
- [ ] Test reservation completed
- [ ] Test bank transfer proof approved
- [ ] MOCK 3D flow verified in staging
- [ ] Success and fail pages checked on mobile and desktop

## Notes on real bank activation
This code intentionally does not guess undocumented Turkish bank 3D hash formulas. The payment flow, callbacks, provider registry, credential storage, audit trail, and admin management are complete. The `MOCK` provider is fully executable for testing. `AKBANK`, `HALKBANK`, and `GENERIC_VPOS` adapters are isolated so bank-issued field maps and signature routines can be applied without changing booking or checkout flow logic.
