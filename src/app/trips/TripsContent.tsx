'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, Filter, Search, Loader2, Sparkles, X, SlidersHorizontal, MessageCircle, Globe } from 'lucide-react';
import Link from 'next/link';
import TripCard from '@/components/TripCard';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { useVisitor } from '@/context/VisitorContext';

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

            {/* Curated Tours quick-links */}
            <div className="bg-secondary/5 border-b border-secondary/15 py-3">
                <div className="section-container">
                    <div className="flex flex-nowrap items-center gap-2 md:gap-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold uppercase tracking-widest text-secondary/70 pr-2 border-r border-secondary/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Curated Tours</span>
                        </div>
                        {[
                            { label: '10-Day Golden Triangle', href: '/tours/golden-triangle-10-day', from: 'From $1,400' },
                            { label: '14-Day Kerala & South India', href: '/tours/kerala-south-india-14-day', from: 'From $1,900' },
                            { label: '7-Day Rajasthan Heritage', href: '/tours/rajasthan-heritage-7-day', from: 'From $950' },
                        ].map((tour) => (
                            <Link
                                key={tour.href}
                                href={tour.href}
                                className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border border-secondary/20 hover:border-secondary hover:bg-secondary/5 transition-all group"
                            >
                                <span className="text-xs font-medium text-primary whitespace-nowrap">{tour.label}</span>
                                <span className="text-[10px] text-secondary/70 whitespace-nowrap hidden sm:inline">{tour.from}</span>
                                <ArrowUpRight className="w-3 h-3 text-secondary/50 group-hover:text-secondary shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

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
