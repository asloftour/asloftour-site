import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { uploadFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  const altText = String(formData.get('altText') || '');
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'File missing.' }, { status: 400 });
  }

  const uploaded = await uploadFile(file, 'media');
  const asset = await db.mediaAsset.create({
    data: {
      uploaderId: session.user.id,
      fileName: uploaded.fileName,
      originalName: file.name,
      mimeType: uploaded.mimeType,
      size: uploaded.size,
      url: uploaded.url,
      altText
    }
  });

  return NextResponse.json(asset);
}
