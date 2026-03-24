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

  if (process.env.VERCEL) {
    throw new Error('BLOB_READ_WRITE_TOKEN is required on Vercel for file uploads.');
  }

  const { mkdir, writeFile } = await import('node:fs/promises');
  const path = await import('node:path');

  const baseDir = './public/uploads';
  const targetDir = path.resolve(process.cwd(), baseDir, folder);
  await mkdir(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, fileName);
  await writeFile(targetPath, buffer);

  return {
    fileName,
    url: `/uploads/${folder}/${fileName}`,
    size: file.size,
    mimeType: file.type
  };
}