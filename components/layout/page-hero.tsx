import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { AppLocale } from '@/i18n/routing';
import { tLocale, ui } from '@/lib/public-copy';

export function PageHero({
  locale,
  eyebrow,
  title,
  description,
  showActions = true
}: {
  locale: AppLocale;
  eyebrow?: string;
  title: string;
  description: string;
  showActions?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-[radial-gradient(circle_at_top,rgba(201,168,106,0.18),transparent_32%),linear-gradient(180deg,#121218_0%,#0b0b0e_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a86a] to-transparent" />
        <div className="absolute -left-24 top-20 h-56 w-56 rounded-full bg-[#c9a86a]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#3f4a64]/20 blur-3xl" />
      </div>
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {eyebrow ? <Badge>{eyebrow}</Badge> : null}
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{description}</p>
            {showActions ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild><Link href={`/${locale}/booking`}>{tLocale(ui.hero.book, locale)}</Link></Button>
                <Button variant="secondary" asChild><Link href={`/${locale}/experiences`}>{tLocale(ui.hero.explore, locale)}</Link></Button>
              </div>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:col-span-1">
              <Image src="/images/categories/yacht-charter.jpg" alt="Yacht charter" fill className="object-cover" priority />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                <div className="text-xs uppercase tracking-[0.28em] text-white/55">{tLocale(ui.hero.signature, locale)}</div>
                <div className="mt-2 text-xl font-medium text-white">{tLocale(ui.hero.yacht, locale)}</div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="relative min-h-[152px] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <Image src="/images/categories/private-villas.jpg" alt="Private villa" fill className="object-cover" priority />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <div className="text-lg font-medium text-white">{tLocale(ui.hero.villa, locale)}</div>
                </div>
              </div>
              <div className="relative min-h-[152px] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <Image src="/images/categories/balloon-flights.jpg" alt="Balloon flights" fill className="object-cover" priority />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <div className="text-lg font-medium text-white">{tLocale(ui.hero.balloon, locale)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
