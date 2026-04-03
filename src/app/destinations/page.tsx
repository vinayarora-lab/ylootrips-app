'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useVisitor } from '@/context/VisitorContext';

interface PageContent {
  hero: { eyebrow: string; title: string; subtitle: string; imageUrl: string };
}

const regions = ['All Regions', 'Asia', 'Europe', 'Africa', 'Americas'];

function DestinationsContent() {
  const { visitor } = useVisitor();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All Regions');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.getPageContent('destinations');
        setPageContent(response.data);
      } catch (err) {
        console.error('Error fetching page content:', err);
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
      } catch (err) {
        console.error('Error fetching destinations:', err);
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

  const filteredDestinations =
    activeRegion === 'All Regions' ? visitorFiltered : visitorFiltered.filter((d) => d.region === activeRegion);
  const featuredDestination = filteredDestinations[0];

  return (
    <>
      <PageHero
        title={pageContent?.hero?.title || 'Explore Destinations'}
        subtitle={pageContent?.hero?.subtitle || "From hidden gems to iconic landmarks, discover the world's most captivating places through our curated collection of destinations."}
        breadcrumb={pageContent?.hero?.eyebrow || 'Destinations'}
        backgroundImage={pageContent?.hero?.imageUrl}
      />

      {/* Scope tabs — International outbound tab hidden for foreign visitors */}
      <section className="py-4 md:py-6 border-b border-primary/10 bg-cream">
        <div className="section-container">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            <span className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-caption uppercase tracking-widest bg-primary text-cream">
              All
            </span>
            <Link
              href="/destinations/domestic"
              className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-caption uppercase tracking-widest bg-cream-dark text-primary hover:bg-primary/10 transition-all"
            >
              {visitor === 'foreigner' ? 'India Regions' : 'Domestic'}
            </Link>
            {visitor !== 'foreigner' && (
              <Link
                href="/destinations/international"
                className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-caption uppercase tracking-widest bg-cream-dark text-primary hover:bg-primary/10 transition-all"
              >
                International
              </Link>
            )}
            {visitor === 'foreigner' && (
              <span className="ml-2 text-caption text-secondary/70 italic">
                Showing India destinations only
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 border-b border-primary/10 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-4 py-2 md:px-6 md:py-3 text-xs md:text-caption uppercase tracking-widest transition-all ${activeRegion === region ? 'bg-primary text-cream' : 'bg-cream text-primary hover:bg-primary/10'}`}
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

      {!loading && featuredDestination && (
        <section className="py-10 md:py-16 lg:py-24 bg-cream">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
              <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
                <Image
                  src={featuredDestination.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80'}
                  alt={featuredDestination.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="inline-block px-4 py-2 bg-accent text-primary text-caption uppercase tracking-widest mb-4">
                    Featured Destination
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">{featuredDestination.name}</h2>
                  <p className="text-cream/70 text-lg mb-6 max-w-md">{featuredDestination.description}</p>
                  <Link href={`/destinations/${featuredDestination.slug}`} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
                    <span>Explore {featuredDestination.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-8 lg:pl-12">
                <div>
                  <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Why {featuredDestination.name}?</p>
                  <h3 className="font-display text-display-lg text-primary mb-4">
                    A destination for the <span className="italic">soul</span>
                  </h3>
                  <p className="text-primary/60 text-body-lg">{featuredDestination.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: featuredDestination.tripCount || '0', label: 'Experiences' },
                    { value: '4.9', label: 'Avg Rating' },
                    { value: '12', label: 'Hotels' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-cream-dark">
                      <div className="font-display text-3xl text-secondary mb-1">{stat.value}</div>
                      <div className="text-caption uppercase tracking-widest text-primary/50">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-10 md:py-16 lg:py-24 bg-cream-dark">
        <div className="section-container">
          {(loading || filteredDestinations.length > 0) && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 md:mb-12">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">All Destinations</p>
                {filteredDestinations.length > 0 && <h2 className="font-display text-display-lg text-primary">Where will you go?</h2>}
              </div>
              <p className="text-primary/60 hidden md:block">
                {loading ? 'Loading...' : `${filteredDestinations.length} destinations to explore`}
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[450px] bg-cream animate-pulse" />
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

      <section className="py-20 bg-secondary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-4">Get inspired</h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Subscribe for destination guides, travel tips, and exclusive offers delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent"
            />
            <button type="submit" className="btn-primary bg-accent text-primary hover:bg-accent-warm">
              Subscribe
            </button>
          </form>
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
