export interface PromoCode {
  code: string;
  title: string;
  desc: string;
  type: 'percent' | 'flat';
  value: number;       // percent (0-100) or flat INR amount
  minOrder: number;    // minimum order in INR
  maxDiscount?: number; // cap for percent discounts (INR)
  validTill: string;
}

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    title: '10% Off First Booking',
    desc: 'Welcome offer for new travelers',
    type: 'percent',
    value: 10,
    minOrder: 2000,
    maxDiscount: 5000,
    validTill: '31 Dec 2026',
  },
  {
    code: 'TRIPFIVE',
    title: '₹500 Off',
    desc: 'Flat ₹500 off on bookings above ₹5,000',
    type: 'flat',
    value: 500,
    minOrder: 5000,
    validTill: '30 Jun 2026',
  },
  {
    code: 'HOLIDAY15',
    title: '15% Off Holiday Packages',
    desc: 'Special discount on packages above ₹25,000',
    type: 'percent',
    value: 15,
    minOrder: 25000,
    maxDiscount: 10000,
    validTill: '15 Aug 2026',
  },
  {
    code: 'INDIATRAVEL',
    title: '₹1,000 Off India Tours',
    desc: 'Flat ₹1,000 off on curated India tours',
    type: 'flat',
    value: 1000,
    minOrder: 15000,
    validTill: '31 Mar 2027',
  },
];

export type PromoResult =
  | { valid: true; promo: PromoCode; discount: number }
  | { valid: false; error: string };

export function applyPromoCode(code: string, orderTotal: number): PromoResult {
  const promo = PROMO_CODES.find(
    (p) => p.code.toUpperCase() === code.trim().toUpperCase()
  );

  if (!promo) {
    return { valid: false, error: 'Invalid promo code. Please check and try again.' };
  }

  if (orderTotal < promo.minOrder) {
    return {
      valid: false,
      error: `Minimum order of ₹${promo.minOrder.toLocaleString('en-IN')} required for this code.`,
    };
  }

  const discount =
    promo.type === 'percent'
      ? Math.min(
          Math.round((orderTotal * promo.value) / 100),
          promo.maxDiscount ?? Infinity
        )
      : promo.value;

  return { valid: true, promo, discount };
}
