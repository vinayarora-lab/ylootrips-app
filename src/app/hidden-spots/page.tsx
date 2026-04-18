import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Clock, Compass, Filter } from 'lucide-react';
import hiddenSpots from '@/data/hiddenSpots';

export const metadata: Metadata = {
  title: 'Hidden Gems of India — Secret Destinations | YlooTrips',
  description: 'Discover India\'s hidden gems — Chopta, Majuli, Dawki, Gokarna, Orchha, Bundi and more. 10 off-the-beaten-path destinations curated by YlooTrips over 12 years.',
  alternates: { canonical: 'https://www.ylootrips.com/hidden-spots' },
};

const regions = ['All', 'North India', 'South India', 'Northeast India', 'Central India', 'East India', 'West India'] as const;
const categories = ['All', 'nature', 'heritage', 'beach', 'hills', 'adventure', 'spiritual', 'wildlife'] as const;

const categoryLabel: Record<string, string> = {
  nature: 'Nature',
  heritage: 'Heritage',
  beach: 'Beach',
  hills: 'Hills',
  adventure: 'Adventure',
  spiritual: 'Spiritual',
  wildlife: 'Wildlife',
};

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-amber-100 text-amber-800',
  Challenging: 'bg-red-100 text-red-800',
};

export default function HiddenSpotsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end bg-[#0f1a12] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1920&q=80"
            alt="India hidden gems"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a12] via-[#0f1a12]/60 to-transparent" />
        </div>
        <div className="relative z-10 section-container pb-8 pt-6">
          <div className="flex items-center gap-2 mb-5">
            <Compass className="w-4 h-4 text-accent" />
            <span className="text-caption uppercase tracking-[0.35em] text-accent">Secret India</span>
          </div>
          <h1 className="font-display text-display-xl text-cream mb-5 max-w-2xl">
            Hidden gems most<br />
            <span className="italic text-accent">travellers never find</span>
          </h1>
          <p className="text-cream/60 text-body-lg max-w-xl leading-relaxed">
            {hiddenSpots.length} off-the-beaten-path destinations curated over 12 years. Places that reward the curious — beyond the postcard, away from the crowds.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-[#0f1a12] border-b border-white/8">
        <div className="section-container py-5">
          <div className="flex flex-wrap gap-8 text-cream/50 text-sm">
            {[
              { v: `${hiddenSpots.length}`, l: 'Hidden spots' },
              { v: '3+', l: 'Years discovering' },
              { v: '8', l: 'States covered' },
              { v: '100%', l: 'Off the tourist trail' },
            ].map(({ v, l }) => (
              <div key={l}>
                <span className="font-display text-xl text-accent mr-1.5">{v}</span>
                <span className="text-[11px] uppercase tracking-widest">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {hiddenSpots.map((spot, index) => (
              <Link
                key={spot.slug}
                href={`/hidden-spots/${spot.slug}`}
                className="group block bg-cream-light border border-primary/8 overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-[280px] overflow-hidden">
                  <Image
                    src={spot.imageUrl}
                    alt={spot.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {spot.featured && (
                      <span className="bg-accent text-primary text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold">
                        Featured
                      </span>
                    )}
                    <span className="bg-black/50 backdrop-blur-sm text-cream text-[9px] uppercase tracking-widest px-2.5 py-1">
                      {categoryLabel[spot.category]}
                    </span>
                  </div>

                  <div className={`absolute top-4 right-4 text-[9px] uppercase tracking-widest px-2.5 py-1 font-medium ${difficultyColor[spot.difficulty]}`}>
                    {spot.difficulty}
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-cream/55 text-[10px] uppercase tracking-widest mb-1.5">
                      <MapPin className="w-3 h-3" />
                      {spot.state} · {spot.region}
                    </div>
                    <h2 className="font-display text-2xl text-cream">{spot.name}</h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <p className="text-primary/60 text-sm leading-relaxed line-clamp-2">
                    {spot.tagline}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-primary/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {spot.recommendedStay}
                    </span>
                    <span>·</span>
                    <span>{spot.bestTime.split('·')[0].trim()}</span>
                  </div>

                  {/* 2 highlights */}
                  <ul className="space-y-1">
                    {spot.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-primary/55">
                        <span className="w-1 h-1 rounded-full bg-secondary mt-1.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-primary/8 flex items-center justify-between">
                    <span className="text-xs text-primary/40 uppercase tracking-widest">{spot.avgCost}</span>
                    <span className="flex items-center gap-1.5 text-secondary text-xs font-semibold uppercase tracking-widest opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Explore
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0f1a12] text-cream">
        <div className="section-container text-center">
          <Compass className="w-8 h-8 text-accent mx-auto mb-5" />
          <h2 className="font-display text-display-lg mb-4">
            Want us to plan your<br />
            <span className="italic text-accent">hidden gem trip?</span>
          </h2>
          <p className="text-cream/50 text-body-sm max-w-lg mx-auto mb-10">
            Tell us which spot caught your eye. We'll handle transport, permits, stays and guides — you just show up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918427831127?text=Hi%2C+I'd+like+to+visit+one+of+your+hidden+gem+destinations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Plan My Hidden Gem Trip
            </a>
            <Link
              href="/trips"
              className="inline-flex items-center justify-center gap-2 border border-cream/20 text-cream hover:border-cream/40 hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all"
            >
              Browse All Trips
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
