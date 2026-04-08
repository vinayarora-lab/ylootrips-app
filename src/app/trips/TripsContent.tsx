'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, Filter, Search, Loader2, Sparkles, X, SlidersHorizontal, MessageCircle, Globe, Star, MapPin, Clock, Check, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TripCard from '@/components/TripCard';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { useVisitor } from '@/context/VisitorContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

// Static curated tours for international users — these are private guided packages
const CURATED_TOURS = [
  {
    slug: 'golden-triangle-10-day',
    title: '10-Day Golden Triangle',
    subtitle: 'Delhi · Agra · Jaipur',
    priceINR: 117600,
    duration: '10 Days / 9 Nights',
    rating: 4.9,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    href: '/tours/golden-triangle-10-day',
    highlights: ['Taj Mahal sunrise', 'Amber Fort', 'Old Delhi tour'],
    badge: 'Most Popular',
    badgeColor: 'bg-amber-500',
  },
  {
    slug: 'kerala-south-india-14-day',
    title: '14-Day Kerala & South India',
    subtitle: 'Kochi · Munnar · Alleppey · Pondicherry',
    priceINR: 159600,
    duration: '14 Days / 13 Nights',
    rating: 4.9,
    reviews: 287,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    href: '/tours/kerala-south-india-14-day',
    highlights: ['Houseboat stay', 'Tea estates', 'French Quarter'],
    badge: 'Best Value',
    badgeColor: 'bg-green-600',
  },
  {
    slug: 'rajasthan-heritage-7-day',
    title: '7-Day Rajasthan Heritage',
    subtitle: 'Jaipur · Jodhpur · Udaipur',
    priceINR: 79600,
    duration: '7 Days / 6 Nights',
    rating: 4.8,
    reviews: 194,
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    href: '/tours/rajasthan-heritage-7-day',
    highlights: ['Desert safari', 'Lake Palace', 'Blue City'],
    badge: 'Quick Escape',
    badgeColor: 'bg-blue-600',
  },
];

function CuratedTourCard({ tour }: { tour: typeof CURATED_TOURS[0] }) {
  const { currency } = useCurrency();
  const fp = (p: number) => formatPriceWithCurrency(p, currency);

  return (
    <div className="group bg-white rounded-none overflow-hidden border border-primary/10 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={tour.href} className="block relative aspect-[4/3] overflow-hidden shrink-0">
        <Image
          src={tour.image} alt={tour.title} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`${tour.badgeColor} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1`}>
            {tour.badge}
          </span>
          <span className="bg-primary text-cream text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1">
            🌍 Private Tour
          </span>
        </div>
        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold">{tour.rating}</span>
          <span className="text-[10px] text-gray-400">({tour.reviews})</span>
        </div>
        {/* Secure badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full">
          <Lock className="w-2.5 h-2.5" />
          Secure Booking
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-primary/50 mb-1.5">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-wider">{tour.subtitle}</span>
        </div>
        <Link href={tour.href}>
          <h3 className="font-display text-lg text-primary hover:text-secondary transition-colors leading-snug mb-2">{tour.title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-primary/50 mb-3">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-wider">{tour.duration}</span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tour.highlights.map((h) => (
            <span key={h} className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">{h}</span>
          ))}
        </div>

        {/* Included */}
        <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-medium mb-3">
          <Check className="w-3 h-3" />
          English guide · Private AC car · All tickets
        </div>

        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="pt-3 border-t border-primary/10">
          <div className="flex items-baseline gap-1 mb-0.5">
            <span className="font-display text-xl text-primary">{fp(tour.priceINR)}</span>
          </div>
          <span className="text-[10px] text-primary/40 uppercase tracking-widest">per person · no hidden fees</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3">
          <Link
            href={`/checkout/tour?tour=${tour.slug}`}
            className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors"
          >
            <Shield className="w-3 h-3" />
            Book Now
          </Link>
          <Link
            href={tour.href}
            className="flex items-center justify-center gap-1.5 border border-primary/20 text-primary px-3 py-2.5 text-xs uppercase tracking-widest hover:bg-primary hover:text-cream transition-all"
          >
            Details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

const defaultCategories = ['All', 'Trekking', 'Tour', 'Adventure', 'Camping', 'International', 'Beach', 'Honeymoon'];

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'duration-asc';

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'featured',    label: 'Featured'         },
    { value: 'price-asc',   label: 'Price: Low → High' },
    { value: 'price-desc',  label: 'Price: High → Low' },
    { value: 'rating',      label: 'Top Rated'         },
    { value: 'duration-asc',label: 'Shortest First'    },
];

