'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Check, Calendar, Users, Phone, Mail, Share2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Hotel {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    location: string;
    city: string;
    country: string;
    rating: number;
    reviewCount: number;
    pricePerNight: number | { value: string };
    type: string;
    amenities: string[];
    isBoutique?: boolean;
    isFeatured?: boolean;
    destination?: {
        id: number;
        name: string;
        slug: string;
    };
}

export default function HotelDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                setLoading(true);
                const response = await api.getHotelById(Number(id));
                setHotel(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Hotel not found' : 'Failed to load hotel');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHotel();
        }
    }, [id]);

    const formatPrice = (price: number | { value: string }) => {
        const numPrice = typeof price === 'object' ? parseFloat(price.value) : price;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numPrice);
    };

    const calculateTotal = () => {
        if (!hotel || !checkIn || !checkOut) return 0;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        const price = typeof hotel.pricePerNight === 'object' 
            ? parseFloat(hotel.pricePerNight.value) 
            : hotel.pricePerNight;
        return nights > 0 ? nights * price * guests : price * guests;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading hotel details...</p>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">404</h1>
                    <p className="text-text-secondary mb-8">{error || 'Hotel not found'}</p>
                    <Link href="/hotels" className="btn-primary">
                        Back to Stays
                    </Link>
                </div>
            </div>
        );
    }

    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[320px] sm:h-[55vh] sm:min-h-[360px] md:h-[60vh] md:min-h-[400px] overflow-hidden">
                <Image
                    src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80'}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                
                <div className="relative z-10 h-full flex items-end">
                    <div className="section-container w-full pb-8 md:pb-16">
                        <div className="max-w-4xl">
                            <Link 
                                href="/hotels" 
                                className="inline-flex items-center gap-2 text-cream/80 hover:text-cream mb-6 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-caption uppercase tracking-widest">Back to Stays</span>
                            </Link>
                            
                            {hotel.type && (
                                <div className="mb-4">
                                    <span className="px-4 py-2 bg-cream/20 backdrop-blur-sm text-caption uppercase tracking-widest text-cream">
                                        {hotel.type}
                                    </span>
                                </div>
                            )}
                            
                            <h1 className="font-display text-2xl sm:text-3xl md:text-display-xl text-white mb-3 md:mb-4">{hotel.name}</h1>
                            
                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-white/80 text-sm sm:text-base mb-4 md:mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} />
                                    <span>{hotel.location || `${hotel.city}, ${hotel.country}`}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="fill-accent text-accent" />
                                    <span>{hotel.rating}</span>
                                    {hotel.reviewCount > 0 && (
                                        <span className="text-white/60">({hotel.reviewCount} reviews)</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-container py-10 md:py-16">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section>
                            <h2 className="text-display-lg mb-6">About</h2>
                            <div className="prose max-w-none">
                                <p className="text-body-lg leading-relaxed whitespace-pre-line">{hotel.description}</p>
                            </div>
                        </section>

                        {/* Amenities */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Amenities</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {hotel.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-4 bg-cream-light border border-primary/10">
                                            <Check size={20} className="text-accent flex-shrink-0" />
                                            <span className="text-body-lg">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Location */}
                        <section>
                            <h2 className="text-display-lg mb-6">Location</h2>
                            <div className="bg-cream-light p-6 border border-primary/10">
                                <div className="flex items-start gap-3">
                                    <MapPin size={24} className="text-secondary mt-1" />
                                    <div>
                                        <p className="text-body-lg font-medium mb-1">{hotel.name}</p>
                                        <p className="text-body-lg text-text-secondary">
                                            {hotel.location || `${hotel.city}, ${hotel.country}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="space-y-8">
                        {/* Booking Card */}
                        <div className="bg-cream-light p-6 md:p-8 border border-primary/10 lg:sticky lg:top-24">
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="font-display text-2xl sm:text-3xl md:text-4xl text-primary">
                                        {formatPrice(hotel.pricePerNight)}
                                    </span>
                                    <span className="text-text-secondary">/ night</span>
                                </div>
                                {hotel.reviewCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="fill-accent text-accent" />
                                        <span className="text-sm">{hotel.rating}</span>
                                        <span className="text-sm text-text-secondary">({hotel.reviewCount} reviews)</span>
                                    </div>
                                )}
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-caption uppercase tracking-widest text-text-secondary mb-2">
                                        Check-in
                                    </label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={minDate}
                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-caption uppercase tracking-widest text-text-secondary mb-2">
                                        Check-out
                                    </label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || minDate}
                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-caption uppercase tracking-widest text-text-secondary mb-2">
                                        Guests
                                    </label>
                                    <div className="flex items-center border border-primary/20 bg-cream">
                                        <button
                                            type="button"
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="px-4 py-3 hover:bg-cream-dark transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="flex-1 text-center py-3">{guests}</span>
                                        <button
                                            type="button"
                                            onClick={() => setGuests(guests + 1)}
                                            className="px-4 py-3 hover:bg-cream-dark transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {(checkIn && checkOut) && (
                                    <div className="pt-4 border-t border-primary/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-text-secondary">
                                                {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                                            </span>
                                            <span className="font-display text-2xl text-primary">
                                                {formatPrice({ value: calculateTotal().toString() })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="btn-primary w-full"
                                    onClick={() => {
                                        // TODO: Implement booking functionality
                                        alert('Booking functionality coming soon!');
                                    }}
                                >
                                    Book Now
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-primary/10">
                                <p className="text-caption text-text-secondary mb-4">Need assistance?</p>
                                <div className="space-y-2">
                                    <a href="tel:+1234567890" className="flex items-center gap-2 text-body-lg hover:text-secondary transition-colors">
                                        <Phone size={18} />
                                        <span>+91 8427831127</span>
                                    </a>
                                    <a href="mailto:connectylootrips@gmail.com" className="flex items-center gap-2 text-body-lg hover:text-secondary transition-colors">
                                        <Mail size={18} />
                                        <span>connectylootrips@gmail.com</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="bg-cream-light p-6 border border-primary/10">
                            <p className="text-caption uppercase tracking-widest text-text-secondary mb-4">
                                Share this stay
                            </p>
                            <button className="p-3 border border-primary/20 hover:border-primary transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Destinations */}
            {hotel.destination && (
                <section className="py-16 bg-cream-dark">
                    <div className="section-container">
                        <h2 className="text-display-lg mb-8">Explore the Destination</h2>
                        <Link 
                            href={`/destinations/${hotel.destination.slug}`}
                            className="btn-outline"
                        >
                            Discover {hotel.destination.name}
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

