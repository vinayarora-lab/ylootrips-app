'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Ad {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    redirectUrl: string;
    discountText?: string;
}

export default function AdCarousel() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await api.getActiveAds();
                setAds(response.data || []);
            } catch {
                // silently skip ads if unavailable
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        if (ads.length === 0) return;

        const interval = setInterval(() => {
            setSlideDirection('out');
            setIsAnimating(true);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % ads.length);
                setSlideDirection('in');

                setTimeout(() => {
                    setIsAnimating(false);
                }, 500);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, [ads.length]);

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    // Get all discount texts for marquee
    const discountTexts = ads
        .filter(ad => ad.discountText)
        .map(ad => `🔥 ${ad.discountText} - ${ad.title}`);

    return (
        <>
            {/* Mobile: Infinite scrolling discount strip */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary via-secondary to-primary overflow-hidden">
                <div className="animate-marquee whitespace-nowrap py-2">
                    {[...discountTexts, ...discountTexts, ...discountTexts].map((text, idx) => (
                        <span key={idx} className="inline-block text-white text-sm font-bold mx-8">
                            {text}
                        </span>
                    ))}
                </div>
            </div>

            {/* Desktop: Card carousel on right side of hero */}
            <div className="absolute z-20 hidden lg:block lg:right-8 lg:top-1/2 lg:-translate-y-1/2">
                <Link
                    href={currentAd.redirectUrl}
                    className={`block relative w-72 bg-primary/85 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer
                        ${isAnimating ? (slideDirection === 'out' ? 'animate-slide-out-right' : 'animate-slide-in-right') : ''}`}
                >
                    {/* Discount Badge */}
                    {currentAd.discountText && (
                        <div className="absolute top-3 right-3 z-10 animate-pulse">
                            <div className="bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-3">
                                🔥 {currentAd.discountText}
                            </div>
                        </div>
                    )}

                    {/* Ad Image */}
                    <div className="relative h-40 overflow-hidden">
                        <Image
                            src={currentAd.imageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'}
                            alt={currentAd.title}
                            fill
                            className="object-cover"
                            onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'; }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Ad Content */}
                    <div className="p-4">
                        <h3 className="font-display text-lg text-cream font-semibold mb-1">
                            {currentAd.title}
                        </h3>
                        <p className="text-sm text-cream/70 line-clamp-2">
                            {currentAd.description}
                        </p>

                        {/* CTA */}
                        <div className="mt-3 px-4 py-2 bg-accent text-primary text-xs font-bold uppercase tracking-widest text-center hover:bg-accent-warm transition-colors">Book Now</div>
                        {/* Dots indicator */}
                        <div className="flex gap-1 justify-center mt-3">
                            {ads.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-accent' : 'bg-cream/30'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-2xl border border-accent/20 pointer-events-none" />
                </Link>
            </div>
        </>
    );
}
