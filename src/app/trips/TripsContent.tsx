'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, Filter, Search, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import TripCard from '@/components/TripCard';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { useVisitor } from '@/context/VisitorContext';

// Default categories (will be replaced by dynamic ones from API)
const defaultCategories = ['All', 'Trekking', 'Tour', 'Adventure', 'Camping', 'International', 'Beach', 'Honeymoon'];

export default function TripsContent() {
    const { visitor } = useVisitor();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);

    // Dynamic categories from API
    const [categories, setCategories] = useState<string[]>(defaultCategories);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

    const PAGE_SIZE = 12;

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories();
                if (response.data.categories && response.data.categories.length > 0) {
                    setCategories(['All', ...response.data.categories]);
                    setCategoryCounts(response.data.counts || {});
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                // Keep default categories on error
            }
        };
        fetchCategories();
    }, []);

    // Fetch trips with pagination
    const fetchTrips = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            if (!append) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            let response;

            if (searchQuery) {
                // Search doesn't support pagination yet, get all results
                response = await api.searchTrips(searchQuery);
                setTrips(response.data);
                setHasMore(false);
                setTotalElements(response.data.length);
            } else {
                // Use paginated endpoint
                const params: Record<string, unknown> = {
                    page: pageNum,
                    size: PAGE_SIZE,
                };

                if (activeCategory !== 'All') {
                    params.category = activeCategory;
                }

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
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError('Unable to load trips. Please ensure the backend is running.');
            if (!append) {
                setTrips([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCategory, searchQuery]);

    // Initial fetch and when category/search changes
    useEffect(() => {
        setPage(0);
        fetchTrips(0, false);
    }, [activeCategory, searchQuery, fetchTrips]);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        setSearchQuery('');
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setSearchQuery(formData.get('search') as string);
        setActiveCategory('All');
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTrips(nextPage, true);
    };

    // Foreigners see only India trips (hide 'International' outbound category)
    const displayedTrips = visitor === 'foreigner'
        ? trips.filter((t) => (t.category || '').toLowerCase() !== 'international')
        : trips;

    // Also hide the 'International' category pill from the filter bar for foreigners
    const displayedCategories = visitor === 'foreigner'
        ? categories.filter((c) => c.toLowerCase() !== 'international')
        : categories;

    return (
        <>
            {/* Visitor context banner */}
            {visitor === 'foreigner' && (
                <div className="bg-secondary/10 border-b border-secondary/20 py-3">
                    <div className="section-container flex items-center gap-2 text-sm text-secondary">
                        <span>🌍</span>
                        <span>Showing India trips curated for international visitors</span>
                    </div>
                </div>
            )}

            {/* Featured Itineraries Bar */}
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
                                <ArrowUpRight className="w-3 h-3 text-secondary/50 group-hover:text-secondary transition-colors shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters Section - compact on mobile so trip cards are visible */}
            <section className="py-4 md:py-8 border-b border-primary/10 bg-cream md:sticky md:top-20 z-30">
                <div className="section-container">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                        {/* Categories - single-row horizontal scroll on mobile, wrap on desktop */}
                        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                            {displayedCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`shrink-0 px-3 py-1.5 md:px-5 md:py-2.5 text-xs md:text-caption uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 md:gap-2 ${activeCategory === category
                                        ? 'bg-primary text-cream'
                                        : 'bg-cream-dark text-primary hover:bg-primary/10'
                                        }`}
                                >
                                    <span>{category}</span>
                                    {category !== 'All' && categoryCounts[category] !== undefined && (
                                        <span className="text-[10px] md:text-xs opacity-60">
                                            ({categoryCounts[category]})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search - compact row on mobile */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 md:gap-4 shrink-0">
                            <div className="relative flex-1 min-w-0 md:flex-none">
                                <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search experiences..."
                                    className="pl-9 md:pl-11 pr-3 md:pr-5 py-2.5 md:py-3 bg-cream-dark text-primary text-sm md:text-base placeholder:text-primary/40 focus:outline-none focus:ring-1 focus:ring-secondary w-full md:w-64"
                                />
                            </div>
                            <button type="submit" className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 md:py-3 bg-primary text-cream hover:bg-primary-light transition-colors shrink-0">
                                <Filter className="w-4 h-4" />
                                <span className="text-caption uppercase tracking-widest hidden md:inline">Search</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Error Banner */}
            {error && (
                <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
                    <div className="section-container">
                        <p className="text-terracotta text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Trips Grid */}
            <section className="py-16 md:py-24 bg-cream">
                <div className="section-container">
                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-primary/60">
                            {loading ? 'Loading...' : (
                                <>
                                    Showing <span className="font-medium text-primary">{displayedTrips.length}</span>
                                    {totalElements > trips.length && (
                                        <> of <span className="font-medium text-primary">{totalElements}</span></>
                                    )}
                                    {' '}experiences
                                </>
                            )}
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-[500px] bg-cream-dark animate-pulse rounded-lg" />
                            ))}
                        </div>
                    ) : displayedTrips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {displayedTrips.map((trip, index) => (
                                <TripCard key={trip.id} trip={trip} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-primary/60 mb-4">No experiences found.</p>
                            <p className="text-sm text-primary/40">
                                Try a different category or{' '}
                                <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="text-secondary hover:underline">
                                    clear filters
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Load More */}
                    {trips.length > 0 && hasMore && (
                        <div className="text-center mt-16">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Experiences</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* All loaded indicator */}
                    {trips.length > 0 && !hasMore && trips.length === totalElements && (
                        <div className="text-center mt-16">
                            <p className="text-primary/40 text-sm">All experiences loaded</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
