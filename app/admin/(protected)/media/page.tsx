import { db } from '@/lib/db';
import { MediaUploader } from '@/components/admin/media-uploader';
import { Card, CardContent } from '@/components/ui/card';

export default async function MediaPage() {
  const assets = await db.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return <div className="space-y-6"><MediaUploader /><Card><CardContent><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <div key={asset.id} className="rounded-2xl border border-white/10 bg-white/4 p-4"><div className="text-sm font-medium text-white">{asset.originalName}</div><a href={asset.url} className="mt-2 inline-block text-sm text-gold">Open file</a><div className="mt-2 text-xs text-white/44">{asset.mimeType} · {asset.size} bytes</div></div>)}</div></CardContent></Card></div>;
}
