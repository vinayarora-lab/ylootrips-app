'use client';

import { ReactNode } from 'react';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { VisitorProvider } from '@/context/VisitorContext';
import VisitorSelector from '@/components/VisitorSelector';
import SocialProofToast from '@/components/SocialProofToast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <VisitorProvider>
        {/* Full-screen 2-card selector — shown only before a choice is made */}
        <VisitorSelector />
        {/* FOMO social proof toast — bottom-left, cycles through recent bookings */}
        <SocialProofToast />
        {children}
      </VisitorProvider>
    </CurrencyProvider>
  );
}
