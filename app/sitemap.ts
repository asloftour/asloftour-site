import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const routes = ['', '/experiences', '/booking', '/payment', '/about', '/contact', '/faq', '/policies', '/privacy', '/cookies', '/distance-sales', '/cancellation-refund', '/pre-information', '/service-agreement'];
  const locales = ['tr', 'en', 'ar'];
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date()
    }))
  );
}
