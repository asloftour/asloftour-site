import { z } from 'zod';

const basePhone = z.string().min(7).max(20);

export const bookingSchema = z.object({
  locale: z.enum(['tr', 'en', 'ar']),
  experienceId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  guestCount: z.coerce.number().int().min(1).max(20),
  fullName: z.string().min(2).max(120),
  phone: basePhone,
  email: z.string().email(),
  specialRequests: z.string().max(2000).optional().or(z.literal('')),
  addTransfer: z.coerce.boolean().optional().default(false),
  billingType: z.enum(['INDIVIDUAL', 'COMPANY']).optional().or(z.literal('')),
  billingFullName: z.string().max(120).optional().or(z.literal('')),
  billingCompany: z.string().max(160).optional().or(z.literal('')),
  billingTaxOffice: z.string().max(160).optional().or(z.literal('')),
  billingTaxNumber: z.string().max(32).optional().or(z.literal('')),
  billingAddress: z.string().max(320).optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal(''))
}).superRefine((value, ctx) => {
  const start = new Date(value.startDate);
  const end = new Date(value.endDate);
  if (end <= start) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'End date must be after start date.' });
  }
});

export const contactSchema = z.object({
  locale: z.enum(['tr', 'en', 'ar']),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
  website: z.string().max(0).optional().or(z.literal(''))
});

export const inquirySchema = z.object({
  locale: z.enum(['tr', 'en', 'ar']),
  type: z.enum(['GENERAL', 'PRIVATE_PLANNING', 'APPOINTMENT']),
  experienceId: z.string().optional().or(z.literal('')),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: basePhone,
  company: z.string().max(120).optional().or(z.literal('')),
  message: z.string().min(10).max(2000),
  preferredDate: z.string().optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal(''))
});

export const paymentInitSchema = z.object({
  locale: z.enum(['tr', 'en', 'ar']),
  reservationId: z.string().min(1),
  method: z.enum(['CARD_3D', 'BANK_TRANSFER', 'PAYMENT_LINK']),
  installment: z.coerce.number().int().min(1).max(12).default(1),
  provider: z.enum(['MOCK', 'GENERIC_VPOS', 'AKBANK', 'HALKBANK']).optional()
});

export const transferProofSchema = z.object({
  paymentId: z.string().min(1),
  note: z.string().max(1000).optional().or(z.literal(''))
});
