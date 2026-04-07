'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type VisitorType = 'indian' | 'foreigner' | null;

interface VisitorContextValue {
  visitor: VisitorType;
  setVisitor: (v: VisitorType) => void;
  hasChosen: boolean;
}

const VisitorContext = createContext<VisitorContextValue>({
  visitor: null,
  setVisitor: () => {},
  hasChosen: false,
});

const STORAGE_KEY = 'ylootrips-visitor';

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [visitor, setVisitorState] = useState<VisitorType>('indian');
  const [hasChosen, setHasChosen] = useState(false);

  // Load from localStorage on mount and sync currency
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as VisitorType;
      if (saved === 'indian' || saved === 'foreigner') {
        setVisitorState(saved);
        setHasChosen(true);
        window.dispatchEvent(new CustomEvent('visitorchange', { detail: saved }));
      }
    } catch {}
  }, []);

  const setVisitor = (v: VisitorType) => {
    setVisitorState(v);
    setHasChosen(true);
    try {
      if (v) {
        localStorage.setItem(STORAGE_KEY, v);
        // Notify CurrencyContext to update currency
        window.dispatchEvent(new CustomEvent('visitorchange', { detail: v }));
      }
    } catch {}
  };

  return (
    <VisitorContext.Provider value={{ visitor, setVisitor, hasChosen }}>
      {children}
    </VisitorContext.Provider>
  );
}

export const useVisitor = () => useContext(VisitorContext);
