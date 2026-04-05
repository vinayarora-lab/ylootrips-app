import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Clock, Calendar, Compass, CheckCircle2, AlertTriangle, MessageCircle, ChevronLeft } from 'lucide-react';
import hiddenSpots from '@/data/hiddenSpots';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return hiddenSpots.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const spot = hiddenSpots.find((s) => s.slug === slug);
  if (!spot) return {};
  return {
    title: `${spot.name} — Hidden Gem | YlooTrips`,
    description: spot.description,
    alternates: { canonical: `https://www.ylootrips.com/hidden-spots/${spot.slug}` },
    openGraph: {
      title: `${spot.name} — India's Hidden Gem`,
      description: spot.tagline,
      images: [{ url: spot.imageUrl, width: 1200, height: 630 }],
    },
  };
}

const categoryLabel: Record<string, string> = {
  nature: 'Nature', heritage: 'Heritage', beach: 'Beach',
  hills: 'Hill Station', adventure: 'Adventure', spiritual: 'Spiritual', wildlife: 'Wildlife',
};

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-amber-100 text-amber-800',
  Challenging: 'bg-red-100 text-red-800',
};

export default async function HiddenSpotPage({ params }: Props) {
  const { slug } = await params;
  const spot = hiddenSpots.find((s) => s.slug === slug);
  if (!spot) notFound();

  const related = hiddenSpots
    .filter((s) => s.slug !== spot.slug && (s.region === spot.region || s.category === spot.category))
    .slice(0, 3);

  const waText = encodeURIComponent(
    `Hi, I'd like to visit ${spot.name} in ${spot.state}.\n\nInterested in: ${spot.recommendedStay} trip\nBest time: ${spot.bestTime}\n\nPlease share your itinerary and pricing.`
  );

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <Image
          src={spot.imageUrl}
          alt={spot.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        {/* Back */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="section-container">
            <Link
              href="/hidden-spots"
              className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream text-xs uppercase tracking-widest transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              All Hidden Gems
            </Link>
          </div>
        </div>

        <div className="relative z-10 section-container pb-12">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-accent text-primary text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold">
              Hidden Gem
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-cream text-[9px] uppercase tracking-widest px-3 py-1.5">
              {categoryLabel[spot.category]}
            </span>
            <span className={`text-[9px] uppercase tracking-widest px-3 py-1.5 font-medium ${difficultyColor[spot.difficulty]}`}>
              {spot.difficulty}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-cream mb-3">{spot.name}</h1>
          <p className="text-cream/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-6">{spot.tagline}</p>

          <div className="flex flex-wrap items-center gap-5 text-cream/55 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {spot.state}, India
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {spot.recommendedStay} recommended
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Best: {spot.bestTime}
            </span>
          </div>
        </div>
      </section>

      {/* Sticky booking bar */}
      <div className="sticky top-16 z-30 bg-primary text-cream py-3 shadow-lg">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm">
            <span className="font-semibold">{spot.name}</span>
            <span className="text-cream/50 ml-2 text-xs">· {spot.avgCost}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/918427831127?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-2 text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Plan This Trip
            </a>
            <Link
              href={`/trips?q=${encodeURIComponent(spot.tripSearchQuery)}`}
              className="flex items-center gap-1.5 border border-cream/25 text-cream hover:bg-white/10 px-5 py-2 text-xs uppercase tracking-widest transition-all"
            >
              View Trips
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">

            {/* Left — content */}
            <div>
              {/* About */}
              <div className="mb-10">
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">About This Place</p>
                <div className="prose prose-primary max-w-none">
                  {spot.longDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-primary/70 text-base leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-10">
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-5">Why Go Here</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {spot.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3 p-4 bg-cream-light border border-primary/8">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-primary/70 leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why hidden */}
              <div className="p-5 bg-accent/10 border-l-4 border-accent mb-10">
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">Why It\'s Still Hidden</p>
                <p className="text-primary/70 text-sm leading-relaxed italic">"{spot.whyHidden}"</p>
              </div>

              {/* Gallery */}
              {spot.galleryImages.length > 0 && (
                <div className="mb-10">
                  <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-5">Gallery</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {spot.galleryImages.map((img, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden">
                        <Image src={img} alt={`${spot.name} ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How to reach */}
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">How to Reach</p>
                <div className="flex items-start gap-3 p-5 bg-cream-light border border-primary/8">
                  <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <p className="text-sm text-primary/70 leading-relaxed">{spot.howToReach}</p>
                </div>
              </div>
            </div>

            {/* Right — sidebar */}
            <div className="space-y-5">
              {/* At a glance */}
              <div className="bg-primary text-cream p-6">
                <p className="text-caption uppercase tracking-[0.3em] text-accent mb-5">At a Glance</p>
                <div className="space-y-4">
                  {[
                    { label: 'Location', value: `${spot.nearbyCity} + ${spot.distanceFromCity}` },
                    { label: 'Best Time', value: spot.bestTime },
                    { label: 'Recommended Stay', value: spot.recommendedStay },
                    { label: 'Difficulty', value: spot.difficulty },
                    { label: 'Avg Cost', value: spot.avgCost },
                    { label: 'Region', value: spot.region },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-white/8 pb-3">
                      <span className="text-cream/45 uppercase tracking-widest text-[10px]">{label}</span>
                      <span className="text-cream/85 text-right max-w-[180px]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan with us */}
              <div className="bg-cream-light border border-primary/10 p-6">
                <Compass className="w-8 h-8 text-primary/20 mb-4" />
                <h3 className="font-display text-xl text-primary mb-2">Plan this trip with us</h3>
                <p className="text-primary/55 text-sm leading-relaxed mb-5">
                  We arrange transport, accommodation, permits (ILP if needed), and local guides for {spot.name}. Share your dates and we'll send a detailed itinerary within 24 hours.
                </p>
                <a
                  href={`https://wa.me/918427831127?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors mb-3"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
                <Link
                  href={`/trips?q=${encodeURIComponent(spot.tripSearchQuery)}`}
                  className="w-full flex items-center justify-center gap-2 border border-primary/15 text-primary hover:bg-primary hover:text-cream px-5 py-3.5 text-xs uppercase tracking-widest transition-all"
                >
                  Browse Related Trips
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Nearby destination */}
              {spot.destinationSlug && (
                <div className="bg-secondary/5 border border-secondary/15 p-5">
                  <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">Explore the Region</p>
                  <p className="text-sm text-primary/60 mb-3">
                    {spot.name} is in {spot.state}. Browse all destinations in this region.
                  </p>
                  <Link
                    href={`/destinations/${spot.destinationSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-secondary uppercase tracking-widest font-semibold hover:underline"
                  >
                    View {spot.state} Destinations
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related spots */}
      {related.length > 0 && (
        <section className="py-16 bg-cream-dark">
          <div className="section-container">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">More Hidden Gems</p>
            <h2 className="font-display text-display-lg text-primary mb-10">You might also love</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/hidden-spots/${s.slug}`}
                  className="group block bg-cream border border-primary/8 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src={s.imageUrl}
                      alt={s.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-[10px] text-cream/55 uppercase tracking-widest mb-1">{s.state}</p>
                      <h3 className="font-display text-xl text-cream">{s.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-primary/55 text-xs line-clamp-2 leading-relaxed">{s.tagline}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-primary/40">{s.recommendedStay}</span>
                      <span className="text-secondary font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
