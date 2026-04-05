'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Destination } from '@/types';

// Destination-specific images keyed by slug or normalised name.
// Used as fallback when the backend hasn't set a unique image.
const DEST_IMAGES: Record<string, string> = {
  // ── Rajasthan ──────────────────────────────────────────────
  'rajasthan':            'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'jaipur':               'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'jodhpur':              'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
  'udaipur':              'https://images.unsplash.com/photo-1586187786830-a8b30e2093b7?w=800&q=80',
  'jaisalmer':            'https://images.unsplash.com/photo-1519923041107-2f76fc43efad?w=800&q=80',
  'pushkar':              'https://images.unsplash.com/photo-1519923041107-2f76fc43efad?w=800&q=80',
  // ── Iconic North India ─────────────────────────────────────
  'agra':                 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  'taj-mahal':            'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  'delhi':                'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'new-delhi':            'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'varanasi':             'https://images.unsplash.com/photo-1561361058-c24e81fc7e80?w=800&q=80',
  'benares':              'https://images.unsplash.com/photo-1561361058-c24e81fc7e80?w=800&q=80',
  'amritsar':             'https://images.unsplash.com/photo-1588416499018-d8c621e55bac?w=800&q=80',
  'golden-triangle':      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  // ── Himalayas / Hill Stations ──────────────────────────────
  'leh':                  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'ladakh':               'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'manali':               'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
  'spiti':                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'spiti-valley':         'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'shimla':               'https://images.unsplash.com/photo-1598077540161-9218a1b26fb2?w=800&q=80',
  'dharamsala':           'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80',
  'mcleod-ganj':          'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80',
  'himachal-pradesh':     'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
  'uttarakhand':          'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
  'rishikesh':            'https://images.unsplash.com/photo-1592820487765-54de6041af07?w=800&q=80',
  'haridwar':             'https://images.unsplash.com/photo-1592820487765-54de6041af07?w=800&q=80',
  'mussoorie':            'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
  'nainital':             'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
  // ── Kashmir ────────────────────────────────────────────────
  'kashmir':              'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
  'srinagar':             'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
  'gulmarg':              'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
  'pahalgam':             'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
  // ── Northeast India ────────────────────────────────────────
  'darjeeling':           'https://images.unsplash.com/photo-1595859703065-2259982b2352?w=800&q=80',
  'sikkim':               'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
  'gangtok':              'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
  'meghalaya':            'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80',
  'shillong':             'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80',
  'cherrapunji':          'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80',
  'assam':                'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&q=80',
  'kaziranga':            'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&q=80',
  // ── South India ────────────────────────────────────────────
  'kerala':               'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  'alleppey':             'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  'alappuzha':            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  'munnar':               'https://images.unsplash.com/photo-1630973008133-8fc5f98c35a3?w=800&q=80',
  'thekkady':             'https://images.unsplash.com/photo-1630973008133-8fc5f98c35a3?w=800&q=80',
  'wayanad':              'https://images.unsplash.com/photo-1630973008133-8fc5f98c35a3?w=800&q=80',
  'goa':                  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  'mysore':               'https://images.unsplash.com/photo-1567416661576-659f49e6aba5?w=800&q=80',
  'mysuru':               'https://images.unsplash.com/photo-1567416661576-659f49e6aba5?w=800&q=80',
  'hampi':                'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  'coorg':                'https://images.unsplash.com/photo-1610448721566-47369c768e70?w=800&q=80',
  'kodagu':               'https://images.unsplash.com/photo-1610448721566-47369c768e70?w=800&q=80',
  'ooty':                 'https://images.unsplash.com/photo-1590123715927-4da88cd4d55e?w=800&q=80',
  'kodaikanal':           'https://images.unsplash.com/photo-1590123715927-4da88cd4d55e?w=800&q=80',
  'pondicherry':          'https://images.unsplash.com/photo-1571260899304-425eee4c7efd?w=800&q=80',
  'puducherry':           'https://images.unsplash.com/photo-1571260899304-425eee4c7efd?w=800&q=80',
  'madurai':              'https://images.unsplash.com/photo-1600100397608-f7a4d5e3046e?w=800&q=80',
  'tamil-nadu':           'https://images.unsplash.com/photo-1600100397608-f7a4d5e3046e?w=800&q=80',
  'hyderabad':            'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80',
  // ── West India ─────────────────────────────────────────────
  'mumbai':               'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  'gujarat':              'https://images.unsplash.com/photo-1558618047-f4e90c90d9c1?w=800&q=80',
  'rann-of-kutch':        'https://images.unsplash.com/photo-1558618047-f4e90c90d9c1?w=800&q=80',
  'somnath':              'https://images.unsplash.com/photo-1600100397608-f7a4d5e3046e?w=800&q=80',
  // ── Islands ────────────────────────────────────────────────
  'andaman':              'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80',
  'andaman-and-nicobar':  'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80',
  'port-blair':           'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80',
  'lakshadweep':          'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80',
  // ── International ──────────────────────────────────────────
  'bali':                 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'thailand':             'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80',
  'singapore':            'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'dubai':                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  'nepal':                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'bhutan':               'https://images.unsplash.com/photo-1490077476659-095159692ab5?w=800&q=80',
  'sri-lanka':            'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
  'maldives':             'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
  'europe':               'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
};

// Known generic fallback URLs used by the backend — treat these as "no image set"
const GENERIC_FALLBACKS = new Set([
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
]);

function isGeneric(url?: string): boolean {
  if (!url) return true;
  return GENERIC_FALLBACKS.has(url.split('?')[0]);
}

function normalise(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getDestinationImage(destination: Destination): string {
  // Try slug first, then normalised name
  const bySlug = destination.slug ? DEST_IMAGES[normalise(destination.slug)] : undefined;
  const byName = destination.name ? DEST_IMAGES[normalise(destination.name)] : undefined;
  const mapped = bySlug || byName;

  // If backend image is real (non-generic), prefer it; else use our map; else generic mountain
  if (!isGeneric(destination.imageUrl)) return destination.imageUrl;
  return mapped || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
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
