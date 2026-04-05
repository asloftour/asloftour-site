import { NextRequest, NextResponse } from 'next/server';
import { finalizeHalkbank3DPayment } from '@/lib/payment/service';

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
  return NextResponse.redirect(buildResultUrl(request, locale, 'success'), 303);
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
    const result = await finalizeHalkbank3DPayment({ body, query });
    return NextResponse.redirect(
      buildResultUrl(request, locale, result.success ? 'success' : 'fail', result.details),
      303
    );
  } catch (error) {
    console.error('Halkbank 3D finalize failed on success route', error);
    return NextResponse.redirect(
      buildResultUrl(request, locale, 'fail', {
        ErrMsg: error instanceof Error ? error.message : '3D finalization failed'
      }),
      303
    );
  }
}
