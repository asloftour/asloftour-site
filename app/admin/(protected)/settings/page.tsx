import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
  const settings = await db.siteSetting.findMany({ orderBy: { key: 'asc' } });

  async function updateSetting(formData: FormData) {
    'use server';
    const key = String(formData.get('key'));
    const raw = String(formData.get('value') || '{}');
    await db.siteSetting.update({ where: { key }, data: { value: JSON.parse(raw) } });
  }

  return <div className="space-y-6">{settings.map((setting) => <Card key={setting.id}><CardContent><form action={updateSetting} className="grid gap-4"><input type="hidden" name="key" value={setting.key} /><div className="text-lg font-semibold text-white">{setting.key}</div><textarea name="value" defaultValue={JSON.stringify(setting.value, null, 2)} className="min-h-56 rounded-2xl border border-white/12 bg-white/4 p-4 text-sm text-white" /><Button type="submit">Save setting</Button></form></CardContent></Card>)}</div>;
}
