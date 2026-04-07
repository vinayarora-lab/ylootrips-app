'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, ArrowUpRight, Mountain, Waves, Castle, TreePine, Sailboat, Sun } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';

const indiaRegions = [
  { label: 'All India', value: 'All India' },
  { label: 'North India', value: 'North India' },
  { label: 'South India', value: 'South India' },
  { label: 'East India', value: 'East India' },
  { label: 'West India', value: 'West India' },
  { label: 'Northeast', value: 'Northeast India' },
  { label: 'Himalayas', value: 'Himalayan Region' },
];

const highlights = [
  { icon: Mountain, label: 'Himalayan Treks', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Castle, label: 'Heritage & Forts', color: 'text-terracotta', bg: 'bg-orange-50' },
  { icon: Waves, label: 'Beaches & Coasts', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: TreePine, label: 'Wildlife Safaris', color: 'text-green-700', bg: 'bg-green-50' },
  { icon: Sailboat, label: 'Kerala Backwaters', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Sun, label: 'Rajasthan Deserts', color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function DomesticDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All India');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        const india = (response.data || []).filter((d: Destination) => (d.country || '').toLowerCase() === 'india');
        setDestinations(india);
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

  const filtered = activeRegion === 'All India'
    ? destinations
    : destinations.filter((d) => d.region === activeRegion);

  return (
    <>
      <PageHero
        title="Discover India"
        subtitle="From the Himalayas to Kerala's backwaters — 12+ years crafting India journeys for 25,000+ travelers."
        breadcrumb="Domestic"
        backgroundImage="https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-terracotta/50 via-primary/60 to-primary/90"
      />

      {/* What India offers — quick category icons */}
      <section className="py-8 md:py-10 bg-cream border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {highlights.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`flex items-center gap-2 ${bg} px-4 py-2.5 rounded-full`}>
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <span className="text-xs font-medium text-primary/80 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region filter */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {indiaRegions.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-sm ${
                  activeRegion === r.value
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'bg-cream text-primary/70 hover:bg-terracotta/10 hover:text-terracotta'
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
              <p className="text-caption uppercase tracking-[0.3em] text-terracotta mb-2">
                {activeRegion === 'All India' ? 'Across India' : activeRegion}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {activeRegion === 'All India' ? 'Where in India?' : `Explore ${activeRegion}`}
              </h2>
            </div>
            {!loading && filtered.length > 0 && (
              <p className="text-sm text-primary/50">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[420px] bg-cream-dark animate-pulse rounded-sm" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} theme="domestic" />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan scopeFilter="Domestic" activeRegion={activeRegion} onViewAll={() => setActiveRegion('All India')} />
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 bg-cream-dark border-y border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center">
            {[
              { value: '12+', label: 'Years of India expertise' },
              { value: '25K+', label: 'Travelers guided' },
              { value: '4.9★', label: 'Google rating' },
              { value: '98%', label: 'Would recommend' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl text-terracotta">{value}</div>
                <div className="text-caption text-primary/50 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 md:py-24 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption uppercase tracking-[0.3em] text-terracotta mb-4">India Travel Experts</p>
            <h2 className="font-display text-display-lg mb-4">
              Not sure where to start?
            </h2>
            <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
              Tell us your interests, budget, and travel dates. Our India specialists respond in under 1 hour — 7 days a week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918427831127?text=Hi%2C+I'm+interested+in+a+domestic+India+trip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all">
                Plan My India Trip
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
