'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useVisitor } from '@/context/VisitorContext';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { useSearchParams } from 'next/navigation';

interface PageContent {
  hero: { eyebrow: string; title: string; subtitle: string; imageUrl: string };
}

const regions = ['All Regions', 'Asia', 'Europe', 'Africa', 'Americas'];

function DestinationsContent() {
  const { visitor } = useVisitor();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.getPageContent('destinations');
        setPageContent(response.data);
      } catch {
        // page content is optional
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        setDestinations(response.data || []);
        setError(null);
      } catch {
        setError('Unable to load destinations. Please ensure the backend is running.');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Foreigners see only India destinations; Indians see everything
  const visitorFiltered = visitor === 'foreigner'
    ? destinations.filter((d) => !d.country || d.country === 'India')
    : destinations;

  const regionFiltered =
    activeRegion === 'All Regions' ? visitorFiltered : visitorFiltered.filter((d) => d.region === activeRegion);

  const filteredDestinations = searchQuery.trim()
    ? regionFiltered.filter((d) =>
        d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : regionFiltered;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Destinations', url: 'https://www.ylootrips.com/destinations' },
      ]} />
      <PageHero
        title={pageContent?.hero?.title || 'Explore Destinations'}
        subtitle={pageContent?.hero?.subtitle || "From hidden gems to iconic landmarks, discover the world's most captivating places through our curated collection of destinations."}
        breadcrumb={pageContent?.hero?.eyebrow || 'Destinations'}
        backgroundImage={pageContent?.hero?.imageUrl}
      />

      {/* Scope tabs + Region filter combined */}
      <section className="bg-cream border-b border-primary/8 sticky top-16 z-30">
        {/* Scope row */}
        <div className="border-b border-primary/6">
          <div className="section-container py-3 md:py-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              <span className="shrink-0 px-5 py-2 text-xs uppercase tracking-widest font-semibold bg-primary text-cream rounded-sm">
                All Destinations
              </span>
              <Link
                href="/destinations/domestic"
                className="shrink-0 flex items-center gap-1.5 px-5 py-2 text-xs uppercase tracking-widest font-medium bg-cream-dark text-primary hover:bg-primary hover:text-cream transition-all rounded-sm"
              >
                🇮🇳 {visitor === 'foreigner' ? 'India Regions' : 'Domestic India'}
              </Link>
              {visitor !== 'foreigner' && (
                <Link
                  href="/destinations/international"
                  className="shrink-0 flex items-center gap-1.5 px-5 py-2 text-xs uppercase tracking-widest font-medium bg-cream-dark text-primary hover:bg-primary hover:text-cream transition-all rounded-sm"
                >
                  🌍 International
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search + Region filter row */}
        <div className="section-container py-3">
          <div className="flex flex-col sm:flex-row gap-3 mb-3 sm:mb-0 sm:items-center">
            <div className="relative sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-primary/15 bg-cream-light rounded-sm focus:outline-none focus:border-primary/40"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`shrink-0 px-4 py-1.5 text-xs uppercase tracking-widest transition-all rounded-sm ${
                  activeRegion === region
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-primary/55 hover:text-primary'
                }`}
              >
                {region}
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

      {/* Destinations grid */}
      <section className="py-12 md:py-20 lg:py-28 bg-cream">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 md:mb-14">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">
                {activeRegion === 'All Regions' ? 'All Destinations' : activeRegion}
              </p>
              <h2 className="font-display text-display-lg text-primary">Where will you go?</h2>
            </div>
            <p className="text-sm text-primary/50 hidden md:block">
              {loading ? 'Loading...' : `${filteredDestinations.length} destination${filteredDestinations.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[400px] bg-cream-dark animate-pulse rounded-sm" />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard key={destination.id} destination={destination} index={index} />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan
              scopeFilter="All"
              activeRegion={activeRegion}
              onViewAll={() => setActiveRegion('All Regions')}
            />
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 md:py-24 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">12+ Years · 25,000+ Travelers</p>
            <h2 className="font-display text-display-lg mb-4">Can't decide where to go?</h2>
            <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
              Tell us your budget, interests, and dates. Our travel experts will craft the perfect itinerary — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918427831127?text=Hi%2C+I'm+looking+for+destination+recommendations"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all">
                Get a Custom Plan
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-cream/30 text-xs mt-6 uppercase tracking-widest">Free · No obligation · Reply in under 1 hour</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-primary/50">Loading...</div></div>}>
      <DestinationsContent />
    </Suspense>
  );
}
