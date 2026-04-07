'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    Calendar, MapPin, Clock, ChevronDown, ChevronUp,
    AlertCircle, Share2, ThumbsUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { Event as EventType } from '@/types';
import PaintSplashBg from '@/components/PaintSplashBg';

function parseJsonArray<T>(val: string | string[] | T[] | undefined): T[] {
    if (val == null) return [];
    if (Array.isArray(val)) return val as T[];
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val) as T[];
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }
    return [];
}

function parseFaq(val: string | { question: string; answer: string }[] | undefined): { question: string; answer: string }[] {
    if (val == null) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }
    return [];
}

function formatPrice(amount: number | string): string {
    const n = typeof amount === 'number' ? amount : parseFloat(String(amount ?? 0));
    return '₹' + n.toLocaleString('en-IN');
}

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slugOrId = params?.slugOrId as string;

    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [interested, setInterested] = useState(false);
    const [shareFeedback, setShareFeedback] = useState<string | null>(null);

    // Persist interested in localStorage by event id
    useEffect(() => {
        if (typeof window === 'undefined' || !event?.id) return;
        try {
            const key = `event-interested-${event.id}`;
            const stored = localStorage.getItem(key);
            if (stored === '1') setInterested(true);
        } catch { /* ignore */ }
    }, [event?.id]);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!slugOrId) return;
            try {
                setLoading(true);
                const isNumeric = /^\d+$/.test(slugOrId);
                const response = isNumeric
                    ? await api.getEventById(Number(slugOrId))
                    : await api.getEventBySlug(slugOrId);
                setEvent(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Event not found' : 'Failed to load event');
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [slugOrId]);

    const highlights = useMemo(() => parseJsonArray<string>(event?.highlights), [event?.highlights]);
    const galleryUrls = useMemo(() => parseJsonArray<string>(event?.galleryUrls), [event?.galleryUrls]);
    const faqList = useMemo(() => parseFaq(event?.faq), [event?.faq]);

    const ticketTypes = event?.ticketTypes ?? [];
    const hasTicketTypes = ticketTypes.length > 0;
    const priceFrom = event && hasTicketTypes
        ? Math.min(...ticketTypes.map(t => typeof t.price === 'number' ? t.price : parseFloat(String(t.price))))
        : (event ? (typeof event.price === 'number' ? event.price : parseFloat(String(event.price ?? 0))) : 0);

    const handleBookNow = () => {
        if (!event) return;
        if (hasTicketTypes) {
            router.push(`/events/${slugOrId}/tickets`);
        } else {
            router.push(`/events/checkout?eventId=${event.id}&date=${encodeURIComponent(event.eventDate)}`);
        }
    };

    const handleShare = async () => {
        if (!event) return;
        const url = typeof window !== 'undefined' ? `${window.location.origin}/events/${event.slug || event.id}` : '';
        const title = event.title;
        const text = event.shortDescription || `${event.title} on YlooTrips`;

        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({ title, text, url });
                setShareFeedback('Shared!');
            } else {
                await navigator.clipboard?.writeText(url);
                setShareFeedback('Link copied!');
            }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                try {
                    await navigator.clipboard?.writeText(url);
                    setShareFeedback('Link copied!');
                } catch {
                    setShareFeedback('Could not share');
                }
            }
        }
        setTimeout(() => setShareFeedback(null), 2500);
    };

    const handleInterested = () => {
        setInterested(prev => {
            const next = !prev;
            if (event?.id && typeof window !== 'undefined') {
                try {
                    localStorage.setItem(`event-interested-${event.id}`, next ? '1' : '0');
                } catch { /* ignore */ }
            }
            return next;
        });
    };

    const imageUrl = event?.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80';
    const allImages = useMemo(() => {
        const base = galleryUrls.length > 0 ? [imageUrl, ...galleryUrls.filter(u => u && u !== imageUrl)] : [imageUrl];
        return base.filter(Boolean);
    }, [imageUrl, galleryUrls]);
    const hasMultipleImages = allImages.length > 1;

    // Auto-advance carousel every 5s
    useEffect(() => {
        if (!hasMultipleImages) return;
        const t = setInterval(() => {
            setGalleryIndex(prev => (prev + 1) % allImages.length);
        }, 5000);
        return () => clearInterval(t);
    }, [hasMultipleImages, allImages.length]);

    const goPrev = () => setGalleryIndex(prev => (prev - 1 + allImages.length) % allImages.length);
    const goNext = () => setGalleryIndex(prev => (prev + 1) % allImages.length);

    // Format date like BMS: "Wed 4 Mar 2026"
    const formatBmsDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-below-nav px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-below-nav px-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Event not found</h1>
                    <p className="text-gray-500 mb-6">{error || 'This event may have ended or been removed.'}</p>
                    <Link href="/events" className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                        Browse events
                    </Link>
                </div>
            </div>
        );
    }

    const dateStr = typeof event.eventDate === 'string' ? event.eventDate : '';
    const bannerStrip = event.bannerHighlights || (highlights.length > 0 ? highlights.join(' | ') : '');

    return (
        <PaintSplashBg className="min-h-screen pt-below-nav">
            {/* ─── Back navigation ─── */}
            <div className="bg-white/70 backdrop-blur-sm border-b border-gray-100 section-container py-3 flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            {/* ─── Event Title ─── */}
            <div className="section-container pt-4 pb-2 flex items-start justify-between gap-3 max-w-5xl mx-auto">
                <h1 className="text-[22px] font-bold text-gray-900 leading-tight flex-1">{event.title}</h1>
                <div className="flex items-center gap-2 shrink-0">
                    {shareFeedback && (
                        <span className="text-xs text-green-600 font-medium animate-in fade-in duration-200">{shareFeedback}</span>
                    )}
                    <button
                        type="button"
                        onClick={handleShare}
                        className="mt-1 w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                        aria-label="Share"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ─── Hero Image Carousel (BMS-style sliding gallery) ─── */}
            <div className="relative section-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
                <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-xl">
                    {/* Sliding track */}
                    <div
                        className="flex h-full transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${galleryIndex * 100}%)` }}
                    >
                        {allImages.map((url, i) => (
                            <div key={i} className="relative w-full flex-shrink-0 h-full">
                                <Image
                                    src={url}
                                    alt={`${event.title} – image ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={i === 0}
                                    sizes="(max-width: 960px) 100vw, 960px"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Banner strip */}
                    {bannerStrip && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white text-[11px] font-semibold py-2 px-4 text-center tracking-wide uppercase">
                            {bannerStrip}
                        </div>
                    )}
                    {/* Prev / Next arrows */}
                    {hasMultipleImages && (
                        <>
                            <button
                                type="button"
                                onClick={goPrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors shadow-lg"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={goNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors shadow-lg"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    {/* Dots */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
                            {allImages.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setGalleryIndex(i)}
                                    className={`h-1.5 rounded-full transition-all ${galleryIndex === i ? 'bg-white w-6' : 'bg-white/50 w-1.5'}`}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {/* Thumbnail strip (BMS-style gallery) */}
                {hasMultipleImages && allImages.length <= 8 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {allImages.map((url, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setGalleryIndex(i)}
                                aria-label={`View image ${i + 1}`}
                                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${galleryIndex === i ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent hover:border-gray-300'}`}
                            >
                                <span className="absolute inset-0 block">
                                    <Image
                                        src={url}
                                        alt={`Gallery thumbnail ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Category pill + Interested ─── */}
            <div className="section-container py-3 md:py-4 flex items-center justify-between max-w-5xl mx-auto border-b border-gray-100">
                <div className="flex items-center gap-2">
                    {event.category && (
                        <span className="bg-gray-100 text-gray-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                            {event.category}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleInterested}
                    className={`flex items-center gap-1.5 text-[13px] font-medium transition-colors ${interested ? 'text-blue-600' : 'text-blue-600 hover:text-blue-700'}`}
                    aria-pressed={interested}
                >
                    <ThumbsUp className={`w-3.5 h-3.5 ${interested ? 'fill-current' : ''}`} />
                    <span>{interested ? "You're interested" : 'Interested'}</span>
                </button>
            </div>

            {/* ─── Main Content: Two-Column on Desktop ─── */}
            <div className="max-w-5xl mx-auto section-container py-6 md:py-8 lg:grid lg:grid-cols-3 lg:gap-8 lg:py-10">

                {/* LEFT: Event Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Quick info (BMS sidebar style info — shown inline on mobile, sidebar on desktop) */}
                    <div className="lg:hidden bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3">
                        {dateStr && (
                            <div className="flex items-center gap-3 text-[14px] text-gray-700">
                                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>{formatBmsDate(dateStr)}</span>
                            </div>
                        )}
                        {event.eventTime && (
                            <div className="flex items-center gap-3 text-[14px] text-gray-700">
                                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>{event.eventTime}</span>
                            </div>
                        )}
                        {event.duration && (
                            <div className="flex items-center gap-3 text-[14px] text-gray-700">
                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{event.duration}</span>
                            </div>
                        )}
                        {event.ageRestriction && (
                            <div className="flex items-center gap-3 text-[14px] text-gray-700">
                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{event.ageRestriction}</span>
                            </div>
                        )}
                        {event.languages && (
                            <div className="flex items-center gap-3 text-[14px] text-gray-700">
                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                </svg>
                                <span>{event.languages}</span>
                            </div>
                        )}
                        {(event.venueName || event.city) && (
                            <div className="flex items-start gap-3 text-[14px] text-gray-700">
                                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-medium">{event.venueName}</span>
                                    {event.city && <span className="text-gray-500">: {event.city}</span>}
                                </div>
                            </div>
                        )}
                        {/* Price + Book Now (mobile) */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[17px] font-bold text-gray-900">{formatPrice(priceFrom)} <span className="text-[13px] font-normal text-gray-500">onwards</span></p>
                                <p className="text-[12px] text-green-600 font-medium">Available</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleBookNow}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-[14px] px-6 py-2.5 rounded-lg transition-colors"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>

                    {/* About The Event */}
                    {(event.longDescription || event.description) && (
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 mb-3">About The Event</h2>
                            <div className="text-[14px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {event.longDescription || event.description}
                            </div>
                        </div>
                    )}

                    {/* Important Info */}
                    {event.importantInfo && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-[14px]">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                Important Information
                            </h3>
                            <p className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">{event.importantInfo}</p>
                        </div>
                    )}

                    {/* Terms & Conditions */}
                    {event.termsAndConditions && (
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 mb-3">Terms &amp; Conditions</h2>
                            <p className="text-[13px] text-gray-600 whitespace-pre-wrap leading-relaxed">{event.termsAndConditions}</p>
                        </div>
                    )}

                    {/* Venue Info */}
                    {(event.venueName || event.venueAddress) && (
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 mb-3">Venue</h2>
                            <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    {event.venueName && <p className="font-semibold text-gray-800 text-[14px]">{event.venueName}</p>}
                                    {event.city && <p className="text-[13px] text-gray-500">{event.city}</p>}
                                    {event.venueAddress && <p className="text-[13px] text-gray-500 mt-0.5">{event.venueAddress}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FAQ */}
                    {faqList.length > 0 && (
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 mb-3">FAQs</h2>
                            <div className="space-y-2">
                                {faqList.map((item, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                                            className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-medium text-gray-900 text-[14px] pr-4">{item.question}</span>
                                            {faqOpen === i
                                                ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                                                : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                                            }
                                        </button>
                                        {faqOpen === i && (
                                            <div className="px-4 pb-4 text-[13px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                                {item.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Link href="/events" className="text-blue-600 hover:underline text-[13px]">← Back to all events</Link>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Event Info Card (Desktop only) */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {/* Small thumbnail */}
                        <div className="h-40 bg-gray-100 overflow-hidden relative">
                            <Image src={imageUrl} alt={event.title} fill className="object-cover" />
                        </div>
                        <div className="p-4 space-y-3">
                            {dateStr && (
                                <div className="flex items-center gap-3 text-[13px] text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{formatBmsDate(dateStr)}</span>
                                </div>
                            )}
                            {event.eventTime && (
                                <div className="flex items-center gap-3 text-[13px] text-gray-700">
                                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{event.eventTime}</span>
                                </div>
                            )}
                            {event.duration && (
                                <div className="flex items-center gap-3 text-[13px] text-gray-700">
                                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{event.duration}</span>
                                </div>
                            )}
                            {event.ageRestriction && (
                                <div className="flex items-center gap-3 text-[13px] text-gray-700">
                                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event.ageRestriction}</span>
                                </div>
                            )}
                            {event.languages && (
                                <div className="flex items-center gap-3 text-[13px] text-gray-700">
                                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    <span>{event.languages}</span>
                                </div>
                            )}
                            {(event.venueName || event.city) && (
                                <div className="flex items-start gap-3 text-[13px] text-gray-700">
                                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        {event.venueName && <span>{event.venueName}</span>}
                                        {event.city && <span className="text-gray-500">: {event.city}</span>}
                                    </div>
                                </div>
                            )}
                            <div className="pt-3 border-t border-gray-100">
                                <p className="text-[15px] font-bold text-gray-900">
                                    {formatPrice(priceFrom)} <span className="text-[12px] font-normal text-gray-500">onwards</span>
                                </p>
                                <p className="text-[11px] text-green-600 font-medium mb-3">Available</p>
                                <button
                                    type="button"
                                    onClick={handleBookNow}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold text-[14px] py-3 rounded-lg transition-colors"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile: Sticky bottom Book Now bar ─── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                <div>
                    <p className="text-[16px] font-bold text-gray-900">
                        {formatPrice(priceFrom)} <span className="text-[12px] font-normal text-gray-500">onwards</span>
                    </p>
                    <p className="text-[11px] text-green-600 font-semibold">Available</p>
                </div>
                <button
                    type="button"
                    onClick={handleBookNow}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold text-[14px] px-8 py-3 rounded-lg transition-colors"
                >
                    Book Now
                </button>
            </div>

            {/* Add bottom padding on mobile for the fixed bar */}
            <div className="lg:hidden h-20" />
        </PaintSplashBg>
    );
}
