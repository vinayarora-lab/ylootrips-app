'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star, ArrowUpRight } from 'lucide-react';
import { Trip } from '@/types';
import { formatPriceWithCurrency, calculateDiscount } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';

interface TripCardProps {
    trip: Trip;
    index?: number;
    variant?: 'default' | 'horizontal' | 'featured';
}

// Deterministic spots-left: 2–6, shown on ~half of trips
function getSpotsLeft(id: number): number | null {
    const val = ((id * 7) % 9) + 1;
    return val <= 5 ? val : null;
}

export default function TripCard({ trip, index = 0, variant = 'default' }: TripCardProps) {
    const { currency } = useCurrency();
    const discount = trip.originalPrice
        ? calculateDiscount(trip.originalPrice, trip.price)
        : 0;
    const fp = (p: typeof trip.price) => formatPriceWithCurrency(p, currency);
    const spotsLeft = getSpotsLeft(trip.id);

    if (variant === 'horizontal') {
        return (
            <Link
                href={`/trips/${trip.id}`}
                className="group flex flex-col md:flex-row gap-6 bg-cream-light p-4 transition-all duration-500 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Image */}
                <div className="relative w-full md:w-72 aspect-landscape md:aspect-square overflow-hidden shrink-0">
                    <Image
                        src={trip.imageUrl}
                        alt={trip.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-terracotta text-cream text-caption uppercase tracking-wider px-3 py-1.5">
                            {discount}% Off
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between py-2 flex-1">
                    <div>
                        <div className="flex items-center gap-2 text-secondary/60 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-caption uppercase tracking-wider">{trip.destination}</span>
                        </div>
                        <h3 className="font-display text-2xl text-primary mb-3 group-hover:text-secondary transition-colors">
                            {trip.title}
                        </h3>
                        <p className="text-primary/60 text-sm line-clamp-2 mb-4">
                            {trip.shortDescription || trip.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-secondary" />
                                <span className="text-sm text-primary/70">{trip.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-accent fill-accent" />
                                <span className="text-sm font-medium">{trip.rating}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-display text-xl text-primary">
                                {fp(trip.price)}
                            </div>
                            <span className="text-caption text-primary/50">per person</span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/trips/${trip.id}`}
            className="group block bg-cream-light overflow-hidden transition-all duration-500 hover:shadow-xl"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Image Container */}
            <div className="relative aspect-portrait overflow-hidden">
                <Image
                    src={trip.imageUrl}
                    alt={trip.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {(trip.featured || trip.isFeatured) && (
                        <span className="bg-primary text-cream text-caption uppercase tracking-wider px-3 py-1.5">
                            Featured
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="bg-terracotta text-cream text-caption uppercase tracking-wider px-3 py-1.5">
                            {discount}% Off
                        </span>
                    )}
                    {spotsLeft !== null && (
                        <span className="bg-red-500 text-white text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5 animate-pulse">
                            Only {spotsLeft} spots left
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-cream/95 px-3 py-1.5 flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm font-medium">{trip.rating}</span>
                </div>

                {/* Category */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-cream/90 blur-overlay px-4 py-2 text-caption uppercase tracking-widest text-primary">
                        {trip.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-secondary/60">
                    <MapPin className="w-4 h-4" />
                    <span className="text-caption uppercase tracking-wider">{trip.destination}</span>
                </div>

                {/* Title */}
                <h3 className="font-display text-xl md:text-2xl text-primary group-hover:text-secondary transition-colors line-clamp-2">
                    {trip.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-primary/60">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{trip.duration}</span>
                    </div>
                    {trip.difficulty && (
                        <span className="px-2 py-0.5 bg-sage/10 text-sage-dark text-caption uppercase">
                            {trip.difficulty}
                        </span>
                    )}
                </div>

                {/* Price Row */}
                <div className="pt-3 md:pt-4 border-t border-primary/10 flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-display text-xl md:text-2xl text-primary">
                                {fp(trip.price)}
                            </span>
                            {trip.originalPrice && (
                                <span className="text-sm text-primary/40 line-through">
                                    {fp(trip.originalPrice)}
                                </span>
                            )}
                        </div>
                        <span className="text-caption text-primary/50">per person · no hidden fees</span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-cream opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>

                {/* Cancellation pill */}
                <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    Free cancellation available
                </div>
            </div>
        </Link>
    );
}
