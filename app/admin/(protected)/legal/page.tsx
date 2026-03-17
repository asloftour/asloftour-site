import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function LegalAdminPage() {
  const docs = await db.legalDocument.findMany({ orderBy: [{ type: 'asc' }, { locale: 'asc' }] });

  async function updateDoc(formData: FormData) {
    'use server';
    const id = String(formData.get('id'));
    await db.legalDocument.update({ where: { id }, data: { title: String(formData.get('title')), excerpt: String(formData.get('excerpt') || ''), content: String(formData.get('content')), version: { increment: 1 } } });
  }

  return <div className="space-y-6">{docs.map((doc) => <Card key={doc.id}><CardContent><form action={updateDoc} className="grid gap-4"><input type="hidden" name="id" value={doc.id} /><div className="text-sm text-white/50">{doc.type} · {doc.locale}</div><input name="title" defaultValue={doc.title} className="h-12 rounded-2xl border border-white/12 bg-white/4 px-4 text-sm text-white" /><input name="excerpt" defaultValue={doc.excerpt || ''} className="h-12 rounded-2xl border border-white/12 bg-white/4 px-4 text-sm text-white" /><textarea name="content" defaultValue={doc.content} className="min-h-64 rounded-2xl border border-white/12 bg-white/4 p-4 text-sm text-white" /><Button type="submit">Save document</Button></form></CardContent></Card>)}</div>;
}
