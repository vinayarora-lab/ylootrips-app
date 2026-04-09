'use client';

import { useRef } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Star, ArrowUpRight, ShoppingCart, Eye } from 'lucide-react';
import { Trip } from '@/types';
import { formatPriceWithCurrency, calculateDiscount } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import WishlistButton from '@/components/WishlistButton';
import { getDestinationImageUrl } from '@/lib/destinationImages';

/* ── 3-D tilt wrapper ─────────────────────────────────────────────── */
function Tilt3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const onMove = (e: MouseEvent<HTMLDivElement>) => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -8;
        const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 8;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
        const shine = el.querySelector<HTMLElement>('[data-shine]');
        if (shine) {
            shine.style.opacity = '1';
            shine.style.background = `radial-gradient(circle at ${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%, rgba(255,255,255,0.14) 0%, transparent 65%)`;
        }
    };
    const onLeave = () => {
        const el = ref.current; if (!el) return;
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        const shine = el.querySelector<HTMLElement>('[data-shine]');
        if (shine) shine.style.opacity = '0';
    };
    return (
        <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className}
            style={{ transition: 'transform 0.18s ease-out', transformStyle: 'preserve-3d' }}>
            {children}
        </div>
    );
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80';

const GENERIC_IMG_FRAGMENTS = [
    'photo-1501554728187-ce583db33af7', // generic mountain 1
    'photo-1517176118067-7f04c8f3f95e', // generic mountain 2
    'photo-1519681393784-d120267933ba', // generic mountain 3
    'photo-1526772662000-3f88f10405ff', // generic mountain 4
    'photo-1530866495561-501e8d4e82d4', // generic mountain 5
    'photo-1506905925346-21bda4d32df4', // wrong generic
];

function getTripImage(trip: Trip): string {
    const url = trip.imageUrl || '';
    // If backend has a real, non-generic image (e.g. Cloudinary from BANBANJARA), use it
    const isGeneric = !url || GENERIC_IMG_FRAGMENTS.some(f => url.includes(f));
    if (!isGeneric) return url;
    // Fall back to destination-mapped Unsplash image
    return getDestinationImageUrl(undefined, trip.destination, url);
}

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.srcset = '';
    target.src = FALLBACK_IMAGE;
};

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

// Deterministic viewers count: 4–23
function getViewers(id: number): number {
    return ((id * 13 + 7) % 20) + 4;
}

export default function TripCard({ trip, index = 0, variant = 'default' }: TripCardProps) {
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const bookNowHref = visitor === 'foreigner' ? '/tours' : `/checkout?tripId=${trip.id}`;
    const discount = trip.originalPrice
        ? calculateDiscount(trip.originalPrice, trip.price)
        : 0;
    const fp = (p: typeof trip.price) => formatPriceWithCurrency(p, currency);
    const spotsLeft = getSpotsLeft(trip.id);
    const viewers = getViewers(trip.id);

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
                        src={getTripImage(trip)}
                        alt={trip.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={handleImgError}
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
        <Tilt3D
            className="group bg-cream-light overflow-hidden transition-all duration-500 hover:shadow-xl flex flex-col relative"
        >
            {/* Shine overlay */}
            <div data-shine className="absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-200 rounded-none" />

            {/* Image Container — clicking image goes to detail */}
            <Link href={`/trips/${trip.id}`} className="block relative aspect-portrait overflow-hidden shrink-0">
                <Image
                    src={getTripImage(trip)}
                    alt={trip.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={handleImgError}
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

                {/* Rating + Wishlist */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div className="bg-cream/95 px-3 py-1.5 flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-medium">{trip.rating}</span>
                    </div>
                    <WishlistButton tripId={trip.id} tripTitle={trip.title} className="relative" />
                </div>

                {/* Live viewers */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    <Eye className="w-3 h-3" />
                    <span>{viewers} viewing</span>
                </div>

                {/* Category */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-cream/90 backdrop-blur-sm px-4 py-2 text-caption uppercase tracking-widest text-primary">
                        {trip.category}
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 md:p-5 space-y-3 flex flex-col flex-1">
                {/* Location + duration row */}
                <div className="flex items-center justify-between text-sm text-primary/55">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-caption uppercase tracking-wider">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-caption">{trip.duration}</span>
                    </div>
                </div>

                {/* Title — links to detail */}
                <Link href={`/trips/${trip.id}`} className="block">
                    <h3 className="font-display text-xl text-primary hover:text-secondary transition-colors line-clamp-2 leading-snug">
                        {trip.title}
                    </h3>
                </Link>

                {trip.difficulty && (
                    <span className="inline-block px-2 py-0.5 bg-primary/5 text-primary/55 text-caption uppercase tracking-wide text-[10px]">
                        {trip.difficulty}
                    </span>
                )}

                {/* Push price + buttons to bottom */}
                <div className="flex-1" />

                {/* Price */}
                <div className="pt-3 border-t border-primary/10">
                    <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="font-display text-xl text-primary">{fp(trip.price)}</span>
                        {trip.originalPrice && (
                            <span className="text-sm text-primary/35 line-through">{fp(trip.originalPrice)}</span>
                        )}
                    </div>
                    <span className="text-[10px] text-primary/45 uppercase tracking-widest">per person · no hidden fees</span>
                </div>

                {/* CTA row — Book Now + View Details */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                        href={bookNowHref}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-1.5 bg-primary text-cream px-3 py-2.5 text-xs uppercase tracking-widest hover:bg-secondary transition-colors font-semibold"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Book Now
                    </Link>
                    <Link
                        href={`/trips/${trip.id}`}
                        className="flex items-center justify-center gap-1.5 border border-primary/20 text-primary px-3 py-2.5 text-xs uppercase tracking-widest hover:bg-primary hover:text-cream transition-all"
                    >
                        Details
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Free cancellation */}
                <div className="flex items-center gap-1.5 text-[11px] text-green-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Free cancellation available
                </div>
            </div>
        </Tilt3D>
    );
}
