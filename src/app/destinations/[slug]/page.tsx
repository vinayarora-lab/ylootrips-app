'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Globe, Clock, Shield, Utensils, Camera, ArrowRight, Star } from 'lucide-react';
import { api } from '@/lib/api';
import TripCard from '@/components/TripCard';
import { Trip } from '@/types';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { getDestinationImageUrl, DEST_IMAGES } from '@/lib/destinationImages';

interface DestinationDetail {
    id: number;
    destination: {
        id: number;
        name: string;
        slug: string;
        description: string;
        imageUrl: string;
        country: string;
        region: string;
    };
    overview: string;
    bestTimeToVisit: string;
    climate: string;
    culture: string;
    cuisine: string;
    highlights: string[];
    galleryImages: string[];
    popularActivities: string[];
    visaInfo: string;
    currency: string;
    language: string;
    timeZone: string;
    safetyRating: number;
    budgetRange: string;
}

export default function DestinationDetailPage() {
    const params = useParams();
    const { currency } = useCurrency();
    const slug = params?.slug as string;
    
    const [detail, setDetail] = useState<DestinationDetail | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                let detailData: DestinationDetail | null = null;

                try {
                    const detailRes = await api.getDestinationDetails(slug);
                    detailData = detailRes.data;
                } catch {
                    // Detail record may not exist — fall back to basic destination info
                    try {
                        const basicRes = await api.getDestinationBySlug(slug);
                        const dest = basicRes.data;
                        if (dest) {
                            detailData = {
                                id: 0,
                                destination: dest,
                                overview: dest.description || '',
                                bestTimeToVisit: '',
                                climate: '',
                                culture: '',
                                cuisine: '',
                                highlights: [],
                                galleryImages: [],
                                popularActivities: [],
                                visaInfo: '',
                                currency: '',
                                language: '',
                                timeZone: '',
                                safetyRating: 0,
                                budgetRange: '',
                            };
                        }
                    } catch {
                        setError('Destination not found');
                        return;
                    }
                }

                if (!detailData) {
                    setError('Destination not found');
                    return;
                }

                setDetail(detailData);

                // Fetch trips for this destination
                if (detailData?.destination?.id) {
                    try {
                        const tripsResponse = await api.getTrips({ destinationId: detailData.destination.id });
                        setTrips(tripsResponse.data);
                    } catch {
                        setTrips([]);
                    }
                }

                setError(null);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Destination not found' : 'Failed to load destination');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading destination...</p>
                </div>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">404</h1>
                    <p className="text-text-secondary mb-8">{error || 'Destination not found'}</p>
                    <Link href="/destinations" className="btn-primary">
                        Back to Destinations
                    </Link>
                </div>
            </div>
        );
    }

    const destination = detail.destination;

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <BreadcrumbJsonLd items={[
                { name: 'Home', url: 'https://www.ylootrips.com' },
                { name: 'Destinations', url: 'https://www.ylootrips.com/destinations' },
                { name: destination.name, url: `https://www.ylootrips.com/destinations/${destination.slug || slug}` },
            ]} />

            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
                <Image
                    src={(() => {
                        // Always prefer our curated map — backend gallery/imageUrl often has wrong photos
                        const curated = DEST_IMAGES[(destination.slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')] ||
                                        DEST_IMAGES[(destination.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')];
                        if (curated) return curated;
                        // Fall back to gallery or backend URL only if no curated entry
                        return detail.galleryImages?.[0] || getDestinationImageUrl(destination.slug, destination.name, destination.imageUrl);
                    })()}
                    alt={destination.name}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      e.currentTarget.srcset = '';
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                
                <div className="relative z-10 h-full flex items-end">
                    <div className="section-container w-full pb-16">
                        <div className="max-w-3xl">
                            <h1 className="text-display-xl text-white mb-4">{destination.name}</h1>
                            <p className="text-body-lg text-white/90 mb-6">{destination.description}</p>
                            <div className="flex flex-wrap gap-4 text-white">
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} />
                                    <span>{destination.country}, {destination.region}</span>
                                </div>
                                {detail.safetyRating && (
                                    <div className="flex items-center gap-2">
                                        <Shield size={20} />
                                        <span>Safety: {detail.safetyRating}/5</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Info Bar */}
            <section className="bg-cream-dark border-b border-primary/10">
                <div className="section-container py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {detail.currency && (
                            <div className="flex items-center gap-3">
                                <DollarSign size={24} className="text-secondary" />
                                <div>
                                    <p className="text-caption text-text-secondary">Currency</p>
                                    <p className="font-medium">{detail.currency}</p>
                                </div>
                            </div>
                        )}
                        {detail.language && (
                            <div className="flex items-center gap-3">
                                <Globe size={24} className="text-secondary" />
                                <div>
                                    <p className="text-caption text-text-secondary">Language</p>
                                    <p className="font-medium">{detail.language}</p>
                                </div>
                            </div>
                        )}
                        {detail.timeZone && (
                            <div className="flex items-center gap-3">
                                <Clock size={24} className="text-secondary" />
                                <div>
                                    <p className="text-caption text-text-secondary">Time Zone</p>
                                    <p className="font-medium">{detail.timeZone}</p>
                                </div>
                            </div>
                        )}
                        {detail.budgetRange && (
                            <div className="flex items-center gap-3">
                                <DollarSign size={24} className="text-secondary" />
                                <div>
                                    <p className="text-caption text-text-secondary">Budget</p>
                                    <p className="font-medium">{detail.budgetRange}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="section-container py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        {detail.overview && (
                            <section>
                                <h2 className="text-display-lg mb-6">Overview</h2>
                                <div className="prose max-w-none">
                                    <p className="text-body-lg leading-relaxed whitespace-pre-line">{detail.overview}</p>
                                </div>
                            </section>
                        )}

                        {/* Highlights */}
                        {detail.highlights && detail.highlights.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Highlights</h2>
                                <ul className="grid md:grid-cols-2 gap-4">
                                    {detail.highlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Star size={20} className="text-accent mt-1 flex-shrink-0" />
                                            <span className="text-body-lg">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Gallery */}
                        {detail.galleryImages && detail.galleryImages.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {detail.galleryImages.slice(0, 6).map((image, index) => (
                                        <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                                            <Image
                                                src={image}
                                                alt={`${destination.name} gallery photo ${index + 1} — ${destination.country} travel`}
                                                fill
                                                className="object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Popular Activities */}
                        {detail.popularActivities && detail.popularActivities.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Popular Activities</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {detail.popularActivities.map((activity, index) => (
                                        <div key={index} className="p-6 bg-cream-light border border-primary/10">
                                            <p className="text-body-lg">{activity}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Culture */}
                        {detail.culture && (
                            <section>
                                <h2 className="text-display-lg mb-6">Culture & Heritage</h2>
                                <p className="text-body-lg leading-relaxed whitespace-pre-line">{detail.culture}</p>
                            </section>
                        )}

                        {/* Cuisine */}
                        {detail.cuisine && (
                            <section>
                                <h2 className="text-display-lg mb-6 flex items-center gap-3">
                                    <Utensils size={32} className="text-accent" />
                                    Local Cuisine
                                </h2>
                                <p className="text-body-lg leading-relaxed whitespace-pre-line">{detail.cuisine}</p>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Facts */}
                        <div className="bg-cream-light p-8 border border-primary/10">
                            <h3 className="text-2xl font-light mb-6">Quick Facts</h3>
                            <div className="space-y-4">
                                {detail.bestTimeToVisit && (
                                    <div>
                                        <p className="text-caption text-text-secondary mb-1">Best Time to Visit</p>
                                        <p className="text-body-lg">{detail.bestTimeToVisit}</p>
                                    </div>
                                )}
                                {detail.climate && (
                                    <div>
                                        <p className="text-caption text-text-secondary mb-1">Climate</p>
                                        <p className="text-body-lg">{detail.climate}</p>
                                    </div>
                                )}
                                {detail.visaInfo && (
                                    <div>
                                        <p className="text-caption text-text-secondary mb-1">Visa Information</p>
                                        <p className="text-body-lg">{detail.visaInfo}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Trips */}
                        {trips.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-light mb-6">Available Trips</h3>
                                <div className="space-y-4">
                                    {trips.slice(0, 3).map((trip) => (
                                        <Link key={trip.id} href={`/trips/${trip.id}`}>
                                            <div className="p-6 bg-cream-light border border-primary/10 hover:border-primary/30 transition-all card-elegant">
                                                <h4 className="text-xl font-light mb-2">{trip.title}</h4>
                                                <p className="text-body-sm text-text-secondary mb-4 line-clamp-2">{trip.shortDescription}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-light">{trip.price ? formatPriceWithCurrency(trip.price, currency) : 'N/A'}</span>
                                                    <ArrowRight size={20} className="text-secondary" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {trips.length > 3 && (
                                    <Link href={`/trips?destination=${destination.name}`} className="btn-ghost mt-4 w-full justify-center">
                                        View All {trips.length} Trips
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

