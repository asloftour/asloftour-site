import { company } from '@/lib/site-content';

type Props = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: Props) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`}>
      <div className="brand__name">{company.brand}</div>
      <div className="brand__tagline">{company.tagline}</div>
    </div>
  );
}
