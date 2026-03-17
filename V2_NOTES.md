# AS LOF TOUR v2 notes

This package is intended as a **clean full replacement** for the current repo content.

## Major fixes included
- Admin login loop removed via route grouping (`app/admin/login` + `app/admin/(protected)` only)
- Public pages rewritten with proper Turkish / English / Arabic copy on key screens
- Footer legal labels translated
- Page hero buttons now respect current locale
- Booking estimated total now follows pricing mode logic
- Contact / inquiry / payment / transfer proof forms localized
- Email defaults switched to `asloftour@gmail.com`
- Direct DB support added (`DIRECT_URL`) for Prisma + Neon
- Premium local SVG image set added / refreshed for hero, yachts, stays, villas, balloons, transfers and gastronomy
- Seed expanded with additional experiences

## Important replacement rule
Do **not** overlay this on top of old admin files.
Delete all visible old files first, keep only `.git` and `.env`, then copy this package.

## Validation note
I was able to patch structure and logic and package the project for replacement. In this isolated environment I could not complete a full Next production build against your live database and Vercel runtime, so your local verification steps remain necessary:
- `npm install`
- `npx prisma generate`
- `npm run dev`
- `npm run db:seed` (optional but recommended for refreshed visuals and added inventory)
