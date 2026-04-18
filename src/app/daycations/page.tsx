'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star, Users, Zap, ArrowUpRight, Flame } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';
import daycations, { DAYCATION_CATEGORIES, Daycation } from '@/data/daycations';

const DIFFICULTY_STYLE = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-gray-100 text-gray-600',
  hard: 'bg-gray-200 text-gray-700',
};

const DIFFICULTY_LABEL = {
  easy: 'Easy going',
  moderate: 'Some effort',
  hard: 'Go hard',
};

function DaycationCard({ d }: { d: Daycation }) {
  const { currency } = useCurrency();

  return (
    <div className="group bg-white overflow-hidden border border-primary/8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col rounded-2xl">
      {/* Image */}
      <Link href={`/contact?activity=${d.slug}`} className="block relative aspect-[4/3] overflow-hidden shrink-0">
        <Image
          src={d.image} alt={d.title} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Emoji bubble */}
        <div className="absolute top-3 left-3 text-2xl bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md">
          {d.emoji}
        </div>

        {/* Badge */}
        {d.badge && (
          <div className={`absolute top-3 right-3 ${d.badgeColor} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
            {d.badge}
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 fill-white text-white" />
          <span className="text-xs font-bold">{d.rating}</span>
          <span className="text-[10px] opacity-70">({d.reviews.toLocaleString()})</span>
        </div>

        {/* Difficulty */}
        <div className={`absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full ${DIFFICULTY_STYLE[d.difficulty]}`}>
          {DIFFICULTY_LABEL[d.difficulty]}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Location */}
        <div className="flex items-center gap-1 text-primary/50">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="text-[10px] uppercase tracking-wider truncate">{d.location}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg text-primary leading-tight">{d.title}</h3>

        {/* Tagline */}
        <p className="text-xs text-secondary italic">{d.tagline}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-secondary">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{d.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{d.groupSize}</span>
        </div>

        {/* Vibe tag */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-gray-400" />
          <span className="text-[11px] text-gray-500 font-medium italic">{d.vibe}</span>
        </div>

        {/* Includes pills */}
        <div className="flex flex-wrap gap-1 mt-0.5">
          {d.includes.slice(0, 3).map((item) => (
            <span key={item} className="text-[10px] bg-primary/5 text-primary/70 px-2 py-0.5 rounded-full">{item}</span>
          ))}
          {d.includes.length > 3 && (
            <span className="text-[10px] text-primary/40 px-1 py-0.5">+{d.includes.length - 3} more</span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-primary/8 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-secondary uppercase tracking-wider block">from</span>
            <span className="font-display text-xl text-primary">{formatPriceWithCurrency(d.priceINR, currency)}</span>
            <span className="text-[10px] text-secondary"> / person</span>
          </div>
          <Link
            href={`/contact?activity=${d.slug}&city=${d.city}`}
            className="flex items-center gap-1.5 bg-primary text-cream text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-primary/90 transition-colors group/btn"
          >
            Book Now
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DaycationsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? daycations : daycations.filter((d) => d.category === activeCategory);
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => a.priceINR - b.priceINR);
    else if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.priceINR - a.priceINR);
    else if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-[#F4F1EA]">
      {/* Hero */}
      <section className="pt-6 pb-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Flame className="w-3.5 h-3.5" />
            1-Day Adventures
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-primary leading-none mb-4">
            Daycations<span className="text-primary">.</span>
          </h1>
          <p className="text-secondary text-lg sm:text-xl mb-2">
            No bags. No hotel. Just <span className="font-semibold text-primary italic">pure vibes</span>.
          </p>
          <p className="text-secondary/70 text-sm">
            Go hard, be back by dinner — 1-day experiences that actually slap.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-30 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-primary/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            {DAYCATION_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-cream shadow-md'
                    : 'bg-white text-primary border border-primary/15 hover:border-primary/40'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="shrink-0 text-xs border border-primary/20 bg-white rounded-full px-4 py-2 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="popular">Most popular</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-secondary">
            <p className="text-4xl mb-3">😶</p>
            <p className="font-display text-xl">Nothing here yet.</p>
            <p className="text-sm mt-1">Try a different vibe filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <DaycationCard key={d.slug} d={d} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary text-cream py-16 px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-cream/50 mb-3">Don't see your city?</p>
          <h2 className="font-display text-4xl mb-4">We'll cook something up 👨‍🍳</h2>
          <p className="text-cream/70 text-sm mb-8">
            Tell us your city and what you're feeling — we'll build a custom daycation just for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-cream text-primary font-semibold px-8 py-3.5 rounded-full hover:bg-cream/90 transition-all text-sm"
          >
            Request a Custom Day Out
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
