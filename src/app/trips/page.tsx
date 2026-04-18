import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';
import TripsContent from './TripsContent';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'India Trip Packages — Tours, Treks & Cultural Experiences',
  description: 'Browse 150+ curated India trip packages — Golden Triangle, Kerala backwaters, Rajasthan, Himalayan treks, wildlife safaris, and more. Trusted by 25,000+ travelers. Book online with instant confirmation.',
  keywords: 'India trip packages, India tour packages 2025, India travel itinerary, best India tours, India trekking packages, India cultural tours, India wildlife safari, Golden Triangle tour, Kerala tour, Rajasthan tour',
  openGraph: {
    title: 'India Trip Packages | YlooTrips — India Travel Experts',
    description: '150+ curated India tours — from Golden Triangle to Kerala backwaters. 4.9★ rated. Book online with instant confirmation.',
    url: 'https://www.ylootrips.com/trips',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YlooTrips India Tour Packages — Golden Triangle, Kerala, Rajasthan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Trip Packages | YlooTrips',
    description: '150+ curated India tours. 4.9★ rated. Book online with instant confirmation.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/trips' },
};

interface PageContent {
    hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        imageUrl: string;
    };
}

async function getPageContent(): Promise<PageContent | null> {
    try {
        const response = await api.getPageContent('trips');
        return response.data;
    } catch {
        return null;
    }
}

export default async function TripsPage() {
    const pageContent = await getPageContent();

    return (
        <>
            <BreadcrumbJsonLd items={[
                { name: 'Home', url: 'https://www.ylootrips.com' },
                { name: 'Trips', url: 'https://www.ylootrips.com/trips' },
            ]} />

            {/* Hero Section - CMS Driven (Server-Side) */}
            <PageHero
                title={pageContent?.hero?.title || "Curated Experiences"}
                subtitle={pageContent?.hero?.subtitle || "Each journey is thoughtfully designed to immerse you in authentic moments, local cultures, and transformative adventures."}
                breadcrumb={pageContent?.hero?.eyebrow || "Experiences"}
                backgroundImage={pageContent?.hero?.imageUrl}
            />

            {/* Client-Side Interactive Content */}
            <Suspense fallback={
                <div className="py-20 section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[480px] bg-cream-dark animate-pulse" />)}
                    </div>
                </div>
            }>
                <TripsContent />
            </Suspense>

            {/* CTA Section */}
            <section className="bg-gray-900 px-4 py-8">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C4A77D] mb-2">Est. 2022 · 25,000+ Travelers</p>
                    <h2 className="font-playfair text-white text-2xl font-semibold leading-tight mb-3">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-white/55 text-[13px] leading-relaxed mb-6">
                        Tell us your budget and dates. Our experts craft the perfect itinerary — free, no obligation.
                    </p>
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://wa.me/918427831127?text=Hi%2C+I'm+looking+for+a+custom+trip+package"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat on WhatsApp
                        </a>
                        <Link href="/contact" className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.97] transition-transform">
                            Plan Custom Journey
                        </Link>
                    </div>
                    <p className="text-white/25 text-[10px] mt-5 uppercase tracking-widest">Free · No obligation · Reply in under 1 hour</p>
                </div>
            </section>
        </>
    );
}
