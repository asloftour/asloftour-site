import { cn } from '@/lib/utils';

export function RichText({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn('prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-white/74 prose-li:text-white/74 prose-strong:text-white', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
