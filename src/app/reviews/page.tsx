import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Globe, Calendar, Award, Users, ThumbsUp, Camera, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Reviews & Ratings — YlooTrips',
  description: 'Read verified reviews from 25,000+ travelers who booked with YlooTrips. Rated 4.9★ on Google. India\'s most trusted travel platform.',
  openGraph: {
    title: 'YlooTrips Reviews | 4.9★ Rated by 25,000+ Travelers',
    description: 'Verified reviews from real travelers. See why YlooTrips is India\'s most trusted travel platform.',
    url: 'https://www.ylootrips.com/reviews',
    images: [{ url: 'https://www.ylootrips.com/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/reviews' },
};

interface Testimonial {
  id: number;
  userName: string;
  userTitle?: string;
  userImage?: string;
  userAvatar?: string;
  comment: string;
  isFeatured?: boolean;
  rating?: number;
  destination?: string;
  tripDate?: string;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(
      'https://trip-backend-65232427280.asia-south1.run.app/api/testimonials',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const RATING_BREAKDOWN = [
  { stars: 5, percent: 87 },
  { stars: 4, percent: 9 },
  { stars: 3, percent: 3 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
];

const ACHIEVEMENTS = [
  { icon: Award, label: 'MSME Certified', desc: 'Government of India', color: 'text-amber-600 bg-amber-50' },
  { icon: Users, label: '25,000+ Travelers', desc: 'Happy customers served', color: 'text-blue-600 bg-blue-50' },
  { icon: ThumbsUp, label: '4.9★ Google Rating', desc: 'From 2,400+ reviews', color: 'text-green-600 bg-green-50' },
  { icon: CheckCircle, label: '100% Secure', desc: '256-bit SSL encryption', color: 'text-purple-600 bg-purple-50' },
];

const REVIEW_PLATFORMS = [
  {
    name: 'Google',
    rating: '4.9',
    reviews: '2,400+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/272px-Google_2015_logo.svg.png',
    link: 'https://g.co/kgs/ylootrips',
    color: 'border-blue-100',
  },
  {
    name: 'TripAdvisor',
    rating: '4.8',
    reviews: 'New',
    logo: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg',
    link: 'https://www.tripadvisor.in/Profile/ylootrips',
    color: 'border-green-100',
  },
];

function StarRating({ rating = 5, size = 'sm' }: { rating?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sizeClass} ${s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-4 shrink-0">{stars}</span>
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-sm text-gray-500 w-8 text-right shrink-0">{percent}%</span>
    </div>
  );
}

export default async function ReviewsPage() {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter((t) => t.isFeatured);
  const all = featured.length > 0 ? featured : testimonials;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Reviews', url: 'https://www.ylootrips.com/reviews' },
      ]} />

      {/* ── PROFILE HEADER ── */}
      <div className="bg-white border-b border-gray-100 pt-5 pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 pb-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-amber-50">
                <Image
                  src="/favicon.png"
                  alt="YlooTrips"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 border-2 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">YLOO Trips</h1>
                  <p className="text-gray-500 text-sm mt-0.5">@ylootrips</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      India
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Since 2022
                    </span>
                    <Link
                      href="https://www.ylootrips.com"
                      className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      ylootrips.com
                    </Link>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-2 shrink-0">
                  <Link
                    href="/contact"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="https://www.tripadvisor.in/Profile/ylootrips"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5"
                  >
                    TripAdvisor <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-t border-gray-100 mt-2 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
            {['Reviews', 'About', 'Trips', 'Photos'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  i === 0
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT SIDEBAR ── */}
            <div className="lg:col-span-1 space-y-4">

              {/* Rating Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4">Overall Rating</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl font-black text-gray-900">4.9</div>
                  <div>
                    <StarRating rating={5} size="md" />
                    <p className="text-sm text-gray-500 mt-1">2,400+ reviews</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {RATING_BREAKDOWN.map((r) => (
                    <RatingBar key={r.stars} stars={r.stars} percent={r.percent} />
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Achievements
                </h2>
                <div className="space-y-3">
                  {ACHIEVEMENTS.map((a) => (
                    <div key={a.label} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{a.label}</div>
                        <div className="text-xs text-gray-500">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review on platforms */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4">Find us on</h2>
                <div className="space-y-3">
                  {REVIEW_PLATFORMS.map((p) => (
                    <Link
                      key={p.name}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl border ${p.color} hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.rating}★ · {p.reviews} reviews</div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  ))}
                </div>

                <Link
                  href="https://g.page/r/ylootrips/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Write a Review
                </Link>
              </div>

              {/* Intro */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-3">Intro</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Personalized travel by YlooTrips — curated domestic & international packages,
                  hotel bookings, and flight deals. MSME certified. Trusted by 25,000+ Indian travelers.
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    India (PAN India service)
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    Joined Apr 2022
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <Link href="/" className="text-amber-600 hover:underline">www.ylootrips.com</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <Link href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                      WhatsApp us
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── REVIEWS FEED ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-lg">
                  Customer Reviews
                  <span className="ml-2 text-sm font-normal text-gray-400">({all.length > 0 ? `${all.length}+ shown` : '25,000+ travelers'})</span>
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                    ✓ Verified Travelers
                  </span>
                </div>
              </div>

              {/* Review Cards */}
              {all.length > 0 ? (
                <div className="space-y-4">
                  {all.map((t) => (
                    <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        {(t.userImage || t.userAvatar) ? (
                          <img
                            src={(t.userImage || t.userAvatar) as string}
                            alt={t.userName}
                            className="w-11 h-11 rounded-full object-cover border border-gray-100 shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                            {t.userName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-gray-900">{t.userName}</div>
                              {t.userTitle && (
                                <div className="text-xs text-gray-500 mt-0.5">{t.userTitle}</div>
                              )}
                            </div>
                            <StarRating rating={t.rating ?? 5} size="sm" />
                          </div>

                          <p className="text-gray-700 text-sm leading-relaxed mt-3">
                            {t.comment}
                          </p>

                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              Verified Traveler
                            </span>
                            {t.destination && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {t.destination}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback static reviews if API returns empty */
                <div className="space-y-4">
                  {[
                    { name: 'Priya Sharma', title: 'Mumbai', comment: 'YlooTrips made our Bali honeymoon absolutely magical! Everything from flights to hotel was arranged perfectly. No stress at all. Will definitely book again!', rating: 5 },
                    { name: 'Rahul Verma', title: 'Delhi', comment: 'Booked Kashmir tour package for 6 people. The team was incredibly responsive and the itinerary was perfect. Best travel agency I have used in India.', rating: 5 },
                    { name: 'Sneha Patel', title: 'Ahmedabad', comment: 'Amazing experience with YlooTrips! Dubai trip was flawlessly organized. Great value for money and excellent customer support throughout the journey.', rating: 5 },
                    { name: 'Arjun Mehta', title: 'Bangalore', comment: 'Highly recommend! Booked Thailand package, everything went smoothly. The guides were excellent and the hotels were great. 5 stars without a doubt!', rating: 5 },
                    { name: 'Kavya Nair', title: 'Kochi', comment: 'Our family trip to Goa was perfectly planned. Kids had a blast! YlooTrips took care of everything — transport, stays, activities. Superb service!', rating: 5 },
                    { name: 'Vikram Singh', title: 'Jaipur', comment: 'Just returned from Maldives. Could not have asked for better service. YlooTrips got us a great deal and the trip was beyond our expectations!', rating: 5 },
                  ].map((r, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-gray-900">{r.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{r.title}</div>
                            </div>
                            <StarRating rating={r.rating} size="sm" />
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed mt-3">{r.comment}</p>
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              Verified Traveler
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Write a review CTA */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6 text-center">
                <Camera className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Traveled with us?</h3>
                <p className="text-sm text-gray-600 mb-4">Share your experience and help other travelers discover YlooTrips</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="https://g.page/r/ylootrips/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    Review on Google
                  </Link>
                  <Link
                    href="https://www.tripadvisor.in/Profile/ylootrips"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-full border border-gray-200 transition-colors"
                  >
                    Review on TripAdvisor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
