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

const defaultBackgrounds: Record<string, string> = {
    'Domestic': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=900&q=80',
    'International': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&q=80',
    'Destinations': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80',
    'Experiences': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80',
    'Curated Experiences': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80',
    'Stays': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
    'Boutique Stays': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80',
    'Journal': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=900&q=80',
    'The Journal': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=900&q=80',
    'About': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=900&q=80',
    'Our Story': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=900&q=80',
    'Contact': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80',
    'Plan Your Journey': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80',
};

export default function PageHero({ title, subtitle, breadcrumb, backgroundImage, overlayClassName }: PageHeroProps) {
    const imageUrl = backgroundImage
        || defaultBackgrounds[breadcrumb || '']
        || defaultBackgrounds[title]
        || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&q=80';

    return (
        <section className="relative h-[180px] overflow-hidden shrink-0">
            {/* Background */}
            <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
            />
            <div className={`absolute inset-0 ${overlayClassName || 'bg-gradient-to-b from-black/40 via-black/50 to-black/75'}`} />

            {/* Content — always at bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
                {breadcrumb && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <Link href="/" className="text-[10px] font-semibold uppercase tracking-wider text-white/50 hover:text-white/80 transition-colors">
                            Home
                        </Link>
                        <span className="text-white/30 text-[10px]">›</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C4A77D]">
                            {breadcrumb}
                        </span>
                    </div>
                )}
                <h1 className="font-playfair text-white text-2xl font-semibold leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-white/60 text-[12px] leading-snug mt-1.5 line-clamp-2">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
