'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { USD_TO_INR } from '@/lib/currency';
import type { Currency } from '@/lib/currency';

// Re-export so existing imports still work
export { USD_TO_INR } from '@/lib/currency';
export type { Currency } from '@/lib/currency';

interface CurrencyContextValue {
  currency: Currency;
  toggle: () => void;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  toggle: () => {},
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Default to USD — targeting international visitors
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const toggle = () =>
    setCurrencyState((prev) => (prev === 'INR' ? 'USD' : 'INR'));

  const setCurrency = (c: Currency) => setCurrencyState(c);

  return (
    <CurrencyContext.Provider value={{ currency, toggle, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
