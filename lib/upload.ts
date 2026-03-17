import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';

export async function uploadFile(file: File, folder = 'uploads') {
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${fileName}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type
    });

    return {
      fileName,
      url: blob.url,
      size: file.size,
      mimeType: file.type
    };
  }

  const baseDir = process.env.UPLOAD_FALLBACK_DIR || './public/uploads';
  const targetDir = path.resolve(process.cwd(), baseDir, folder);
  await mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fileName);
  await writeFile(targetPath, buffer);

  return {
    fileName,
    url: targetPath.replace(path.resolve(process.cwd(), 'public'), ''),
    size: file.size,
    mimeType: file.type
  };
}
