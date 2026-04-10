'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search, MapPin, Calendar, Users, Star, Shield, Clock,
    ChevronDown, Plane, Hotel, Compass, ArrowLeftRight,
    ArrowUpDown, Zap, MessageCircle, X, AlertCircle
} from 'lucide-react';
import { useVisitor } from '@/context/VisitorContext';
import { useCurrency } from '@/context/CurrencyContext';
import { api } from '@/lib/api';

interface HeroProps {
    content?: { eyebrow?: string; title?: string; subtitle?: string; imageUrl?: string; };
    stats?: Array<{ value: string; label: string }>;
}

interface Ad {
    id: number; title: string; description: string;
    imageUrl: string; redirectUrl: string; discountText?: string;
}

interface FlightResult {
    id: string; airline: string; airlineCode: string; airlineColor: string;
    flightNumber: string;
    departure: { airport: string; terminal: string; time: string };
    arrival: { airport: string; terminal: string; time: string };
    durationFormatted: string; durationMinutes: number;
    stops: number; stopInfo: string;
    pricePerPerson: number; totalPrice: number; currency: string;
    seatsLeft: number | null; isDemo: boolean;
}

const CITIES = [
    { name: 'New Delhi', code: 'DEL' }, { name: 'Mumbai', code: 'BOM' },
    { name: 'Bangalore', code: 'BLR' }, { name: 'Chennai', code: 'MAA' },
    { name: 'Hyderabad', code: 'HYD' }, { name: 'Kolkata', code: 'CCU' },
    { name: 'Jaipur', code: 'JAI' }, { name: 'Goa (Dabolim)', code: 'GOI' },
    { name: 'Kochi', code: 'COK' }, { name: 'Pune', code: 'PNQ' },
    { name: 'Ahmedabad', code: 'AMD' }, { name: 'Varanasi', code: 'VNS' },
    { name: 'Amritsar', code: 'ATQ' }, { name: 'Leh', code: 'IXL' },
    { name: 'Srinagar', code: 'SXR' }, { name: 'Udaipur', code: 'UDR' },
    { name: 'Jodhpur', code: 'JDH' }, { name: 'Chandigarh', code: 'IXC' },
    { name: 'Dehradun', code: 'DED' }, { name: 'Port Blair', code: 'IXZ' },
];

const CITY_SUGGESTIONS = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Jaipur', 'Goa', 'Kochi', 'Ahmedabad', 'Pune', 'Agra',
    'New York', 'London', 'Dubai', 'Singapore', 'Sydney', 'Toronto',
];

// Only locations actually listed on ylootrips.com
const POPULAR_DESTINATIONS = [
    { label: 'Manali',       icon: '🏔️', href: '/destinations/domestic?q=manali'       },
    { label: 'Kedarnath',    icon: '⛪', href: '/destinations/domestic?q=kedarnath'    },
    { label: 'Spiti',        icon: '🗻', href: '/destinations/domestic?q=spiti'        },
    { label: 'Kasol',        icon: '🌿', href: '/destinations/domestic?q=kasol'        },
    { label: 'Lakshadweep',  icon: '🏝️', href: '/destinations/domestic?q=lakshadweep' },
    { label: 'Coorg',        icon: '☕', href: '/destinations/domestic?q=coorg'        },
    { label: 'Bali',         icon: '🌴', href: '/destinations/international?q=bali'   },
    { label: 'Dubai',        icon: '✈️', href: '/destinations/international?q=dubai'  },
];

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }
function airlineInitials(name: string) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

