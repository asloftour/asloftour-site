import { PricingMode } from '@prisma/client';

export type PricingInput = {
  pricingMode: PricingMode;
  basePrice: number;
  guestCount: number;
  startDate: Date;
  endDate: Date;
};

export function diffInNights(startDate: Date, endDate: Date) {
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000));
}

export function diffInWeeks(startDate: Date, endDate: Date) {
  return Math.max(1, Math.ceil(diffInNights(startDate, endDate) / 7));
}

function bookingGuestMultiplier(guestCount: number) {
  if (guestCount <= 4) return 1;
  if (guestCount <= 8) return 1.12;
  if (guestCount <= 12) return 1.24;
  return 1.36;
}

export function calculateTotal(input: PricingInput) {
  const nights = diffInNights(input.startDate, input.endDate);

  switch (input.pricingMode) {
    case 'PER_BOOKING':
      return Math.round(input.basePrice * nights * bookingGuestMultiplier(input.guestCount));
    case 'PER_TRANSFER':
      return input.basePrice;
    case 'PER_PERSON':
      return input.basePrice * input.guestCount;
    case 'PER_NIGHT':
      return input.basePrice * nights;
    case 'PER_WEEK':
      return input.basePrice * diffInWeeks(input.startDate, input.endDate);
    case 'CUSTOM':
      return input.basePrice;
    default:
      return input.basePrice;
  }
}
