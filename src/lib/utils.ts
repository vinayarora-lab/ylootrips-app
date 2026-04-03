import { type ClassValue, clsx } from "clsx";
import { USD_TO_INR } from "@/lib/currency";
import type { Currency } from "@/lib/currency";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatPrice(price: number | string | any): string {
    // Handle BigDecimal from backend (can be object with value property)
    let numPrice: number;
    if (typeof price === 'object' && price !== null && 'value' in price) {
        numPrice = parseFloat(price.value.toString());
    } else if (typeof price === 'string') {
        numPrice = parseFloat(price);
    } else {
        numPrice = Number(price) || 0;
    }
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numPrice);
}

export function calculateDiscount(originalPrice: number | string | any, currentPrice: number | string | any): number {
    let orig: number;
    let curr: number;
    
    // Handle BigDecimal from backend
    if (typeof originalPrice === 'object' && originalPrice !== null && 'value' in originalPrice) {
        orig = parseFloat(originalPrice.value.toString());
    } else {
        orig = Number(originalPrice) || 0;
    }
    
    if (typeof currentPrice === 'object' && currentPrice !== null && 'value' in currentPrice) {
        curr = parseFloat(currentPrice.value.toString());
    } else {
        curr = Number(currentPrice) || 0;
    }
    
    if (orig === 0) return 0;
    return Math.round(((orig - curr) / orig) * 100);
}

/**
 * Currency-aware price formatter.
 * currency = 'USD'  → converts INR → USD at USD_TO_INR rate, formats as "$1,200"
 * currency = 'INR'  → formats as "₹1,00,000"
 */
export function formatPriceWithCurrency(
  price: number | string | Record<string, unknown>,
  currency: Currency = 'INR'
): string {
  let numPrice: number;
  if (typeof price === 'object' && price !== null && 'value' in price) {
    numPrice = parseFloat(String(price.value));
  } else if (typeof price === 'string') {
    numPrice = parseFloat(price);
  } else {
    numPrice = Number(price) || 0;
  }

  if (currency === 'USD') {
    const usdPrice = numPrice / USD_TO_INR;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(usdPrice);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
