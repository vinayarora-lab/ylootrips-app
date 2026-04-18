import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight, MapPin, Clock, Users, Star, CheckCircle2, X,
  MessageCircle, Calendar, Shield, Award, Globe, ChevronDown, ChevronLeft,
  Plane, CreditCard, ThumbsUp
} from 'lucide-react';
import curatedTours from '@/data/curatedTours';

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return curatedTours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = curatedTours.find((t) => t.slug === slug);
  if (!tour) return {};
  return {
    title: `${tour.name} — India Tour from $${tour.priceUSD} | YlooTrips`,
    description: tour.tagline,
    alternates: { canonical: `https://www.ylootrips.com/tours/${tour.slug}` },
    openGraph: {
      title: `${tour.name} | YlooTrips`,
      description: tour.tagline,
      images: [{ url: tour.heroImage, width: 1200, height: 630 }],
    },
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
      ))}
    </span>
  );
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const tour = curatedTours.find((t) => t.slug === slug);
  if (!tour) notFound();

  const waText = encodeURIComponent(
    `Hi, I'm interested in booking the ${tour.name} tour.\n\nDuration: ${tour.duration}\nFrom: $${tour.priceUSD}/person\n\nPlease send me availability and a personalised quote.`
  );

  const savings = tour.originalPriceUSD ? tour.originalPriceUSD - tour.priceUSD : 0;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[560px] flex items-end overflow-hidden">
        <Image src={tour.heroImage} alt={tour.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

        {/* Back link */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="section-container">
            <Link href="/tours" className="inline-flex items-center gap-1.5 text-cream/70 hover:text-cream text-xs uppercase tracking-widest transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> All Tours
            </Link>
          </div>
        </div>

        <div className="relative z-10 section-container pb-14">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-accent text-primary text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold">Private Tour</span>
            <span className="bg-white/15 backdrop-blur-sm text-cream text-[10px] uppercase tracking-widest px-3 py-1.5">{tour.category}</span>
            <span className="bg-white/15 backdrop-blur-sm text-cream text-[10px] uppercase tracking-widest px-3 py-1.5">{tour.difficulty}</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-cream mb-3 leading-none">{tour.name}</h1>
          <p className="text-cream/70 text-lg md:text-xl max-w-2xl mb-6">{tour.subtitle}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-5 text-cream/65 text-sm">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{tour.duration}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{tour.routeString}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{tour.groupSize}</span>
            <span className="flex items-center gap-1.5">
              <Stars rating={tour.avgRating} />
              <span className="font-semibold text-cream">{tour.avgRating}</span>
              <span className="text-cream/45">({tour.reviewCount} reviews)</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── STICKY BOOKING BAR ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-primary border-b border-white/10 shadow-xl">
        <div className="section-container py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="font-display text-2xl text-cream">${tour.priceUSD}</span>
              <span className="text-cream/45 text-xs ml-1">per person</span>
              {tour.originalPriceUSD && (
                <span className="text-cream/35 text-sm line-through ml-2">${tour.originalPriceUSD}</span>
              )}
            </div>
            {savings > 0 && (
              <span className="bg-green-500 text-white text-[10px] uppercase tracking-widest px-2 py-1 font-bold">
                Save ${savings}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/918427831127?text=${waText}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-bold transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> Book on WhatsApp
            </a>
            <Link href={`/checkout?tour=${tour.slug}`}
              className="flex items-center gap-2 bg-accent hover:bg-accent-warm text-primary px-5 py-2.5 text-xs uppercase tracking-widest font-bold transition-colors">
              Book Now <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="bg-cream">
        <div className="section-container py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">

            {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
            <div className="space-y-14">

              {/* Tagline + highlights */}
              <div>
                <p className="font-display text-2xl md:text-3xl text-primary leading-snug mb-8 max-w-2xl italic">
                  "{tour.tagline}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3 p-4 bg-cream-light border border-primary/8 hover:border-secondary/20 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-primary/70 leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-day itinerary */}
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">Full Itinerary</p>
                <h2 className="font-display text-display-lg text-primary mb-8">Day by day</h2>

                <div className="space-y-0 border-l-2 border-primary/10 ml-4">
                  {tour.itinerary.map((day, i) => (
                    <div key={day.day} className="relative pl-8 pb-10 last:pb-0">
                      {/* Circle on timeline */}
                      <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 border-secondary bg-cream flex items-center justify-center">
                        <span className="text-[8px] font-bold text-secondary">{day.day}</span>
                      </div>

                      <div className="bg-cream-light border border-primary/8 p-5 md:p-6 hover:border-secondary/20 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-secondary/70 mb-1">Day {day.day}</p>
                            <h3 className="font-display text-xl text-primary">{day.title}</h3>
                            <p className="flex items-center gap-1 text-xs text-primary/45 mt-1">
                              <MapPin className="w-3 h-3" /> {day.location}
                            </p>
                          </div>
                          <div className="shrink-0 text-right text-xs text-primary/40">
                            <p>{day.meals}</p>
                            {day.accommodation !== 'N/A' && <p className="mt-0.5">{day.accommodation}</p>}
                          </div>
                        </div>

                        <p className="text-sm text-primary/65 leading-relaxed mb-4">{day.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {day.highlights.map((h) => (
                            <span key={h} className="px-2.5 py-1 bg-secondary/8 text-secondary text-[10px] uppercase tracking-wider font-medium">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Includes / Excludes */}
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">What's Covered</p>
                <h2 className="font-display text-display-lg text-primary mb-8">Inclusions & exclusions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-100 p-6">
                    <p className="text-xs uppercase tracking-widest text-green-700 font-bold mb-4">✓ Included</p>
                    <ul className="space-y-2.5">
                      {tour.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-green-900/80">
                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-6">
                    <p className="text-xs uppercase tracking-widest text-red-600 font-bold mb-4">✗ Not Included</p>
                    <ul className="space-y-2.5">
                      {tour.excludes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-red-900/70">
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Photo gallery */}
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">Gallery</p>
                <h2 className="font-display text-display-lg text-primary mb-8">What you'll see</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tour.galleryImages.map((img, i) => (
                    <div key={i} className={`relative overflow-hidden ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
                      <Image src={img} alt={`${tour.name} gallery ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">Traveller Reviews</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-display text-5xl text-primary">{tour.avgRating}</span>
                  <div>
                    <Stars rating={tour.avgRating} />
                    <p className="text-primary/45 text-sm mt-1">{tour.reviewCount} verified reviews</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {tour.reviews.map((rev) => (
                    <div key={rev.name} className="bg-cream-light border border-primary/8 p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-sm font-bold">
                            {rev.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-primary text-sm">{rev.name}</p>
                            <p className="text-primary/45 text-xs">{rev.flag} {rev.country} · {rev.date}</p>
                          </div>
                        </div>
                        <Stars rating={rev.rating} />
                      </div>
                      <p className="text-primary/65 text-sm leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">FAQ</p>
                <h2 className="font-display text-display-lg text-primary mb-8">Questions answered</h2>
                <div className="space-y-3">
                  {tour.faq.map((item) => (
                    <details key={item.q} className="group bg-cream-light border border-primary/8 open:border-secondary/20">
                      <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                        <span className="font-medium text-primary text-sm pr-4">{item.q}</span>
                        <ChevronDown className="w-4 h-4 text-primary/40 shrink-0 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="px-6 pb-5 text-primary/60 text-sm leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
            <div className="space-y-5 lg:sticky lg:top-32 self-start">

              {/* Price card */}
              <div className="bg-primary text-cream p-6 shadow-2xl">
                <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">Book This Tour</p>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-4xl">${tour.priceUSD}</span>
                  <span className="text-cream/45 text-sm">per person</span>
                </div>
                {tour.originalPriceUSD && (
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-cream/30 line-through text-sm">${tour.originalPriceUSD}</span>
                    <span className="bg-green-500 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold">
                      Save ${savings}
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-6 text-sm text-cream/65">
                  {[
                    { icon: Clock, text: tour.duration },
                    { icon: Users, text: tour.groupSize },
                    { icon: MapPin, text: `${tour.startCity} → ${tour.endCity}` },
                    { icon: Calendar, text: `Best: ${tour.bestTime}` },
                    { icon: Globe, text: tour.languages.slice(0,2).join(' · ') },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                <a href={`https://wa.me/918427831127?text=${waText}`} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-4 text-sm uppercase tracking-widest font-bold transition-colors mb-3">
                  <MessageCircle className="w-4 h-4" /> Book on WhatsApp
                </a>
                <Link href={`/checkout?tour=${tour.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-warm text-primary py-4 text-sm uppercase tracking-widest font-bold transition-colors mb-4">
                  Book & Pay Online <ArrowUpRight className="w-4 h-4" />
                </Link>

                <p className="text-center text-cream/30 text-[10px] uppercase tracking-widest">
                  30% deposit · Free cancellation 30 days before
                </p>
              </div>

              {/* Trust signals */}
              <div className="bg-cream-light border border-primary/8 p-5 space-y-4">
                <p className="text-caption uppercase tracking-[0.3em] text-secondary">Why Book With Us</p>
                {[
                  { icon: Shield, text: 'Fully licensed & MSME certified', sub: 'India Pvt. Ltd. registered' },
                  { icon: Award, text: '4.9★ on Google Reviews', sub: `${tour.reviewCount}+ verified reviews` },
                  { icon: ThumbsUp, text: '25,000+ travellers since 2022', sub: '40+ source countries' },
                  { icon: CreditCard, text: 'Secure international payment', sub: 'USD, EUR, GBP, AUD accepted' },
                  { icon: Globe, text: '24/7 WhatsApp support', sub: 'Real people, not bots' },
                  { icon: Plane, text: 'We handle your e-Visa letter', sub: 'India visa support included' },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{text}</p>
                      <p className="text-[11px] text-primary/45">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Best for */}
              <div className="bg-cream-light border border-primary/8 p-5">
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">Best For</p>
                <div className="flex flex-wrap gap-2">
                  {tour.bestFor.map((b) => (
                    <span key={b} className="px-3 py-1.5 bg-primary/5 text-primary text-xs uppercase tracking-wider font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Other tours */}
              <div className="bg-cream-light border border-primary/8 p-5">
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">Other Tours</p>
                <div className="space-y-3">
                  {curatedTours.filter(t => t.slug !== tour.slug).map((t) => (
                    <Link key={t.slug} href={`/tours/${t.slug}`}
                      className="flex items-center gap-3 group">
                      <div className="relative w-14 h-14 overflow-hidden shrink-0">
                        <Image src={t.heroImage} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors leading-tight">{t.name}</p>
                        <p className="text-xs text-primary/45">{t.duration} · From ${t.priceUSD}</p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-primary/25 group-hover:text-secondary ml-auto shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">Ready to Go?</p>
          <h2 className="font-display text-display-lg mb-5">
            Book {tour.name}<br />
            <span className="italic">from ${tour.priceUSD} per person</span>
          </h2>
          <p className="text-cream/55 text-body-sm max-w-lg mx-auto mb-10 leading-relaxed">
            Private tour · English-speaking guide · 4-star hotels · 24/7 support · Free cancellation 30 days before. Trusted by travelers from 40+ countries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`https://wa.me/918427831127?text=${waText}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-bold text-sm uppercase tracking-widest transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Book on WhatsApp
            </a>
            <Link href={`/checkout?tour=${tour.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-warm text-primary px-8 py-4 font-bold text-sm uppercase tracking-widest transition-colors">
              Book & Pay Online <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-cream/25 text-xs mt-6 uppercase tracking-widest">30% deposit · Balance 30 days before · Free cancellation · Secure payment</p>
        </div>
      </section>
    </>
  );
}
