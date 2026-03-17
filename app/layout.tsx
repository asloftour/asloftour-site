import './globals.css';
import type { Metadata } from 'next';
import { company } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${company.name} | ${company.slogan}`,
    template: `%s | ${company.name}`
  },
  description: 'Premium travel design, yacht charter, luxury accommodation, private balloon flights, VIP transfers and bespoke journeys.',
  applicationName: company.name,
  openGraph: {
    title: `${company.name} | ${company.slogan}`,
    description: 'Premium travel design and private experiences across Türkiye.',
    siteName: company.name,
    images: ['/images/default-card.svg'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: `${company.name} | ${company.slogan}`,
    description: 'Premium travel design and private experiences across Türkiye.',
    images: ['/images/default-card.svg']
  },
  icons: {
    icon: '/favicon.svg'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
