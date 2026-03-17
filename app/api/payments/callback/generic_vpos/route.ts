import { NextRequest, NextResponse } from 'next/server';
import { handleProviderCallback } from '@/lib/payment/service';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries()) as Record<string, string>;
  const result = await handleProviderCallback({ provider: 'GENERIC_VPOS' as any, body });
  return NextResponse.redirect(new URL(`/${result.locale}/${result.success ? 'success' : 'fail'}?reservation=${result.reservationId}`, request.url));
}

export async function GET(request: NextRequest) {
  const query = Object.fromEntries(request.nextUrl.searchParams.entries()) as Record<string, string>;
  const result = await handleProviderCallback({ provider: 'GENERIC_VPOS' as any, body: query, query });
  return NextResponse.redirect(new URL(`/${result.locale}/${result.success ? 'success' : 'fail'}?reservation=${result.reservationId}`, request.url));
}
