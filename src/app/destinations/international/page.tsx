'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, ArrowUpRight, Globe } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';

const regions = [
  { label: '🌐 All', value: 'All Regions' },
  { label: '🌏 Asia', value: 'Asia' },
  { label: '🇪🇺 Europe', value: 'Europe' },
  { label: '🌍 Africa', value: 'Africa' },
  { label: '🌎 Americas', value: 'Americas' },
  { label: '🏝 Pacific', value: 'Pacific' },
];

const popularRegions = [
  { name: 'Bali, Indonesia', tag: 'Asia', bg: 'from-orange-400/80', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { name: 'Paris, France', tag: 'Europe', bg: 'from-blue-900/80', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { name: 'Safari, Kenya', tag: 'Africa', bg: 'from-amber-800/80', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80' },
];

export default function InternationalDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All Regions');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        const intl = (response.data || []).filter((d: Destination) => (d.country || '').toLowerCase() !== 'india');
        setDestinations(intl);
        setError(null);
      } catch {
        setError('Unable to load destinations.');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filtered = activeRegion === 'All Regions'
    ? destinations
    : destinations.filter((d) => d.region === activeRegion);

  return (
    <>
      <PageHero
        title="Explore the World"
        subtitle="Curated international journeys designed for Indian travelers — visa support, INR pricing, 24/7 on-trip assistance."
        breadcrumb="International"
        backgroundImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-secondary/40 via-primary/60 to-primary/90"
      />

      {/* Trust for international travel */}
      <section className="py-6 bg-secondary/5 border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              '✈️  Visa assistance included',
              '💳  INR pricing · no forex surprises',
              '🗣  Hindi & English-speaking guides',
              '📞  24/7 on-trip emergency support',
            ].map((item) => (
              <span key={item} className="text-xs md:text-sm text-primary/70 font-medium">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Region filter — sticky */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-sm ${
                  activeRegion === r.value
                    ? 'bg-secondary text-cream shadow-sm'
                    : 'bg-cream text-primary/70 hover:bg-secondary/10 hover:text-secondary'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Destination grid */}
      <section className="py-12 md:py-20 lg:py-28 bg-cream">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 md:mb-14">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">
                {activeRegion === 'All Regions' ? 'Across the globe' : activeRegion}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {activeRegion === 'All Regions' ? 'Where in the world?' : `Explore ${activeRegion}`}
              </h2>
            </div>
            {!loading && filtered.length > 0 && (
              <p className="text-sm text-primary/50">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[400px] bg-cream-dark animate-pulse rounded-sm" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} theme="international" />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan scopeFilter="International" activeRegion={activeRegion} onViewAll={() => setActiveRegion('All Regions')} />
          )}
        </div>
      </section>

      {/* Countries we cover visual strip */}
      <section className="py-10 bg-cream-dark border-y border-primary/8">
        <div className="section-container text-center">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-5">Popular with Indian travelers</p>
          <div className="flex flex-wrap justify-center gap-2.5 text-2xl">
            {['🇹🇭','🇧🇦','🇬🇧','🇫🇷','🇮🇹','🇪🇸','🇬🇷','🇹🇷','🇯🇵','🇸🇬','🇦🇺','🇺🇸','🇲🇻','🇰🇪','🇵🇹','🇳🇿','🇨🇭','🇦🇹','🇲🇦','🇦🇪'].map(flag => (
              <span key={flag} className="text-2xl">{flag}</span>
            ))}
          </div>
          <p className="text-primary/40 text-caption mt-3">+ many more</p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 md:py-24 bg-secondary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-5">
              <Globe className="w-10 h-10 text-cream/40" />
            </div>
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">International Travel Specialists</p>
            <h2 className="font-display text-display-lg mb-4">
              Ready to explore the world?
            </h2>
            <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
              We handle visa paperwork, flights, hotels, and on-ground guides. You just pack and go. Our specialists respond in under 1 hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918427831127?text=Hi%2C+I'm+interested+in+an+international+trip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all">
                Plan My World Trip
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-cream/30 text-xs mt-6 uppercase tracking-widest">Free · No obligation · Response in under 1 hour</p>
          </div>
        </div>
      </section>
    </>
  );
}
