'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, User, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

interface Blog {
  id: number;
  title: string;
  content: string;
  shortDescription: string;
  imageUrl: string;
  slug: string;
  authorName: string;
  publishedDate: string;
  category: string;
  readTime: string;
  isFeatured: boolean;
}

const categories = ['All', 'Destinations', 'Philosophy', 'Responsible Travel', 'Tips', 'Food & Culture', 'Guides'];

const staticGuides = [
  {
    title: 'Best Time to Visit India — Month by Month Guide 2026',
    description: 'When is the best time to visit India? Month-by-month breakdown of weather, festivals, crowds, and prices. Find your perfect travel window.',
    href: '/blogs/best-time-to-visit-india',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
    tag: 'Travel Planning',
    read: '8 min read',
  },
  {
    title: 'Manali Trip Guide 2026 — Summer, Winter & Everything In Between',
    description: 'Complete Manali travel guide — best time to visit, how to reach, things to do, budget breakdown, and essential packing tips.',
    href: '/blogs/manali-trip-guide',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    tag: 'Destinations',
    read: '9 min read',
  },
  {
    title: 'Goa on a Budget 2026 — How to Visit for Under ₹15,000',
    description: 'North vs South Goa, cheapest stays, budget food spots, free beaches, and the best season to go — everything for a budget Goa trip.',
    href: '/blogs/goa-budget-trip-guide',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    tag: 'Budget Travel',
    read: '7 min read',
  },
  {
    title: 'Kashmir Travel Guide 2026 — Complete Itinerary & Travel Tips',
    description: 'Srinagar, Gulmarg, Pahalgam, Sonamarg — the complete Kashmir guide with month-by-month weather, houseboat tips, and 7-day itinerary.',
    href: '/blogs/kashmir-travel-guide',
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80',
    tag: 'Destinations',
    read: '10 min read',
  },
  {
    title: '15 Best Honeymoon Destinations in India 2026',
    description: 'Andaman, Kashmir, Goa, Kerala, Coorg, Udaipur — romantic getaways for every budget. Find the perfect India honeymoon destination.',
    href: '/blogs/best-honeymoon-destinations-india',
    image: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=600&q=80',
    tag: 'Honeymoon',
    read: '8 min read',
  },
  {
    title: '20 Best Long Weekend Getaways from Delhi 2026',
    description: 'Agra, Jaipur, Rishikesh, Nainital, Shimla, Jim Corbett — the best short trips from Delhi within 500km, grouped by driving distance.',
    href: '/blogs/long-weekend-getaways-delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
    tag: 'Weekend Trips',
    read: '8 min read',
  },
  {
    title: 'Kedarnath Yatra 2026 — Complete Guide (Registration, Trek & Budget)',
    description: 'Registration process, best time to visit, trek route, accommodation at base camp, budget breakdown, and essential tips for Kedarnath.',
    href: '/blogs/kedarnath-yatra-guide',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80',
    tag: 'Pilgrimage',
    read: '11 min read',
  },
  {
    title: 'Best Time to Visit Bali 2026 — Month-by-Month Guide',
    description: 'Dry season, wet season, Nyepi, crowds and prices — the complete guide to choosing the best month to visit Bali from India.',
    href: '/blogs/best-time-to-visit-bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    tag: 'Destinations',
    read: '7 min read',
  },
  {
    title: 'Dubai Trip Cost from India 2026 — Full Budget Breakdown',
    description: 'Flights, hotels, visa, food, attractions — exact cost of a Dubai trip from India. Budget vs luxury options compared.',
    href: '/blogs/dubai-trip-cost-from-india',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    tag: 'Budget Travel',
    read: '8 min read',
  },
  {
    title: 'Thailand 5-Day Itinerary — Bangkok + Phuket on a Budget',
    description: 'The perfect 5-day Thailand itinerary from India — Bangkok temples, Phuket beaches, street food, and island hopping under ₹60,000.',
    href: '/blogs/thailand-itinerary-5-days',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
    tag: 'Destinations',
    read: '9 min read',
  },
  {
    title: 'First Time in India? Complete 2026 Guide for International Travelers',
    description: 'Everything you need before visiting India — visa, safety, money, food, transport, and the best places to start.',
    href: '/blogs/first-time-india-guide',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
    tag: 'Beginners Guide',
    read: '12 min read',
  },
  {
    title: 'India vs Thailand: Which Should You Visit First?',
    description: 'Cost, safety, food, beaches, culture — an honest head-to-head comparison to help you decide.',
    href: '/blogs/india-vs-thailand',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80',
    tag: 'Destination Compare',
    read: '7 min read',
  },
  {
    title: 'Solo Female Travel in India: Honest Safety Guide 2026',
    description: 'Safe cities, transport tips, dress code, accommodation advice, and how to handle unwanted attention — the guide no one else writes.',
    href: '/blogs/solo-female-travel-india',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80',
    tag: 'Solo Travel',
    read: '10 min read',
  },
  {
    title: 'How to Plan a 2-Week India Trip on a $2,000 Budget',
    description: 'Full budget breakdown, where to save vs splurge, and a complete 14-day Delhi → Agra → Jaipur → Rajasthan itinerary.',
    href: '/blogs/2-week-india-trip-budget',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    tag: 'Budget Travel',
    read: '8 min read',
  },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.getBlogs();
        setBlogs(response.data);
        setError(null);
      } catch {
        setError('Unable to load blogs. Please ensure the backend is running.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter by category (client-side)
  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  const featuredPost = filteredBlogs.find(b => b.isFeatured);
  const regularPosts = filteredBlogs.filter(b => b !== featuredPost);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
      ]} />
      <PageHero
        title="The Journal"
        subtitle="Stories, insights, and inspiration from our travels around the world. Discover new perspectives on destinations, cultures, and the art of meaningful travel."
        breadcrumb="Journal"
      />

      {/* Categories */}
      <section className="sticky top-0 z-30 bg-cream py-4 md:py-6 border-b border-primary/10 overflow-x-auto">
        <div className="section-container">
          <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 min-w-max sm:min-w-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-caption uppercase tracking-widest transition-all ${activeCategory === category
                    ? 'bg-primary text-cream'
                    : 'bg-cream-dark text-primary hover:bg-primary/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Static India Travel Guides — always visible */}
      <section className="py-14 md:py-20 bg-cream">
        <div className="section-container">
          <div className="mb-10">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">India Travel Guides</p>
            <h2 className="font-display text-display-lg text-primary">
              Essential reads for <span className="italic">first-time visitors</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group block bg-cream-light border border-primary/8 overflow-hidden hover:shadow-lg transition-all duration-500"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-primary/20" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gray-900/80 text-white text-[10px] uppercase tracking-widest font-medium">
                      {guide.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg text-primary group-hover:text-secondary transition-colors mb-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-primary/55 leading-relaxed mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-caption text-primary/40 uppercase tracking-wider">
                    <span>YlooTrips Editorial</span>
                    <span>{guide.read}</span>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="section-container">
            <Link href={`/blogs/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                <Image
                  src={featuredPost.imageUrl || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80'}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center lg:pl-8">
                <span className="text-caption uppercase tracking-widest text-secondary mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="font-display text-display-lg text-primary group-hover:text-secondary transition-colors mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-primary/60 text-body-lg mb-6">
                  {featuredPost.shortDescription}
                </p>
                <div className="flex items-center gap-6 text-sm text-primary/50">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.authorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime || '5 min'} read</span>
                  </div>
                  <span>{formatDate(featuredPost.publishedDate)}</span>
                </div>
                <div className="mt-8">
                  <span className="btn-ghost text-primary group-hover:text-secondary">
                    Read Article <ArrowRight className="w-4 h-4 inline ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="section-container">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">From Our Writers</p>
          <h2 className="font-display text-display-lg text-primary mb-2">Latest Stories</h2>
          <p className="text-primary/50 text-sm mb-10">Our team shares travel insights, destination guides, and inspiration.</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.slug}`}
                  className="group block bg-cream overflow-hidden transition-all duration-500 hover:shadow-xl"
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-cream text-caption uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-primary group-hover:text-secondary transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-primary/60 text-sm line-clamp-2 mb-4">
                      {post.shortDescription}
                    </p>
                    <div className="flex items-center justify-between text-caption text-primary/50">
                      <span>
                        {post.authorName}
                        {post.publishedDate && (
                          <span className="text-primary/35 text-caption"> · {formatDate(post.publishedDate)}</span>
                        )}
                      </span>
                      <span>{post.readTime || '5 min'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-primary/60">No blog posts available.</p>
            </div>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3">Ready to travel?</p>
              <h2 className="font-display text-2xl md:text-3xl text-cream mb-2">Turn inspiration into a journey</h2>
              <p className="text-cream/55 text-sm">Our India experts craft custom itineraries in 24 hours — no obligation.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-colors">
                WhatsApp Us
              </a>
              <Link href="/trips" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:bg-white/8 px-6 py-3 text-sm uppercase tracking-widest transition-all">
                Browse Trips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}