import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paymentId = String(formData.get('paymentId') || '');
    const note = String(formData.get('note') || '');
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'File is required.' }, { status: 400 });
    }
    const uploaded = await uploadFile(file, 'transfer-proofs');
    const proof = await db.transferProof.create({
      data: {
        paymentId,
        fileName: uploaded.fileName,
        originalName: file.name,
        mimeType: uploaded.mimeType,
        fileSize: uploaded.size,
        fileUrl: uploaded.url,
        note,
        status: 'PENDING'
      }
    });
    await db.payment.update({ where: { id: paymentId }, data: { status: 'PENDING_REVIEW' } });
    return NextResponse.json({ proofId: proof.id });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Upload failed.' }, { status: 400 });
  }
}
