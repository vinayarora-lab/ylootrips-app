'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    backgroundImage?: string;
    overlayClassName?: string;
}

// Default background images for different pages
const defaultBackgrounds: Record<string, string> = {
    'Domestic': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80',
    'International': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80',
    'Destinations': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80',
    'Experiences': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    'Curated Experiences': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    'Stays': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    'Boutique Stays': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    'Journal': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80',
    'The Journal': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80',
    'About': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1920&q=80',
    'Our Story': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1920&q=80',
    'Contact': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
    'Plan Your Journey': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
};

export default function PageHero({ title, subtitle, breadcrumb, backgroundImage, overlayClassName }: PageHeroProps) {
    // Try to find a default background if none provided
    const imageUrl = backgroundImage || defaultBackgrounds[breadcrumb || ''] || defaultBackgrounds[title] ||
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80';

    return (
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className={`absolute inset-0 ${overlayClassName || 'bg-primary/70'}`} />
            </div>

            {/* Content */}
            <div className="relative z-10 section-container">
                {/* Breadcrumb */}
                {breadcrumb && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                        <Link
                            href="/"
                            className="text-caption uppercase tracking-[0.2em] text-cream/60 hover:text-cream transition-colors"
                        >
                            Home
                        </Link>
                        <span className="text-cream/40">→</span>
                        <span className="text-caption uppercase tracking-[0.2em] text-accent">
                            {breadcrumb}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1 className="font-display text-display-xl max-w-4xl text-cream text-balance">
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-base md:text-body-lg max-w-2xl mt-4 md:mt-6 text-cream/70">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
