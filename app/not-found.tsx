import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-white">
      <div>
        <div className="text-sm uppercase tracking-[0.3em] text-white/44">404</div>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-white/64">The page you requested could not be located.</p>
        <div className="mt-8">
          <Button asChild><Link href="/tr">Return home</Link></Button>
        </div>
      </div>
    </div>
  );
}
