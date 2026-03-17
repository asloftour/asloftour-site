import { Payment, PaymentAttempt, PaymentProvider, PaymentProviderSetting, Reservation } from '@prisma/client';

export type PaymentInitResult =
  | { mode: 'redirect'; redirectUrl: string }
  | { mode: 'post'; action: string; fields: Record<string, string> };

export type VerifyResult = {
  approved: boolean;
  verified: boolean;
  transactionReference?: string;
  cardBrand?: string;
  message?: string;
  raw?: unknown;
};

export type PaymentContext = {
  payment: Payment;
  attempt: PaymentAttempt;
  reservation: Reservation;
  setting: PaymentProviderSetting;
  locale: string;
  successUrl: string;
  failUrl: string;
  callbackUrl: string;
};

export interface PaymentProviderContract {
  key: PaymentProvider;
  start3DS(context: PaymentContext): Promise<PaymentInitResult>;
  verifyCallback(input: {
    setting: PaymentProviderSetting;
    body: Record<string, string>;
    query: Record<string, string>;
  }): Promise<VerifyResult>;
}
