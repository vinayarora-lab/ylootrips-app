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
            <section className="py-20 bg-primary text-cream">
                <div className="section-container text-center">
                    <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">12+ Years · 25,000+ Travelers</p>
                    <h2 className="font-display text-display-lg mb-6">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-cream/60 text-body-lg max-w-2xl mx-auto mb-10">
                        Tell us your budget, interests, and travel dates. Our experts will craft the perfect itinerary — no obligation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/918427831127?text=Hi%2C+I'm+looking+for+a+custom+trip+package"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Chat on WhatsApp
                        </a>
                        <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all">
                            <span>Plan Custom Journey</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <p className="text-cream/30 text-xs mt-6 uppercase tracking-widest">Free · No obligation · Reply in under 1 hour</p>
                </div>
            </section>
        </>
    );
}
