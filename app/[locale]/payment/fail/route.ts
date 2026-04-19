import { NextRequest, NextResponse } from 'next/server';
import { handleProviderCallback } from '@/lib/payment/service';

function buildResultUrl(
  request: NextRequest,
  locale: string,
  status: 'success' | 'fail',
  details?: Record<string, string | null | undefined>
) {
  const target = new URL(`/${locale}/payment/result`, request.nextUrl.origin);
  target.searchParams.set('status', status);

  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    target.searchParams.set(key, value);
  }

  Object.entries(details || {}).forEach(([key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      target.searchParams.set(key, value);
    }
  });

  return target;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  return NextResponse.redirect(buildResultUrl(request, locale, 'fail'), 303);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> }
) {
  const { locale } = await context.params;
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries()) as Record<string, string>;
  const query = Object.fromEntries(request.nextUrl.searchParams.entries()) as Record<string, string>;

  try {
    const result = await handleProviderCallback({
      provider: 'HALKBANK' as any,
      body,
      query
    });

    return NextResponse.redirect(
      buildResultUrl(request, locale, result.success ? 'success' : 'fail', {
        reservation: result.reservationId
      }),
      303
    );
  } catch (error) {
    console.error('Halkbank callback failed on fail route', error);
    return NextResponse.redirect(
      buildResultUrl(request, locale, 'fail', {
        ErrMsg: error instanceof Error ? error.message : '3D callback failed'
      }),
      303
    );
  }
}