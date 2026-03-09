import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AS LOF TOUR',
  description: 'Premium travel, yacht charter and curated stay website for AS LOF TOUR.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
