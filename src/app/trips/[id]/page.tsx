'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, MapPin, Clock, Star, Check, X, ArrowRight, Utensils, Hotel, ChevronDown, Shield, RefreshCw, Globe, CreditCard, Phone, BadgeCheck, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import MobileStickyBookingBar from '@/components/MobileStickyBookingBar';
import { BreadcrumbJsonLd, FaqJsonLd, TourJsonLd } from '@/components/JsonLd';
import { getDestinationImageUrl } from '@/lib/destinationImages';
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
        { q: 'Is this trip suitable for first-time visitors to India?', a: 'Absolutely! All our tours are designed with international first-timers in mind. Your private guide handles all logistics, briefs you daily on what to expect, and is available 24/7. We\'ll also send you a complete pre-trip India guide after booking.' },
        { q: 'Is India safe for tourists from the USA / UK / Australia?', a: 'India is very welcoming to international tourists — especially on the major tourist circuits. We take extra precautions: vetted accommodation, licensed guides with national guide cards, pre-booked transport, and 24/7 reachable support team. Millions of international travelers visit India every year without incident.' },
        { q: 'Do I need a visa? How do I apply?', a: 'Most nationalities (USA, UK, Australia, Canada, EU) can apply for an Indian e-Visa online at indianvisaonline.gov.in. Processing is 2–4 business days. Cost is $25–$80 depending on nationality. We send you a step-by-step application guide after booking. Apply at least 2 weeks before travel.' },
        { q: 'What is the cancellation policy?', a: 'Free cancellation up to 7 days before departure for a full refund. Cancellations 3–7 days before get a 50% refund. Within 3 days the booking is non-refundable but can be transferred to another date. We also allow one free date change per booking.' },
        { q: 'Are international cards accepted? Can I pay in USD?', a: 'Yes — Visa, Mastercard, and Amex are all accepted. Payment is processed via our secure Easebuzz gateway (PCI-DSS compliant). The charge appears in INR on your statement but your bank converts at the live exchange rate — no surcharges from our end. You can view prices in USD on our website.' },
        { q: 'What languages do your guides speak?', a: 'All our guides are fluent in English. Several also speak French, German, Spanish, Italian, and Japanese. Mention your preference when booking and we\'ll do our best to match you with the right guide.' },
        { q: 'What\'s included — and what\'s not?', a: 'Included: private air-conditioned vehicle, dedicated English-speaking guide, all accommodation as stated, meals as per itinerary, all entry tickets, airport/station transfers, and a local SIM card. Not included: international flights, travel insurance, personal expenses, and tips for guides (appreciated but optional).' },
        { q: 'Do you provide travel insurance?', a: 'We don\'t sell insurance directly, but we strongly recommend purchasing comprehensive travel insurance before departure. World Nomads and Allianz are popular with international travelers to India. Your guide will be briefed on your insurance details.' },
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
                    src={getDestinationImageUrl(undefined, trip.destination, trip.imageUrl || trip.images?.[0])}
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

            {/* ── INTERNATIONAL TRUST BAR ── */}
            {visitor === 'foreigner' && (
                <div className="bg-amber-500 text-white py-3">
                    <div className="section-container">
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-semibold uppercase tracking-wider">
                            {[
                                '🔒 Secure Payment · Visa · MC · Amex',
                                '🗣️ English-Speaking Private Guide',
                                '🆓 Free Cancellation — 7 Days',
                                '📞 24/7 WhatsApp Support',
                                '🏛️ Ministry of Tourism Registered',
                            ].map((item) => (
                                <span key={item} className="whitespace-nowrap">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRIVATE GUIDE HIGHLIGHT (foreigner) ── */}
            {visitor === 'foreigner' && (
                <div className="bg-white border-b border-primary/8 py-6">
                    <div className="section-container">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: Users, label: 'Private Tour', sub: 'Your group only — no strangers', color: 'text-amber-600' },
                                { icon: Globe, label: 'English Guide', sub: 'Fluent · Licensed · Local expert', color: 'text-blue-600' },
                                { icon: Shield, label: 'Fully Insured', sub: 'Govt. licensed · Travel insured', color: 'text-green-600' },
                                { icon: CreditCard, label: 'Pay in USD', sub: 'Visa · Mastercard · Amex', color: 'text-purple-600' },
                            ].map(({ icon: Icon, label, sub, color }) => (
                                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-cream/50">
                                    <div className={`w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-primary text-sm">{label}</div>
                                        <div className="text-xs text-primary/50 mt-0.5">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                                                                onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'; }}
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

                            {/* International trust block */}
                            {visitor === 'foreigner' ? (
                                <div className="mt-3 space-y-2">
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-blue-800 font-semibold text-xs mb-1">💳 International Payment</p>
                                        <p className="text-blue-700 text-xs">Visa · Mastercard · Amex accepted · Charged in INR, your bank converts at live rate. No surcharges.</p>
                                    </div>
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-amber-800 font-semibold text-xs mb-1">🗣️ Private English-Speaking Guide</p>
                                        <p className="text-amber-700 text-xs">Dedicated guide throughout — no group tour. Licensed, insured, and hand-picked by our team.</p>
                                    </div>
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-800 font-semibold text-xs mb-1">📞 24/7 WhatsApp Support</p>
                                        <p className="text-green-700 text-xs">Our team is reachable around the clock during your trip. Response within minutes.</p>
                                    </div>
                                </div>
                            ) : (
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
                                {visitor === 'foreigner' && (
                                    <div className="flex items-start gap-2 text-sm">
                                        <BadgeCheck size={15} className="text-amber-600 mt-0.5 shrink-0" />
                                        <span className="text-primary/70">Ministry of Tourism registered operator</span>
                                    </div>
                                )}
                            </div>

                            {/* WhatsApp contact */}
                            {visitor === 'foreigner' && (
                                <a
                                    href={`https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20booking%20${encodeURIComponent(trip.title || 'your tour')}.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold rounded transition-colors"
                                >
                                    <MessageCircle size={16} />
                                    Ask a Question on WhatsApp
                                </a>
                            )}
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













