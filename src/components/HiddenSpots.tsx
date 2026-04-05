'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Clock, Compass } from 'lucide-react';
import hiddenSpots from '@/data/hiddenSpots';

const featured = hiddenSpots.filter((s) => s.featured).slice(0, 4);

const categoryLabel: Record<string, string> = {
  nature: 'Nature',
  heritage: 'Heritage',
  adventure: 'Adventure',
  spiritual: 'Spiritual',
  beach: 'Beach',
  hills: 'Hills',
  wildlife: 'Wildlife',
};

export default function HiddenSpots() {
  return (
    <section className="py-16 md:py-24 bg-[#0f1a12] text-cream overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-accent" />
              <p className="text-caption uppercase tracking-[0.35em] text-accent">Secret India</p>
            </div>
            <h2 className="font-display text-display-lg text-cream">
              Hidden gems most<br />
              <span className="italic text-accent">travellers never find</span>
            </h2>
            <p className="text-cream/50 text-body-sm max-w-lg mt-4 leading-relaxed">
              We've been finding India's best-kept secrets for 12 years. These are places that reward the curious — off the tourist trail, beyond the postcard.
            </p>
          </div>
          <Link
            href="/hidden-spots"
            className="shrink-0 inline-flex items-center gap-2 border border-cream/20 text-cream hover:bg-cream/10 hover:border-cream/40 px-7 py-3.5 text-xs uppercase tracking-widest transition-all self-start md:self-end"
          >
            All Hidden Gems
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((spot, i) => (
            <Link
              key={spot.slug}
              href={`/hidden-spots/${spot.slug}`}
              className={`group relative overflow-hidden block ${
                i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${i === 0 ? 'h-[420px] md:h-[540px]' : 'h-[260px] md:h-[280px]'}`}>
                <Image
                  src={spot.imageUrl}
                  alt={spot.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/90 transition-all duration-500" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-accent/90 text-primary text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold">
                    Hidden Gem
                  </span>
                  <span className="bg-black/40 backdrop-blur-sm text-cream text-[9px] uppercase tracking-widest px-2.5 py-1">
                    {categoryLabel[spot.category]}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-1.5 text-cream/55 text-[10px] uppercase tracking-widest mb-2">
                    <MapPin className="w-3 h-3" />
                    {spot.state}
                  </div>
                  <h3 className={`font-display text-cream leading-tight mb-2 ${i === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                    {spot.name}
                  </h3>

                  {i === 0 && (
                    <p className="text-cream/65 text-sm leading-relaxed line-clamp-2 mb-4 max-w-sm">
                      {spot.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-cream/50 text-[10px] uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {spot.recommendedStay}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold uppercase tracking-widest opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/8 pt-8">
          <p className="text-cream/35 text-sm">
            {hiddenSpots.length} hidden spots curated over 12 years · Updated for 2026
          </p>
          <a
            href="https://wa.me/918427831127?text=Hi%2C+I'd+like+to+visit+one+of+your+hidden+gem+destinations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Plan a Hidden Gem Trip
          </a>
        </div>
      </div>
    </section>
  );
}
