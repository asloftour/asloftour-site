import { NextRequest, NextResponse } from 'next/server';
import { storeHalkbank3DCallbackSnapshot } from '@/lib/payment/service';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries()) as Record<string, string>;
  const query = Object.fromEntries(request.nextUrl.searchParams.entries()) as Record<string, string>;

  try {
    await storeHalkbank3DCallbackSnapshot({ body, query });
  } catch (error) {
    console.error('Halkbank callback snapshot failed', error);
  }

  return new NextResponse('Approved', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

export async function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
