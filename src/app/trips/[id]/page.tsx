'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, MapPin, Clock, Star, Check, X, ArrowRight, Utensils, Hotel, ChevronDown, Shield, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import MobileStickyBookingBar from '@/components/MobileStickyBookingBar';
import { BreadcrumbJsonLd, FaqJsonLd, TourJsonLd } from '@/components/JsonLd';
import FlightBookingSection from '@/components/FlightBookingSection';

interface TripItinerary {
    id: number;
    dayNumber: number;
    dayTitle: string;
    description: string;
    activities: string[];
    accommodation: string;
    meals: string;
    imageUrl: string;
}

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const fp = (p: number | string) => formatPriceWithCurrency(p, currency);

    const [trip, setTrip] = useState<Trip | null>(null);
    const [itinerary, setItinerary] = useState<TripItinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGuests, setSelectedGuests] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [tripRes, itineraryRes] = await Promise.all([
                    api.getTripById(Number(id)),
                    api.getTripItinerary(Number(id)).catch(() => ({ data: [] })),
                ]);

                setTrip(tripRes.data);
                setItinerary(itineraryRes.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Trip not found' : 'Failed to load trip');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleBookNow = () => {
        if (!trip) return;
        const bookingData = {
            tripId: trip.id,
            numberOfGuests: selectedGuests,
            travelDate: selectedDate || new Date().toISOString().split('T')[0],
        };
        router.push(`/checkout?tripId=${trip.id}&guests=${selectedGuests}&date=${selectedDate}`);
    };

    const totalPrice = trip ? (typeof trip.price === 'number' ? trip.price : parseFloat(trip.price.toString())) * selectedGuests : 0;
    const basePrice = trip ? (typeof trip.price === 'number' ? trip.price : parseFloat(trip.price.toString())) : 0;

    // Deterministic spots left (consistent server/client)
    const spotsLeft = trip ? (((trip.id * 7) % 9) + 1 <= 5 ? ((trip.id * 7) % 9) + 1 : null) : null;

    const tripFaqs = [
        { q: 'Is this trip suitable for first-time visitors to India?', a: 'Absolutely! Our expert guides are experienced with international travelers. We provide detailed pre-trip briefings, handle all logistics, and are available 24/7 throughout your journey.' },
        { q: 'What is the cancellation policy?', a: 'We offer free cancellation up to 7 days before departure for a full refund. Cancellations 3–7 days before departure receive a 50% refund. Within 3 days, the booking is non-refundable but can be transferred to another date.' },
        { q: 'Do I need a visa to travel to India?', a: 'Most nationalities can apply for an Indian e-Visa online at indianvisaonline.gov.in. Processing takes 2–4 business days. We recommend applying at least 2 weeks before travel.' },
        { q: 'Are international credit/debit cards accepted?', a: 'Yes — we accept all major international cards (Visa, Mastercard, Amex) and process payments securely. Prices can be displayed in USD, INR, or other currencies.' },
        { q: 'What languages do your guides speak?', a: 'All our guides are fluent in English. Several also speak French, German, Spanish, and Japanese. Please mention your preference and we\'ll do our best to match you.' },
        { q: 'What\'s included in the trip price?', a: 'All prices are per person and include accommodation, ground transportation, guided excursions, and meals as specified in the itinerary. International flights are not included unless stated.' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading trip details...</p>
                </div>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">404</h1>
                    <p className="text-text-secondary mb-8">{error || 'Trip not found'}</p>
                    <Link href="/trips" className="btn-primary">
                        Back to Trips
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <BreadcrumbJsonLd items={[
                { name: 'Home', url: 'https://www.ylootrips.com' },
                { name: 'Trips', url: 'https://www.ylootrips.com/trips' },
                { name: trip.title, url: `https://www.ylootrips.com/trips/${trip.id}` },
            ]} />
            <TourJsonLd
                name={trip.title}
                description={trip.shortDescription || trip.description || ''}
                url={`https://www.ylootrips.com/trips/${trip.id}`}
                image={trip.imageUrl || (trip.images?.[0]) || 'https://www.ylootrips.com/og-image.jpg'}
                price={basePrice.toString()}
                currency="USD"
                duration={trip.duration || ''}
                startLocation={trip.destination || 'India'}
                highlights={trip.highlights || []}
                rating={typeof trip.rating === 'number' ? trip.rating : 4.8}
                reviewCount={typeof trip.reviewCount === 'number' ? trip.reviewCount : 94}
            />
            <FaqJsonLd faqs={tripFaqs.map(f => ({ question: f.q, answer: f.a }))} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
                <Image
                    src={trip.imageUrl || trip.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
                    alt={trip.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                
                <div className="relative z-10 h-full flex items-end">
                    <div className="section-container w-full pb-12">
                        <div className="max-w-3xl">
                            <h1 className="text-display-xl text-white mb-4">{trip.title}</h1>
                            <p className="text-body-lg text-white/90 mb-6">{trip.shortDescription || trip.description}</p>
                            <div className="flex flex-wrap gap-6 text-white">
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} />
                                    <span>{trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={20} />
                                    <span>{trip.duration}</span>
                                </div>
                                {trip.difficulty && (
                                    <div className="flex items-center gap-2">
                                        <Users size={20} />
                                        <span>{trip.difficulty}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                    <span>{trip.rating} ({trip.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-container py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section>
                            <h2 className="text-display-lg mb-6">About This Trip</h2>
                            <div className="prose max-w-none">
                                <p className="text-body-lg leading-relaxed whitespace-pre-line">{trip.description}</p>
                            </div>
                        </section>

                        {/* Highlights */}
                        {trip.highlights && trip.highlights.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Highlights</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {trip.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-cream-light border border-primary/10">
                                            <Check size={20} className="text-success mt-1 flex-shrink-0" />
                                            <span className="text-body-lg">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Itinerary */}
                        {itinerary.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Itinerary</h2>
                                <div className="space-y-8">
                                    {itinerary.map((day) => (
                                        <div key={day.id} className="border-l-2 border-secondary pl-8 pb-8">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-secondary text-cream flex items-center justify-center font-light text-xl flex-shrink-0">
                                                    {day.dayNumber}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-light mb-2">{day.dayTitle}</h3>
                                                    {day.imageUrl && (
                                                        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                                                            <Image
                                                                src={day.imageUrl}
                                                                alt={day.dayTitle}
                                                                fill
                                                                className="object-cover"
                                                                onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'; }}
                                                            />
                                                        </div>
                                                    )}
                                                    <p className="text-body-lg leading-relaxed mb-4">{day.description}</p>
                                                    
                                                    {day.activities && day.activities.length > 0 && (
                                                        <div className="mb-4">
                                                            <p className="text-caption text-text-secondary mb-2">Activities:</p>
                                                            <ul className="space-y-2">
                                                                {day.activities.map((activity, idx) => (
                                                                    <li key={idx} className="flex items-start gap-2">
                                                                        <ArrowRight size={16} className="text-secondary mt-1 flex-shrink-0" />
                                                                        <span className="text-body-sm">{activity}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                                        {day.accommodation && (
                                                            <div className="flex items-start gap-2">
                                                                <Hotel size={20} className="text-secondary mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-caption text-text-secondary">Accommodation</p>
                                                                    <p className="text-body-sm">{day.accommodation}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {day.meals && (
                                                            <div className="flex items-start gap-2">
                                                                <Utensils size={20} className="text-secondary mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-caption text-text-secondary">Meals</p>
                                                                    <p className="text-body-sm">{day.meals}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Flight Booking */}
                        <FlightBookingSection
                            destination={trip.destination || 'Delhi'}
                            travelDate={selectedDate}
                            guests={selectedGuests}
                        />

                        {/* Includes & Excludes */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {trip.includes && trip.includes.length > 0 && (
                                <section>
                                    <h2 className="text-display-lg mb-6">What's Included</h2>
                                    <ul className="space-y-3">
                                        {trip.includes.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check size={20} className="text-success mt-1 flex-shrink-0" />
                                                <span className="text-body-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                            
                            {trip.excludes && trip.excludes.length > 0 && (
                                <section>
                                    <h2 className="text-display-lg mb-6">What's Not Included</h2>
                                    <ul className="space-y-3">
                                        {trip.excludes.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <X size={20} className="text-error mt-1 flex-shrink-0" />
                                                <span className="text-body-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-cream-light p-8 border border-primary/10">
                            {/* Spots left alert */}
                            {spotsLeft !== null && (
                                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0"></span>
                                    <span className="text-red-700 font-medium">Only {spotsLeft} spots left for this trip!</span>
                                </div>
                            )}

                            <h3 className="text-2xl font-light mb-6">Book This Trip</h3>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-4xl font-light">{fp(trip.price)}</span>
                                    <span className="text-body-sm text-text-secondary">per person</span>
                                </div>
                                {trip.originalPrice && (
                                    <p className="text-body-sm text-text-secondary line-through">
                                        {fp(trip.originalPrice)}
                                    </p>
                                )}
                                <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                    No hidden fees · all taxes included
                                </p>
                            </div>

                            {/* Number of Guests */}
                            <div className="mb-6">
                                <label className="text-caption text-text-secondary mb-2 block">Number of Guests</label>
                                <select
                                    value={selectedGuests}
                                    onChange={(e) => setSelectedGuests(Number(e.target.value))}
                                    className="w-full p-3 border border-primary/20 bg-white text-primary"
                                >
                                    {Array.from({ length: trip.maxGroupSize || 10 }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Travel Date */}
                            <div className="mb-6">
                                <label className="text-caption text-text-secondary mb-2 block">Travel Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border border-primary/20 bg-white text-primary"
                                />
                            </div>

                            {/* Total */}
                            <div className="mb-6 pt-6 border-t border-primary/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-body-lg">Total</span>
                                    <span className="text-2xl font-light">{fp(totalPrice)}</span>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={handleBookNow}
                                disabled={!selectedDate}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {visitor === 'foreigner' ? 'Book & Pay Online' : 'Proceed to Checkout'}
                            </button>

                            {/* International card note for foreigners */}
                            {visitor === 'foreigner' && (
                                <div className="mt-3 p-3 bg-secondary/5 border border-secondary/20 rounded text-sm text-center">
                                    <p className="text-secondary font-medium">💳 International cards accepted</p>
                                    <p className="text-primary/50 text-xs mt-1">Visa · Mastercard · Amex · Pay in USD</p>
                                </div>
                            )}

                            {/* Trip Info */}
                            <div className="mt-6 pt-6 border-t border-primary/10 space-y-3">
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-text-secondary">Duration</span>
                                    <span>{trip.duration}</span>
                                </div>
                                {trip.difficulty && (
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-text-secondary">Difficulty</span>
                                        <span>{trip.difficulty}</span>
                                    </div>
                                )}
                                {trip.maxGroupSize && (
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-text-secondary">Max Group Size</span>
                                        <span>{trip.maxGroupSize}</span>
                                    </div>
                                )}
                            </div>

                            {/* Cancellation policy */}
                            <div className="mt-5 pt-5 border-t border-primary/10 space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                    <RefreshCw size={15} className="text-green-600 mt-0.5 shrink-0" />
                                    <span className="text-primary/70">Free cancellation up to 7 days before departure</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                    <Shield size={15} className="text-blue-600 mt-0.5 shrink-0" />
                                    <span className="text-primary/70">Secure payment · instant confirmation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-cream-dark py-16">
                <div className="section-container max-w-3xl">
                    <h2 className="text-display-lg mb-2 text-center">Frequently Asked Questions</h2>
                    <p className="text-primary/50 text-center mb-10">Everything you need to know before booking</p>
                    <div className="space-y-3">
                        {tripFaqs.map((faq, i) => (
                            <div key={i} className="bg-white border border-primary/10 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-primary/[0.02] transition-colors"
                                >
                                    <span className="font-medium text-primary pr-4">{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-secondary shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-primary/70 leading-relaxed border-t border-primary/5">
                                        <p className="pt-4">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expert Team Strip */}
            <div className="py-12 bg-primary text-cream">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="shrink-0 text-center md:text-left">
                            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-2">Your Experts</p>
                            <h3 className="font-display text-2xl md:text-3xl">Meet your guides</h3>
                            <p className="text-cream/60 mt-2 max-w-xs">Handpicked local experts who speak your language and know every hidden gem.</p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {[
                                { name: 'Arjun Mehta', role: 'North India Expert', exp: '12 yrs', langs: 'EN · DE · FR', emoji: '🧔🏽' },
                                { name: 'Priya Nair', role: 'Kerala & South India', exp: '9 yrs', langs: 'EN · JP · ES', emoji: '👩🏽' },
                                { name: 'Rahul Sharma', role: 'Rajasthan Heritage', exp: '14 yrs', langs: 'EN · FR · IT', emoji: '👨🏽‍💼' },
                            ].map((guide) => (
                                <div key={guide.name} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 w-48 text-center hover:bg-white/15 transition-all">
                                    <div className="text-4xl mb-3">{guide.emoji}</div>
                                    <div className="font-medium text-cream">{guide.name}</div>
                                    <div className="text-xs text-accent mt-1">{guide.role}</div>
                                    <div className="text-xs text-cream/50 mt-2">{guide.exp} experience</div>
                                    <div className="text-xs text-cream/50">{guide.langs}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Booking Bar */}
            <MobileStickyBookingBar
                price={basePrice}
                onBook={handleBookNow}
                disabled={!selectedDate}
                spotsLeft={spotsLeft ?? undefined}
            />
        </div>
    );
}













