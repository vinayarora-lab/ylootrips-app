'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Star, Users } from 'lucide-react';
import { formatPriceWithCurrency, calculateDiscount } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80';

interface Trip {
  id: number;
  title: string;
  shortDescription?: string;
  destination: string;
  imageUrl: string;
  price: number | string | any;
  originalPrice?: number | string | any;
  duration: string;
  rating?: number;
  reviewCount?: number;
  maxGroupSize?: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
}

export default function CuratedJourneys({ trips }: { trips: Trip[] }) {
  const { currency } = useCurrency();
  const fp = (p: Trip['price']) => formatPriceWithCurrency(p, currency);

  return (
    <section className="py-16 md:py-24 bg-cream-light">
      <div className="section-container">

        <div className="text-center mb-12">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Handpicked for You</p>
          <h2 className="font-display text-display-lg text-primary">
            Curated <span className="italic">Journeys</span>
          </h2>
          <p className="mt-3 text-primary/55 text-body-sm max-w-xl mx-auto">
            Every trip is personally inspected and tailored. No filler, no mass tourism.
          </p>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-20 text-primary/40">No journeys available right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {trips.map((trip, i) => {
              const discount = trip.originalPrice ? calculateDiscount(trip.originalPrice, trip.price) : 0;
              const badge = trip.isTrending ? { label: 'Trending 🔥', cls: 'bg-terracotta text-cream' }
                : trip.isPopular ? { label: 'Most Popular', cls: 'bg-secondary text-cream' }
                : trip.isFeatured ? { label: 'Featured', cls: 'bg-accent text-primary' }
                : null;

              return (
                <Link key={trip.id} href={`/trips/${trip.id}`}
                  className="group block bg-cream overflow-hidden border border-primary/8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-400"
                  style={{ animationDelay: `${i * 0.08}s` }}>

                  {/* Image */}
                  <div className="relative h-60 overflow-hidden">
                    <Image src={trip.imageUrl || FALLBACK_IMAGE} alt={trip.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = FALLBACK_IMAGE; }} />
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors" />

                    {/* Badge */}
                    {badge && (
                      <div className={`absolute top-3 left-3 ${badge.cls} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1`}>
                        {badge.label}
                      </div>
                    )}
                    {/* Discount */}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 bg-green-600 text-cream text-[10px] font-bold px-2 py-1 rounded-full">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-primary/50 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{trip.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{trip.destination}</span>
                      </div>
                      {trip.maxGroupSize && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Max {trip.maxGroupSize}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-display text-xl text-primary mb-2 group-hover:text-secondary transition-colors leading-tight">
                      {trip.title}
                    </h3>

                    {trip.shortDescription && (
                      <p className="text-primary/55 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {trip.shortDescription}
                      </p>
                    )}

                    {/* Rating */}
                    {(trip.rating && trip.rating > 0) ? (
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3 h-3 ${s <= Math.round(trip.rating!) ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-primary/15'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-primary/70">{trip.rating}</span>
                        {trip.reviewCount ? <span className="text-xs text-primary/35">({trip.reviewCount} reviews)</span> : null}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
                        </div>
                        <span className="text-xs text-primary/35">Highly rated</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-end justify-between pt-4 border-t border-primary/8">
                      <div>
                        <div className="text-[10px] text-primary/35 uppercase tracking-wider mb-0.5">From</div>
                        <div className="font-display text-2xl text-primary">{fp(trip.price)}</div>
                        {trip.originalPrice && Number(trip.originalPrice) > Number(trip.price) && (
                          <div className="text-xs text-primary/35 line-through">{fp(trip.originalPrice)}</div>
                        )}
                        <div className="text-[10px] text-primary/35">per person · all inclusive</div>
                      </div>
                      <span className="text-xs text-secondary font-medium uppercase tracking-widest group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10 md:mt-14">
          <Link href="/trips" className="btn-primary inline-flex items-center gap-2">
            Explore All Trips
          </Link>
          <p className="text-[10px] text-primary/35 mt-3 uppercase tracking-wider">Free cancellation · No hidden fees · Custom itineraries</p>
        </div>
      </div>
    </section>
  );
}