export default function Hero({ content, stats }: HeroProps) {
    const router = useRouter();
    const { visitor, setVisitor } = useVisitor();
    const { setCurrency } = useCurrency();

    // Tab
    const [activeTab, setActiveTab] = useState('trips');

    // Tours / Hotels fields
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = useState<string[]>([]);
    const [showFromSug, setShowFromSug] = useState(false);
    const [showToSug, setShowToSug] = useState(false);

    // Flight fields
    const [flightFrom, setFlightFrom] = useState('DEL');
    const [flightTo, setFlightTo] = useState('GOI');
    const [flightDate, setFlightDate] = useState('');
    const [flightReturn, setFlightReturn] = useState('');
    const [tripType, setTripType] = useState<'oneway' | 'return'>('oneway');
    const [flightPax, setFlightPax] = useState(2);

    // Flight results
    const [flightResults, setFlightResults] = useState<FlightResult[] | null>(null);
    const [flightLoading, setFlightLoading] = useState(false);
    const [flightError, setFlightError] = useState<string | null>(null);
    const [isDemo, setIsDemo] = useState(false);
    const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

    // Ads
    const [ads, setAds] = useState<Ad[]>([]);
    const [adIndex, setAdIndex] = useState(0);

    const guestRef = useRef<HTMLDivElement>(null);
    const todayStr = new Date().toISOString().split('T')[0];
    const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80';

    const displayStats = stats && stats.length > 0 ? stats : [
        { value: '25K+', label: 'Happy Travelers' },
        { value: '4.9★', label: 'Avg Rating' },
        { value: '150+', label: 'Destinations' },
        { value: '12+', label: 'Years' },
    ];

    useEffect(() => {
        api.getActiveAds().then(r => setAds(r.data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        if (ads.length < 2) return;
        const t = setInterval(() => setAdIndex(i => (i + 1) % ads.length), 4000);
        return () => clearInterval(t);
    }, [ads.length]);

    const swapFlightCities = useCallback(() => {
        setFlightFrom(flightTo);
        setFlightTo(flightFrom);
        setFlightResults(null);
    }, [flightFrom, flightTo]);
    const swapTourCities = useCallback(() => { setFromCity(toCity); setToCity(fromCity); }, [fromCity, toCity]);
    const filterSuggestions = useCallback((val: string) =>
        val.length > 0 ? CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 5) : []
    , []);

    const cityName = useCallback((code: string) => CITIES.find(c => c.code === code)?.name ?? code, []);

    const handleFlightSearch = useCallback(async () => {
        if (!flightDate) return;
        setFlightLoading(true);
        setFlightError(null);
        setFlightResults(null);
        try {
            const params = new URLSearchParams({
                origin: flightFrom, destination: flightTo,
                date: flightDate, adults: String(flightPax),
            });
            const res = await fetch(`/api/flights/search?${params}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setFlightResults(json.data ?? []);
            setIsDemo(json.isDemo ?? false);
        } catch {
            setFlightError('Could not load flights. Please try again.');
        } finally {
            setFlightLoading(false);
        }
    }, [flightDate, flightFrom, flightTo, flightPax]);

    const handleTourSearch = useCallback(() => {
        const to = toCity.trim();
        const from = fromCity.trim();
        if (!to && !from) return;

        const OUR_KEYWORDS = [
            'manali','goa','kashmir','kerala','bali','dubai','thailand','singapore','maldives',
            'auli','jibhi','tirthan','kedarnath','lakshadweep','coorg','spiti','chopta',
            'kedarkantha','kheerganga','hampta','sar pass','prashar','har ki dun','roopkund',
            'chadar','ladakh','leh','kasol','solang','munnar','alleppey','kochi','srinagar',
            'gulmarg','pahalgam','ubud','seminyak','bangkok','phuket','marina bay','sentosa',
        ];

        const query = (to || from).toLowerCase();
        const isListed = OUR_KEYWORDS.some((k) => query.includes(k));

        if (isListed) {
            const params = new URLSearchParams();
            if (to) params.set('to', to);
            if (from) params.set('from', from);
            if (guests) params.set('guests', String(guests));
            if (checkIn) params.set('date', checkIn);
            router.push(`/search?${params.toString()}`);
        } else {
            router.push(`/trip-planner?q=${encodeURIComponent(to || from)}`);
        }
    }, [toCity, fromCity, guests, checkIn, router]);

    const handleHotelSearch = useCallback(() => {
        router.push(`/hotels${toCity ? `?q=${encodeURIComponent(toCity)}` : ''}`);
    }, [toCity, router]);

    const handleSearch = useCallback(() => {
        if (activeTab === 'flights') handleFlightSearch();
        else if (activeTab === 'trips') handleTourSearch();
        else handleHotelSearch();
    }, [activeTab, handleFlightSearch, handleTourSearch, handleHotelSearch]);

    const chooseVisitor = useCallback((type: 'indian' | 'foreigner') => {
        setVisitor(type);
        setCurrency(type === 'indian' ? 'INR' : 'USD');
    }, [setVisitor, setCurrency]);

    const sorted = useMemo(() =>
        flightResults
            ? [...flightResults].sort((a, b) => sortBy === 'price' ? a.totalPrice - b.totalPrice : a.durationMinutes - b.durationMinutes)
            : null
    , [flightResults, sortBy]);

    const buildBookingUrl = useCallback((f: FlightResult) => {
        const p = new URLSearchParams({
            airline: f.airline, code: f.airlineCode, flightNum: f.flightNumber,
            from: f.departure.airport, to: f.arrival.airport,
            dep: f.departure.time, arr: f.arrival.time,
            date: flightDate, dur: f.durationFormatted,
            stops: String(f.stops), pax: String(flightPax), price: String(f.totalPrice),
        });
        return `/flights/book?${p}`;
    }, [flightDate, flightPax]);

    const currentAd = ads[adIndex];

    return (
        <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <video autoPlay muted loop playsInline poster={imageUrl} className="absolute inset-0 w-full h-full object-cover">
                    <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                </video>
                <Image src={imageUrl} alt="India travel" fill priority className="object-cover -z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85" />
            </div>

            {/* Mobile ad strip */}
            {ads.length > 0 && (
                <div className="lg:hidden absolute top-16 left-0 right-0 z-30 bg-gradient-to-r from-primary via-secondary to-primary overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap py-1.5">
                        {[...ads, ...ads].map((ad, idx) => (
                            <span key={idx} className="inline-block text-white text-xs font-bold mx-6">
                                🔥 {ad.discountText ? `${ad.discountText} · ` : ''}{ad.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col justify-center flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-10">
                <div className="max-w-7xl mx-auto w-full">

                    {/* Visitor / Currency toggle */}
                    <div className="flex justify-end mb-5">
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1">
                            <button onClick={() => chooseVisitor('indian')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${visitor === 'indian' ? 'bg-amber-400 text-gray-900' : 'text-white/70 hover:text-white'}`}>
                                🇮🇳
                                <span className="sm:hidden font-bold">INR</span>
                                <span className="hidden sm:inline">Indian</span>
                            </button>
                            <button onClick={() => chooseVisitor('foreigner')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${visitor === 'foreigner' ? 'bg-amber-400 text-gray-900' : 'text-white/70 hover:text-white'}`}>
                                <span className="sm:hidden font-bold">$ USD</span>
                                <span className="hidden sm:inline">🌍 International</span>
                            </button>
                        </div>
                    </div>

                    {/* 2-column: left=content+search, right=ad */}
                    <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

                        {/* LEFT */}
                        <div>
                            {/* Headline */}
                            <div className="mb-6">
                                <p className="text-amber-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                                    {content?.eyebrow || '⭐ Rated 4.9 on Google · 25,000+ Trips Booked'}
                                </p>
                                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                                    {content?.title ? content.title : <>International Trips<br /><span className="italic text-amber-300">Starting ₹9,999</span></>}
                                </h1>
                                <p className="text-white/70 text-base sm:text-lg max-w-xl">
                                    {content?.subtitle || 'Goa · Kashmir · Dubai · Bali · Singapore · Thailand — Book in 2 minutes, pay ₹5,000 to confirm.'}
                                </p>
                            </div>

                            {/* Search Widget */}
                            <div className="bg-white rounded-2xl shadow-2xl overflow-visible">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-100 rounded-t-2xl overflow-hidden">
                                    {[
                                        { id: 'trips', label: 'Tour Packages', short: 'Tours', icon: Compass },
                                        { id: 'flights', label: 'Flights', short: 'Flights', icon: Plane },
                                        { id: 'hotels', label: 'Hotels', short: 'Hotels', icon: Hotel },
                                    ].map(tab => {
                                        const Icon = tab.icon;
                                        return (
                                            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setFlightResults(null); }}
                                                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-all flex-1 justify-center ${activeTab === tab.id ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                                                <Icon size={15} />
                                                <span className="hidden sm:inline">{tab.label}</span>
                                                <span className="sm:hidden">{tab.short}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="p-4">
                                    {/* ── FLIGHTS TAB ── */}
                                    {activeTab === 'flights' && (
                                        <>
                                            {/* Trip type */}
                                            <div className="flex gap-1 mb-3">
                                                {(['oneway', 'return'] as const).map(t => (
                                                    <button key={t} onClick={() => { setTripType(t); setFlightResults(null); }}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${tripType === t ? 'bg-amber-500 text-white border-amber-500' : 'border-gray-300 text-gray-500 hover:border-amber-400'}`}>
                                                        {t === 'oneway' ? 'One Way' : 'Round Trip'}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                                                {/* From city dropdown */}
                                                <div className="relative flex-1 min-w-[140px]">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">From</label>
                                                    <div className="relative">
                                                        <Plane size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-45" />
                                                        <select value={flightFrom} onChange={e => { setFlightFrom(e.target.value); setFlightResults(null); }}
                                                            className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white appearance-none">
                                                            {CITIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Swap */}
                                                <button onClick={swapFlightCities}
                                                    className="self-center sm:mt-1 w-8 h-8 shrink-0 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center transition-all hover:rotate-180 duration-300">
                                                    <ArrowUpDown size={13} className="text-amber-600" />
                                                </button>

                                                {/* To city dropdown */}
                                                <div className="relative flex-1 min-w-[140px]">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">To</label>
                                                    <div className="relative">
                                                        <Plane size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                                        <select value={flightTo} onChange={e => { setFlightTo(e.target.value); setFlightResults(null); }}
                                                            className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white appearance-none">
                                                            {CITIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Depart date */}
                                                <div className="relative sm:w-36">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Depart</label>
                                                    <div className="relative">
                                                        <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input type="date" value={flightDate} min={todayStr}
                                                            onChange={e => { setFlightDate(e.target.value); setFlightResults(null); }}
                                                            className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                                                    </div>
                                                </div>

                                                {/* Return date */}
                                                {tripType === 'return' && (
                                                    <div className="relative sm:w-36">
                                                        <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Return</label>
                                                        <div className="relative">
                                                            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input type="date" value={flightReturn} min={flightDate || todayStr}
                                                                onChange={e => setFlightReturn(e.target.value)}
                                                                className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Passengers */}
                                                <div className="relative sm:w-32 shrink-0" ref={guestRef}>
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Passengers</label>
                                                    <button onClick={() => setShowGuestPicker(!showGuestPicker)}
                                                        className="w-full flex items-center pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-left hover:border-amber-400 transition-colors">
                                                        <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <span className="text-gray-700">{flightPax} Pax</span>
                                                        <ChevronDown size={12} className="ml-auto text-gray-400" />
                                                    </button>
                                                    {showGuestPicker && (
                                                        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-40">
                                                            <p className="text-xs text-gray-500 mb-2 font-semibold">Passengers</p>
                                                            <div className="flex items-center justify-between">
                                                                <button onClick={() => setFlightPax(Math.max(1, flightPax - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">−</button>
                                                                <span className="text-lg font-semibold w-8 text-center">{flightPax}</span>
                                                                <button onClick={() => setFlightPax(Math.min(9, flightPax + 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">+</button>
                                                            </div>
                                                            <button onClick={() => setShowGuestPicker(false)} className="mt-3 w-full py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600">Done</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Search */}
                                                <button onClick={handleFlightSearch} disabled={!flightDate || flightLoading}
                                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 active:scale-95 shrink-0 whitespace-nowrap">
                                                    {flightLoading
                                                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
                                                        : <><Search size={16} /> Search</>
                                                    }
                                                </button>
                                            </div>

                                            {/* Flight Results inline */}
                                            {flightError && (
                                                <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                                    <AlertCircle size={15} className="shrink-0" /> {flightError}
                                                </div>
                                            )}


                                            {sorted && sorted.length > 0 && (
                                                <div className="mt-4 space-y-2">
                                                    {/* Results header */}
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-semibold text-gray-900">{sorted.length} flights</span> · {cityName(flightFrom)} → {cityName(flightTo)} · {flightDate}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs text-gray-400">Sort:</span>
                                                            {(['price', 'duration'] as const).map(s => (
                                                                <button key={s} onClick={() => setSortBy(s)}
                                                                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${sortBy === s ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                                                                    {s === 'price' ? 'Cheapest' : 'Fastest'}
                                                                </button>
                                                            ))}
                                                            <button onClick={() => setFlightResults(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {sorted.map((f, i) => (
                                                        <div key={f.id}
                                                            className={`border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 relative bg-white ${i === 0 && sortBy === 'price' ? 'border-green-400 ring-1 ring-green-400' : 'border-gray-200'}`}>
                                                            {i === 0 && sortBy === 'price' && (
                                                                <span className="absolute -top-2.5 left-3 bg-green-500 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold rounded-full flex items-center gap-1">
                                                                    <Zap size={9} /> Best Price
                                                                </span>
                                                            )}

                                                            {/* Airline */}
                                                            <div className="flex items-center gap-2 min-w-[110px]">
                                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                                    style={{ backgroundColor: f.airlineColor || '#6B7355' }}>
                                                                    {airlineInitials(f.airline)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-800">{f.airline}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase">{f.flightNumber}</p>
                                                                </div>
                                                            </div>

                                                            {/* Route */}
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <div className="text-center">
                                                                    <p className="text-lg font-bold text-gray-900">{f.departure.time}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase">{f.departure.airport}</p>
                                                                </div>
                                                                <div className="flex-1 flex flex-col items-center gap-0.5">
                                                                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                        <Clock size={9} />{f.durationFormatted}
                                                                    </p>
                                                                    <div className="w-full flex items-center gap-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full border border-gray-300" />
                                                                        <div className="flex-1 h-px bg-gray-300" />
                                                                        <Plane size={11} className="text-amber-500" />
                                                                        <div className="flex-1 h-px bg-gray-300" />
                                                                        <div className="w-1.5 h-1.5 rounded-full border border-gray-300" />
                                                                    </div>
                                                                    <p className={`text-[10px] font-semibold ${f.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                                                        {f.stopInfo}
                                                                    </p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-lg font-bold text-gray-900">{f.arrival.time}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase">{f.arrival.airport}</p>
                                                                </div>
                                                            </div>

                                                            {/* Price + Book */}
                                                            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                                                                <div className="text-right">
                                                                    <p className="text-xl font-bold text-gray-900">₹{fmt(f.totalPrice)}</p>
                                                                    <p className="text-[10px] text-gray-400">₹{fmt(f.pricePerPerson)}/person</p>
                                                                    {f.seatsLeft && f.seatsLeft <= 5 && (
                                                                        <p className="text-[10px] text-red-500 font-semibold animate-pulse">{f.seatsLeft} seats left!</p>
                                                                    )}
                                                                </div>
                                                                <Link href={buildBookingUrl(f)}
                                                                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                                                                    <Plane size={12} /> Book Now
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <p className="text-center text-gray-400 text-[10px] uppercase tracking-wider pt-1">
                                                        Prices indicative · Final fare confirmed on booking
                                                    </p>
                                                </div>
                                            )}

                                            {sorted && sorted.length === 0 && (
                                                <div className="mt-4 text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-xl">
                                                    No flights found for this route on {flightDate}. Try a different date.
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* ── TOURS TAB ── */}
                                    {activeTab === 'trips' && (
                                        <>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                {/* From */}
                                                <div className="relative flex-1">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">From</label>
                                                    <div className="relative">
                                                        <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input type="text" placeholder="Your city / origin" value={fromCity}
                                                            onChange={e => { const v = e.target.value; setFromCity(v); setFromSuggestions(filterSuggestions(v)); setShowFromSug(v.length > 0); }}
                                                            onFocus={() => setShowFromSug(fromCity.length > 0)}
                                                            onBlur={() => setTimeout(() => setShowFromSug(false), 150)}
                                                            className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                                                        {showFromSug && fromSuggestions.length > 0 && (
                                                            <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                                                                {fromSuggestions.map(s => (
                                                                    <li key={s} onMouseDown={() => { setFromCity(s); setShowFromSug(false); }}
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-amber-50 cursor-pointer">
                                                                        <MapPin size={11} className="text-gray-400" />{s}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>

                                                <button onClick={swapTourCities}
                                                    className="self-center w-8 h-8 shrink-0 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 flex items-center justify-center transition-all hover:rotate-180 duration-300">
                                                    <ArrowLeftRight size={13} className="text-amber-600" />
                                                </button>

                                                {/* To */}
                                                <div className="relative flex-1">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">To</label>
                                                    <div className="relative">
                                                        <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                                                        <input type="text" placeholder="Where do you want to go?" value={toCity}
                                                            onChange={e => { const v = e.target.value; setToCity(v); setToSuggestions(filterSuggestions(v)); setShowToSug(v.length > 0); }}
                                                            onFocus={() => setShowToSug(toCity.length > 0)}
                                                            onBlur={() => setTimeout(() => setShowToSug(false), 150)}
                                                            className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                                                        {showToSug && toSuggestions.length > 0 && (
                                                            <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                                                                {toSuggestions.map(s => (
                                                                    <li key={s} onMouseDown={() => { setToCity(s); setShowToSug(false); }}
                                                                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-amber-50 cursor-pointer">
                                                                        <MapPin size={11} className="text-amber-400" />{s}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div className="relative sm:w-36">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Travel Date</label>
                                                    <div className="relative">
                                                        <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input type="date" value={checkIn} min={todayStr} onChange={e => setCheckIn(e.target.value)}
                                                            className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                                                    </div>
                                                </div>

                                                {/* Guests */}
                                                <div className="relative sm:w-28 shrink-0">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Guests</label>
                                                    <button onClick={() => setShowGuestPicker(!showGuestPicker)}
                                                        className="w-full flex items-center pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-left hover:border-amber-400 transition-colors">
                                                        <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <span className="text-gray-700">{guests} {guests > 1 ? 'Guests' : 'Guest'}</span>
                                                        <ChevronDown size={12} className="ml-auto text-gray-400" />
                                                    </button>
                                                    {showGuestPicker && (
                                                        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-40">
                                                            <div className="flex items-center justify-between">
                                                                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">−</button>
                                                                <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                                                                <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">+</button>
                                                            </div>
                                                            <button onClick={() => setShowGuestPicker(false)} className="mt-3 w-full py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600">Done</button>
                                                        </div>
                                                    )}
                                                </div>

                                                <button onClick={handleTourSearch}
                                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 active:scale-95 shrink-0">
                                                    <Search size={16} /><span>Search</span>
                                                </button>
                                            </div>

                                            {/* Trending */}
                                            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                                <span className="text-xs text-gray-400 font-medium shrink-0">Trending:</span>
                                                {POPULAR_DESTINATIONS.map(dest => (
                                                    <Link key={dest.label} href={dest.href}
                                                        className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 rounded-full text-xs text-gray-600 font-medium transition-colors">
                                                        <span>{dest.icon}</span><span>{dest.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* ── HOTELS TAB ── */}
                                    {activeTab === 'hotels' && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="relative flex-1">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Destination</label>
                                                <div className="relative">
                                                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="text" placeholder="City or hotel name" value={toCity}
                                                        onChange={e => setToCity(e.target.value)}
                                                        className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                                                </div>
                                            </div>
                                            <div className="relative sm:w-36">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Check-in</label>
                                                <div className="relative">
                                                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="date" value={checkIn} min={todayStr} onChange={e => setCheckIn(e.target.value)}
                                                        className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                                                </div>
                                            </div>
                                            <div className="relative sm:w-36">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Check-out</label>
                                                <div className="relative">
                                                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="date" value={checkOut} min={checkIn || todayStr} onChange={e => setCheckOut(e.target.value)}
                                                        className="w-full pl-8 pr-2 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                                                </div>
                                            </div>
                                            <div className="relative sm:w-28 shrink-0">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Guests</label>
                                                <button onClick={() => setShowGuestPicker(!showGuestPicker)}
                                                    className="w-full flex items-center pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-left hover:border-amber-400">
                                                    <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <span className="text-gray-700">{guests} {guests > 1 ? 'Guests' : 'Guest'}</span>
                                                    <ChevronDown size={12} className="ml-auto text-gray-400" />
                                                </button>
                                                {showGuestPicker && (
                                                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-40">
                                                        <div className="flex items-center justify-between">
                                                            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">−</button>
                                                            <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                                                            <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">+</button>
                                                        </div>
                                                        <button onClick={() => setShowGuestPicker(false)} className="mt-3 w-full py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600">Done</button>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={handleHotelSearch}
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 active:scale-95 shrink-0">
                                                <Search size={16} /><span>Search</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Trust bar */}
                            <div className="mt-6 flex flex-wrap gap-5 sm:gap-8">
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Star size={15} className="text-amber-400 fill-amber-400" />
                                    <span><strong className="text-white">4.9/5</strong> · 2,400+ reviews</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Shield size={15} className="text-green-400" />
                                    <span><strong className="text-white">Secure</strong> · Licensed & insured</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Clock size={15} className="text-blue-400" />
                                    <span><strong className="text-white">1-hour</strong> response guarantee</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Ad card */}
                        {currentAd && !flightResults && (
                            <div className="hidden lg:block self-center">
                                <Link href={currentAd.redirectUrl}
                                    className="block relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                    {currentAd.discountText && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg -rotate-2">
                                                🔥 {currentAd.discountText}
                                            </div>
                                        </div>
                                    )}
                                    <div className="relative h-44 overflow-hidden">
                                        <Image src={currentAd.imageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80'}
                                            alt={currentAd.title} fill className="object-cover"
                                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80'; }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-white text-base mb-1">{currentAd.title}</h3>
                                        <p className="text-sm text-white/70 line-clamp-2">{currentAd.description}</p>
                                        <div className="mt-3 py-2 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest text-center rounded-lg hover:bg-amber-600 transition-colors">Book Now</div>
                                        {ads.length > 1 && (
                                            <div className="flex gap-1 justify-center mt-3">
                                                {ads.map((_, i) => (
                                                    <button key={i} onClick={e => { e.preventDefault(); setAdIndex(i); }}
                                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === adIndex ? 'bg-amber-400' : 'bg-white/30'}`} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl border border-amber-400/20 pointer-events-none" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {displayStats.slice(0, 4).map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