function sortTrips(trips: Trip[], sort: SortOption): Trip[] {
    const arr = [...trips];
    switch (sort) {
        case 'price-asc':
            return arr.sort((a, b) => Number(a.price) - Number(b.price));
        case 'price-desc':
            return arr.sort((a, b) => Number(b.price) - Number(a.price));
        case 'rating':
            return arr.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        case 'duration-asc':
            return arr.sort((a, b) => {
                const daysA = parseInt(a.duration || '99');
                const daysB = parseInt(b.duration || '99');
                return daysA - daysB;
            });
        default:
            return arr.sort((a, b) => (b.featured || b.isFeatured ? 1 : 0) - (a.featured || a.isFeatured ? 1 : 0));
    }
}

export default function TripsContent() {
    const { visitor } = useVisitor();
    const searchParams = useSearchParams();

    // Read ?category= and ?q= from URL on first render
    const urlCategory = searchParams.get('category') || 'All';
    const urlQuery    = searchParams.get('q') || '';

    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(urlCategory);
    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [searchInput, setSearchInput] = useState(urlQuery); // controlled input value
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);

    const [categories, setCategories] = useState<string[]>(defaultCategories);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

    const PAGE_SIZE = 12;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories();
                if (response.data.categories && response.data.categories.length > 0) {
                    setCategories(['All', ...response.data.categories]);
                    setCategoryCounts(response.data.counts || {});
                }
            } catch {
                // keep default categories on error
            }
        };
        fetchCategories();
    }, []);

    const fetchTrips = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            if (!append) setLoading(true);
            else setLoadingMore(true);

            let response;

            if (searchQuery) {
                response = await api.searchTrips(searchQuery);
                setTrips(response.data);
                setHasMore(false);
                setTotalElements(response.data.length);
            } else {
                const params: Record<string, unknown> = { page: pageNum, size: PAGE_SIZE };
                if (activeCategory !== 'All') params.category = activeCategory;

                response = await api.getTripsPaginated(params);
                const pageData = response.data;

                if (append) {
                    setTrips(prev => [...prev, ...pageData.content]);
                } else {
                    setTrips(pageData.content);
                }

                setHasMore(!pageData.last);
                setTotalElements(pageData.totalElements);
            }

            setError(null);
        } catch {
            setError('Unable to load trips. Please ensure the backend is running.');
            if (!append) setTrips([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCategory, searchQuery]);

    useEffect(() => {
        setPage(0);
        fetchTrips(0, false);
    }, [activeCategory, searchQuery, fetchTrips]);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        setSearchQuery('');
        setSearchInput('');
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = searchInput.trim();
        if (!trimmed) return;
        setSearchQuery(trimmed);
        setActiveCategory('All');
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchInput('');
        setActiveCategory('All');
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTrips(nextPage, true);
    };

    // Visitor filter
    const visitorFiltered = visitor === 'foreigner'
        ? trips.filter((t) => (t.category || '').toLowerCase() !== 'international')
        : trips;

    // Sort
    const displayedTrips = sortTrips(visitorFiltered, sortBy);

    const displayedCategories = visitor === 'foreigner'
        ? categories.filter((c) => c.toLowerCase() !== 'international')
        : categories;

    const activeLabel = searchQuery
        ? `"${searchQuery}"`
        : activeCategory !== 'All' ? activeCategory : null;

    return (
        <>
            {/* Foreigner CTA banner */}
            {visitor === 'foreigner' && (
                <div className="bg-primary text-cream py-8 md:py-10">
                    <div className="section-container">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <Globe className="w-8 h-8 text-accent shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-1">International Visitors</p>
                                    <h3 className="font-display text-2xl md:text-3xl text-cream mb-1">Looking for guided India tours?</h3>
                                    <p className="text-cream/55 text-sm">Private packages · 4-star hotels · USD pricing · Visa support included</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <Link
                                    href="/tours"
                                    className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-warm text-primary px-6 py-3.5 text-xs uppercase tracking-widest font-bold transition-colors"
                                >
                                    Book Now
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="https://wa.me/918427831127?text=Hi%2C%20I%27m%20an%20international%20traveler%20looking%20to%20book%20an%20India%20tour.%20Please%20share%20your%20packages."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CURATED PRIVATE TOURS — shown at top for international users BEFORE filters ── */}
            {visitor === 'foreigner' && (
                <section className="bg-gradient-to-b from-amber-50 to-cream border-b border-amber-200/60 py-10 md:py-14">
                    <div className="section-container">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                                    <Globe className="w-3 h-3" /> Exclusive for International Travelers
                                </div>
                                <h2 className="font-display text-2xl md:text-display-lg text-primary">
                                    Private Guided India Tours
                                </h2>
                                <p className="text-primary/55 text-sm mt-2 max-w-lg">
                                    English-speaking guide · Private AC car · All entry tickets · Secure USD payment · Free cancellation
                                </p>
                            </div>
                            <Link href="/tours" className="hidden md:flex items-center gap-1.5 shrink-0 text-xs font-bold text-amber-600 border border-amber-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 px-4 py-2 rounded-full transition-all uppercase tracking-wider">
                                All Tours <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {CURATED_TOURS.map((tour) => (
                                <CuratedTourCard key={tour.slug} tour={tour} />
                            ))}
                        </div>

                        {/* Trust row */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-8 py-4 bg-white/60 rounded-xl border border-amber-200/40">
                            {[
                                { icon: '🔒', text: '256-bit SSL · PCI-DSS' },
                                { icon: '💳', text: 'Visa · Mastercard · Amex' },
                                { icon: '🗣️', text: 'English-Speaking Guides' },
                                { icon: '🆓', text: 'Free Cancellation — 7 Days' },
                                { icon: '🏛️', text: 'Ministry of Tourism Registered' },
                            ].map(({ icon, text }) => (
                                <span key={text} className="flex items-center gap-1.5 text-xs text-primary/60 font-medium whitespace-nowrap">
                                    <span>{icon}</span>{text}
                                </span>
                            ))}
                        </div>

                        {/* Mobile "see all" */}
                        <div className="mt-5 text-center md:hidden">
                            <Link href="/tours" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 underline underline-offset-4">
                                View All Private Tours <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Divider into main trips */}
                        <div className="mt-10 flex items-center gap-4">
                            <div className="flex-1 border-t border-primary/10" />
                            <span className="text-[10px] uppercase tracking-widest text-primary/35 whitespace-nowrap flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> More India Experiences Below
                            </span>
                            <div className="flex-1 border-t border-primary/10" />
                        </div>
                    </div>
                </section>
            )}

            {/* Filters — sticky on all screens */}
            <section className="py-3 md:py-5 border-b border-primary/10 bg-cream sticky top-16 z-30 shadow-sm">
                <div className="section-container space-y-3">
                    {/* Row 1: Categories */}
                    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-0.5 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
                        {displayedCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`shrink-0 px-3 py-1.5 text-xs uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 rounded-sm ${
                                    activeCategory === category && !searchQuery
                                        ? 'bg-primary text-cream'
                                        : 'bg-cream-dark text-primary hover:bg-primary/10'
                                }`}
                            >
                                <span>{category}</span>
                                {category !== 'All' && categoryCounts[category] !== undefined && (
                                    <span className="text-[10px] opacity-55">({categoryCounts[category]})</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Row 2: Search + Sort */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/40" />
                                <input
                                    type="text"
                                    placeholder="Search trips, destinations..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 bg-cream-dark text-primary text-sm placeholder:text-primary/35 focus:outline-none focus:ring-1 focus:ring-secondary"
                                />
                                {(searchInput || searchQuery) && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-primary text-cream hover:bg-secondary transition-colors text-xs uppercase tracking-widest"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </form>

                        {/* Sort */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setShowSortMenu(v => !v)}
                                className="flex items-center gap-1.5 px-3 py-2.5 border border-primary/15 bg-cream text-primary text-xs uppercase tracking-widest hover:border-primary/40 transition-colors"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">
                                    {sortOptions.find(s => s.value === sortBy)?.label || 'Sort'}
                                </span>
                            </button>
                            {showSortMenu && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-primary/10 shadow-xl z-50">
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest transition-colors ${
                                                sortBy === opt.value
                                                    ? 'bg-primary text-cream'
                                                    : 'text-primary hover:bg-cream-dark'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Active filter pill */}
            {activeLabel && !loading && (
                <div className="bg-secondary/5 border-b border-secondary/10 py-2.5">
                    <div className="section-container flex items-center gap-3">
                        <span className="text-xs text-primary/55">Filtered by:</span>
                        <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary text-xs font-medium px-3 py-1 rounded-full">
                            {activeLabel}
                            <button onClick={clearSearch} className="hover:text-secondary/60 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                        {!loading && (
                            <span className="text-xs text-primary/40">{displayedTrips.length} result{displayedTrips.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
                    <div className="section-container">
                        <p className="text-terracotta text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Trips Grid */}
            <section className="py-12 md:py-20 bg-cream" onClick={() => showSortMenu && setShowSortMenu(false)}>
                <div className="section-container">

                    {/* Results count */}
                    {!loading && displayedTrips.length > 0 && (
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-primary/55">
                                Showing <span className="font-medium text-primary">{displayedTrips.length}</span>
                                {totalElements > trips.length && (
                                    <> of <span className="font-medium text-primary">{totalElements}</span></>
                                )}
                                {' '}trip{displayedTrips.length !== 1 ? 's' : ''}
                                {activeCategory !== 'All' && !searchQuery && (
                                    <> in <span className="font-medium text-primary">{activeCategory}</span></>
                                )}
                            </p>
                            <p className="text-xs text-primary/35 uppercase tracking-widest hidden md:block">
                                Sorted by: {sortOptions.find(s => s.value === sortBy)?.label}
                            </p>
                        </div>
                    )}

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-[480px] bg-cream-dark animate-pulse rounded-sm" />
                            ))}
                        </div>
                    ) : displayedTrips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {displayedTrips.map((trip, index) => (
                                <TripCard key={trip.id} trip={trip} index={index} />
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="text-center py-20 max-w-md mx-auto">
                            <div className="text-5xl mb-5">🔍</div>
                            <h3 className="font-display text-2xl text-primary mb-3">No trips found</h3>
                            <p className="text-primary/55 text-sm mb-6 leading-relaxed">
                                {searchQuery
                                    ? `No results for "${searchQuery}". Try a different search term or browse by category.`
                                    : `No trips in the "${activeCategory}" category yet. Try another category or let us plan a custom trip for you.`
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={clearSearch}
                                    className="px-6 py-3 bg-primary text-cream text-sm uppercase tracking-widest hover:bg-secondary transition-colors"
                                >
                                    Clear Filters
                                </button>
                                <a
                                    href="https://wa.me/918427831127?text=Hi%2C+I'm+looking+for+a+custom+trip"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 border border-primary/20 text-primary text-sm uppercase tracking-widest hover:bg-primary hover:text-cream transition-all"
                                >
                                    Ask an Expert
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Load More */}
                    {trips.length > 0 && hasMore && !searchQuery && (
                        <div className="text-center mt-14">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Trips</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            <p className="text-primary/35 text-xs mt-3">
                                Showing {trips.length} of {totalElements} trips
                            </p>
                        </div>
                    )}

                    {trips.length > 0 && !hasMore && trips.length >= totalElements && totalElements > 0 && (
                        <div className="text-center mt-14 pb-4">
                            <p className="text-primary/35 text-xs uppercase tracking-widest">— All {totalElements} trips loaded —</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
