'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function MediaUploader() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setStatus(null);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    setStatus(response.ok ? 'Upload complete.' : 'Upload failed.');
  }

  return (
    <Card>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <input type="file" name="file" className="block w-full text-sm text-white/80" />
          <input type="text" name="altText" placeholder="Alt text" className="flex h-12 w-full rounded-2xl border border-white/12 bg-white/4 px-4 py-2 text-sm text-white" />
          <Button type="submit">Upload media</Button>
          {status ? <p className="text-sm text-white/70">{status}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
