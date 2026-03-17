'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-white">
      <div>
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-white/64">A recoverable application error occurred.</p>
        <div className="mt-8"><Button onClick={reset}>Try again</Button></div>
      </div>
    </div>
  );
}
