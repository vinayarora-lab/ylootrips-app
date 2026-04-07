'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Heart, Shield, Star, LucideIcon } from 'lucide-react';
import Hero from '@/components/Hero';
import DestinationCard from '@/components/DestinationCard';
import InternationalTestimonials from '@/components/InternationalTestimonials';
import TrustedHotels from '@/components/TrustedHotels';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import TrustBanner from '@/components/TrustBanner';
import HolidayPlanner from '@/components/HolidayPlanner';
import MyBookingSection from '@/components/MyBookingSection';
import HiddenSpots from '@/components/HiddenSpots';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useVisitor } from '@/context/VisitorContext';

interface CmsContent {
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  sections: Array<{
    sectionKey: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor: string;
  }>;
  stats: Array<{ value: string; label: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
}

// Icon map
const iconMap: Record<string, LucideIcon> = {
  compass: Compass,
  heart: Heart,
  shield: Shield,
  star: Star,
};

export default function Home() {
  const { visitor } = useVisitor();
  const [content, setContent] = useState<CmsContent | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try combined endpoint first (single request - much faster)
        try {
          const homepageRes = await api.getHomepageData();
          const data = homepageRes.data;

          setContent(data.content);
          setDestinations(data.featuredDestinations || []);
          setError(null);
          return;
        } catch {
          // fall through to individual calls
        }

        // Fallback to individual calls if combined endpoint fails
        const [contentRes, destRes] = await Promise.all([
          api.getPageContent('home'),
          api.getFeaturedDestinations(),
        ]);

        setContent(contentRes.data);
        setDestinations(destRes.data.slice(0, 4));
        setError(null);
      } catch {
        setError('Unable to load content. Please ensure the backend is running and seeded.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Visitor-type filtering ────────────────────────────────────────────────
  const visibleDestinations = visitor === 'foreigner'
    ? destinations.filter((d) => !d.country || d.country === 'India')
    : destinations;

  // Get section by key
  const getSection = (key: string) => content?.sections?.find(s => s.sectionKey === key);

  const philosophySection = getSection('philosophy');
  const destinationsSection = getSection('destinations');
  const ctaSection = getSection('cta');

  return (
    <>
      {/* Hero Section - CMS Driven */}
      <Hero
        content={content?.hero}
        stats={content?.stats}
      />

      {/* Trust Banner — payment methods + badges */}
      <TrustBanner />

      {/* Trusted Partner Hotels */}
      <TrustedHotels />

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Philosophy Section - CMS Driven */}
      <section className="py-16 md:py-24 lg:py-32 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                  {philosophySection?.eyebrow || 'Our Philosophy'}
                </p>
                <h2 className="font-display text-display-lg text-primary">
                  {philosophySection?.title?.split('.').map((part, i) => (
                    <span key={i}>
                      {i === 1 ? <><br /><span className="italic text-secondary">{part.trim()}</span></> : part}
                    </span>
                  )) || <>Travel is not just movement.<br /><span className="italic text-secondary">It&apos;s transformation.</span></>}
                </h2>
              </div>

              <p className="text-body-lg text-primary/70 leading-relaxed">
                {philosophySection?.description || 'We believe that the best journeys are those that leave you changed. Our curated experiences go beyond the ordinary, connecting you with local cultures, hidden treasures, and the stories that make each destination unique.'}
              </p>

              {/* Features - CMS Driven */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-4">
                {(content?.features && content.features.length > 0
                  ? content.features
                  : [
                    { icon: 'compass', title: 'Expert Local Guides', description: '' },
                    { icon: 'heart', title: 'Authentic Experiences', description: '' },
                    { icon: 'shield', title: 'Sustainable Travel', description: '' },
                    { icon: 'star', title: 'Curated Excellence', description: '' },
                  ]
                ).map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || Compass;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-sm text-primary/80">{feature.title}</span>
                    </div>
                  );
                })}
              </div>

              <Link href={philosophySection?.ctaLink || '/about'} className="btn-ghost group inline-flex items-center gap-2 pt-4">
                <span>{philosophySection?.ctaText || 'Discover Our Story'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2 sm:space-y-4">
                  <div className="relative aspect-portrait overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80"
                      alt="Taj Mahal at sunrise, Agra, India"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80"
                      alt="Kerala backwaters houseboat cruise, South India"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pt-6 sm:pt-12 space-y-2 sm:space-y-4">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"
                      alt="Colorful Rajasthani culture and traditions, Jaipur India"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-portrait overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"
                      alt="Himalayan mountain landscape, North India"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge with CMS stat */}
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:-bottom-6 md:-left-6 bg-accent text-primary px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4">
                <span className="font-display text-xl sm:text-2xl md:text-3xl">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.value || '12+'}
                </span>
                <span className="block text-[10px] sm:text-caption uppercase tracking-widest">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.label || 'Years of Excellence'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section - CMS Driven */}
      <section className="py-16 md:py-24 lg:py-32 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-16">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                {destinationsSection?.eyebrow || 'Destinations'}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {destinationsSection?.title?.split(' ').map((word, i, arr) => (
                  i >= arr.length - 2 ? <span key={i} className="italic">{word} </span> : <span key={i}>{word} </span>
                )) || <>Where will your<br /><span className="italic">story begin?</span></>}
              </h2>
            </div>
            <Link href={destinationsSection?.ctaLink || '/destinations'} className="btn-ghost group">
              <span>{destinationsSection?.ctaText || 'View All Destinations'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[500px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                  variant={index === 0 ? 'featured' : 'default'}
                />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Hidden Gems section */}
      <HiddenSpots />

      {/* Holiday & Weekend Planner */}
      <HolidayPlanner />


      {/* International Testimonials — static, from real traveler countries */}
      <InternationalTestimonials />

      {/* Why Choose YlooTrips */}
      <WhyChooseUs />

      {/* How It Works */}
      <HowItWorks />

      {/* My Booking Portal */}
      <MyBookingSection />

      {/* CTA Section - CMS Driven */}
      <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={ctaSection?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'}
            alt="India mountain landscape — start your journey with YlooTrips"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        <div className="relative z-10 section-container text-center text-cream">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4 md:mb-6">
            {ctaSection?.eyebrow || 'Ready to Begin?'}
          </p>
          <h2 className="font-display text-display-xl max-w-3xl mx-auto mb-6 md:mb-8 text-balance">
            {ctaSection?.title || <>Let us craft your next<span className="italic"> unforgettable journey</span></>}
          </h2>
          <p className="text-base md:text-body-lg text-cream/70 max-w-xl mx-auto mb-8 md:mb-12">
            {ctaSection?.description || 'Tell us about your dream destination, and our travel experts will design a bespoke experience just for you.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href={ctaSection?.ctaLink || '/contact'} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
              <span>{ctaSection?.ctaText || 'Plan Your Journey'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/destinations" className="btn-outline border-cream/30 text-cream hover:bg-cream/10">
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
