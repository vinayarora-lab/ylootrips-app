'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search, MapPin, ArrowRight, Users, Leaf, IndianRupee,
  Star, ChevronRight, Mountain, Wind, Compass,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const DESTINATIONS = [
  {
    name: 'Spiti Valley',
    state: 'Himachal Pradesh',
    tagline: 'Where the Himalayas meet Tibet',
    description: 'A high-altitude cold desert at 12,500 ft — ancient monasteries, lunar landscapes, and skies drowning in stars.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    tags: ['12,500 ft', 'Monasteries', 'Stargazing'],
    bestTime: 'Jun – Oct',
    crowd: 'Very Low',
    slug: 'spiti-valley',
  },
  {
    name: 'Ziro Valley',
    state: 'Arunachal Pradesh',
    tagline: 'India\'s last pristine frontier',
    description: 'Lush paddy fields, Apatani tribal villages, and the famous Ziro Music Festival — a world barely touched by tourism.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tags: ['UNESCO Tentative', 'Tribal Culture', 'Music Festival'],
    bestTime: 'Mar – Oct',
    crowd: 'Very Low',
    slug: 'ziro-valley',
  },
  {
    name: 'Chopta',
    state: 'Uttarakhand',
    tagline: 'Uttarakhand\'s best-kept secret',
    description: 'Called "Mini Switzerland", Chopta offers rhododendron forests, high-altitude meadows, and the sacred Tungnath temple.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    tags: ['Tungnath Trek', 'Meadows', 'Snow Peaks'],
    bestTime: 'Apr – Jun, Sep – Nov',
    crowd: 'Low',
    slug: 'chopta',
  },
  {
    name: 'Dzukou Valley',
    state: 'Nagaland',
    tagline: 'The Valley of Flowers of the Northeast',
    description: 'A hidden paradise on the Nagaland–Manipur border, carpeted with rare dzukou lilies and ringed by mist-veiled peaks.',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
    tags: ['Rare Flora', 'Naga Culture', 'Trekking'],
    bestTime: 'Jun – Sep',
    crowd: 'Very Low',
    slug: 'dzukou-valley',
  },
  {
    name: 'Majuli Island',
    state: 'Assam',
    tagline: 'World\'s largest river island',
    description: 'A living cultural ecosystem on the Brahmaputra — Vaishnavite monasteries, mask-making villages, and rare Gangetic dolphins.',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80',
    tags: ['River Island', 'Satras', 'Birdwatching'],
    bestTime: 'Oct – Mar',
    crowd: 'Low',
    slug: 'majuli-island',
  },
  {
    name: 'Gokarna',
    state: 'Karnataka',
    tagline: 'Goa before Goa was Goa',
    description: 'A sacred temple town with crescent coves accessible only by footpath — find your quiet beach at Om, Half Moon, or Paradise.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    tags: ['Secret Beaches', 'Temple Town', 'Backpacker Vibes'],
    bestTime: 'Oct – Mar',
    crowd: 'Low',
    slug: 'gokarna',
  },
];

const WHY_OFFBEAT = [
  {
    icon: Users,
    title: 'Fewer Crowds',
    description: 'Wake up to empty landscapes. No elbowing for the perfect photo. Just you and the place, exactly as nature intended.',
    stat: '10× less tourists',
    color: 'bg-sage/10 border-sage/20',
    iconColor: 'text-sage-dark',
  },
  {
    icon: Leaf,
    title: 'Authentic Culture',
    description: 'Meet communities that still live by ancient traditions — Apatani tribes, Naga villages, Vaishnavite monks. Real India, not a museum of it.',
    stat: 'Unfiltered experiences',
    color: 'bg-terracotta/10 border-terracotta/20',
    iconColor: 'text-terracotta-dark',
  },
  {
    icon: IndianRupee,
    title: 'Better Value',
    description: 'Offbeat routes cost 40–60% less than mainstream circuits. Homestays, local food, and real hospitality — without the tourist markup.',
    stat: 'Up to 60% cheaper',
    color: 'bg-accent/10 border-accent/20',
    iconColor: 'text-secondary',
  },
];

const POPULAR_SEARCHES = ['Spiti Valley', 'Dzukou Valley', 'Majuli', 'Northeast India', 'Chopta Trek'];

