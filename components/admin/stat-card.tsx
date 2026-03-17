import { Card, CardContent } from '@/components/ui/card';

export function StatCard({ label, value, help }: { label: string; value: string | number; help?: string }) {
  return (
    <Card>
      <CardContent>
        <div className="text-sm text-white/52">{label}</div>
        <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
        {help ? <div className="mt-2 text-sm text-white/48">{help}</div> : null}
      </CardContent>
    </Card>
  );
}
