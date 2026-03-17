import { cn } from '@/lib/utils';

export function StatusBadge({ value }: { value: string }) {
  const tone = value.includes('PAID') || value.includes('APPROVED')
    ? 'bg-emerald-400/12 text-emerald-200 border-emerald-400/20'
    : value.includes('FAILED') || value.includes('REJECTED') || value.includes('CANCELLED')
      ? 'bg-red-400/12 text-red-200 border-red-400/20'
      : value.includes('PENDING') || value.includes('NEW')
        ? 'bg-amber-400/12 text-amber-100 border-amber-400/20'
        : 'bg-white/8 text-white/80 border-white/10';

  return <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', tone)}>{value}</span>;
}
