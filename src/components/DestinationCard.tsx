'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Destination } from '@/types';
import { getDestinationImageUrl } from '@/lib/destinationImages';

function getDestinationImage(destination: Destination): string {
  return getDestinationImageUrl(destination.slug, destination.name, destination.imageUrl);
}

interface DestinationCardProps {
    destination: Destination;
    index?: number;
    variant?: 'default' | 'featured' | 'compact';
    theme?: 'default' | 'domestic' | 'international';
}

const themeAccent = {
    default: 'bg-accent',
    domestic: 'bg-terracotta',
    international: 'bg-secondary',
};

const themeBadge = {
    default: 'bg-accent/90 text-primary',
    domestic: 'bg-terracotta/90 text-cream',
    international: 'bg-secondary/90 text-cream',
};

const themeHover = {
    default: 'group-hover:bg-accent group-hover:text-primary',
    domestic: 'group-hover:bg-terracotta group-hover:text-cream',
    international: 'group-hover:bg-secondary group-hover:text-cream',
};

export default function DestinationCard({ destination, index = 0, variant = 'default', theme = 'default' }: DestinationCardProps) {
    const heights = {
        default: 'h-[380px] sm:h-[420px] md:h-[480px]',
        featured: 'h-[420px] sm:h-[500px] md:h-[650px]',
        compact: 'h-[260px] sm:h-[300px] md:h-[360px]',
    };

    return (
        <Link
            href={`/destinations/${destination.slug}`}
            className={`group block relative ${heights[variant]} overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Image */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                <Image
                    src={getDestinationImage(destination)}
                    alt={destination.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.srcset = '';
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80';
                    }}
                />
            </div>

            {/* Gradient - stronger at bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/85 transition-all duration-500" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                {/* Country / Region tag */}
                {(destination.country || destination.region) && (
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-cream text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        {destination.country === 'India' ? (destination.region || 'India') : (destination.country || destination.region)}
                    </span>
                )}

                {/* Trip count */}
                {destination.tripCount > 0 && (
                    <span className={`${themeBadge[theme]} backdrop-blur-sm text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm font-semibold ml-auto`}>
                        {destination.tripCount} trips
                    </span>
                )}
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="font-display text-2xl sm:text-3xl text-cream mb-1.5 leading-tight">
                    {destination.name}
                </h3>

                {destination.description && (
                    <p className="text-cream/60 text-sm leading-relaxed line-clamp-2 mb-3 max-w-xs">
                        {destination.description}
                    </p>
                )}

                {/* CTA row — always visible but animates */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 border border-cream/30 text-cream text-xs uppercase tracking-widest transition-all duration-300 ${themeHover[theme]} group-hover:border-transparent`}>
                    <span>Explore</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
            </div>

            {/* Animated accent line */}
            <div className={`absolute bottom-0 left-0 h-0.5 ${themeAccent[theme]} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out w-full`} />
        </Link>
    );
}
