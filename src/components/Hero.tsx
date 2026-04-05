'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ChevronDown, Volume2, VolumeX, Shield, CreditCard, Clock, Star, CheckCircle2 } from 'lucide-react';
import AdCarousel from '@/components/AdCarousel';
import { useVisitor } from '@/context/VisitorContext';
import { useCurrency } from '@/context/CurrencyContext';

interface HeroProps {
    content?: {
        eyebrow?: string;
        title?: string;
        subtitle?: string;
        imageUrl?: string;
        ctaText?: string;
        ctaLink?: string;
        secondaryCtaText?: string;
        secondaryCtaLink?: string;
    };
    stats?: Array<{
        value: string;
        label: string;
    }>;
}

export default function Hero({ content, stats }: HeroProps) {
    const { visitor, setVisitor, hasChosen } = useVisitor();
    const { setCurrency } = useCurrency();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const isForeigner = visitor === 'foreigner';
    const isIndian = visitor === 'indian';

    const eyebrow = content?.eyebrow || (isForeigner ? 'Curated India Journeys for International Travelers' : 'Curated Journeys for the Soul');
    const title = content?.title || (isForeigner ? 'Discover Incredible India' : "Discover the World's Hidden Treasures");
    const subtitle = content?.subtitle || (isForeigner
        ? 'Expert-guided tours across India\'s most iconic destinations. Book online, pay securely in USD with your international card.'
        : 'We craft transformative travel experiences that connect you with authentic cultures, breathtaking landscapes, and unforgettable moments.');
    const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80';
    const ctaText = content?.ctaText || (isForeigner ? 'View India Tours' : 'Start Your Journey');
    const ctaLink = content?.ctaLink || (isForeigner ? '/tours' : '/contact');
    const secondaryCtaText = content?.secondaryCtaText || (isForeigner ? 'View Itineraries' : 'Explore Destinations');
    const secondaryCtaLink = content?.secondaryCtaLink || (isForeigner ? '/tours/golden-triangle-10-day' : '/destinations');

    const displayStats = stats && stats.length > 0 ? stats : [
        { value: '150+', label: 'Curated Destinations' },
        { value: '25K+', label: 'Happy Travelers' },
        { value: '98%', label: 'Satisfaction Rate' },
        { value: '12+', label: 'Years of Excellence' },
    ];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setMousePosition({ x, y });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) { audio.volume = 0.2; audio.play(); setIsPlaying(true); }
        else { audio.pause(); setIsPlaying(false); }
    };

    const choose = (type: 'indian' | 'foreigner') => {
        setVisitor(type);
        setCurrency(type === 'indian' ? 'INR' : 'USD');
    };

    return (
        <section ref={heroRef} className="relative h-screen min-h-[640px] md:min-h-[760px] lg:min-h-[860px] overflow-hidden">
            <audio ref={audioRef} loop preload="auto" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" />

            {/* Music Toggle */}
            <button
                onClick={toggleAudio}
                className="absolute bottom-20 md:bottom-24 right-4 md:right-8 z-30 p-2.5 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream hover:bg-white/20 transition-all duration-300 group"
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
                {isPlaying
                    ? <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform animate-pulse" />
                    : <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                }
            </button>

            {/* Parallax Background */}
            <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.1)` }}
            >
                <video autoPlay muted loop playsInline poster={imageUrl} className="absolute inset-0 w-full h-full object-cover">
                    <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                </video>
                <Image src={imageUrl} alt="India travel — scenic landscape showcasing YlooTrips destinations" fill priority className="object-cover -z-10" />
                <div className="absolute inset-0 bg-linear-to-r from-primary/85 via-primary/55 to-transparent" />
                <div className="absolute inset-0 bg-primary/25" />
            </div>

            {/* Ad Carousel */}
            <AdCarousel />

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col justify-center section-container pt-24 md:pt-0">
                <div className="max-w-2xl space-y-5 md:space-y-7">

                    {/* ── Visitor Type Selector ── */}
                    <div className="animate-fade-up" style={{ animationDelay: '0s' }}>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-cream/40 mb-2.5">
                            {hasChosen ? 'Viewing as' : 'Who are you?'}
                        </p>
                        <div className="flex items-center gap-2">
                            {/* Indian */}
                            <button
                                onClick={() => choose('indian')}
                                className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider border transition-all duration-300
                                    ${isIndian
                                        ? 'bg-accent border-accent text-primary shadow-lg shadow-accent/20'
                                        : 'border-cream/25 text-cream/65 hover:border-cream/55 hover:text-cream hover:bg-white/8 backdrop-blur-sm'
                                    }`}
                            >
                                <span className="text-sm">🇮🇳</span>
                                <span>Indian Resident</span>
                                {isIndian && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />}
                            </button>

                            {/* Foreigner */}
                            <button
                                onClick={() => choose('foreigner')}
                                className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider border transition-all duration-300
                                    ${isForeigner
                                        ? 'bg-accent border-accent text-primary shadow-lg shadow-accent/20'
                                        : 'border-cream/25 text-cream/65 hover:border-cream/55 hover:text-cream hover:bg-white/8 backdrop-blur-sm'
                                    }`}
                            >
                                <span className="text-sm">🌍</span>
                                <span>International Visitor</span>
                                {isForeigner && <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />}
                            </button>
                        </div>

                        {/* Currency hint */}
                        {hasChosen && (
                            <p className="text-[9px] text-cream/35 mt-1.5 tracking-wider">
                                {isIndian ? 'Prices shown in ₹ INR' : 'Prices shown in $ USD'}
                            </p>
                        )}
                    </div>

                    {/* Eyebrow */}
                    <p className="text-caption uppercase tracking-[0.3em] text-accent animate-fade-up" style={{ animationDelay: '0.15s' }}>
                        {eyebrow}
                    </p>

                    {/* Title */}
                    <h1 className="font-display text-display-xl text-cream leading-tight animate-fade-up" style={{ animationDelay: '0.25s' }}>
                        {title.split(' ').map((word, i, arr) => (
                            <span key={i}>
                                {i === arr.length - 2 || i === arr.length - 1
                                    ? <span className="italic">{word} </span>
                                    : <span>{word} </span>
                                }
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-body-lg text-cream/70 max-w-xl animate-fade-up" style={{ animationDelay: '0.35s' }}>
                        {subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 pt-2 animate-fade-up" style={{ animationDelay: '0.45s' }}>
                        <Link href={ctaLink} className="btn-primary">
                            <span>{ctaText}</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link href={secondaryCtaLink} className="btn-outline border-cream/30 text-cream hover:bg-cream/10">
                            <span>{secondaryCtaText}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* ── Trust Signals (both types) ── */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 animate-fade-up" style={{ animationDelay: '0.55s' }}>
                        {isForeigner ? (
                            <>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <CreditCard className="w-3.5 h-3.5 text-accent" />
                                    <span>Visa · Mastercard · Amex</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <Shield className="w-3.5 h-3.5 text-accent" />
                                    <span>Secure USD payments</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <Clock className="w-3.5 h-3.5 text-accent" />
                                    <span>Reply within 1 hour</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                                    <span>4.9/5 from 2,400+ reviews</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <Shield className="w-3.5 h-3.5 text-accent" />
                                    <span>RBI Licensed Company</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                                    <span>GST Registered · MSME Certified</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                                    <span>4.9/5 · 25,000+ happy travellers</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                                    <Clock className="w-3.5 h-3.5 text-accent" />
                                    <span>UPI · NetBanking · EMI available</span>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* Stats Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-primary/90 to-transparent pt-16 md:pt-24 pb-6 md:pb-8">
                <div className="section-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {displayStats.slice(0, 4).map((stat, i) => (
                            <div key={i} className="text-center md:text-left animate-fade-up" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                                <div className="font-display text-2xl sm:text-3xl md:text-4xl text-cream">{stat.value}</div>
                                <div className="text-[10px] sm:text-caption text-cream/50 uppercase tracking-widest mt-0.5 md:mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
                <ChevronDown className="w-6 h-6 text-cream/50" />
            </div>
        </section>
    );
}
