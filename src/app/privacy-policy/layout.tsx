import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Terms | YlooTrips — India Travel Experts',
  description: 'Read the YlooTrips privacy policy and terms & conditions. Learn how we collect, use, and protect your data, and understand our booking, payment, and cancellation terms.',
  robots: {
    index: true,
    follow: false,
  },
  alternates: { canonical: 'https://www.ylootrips.com/privacy-policy' },
};

export default function PrivacyPolicyLayout({ children }: { children: ReactNode }) {
  return children;
}
