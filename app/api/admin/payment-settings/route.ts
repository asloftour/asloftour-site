import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { savePaymentSetting } from '@/lib/payment/settings';
import { saveProviderApiCredential } from '@/lib/payment/provider-api-credentials';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const provider = String(formData.get('provider')) as any;

  await savePaymentSetting({
    provider,
    merchantId: String(formData.get('merchantId') || ''),
    terminalId: String(formData.get('terminalId') || ''),
    storeKey: String(formData.get('storeKey') || ''),
    apiUrl: String(formData.get('apiUrl') || ''),
    successUrl: String(formData.get('successUrl') || ''),
    failUrl: String(formData.get('failUrl') || ''),
    callbackUrl: String(formData.get('callbackUrl') || ''),
    testMode: formData.get('testMode') === 'on',
    active: formData.get('active') === 'on'
  });

  await saveProviderApiCredential({
    provider,
    username: String(formData.get('apiUsername') || ''),
    password: String(formData.get('apiPassword') || '')
  });

  const bankTransfer = {
    accountName: String(formData.get('bankTransferAccountName') || 'AS LOF TOUR'),
    bankName: String(formData.get('bankTransferBankName') || ''),
    iban: String(formData.get('bankTransferIban') || ''),
    enabled: formData.get('bankTransferEnabled') === 'on'
  };

  const paymentOptions = {
    enableCard: formData.get('enableCard') === 'on',
    enableBankTransfer: formData.get('enableBankTransfer') === 'on',
    enablePaymentLink: formData.get('enablePaymentLink') === 'on',
    allowMockProvider: formData.get('allowMockProvider') === 'on'
  };

  await db.siteSetting.upsert({
    where: { key: 'bankTransfer' },
    update: { value: bankTransfer, type: 'json' },
    create: { key: 'bankTransfer', value: bankTransfer, type: 'json' }
  });

  await db.siteSetting.upsert({
    where: { key: 'paymentOptions' },
    update: { value: paymentOptions, type: 'json' },
    create: { key: 'paymentOptions', value: paymentOptions, type: 'json' }
  });

  return NextResponse.json({ ok: true });
}
