'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

const DESTINATIONS = [
  {
    id: 1, label: 'Bali', country: 'Indonesia', nights: '6N/7D',
    price: '₹42,999', tag: 'Honeymoon', tagColor: 'bg-rose-100 text-rose-700',
    href: '/bali-honeymoon-package',
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    rating: 4.9,
  },
  {
    id: 2, label: 'Kashmir', country: 'India', nights: '5N/6D',
    price: '₹24,999', tag: 'Trending', tagColor: 'bg-blue-100 text-blue-700',
    href: '/kashmir-tour-package',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    rating: 4.9,
  },
  {
    id: 3, label: 'Dubai', country: 'UAE', nights: '5N/6D',
    price: '₹35,999', tag: 'Luxury', tagColor: 'bg-amber-100 text-amber-700',
    href: '/dubai-tour-package-from-delhi',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    rating: 4.8,
  },
  {
    id: 4, label: 'Maldives', country: 'Maldives', nights: '4N/5D',
    price: '₹89,999', tag: 'Premium', tagColor: 'bg-teal-100 text-teal-700',
    href: '/maldives-luxury-package',
    img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
    rating: 5.0,
  },
  {
    id: 5, label: 'Manali', country: 'India', nights: '4N/5D',
    price: '₹12,999', tag: 'Adventure', tagColor: 'bg-green-100 text-green-700',
    href: '/manali-tour-package',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    rating: 4.8,
  },
  {
    id: 6, label: 'Goa', country: 'India', nights: '3N/4D',
    price: '₹9,999', tag: 'Beach', tagColor: 'bg-orange-100 text-orange-700',
    href: '/goa-tour-package',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    rating: 4.7,
  },
];

export default function HomeDestinations() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'india' | 'international' | 'honeymoon'>('all');

  const filtered =
    activeCategory === 'all' ? DESTINATIONS
    : activeCategory === 'india' ? DESTINATIONS.filter(d => d.country === 'India')
    : activeCategory === 'international' ? DESTINATIONS.filter(d => d.country !== 'India')
    : DESTINATIONS.filter(d => d.tag === 'Honeymoon');

  return (
    <section className="mt-7 px-4">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Handpicked For You</p>
          <h2 className="font-playfair text-2xl text-gray-900 font-semibold leading-tight">
            Curated<br />Collections
          </h2>
        </div>
        <Link href="/trips" className="text-xs font-bold text-gray-500 underline underline-offset-2 active:opacity-70">
          View all
        </Link>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {(['all', 'india', 'international', 'honeymoon'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              activeCategory === cat
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {cat === 'all' ? 'All'
              : cat === 'india' ? '🇮🇳 India'
              : cat === 'international' ? '🌍 International'
              : '💑 Honeymoon'}
          </button>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {filtered.map(dest => (
          <Link
            key={dest.id}
            href={dest.href}
            className="shrink-0 w-[200px] bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100 active:scale-[0.97] transition-transform"
          >
            <div className="relative h-[130px]">
              <Image src={dest.img} alt={`${dest.label} tour package — ${dest.nights}`} fill className="object-cover" />
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${dest.tagColor} shadow-sm`}>
                {dest.tag}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-playfair font-semibold text-base leading-tight">{dest.label}</p>
                <p className="text-white/80 text-[10px] font-medium">{dest.country}</p>
              </div>
            </div>
            <div className="px-3 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400">{dest.nights}</p>
                  <p className="text-base font-black text-gray-900 leading-tight">
                    {dest.price}<span className="text-[10px] font-semibold text-gray-400">/person</span>
                  </p>
                </div>
                <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  <span className="text-[11px] font-bold text-amber-700">{dest.rating}</span>
                </div>
              </div>
              <div className="mt-2.5 w-full bg-gray-900 rounded-xl py-2 flex items-center justify-center gap-1.5">
                <span className="text-white text-[11px] font-bold">View Package</span>
                <ArrowRight size={11} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