const CROWD_COLOR: Record<string, string> = {
  'Very Low': 'bg-emerald-100 text-emerald-700',
  'Low': 'bg-teal-100 text-teal-700',
  'Medium': 'bg-amber-100 text-amber-700',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DestinationCard({ dest, index }: { dest: typeof DESTINATIONS[0]; index: number }) {
  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-dark shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-52 sm:h-60 overflow-hidden">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-dark" />

        {/* Crowd badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CROWD_COLOR[dest.crowd]}`}>
            {dest.crowd} Crowd
          </span>
        </div>

        {/* Best time */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 text-accent" />
          {dest.bestTime}
        </div>

        {/* Location on image */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1 text-white/90 text-xs">
            <MapPin className="w-3 h-3 text-accent" />
            {dest.state}
          </div>
          <h3 className="text-white font-display text-lg font-semibold leading-tight mt-0.5">{dest.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-medium text-accent mb-1.5">{dest.tagline}</p>
        <p className="text-sm text-secondary leading-relaxed flex-1">{dest.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          {dest.tags.map((tag) => (
            <span key={tag} className="text-xs bg-cream border border-cream-dark text-secondary px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/destinations/${dest.slug}`}
          className="flex items-center justify-center gap-2 w-full bg-primary text-cream text-sm font-medium py-2.5 rounded-xl hover:bg-primary-light transition-colors group/btn"
        >
          Explore {dest.name}
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OffbeatLanding() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/destinations?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd love to plan an offbeat trip in India. Can you help me?");
    window.open(`https://wa.me/918427831127?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-cream-light min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end pb-16 sm:pb-24 overflow-hidden">
        {/* Background */}
        <Image
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80"
          alt="Spiti Valley, India"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />

        {/* Floating badge */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-8 sm:right-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-full">
            <Compass className="w-3.5 h-3.5 text-accent" />
            Handpicked Offbeat Destinations
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4">
              YlooTrips · Hidden Gems of India
            </span>
          </div>
          <h1 className="font-display text-display-xl text-white mb-4 leading-none">
            Discover India<br />
            <span className="text-accent">beyond the guidebook.</span>
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Secret valleys, tribal frontiers, sacred coastlines. We take you to the India that most people never find.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <div className="flex items-center gap-2 pl-4 pr-2 flex-shrink-0">
                <Search className="w-4 h-4 text-secondary" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where do you want to disappear to?"
                className="flex-1 py-4 pr-2 text-sm text-primary placeholder-secondary/50 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 m-1.5 bg-primary text-cream text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary-light transition-colors"
              >
                Search
              </button>
            </div>

            {/* Quick searches */}
            <div className="flex flex-wrap gap-2 mt-3">
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="text-xs text-white/70 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5">
          <Wind className="w-4 h-4 text-white/40 animate-bounce" />
          <span className="text-white/40 text-xs">Scroll to explore</span>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <div className="bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '6+', label: 'Offbeat Regions' },
            { value: '2,000+', label: 'Trips Planned' },
            { value: '4.9★', label: 'Avg. Rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-display text-xl sm:text-2xl text-accent font-semibold">{value}</p>
              <p className="text-cream-dark text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Destinations Grid ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-terracotta mb-3">
            <Mountain className="w-3.5 h-3.5" />
            Featured Destinations
          </span>
          <h2 className="font-display text-display-lg text-primary leading-tight">
            Six places that will<br className="hidden sm:block" /> rewire how you travel
          </h2>
          <p className="text-secondary text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Each destination hand-verified by our team. Not because it's trending — because it's genuinely worth it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DESTINATIONS.map((dest, i) => (
            <DestinationCard key={dest.slug} dest={dest} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/20 bg-white px-6 py-3 rounded-xl hover:bg-primary hover:text-cream hover:border-primary transition-all"
          >
            View all destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Why Offbeat ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-cream-dark py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-sage-dark mb-3">
              Why go offbeat?
            </span>
            <h2 className="font-display text-display-lg text-primary leading-tight">
              Travel better, not louder
            </h2>
            <p className="text-secondary text-sm sm:text-base mt-3 max-w-md mx-auto">
              The mainstream path is paved. Here's what you gain by stepping off it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WHY_OFFBEAT.map(({ icon: Icon, title, description, stat, color, iconColor }) => (
              <div
                key={title}
                className={`rounded-2xl border p-6 sm:p-7 flex flex-col gap-4 ${color}`}
              >
                <div className={`w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-primary text-base mb-1">{title}</p>
                  <p className="text-sm text-secondary leading-relaxed">{description}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-current/10">
                  <p className={`text-sm font-semibold ${iconColor}`}>{stat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial strip ─────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">
        <blockquote className="font-display text-xl sm:text-2xl text-primary leading-relaxed max-w-2xl mx-auto">
          "YlooTrips took us to Dzukou Valley when everyone else was heading to Manali. We had a hidden Himalayan valley almost entirely to ourselves — wildflowers, mist, absolute silence. The best travel decision of our lives."
        </blockquote>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-accent fill-accent" />)}
          </div>
          <span className="text-sm text-secondary">— Priya & Karthik, Bangalore</span>
        </div>
      </section>

      {/* ── WhatsApp CTA ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-8 sm:p-12 text-center overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-terracotta/10" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
              <Compass className="w-3.5 h-3.5" />
              Free Trip Consultation
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-cream mb-3 leading-tight">
              Ready to go somewhere<br />most people never will?
            </h2>
            <p className="text-cream-dark text-sm sm:text-base mb-8 max-w-md mx-auto">
              Tell us your budget, travel dates, and vibe. Our offbeat specialists respond within 1 hour — no bots, just humans who've been there.
            </p>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-[#25D366]/30"
            >
              {/* WhatsApp logo SVG inline */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Plan your offbeat trip on WhatsApp
            </button>

            <p className="text-cream-dark/50 text-xs mt-4">No spam. No pushy sales. Just good travel advice.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
