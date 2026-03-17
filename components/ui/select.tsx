import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'flex h-12 w-full rounded-2xl border border-white/12 bg-[#111117] px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold',
        props.className
      )}
    />
  );
}
