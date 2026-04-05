import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star, Clock, Users, MapPin, CheckCircle2, Shield, Award, Globe, MessageCircle } from 'lucide-react';
import curatedTours from '@/data/curatedTours';

export const metadata: Metadata = {
  title: 'Curated India Tours for International Travelers | YlooTrips',
  description: 'Private guided tours of India crafted for international travelers. Golden Triangle, Kerala, Rajasthan — 4-star hotels, expert guides, all-inclusive packages from $950.',
  alternates: { canonical: 'https://www.ylootrips.com/tours' },
  openGraph: {
    title: 'Curated India Tours — Golden Triangle, Kerala, Rajasthan',
    description: 'Private, all-inclusive India tours for international travelers. MSME certified. 4.9★ on Google. From $950.',
    images: [{ url: curatedTours[0].heroImage, width: 1200, height: 630 }],
  },
};

const trustSignals = [
  { icon: Shield, label: 'MSME Registered', sub: 'Govt. of India' },
  { icon: Star, label: '4.9★ Google', sub: '2,400+ reviews' },
  { icon: Users, label: '25,000+', sub: 'Travelers served' },
  { icon: Globe, label: '48 Countries', sub: 'Visitors hosted' },
  { icon: Award, label: 'Est. 2012', sub: '13 Years experience' },
  { icon: CheckCircle2, label: 'Visa Letter', sub: 'Support included' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function ToursPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=85"
          alt="Taj Mahal at sunrise — India tours for international travelers"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

        <div className="relative z-10 section-container">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4">
              Private · All-Inclusive · International
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-cream mb-5 leading-tight">
              Curated<br /><span className="italic">India Tours</span>
            </h1>
            <p className="text-cream/70 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Handcrafted journeys for discerning international travelers. Private guides, 4-star hotels, and seamless logistics — from your first question to your last goodbye.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/918427831127?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20your%20India%20tours%20for%20international%20travelers."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp an Expert
              </a>
              <a
                href="#tours"
                className="flex items-center gap-2 border border-cream/30 text-cream hover:bg-white/10 px-6 py-3.5 text-xs uppercase tracking-widest transition-all"
              >
                View All Tours
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-primary border-b border-white/8 py-4">
        <div className="section-container">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {trustSignals.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="w-5 h-5 text-accent mb-1" />
                <span className="text-cream text-xs font-semibold">{label}</span>
                <span className="text-cream/40 text-[10px] uppercase tracking-wide">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tour cards */}
      <section id="tours" className="py-20 md:py-28 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14 md:mb-20">
            <p className="text-[10px] uppercase tracking-[0.35em] text-secondary mb-4">Choose Your Journey</p>
            <h2 className="font-display text-display-lg text-primary mb-4">
              Three iconic routes.<br />
              <span className="italic">One unforgettable country.</span>
            </h2>
            <p className="text-primary/60 text-base max-w-xl mx-auto">
              Every tour is private, fully guided, and built around your pace — not a group schedule.
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            {curatedTours.map((tour, index) => {
              const savings = tour.originalPriceUSD ? tour.originalPriceUSD - tour.priceUSD : 0;
              const waText = encodeURIComponent(
                `Hi, I'm interested in the ${tour.name} tour (${tour.duration}, from $${tour.priceUSD.toLocaleString()}).\n\nPlease share availability and next steps.`
              );

              return (
                <article
                  key={tour.slug}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className={`relative h-[360px] lg:h-[520px] overflow-hidden ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                    <Image
                      src={tour.heroImage}
                      alt={tour.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Badges on image */}
                    <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                      {tour.featured && (
                        <span className="bg-accent text-primary text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold">
                          Most Popular
                        </span>
                      )}
                      <span className="bg-white/15 backdrop-blur-sm text-cream text-[9px] uppercase tracking-widest px-3 py-1.5">
                        {tour.difficulty}
                      </span>
                    </div>

                    {/* Bottom info on image */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="flex items-center gap-3 text-cream/70 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {tour.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {tour.groupSize}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {tour.startCity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white flex flex-col p-8 md:p-10 lg:p-12">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={tour.avgRating} />
                      <span className="text-primary/60 text-xs">{tour.avgRating} · {tour.reviewCount} reviews</span>
                    </div>

                    <p className="text-[10px] uppercase tracking-[0.3em] text-secondary mb-2">{tour.category}</p>
                    <h3 className="font-display text-3xl md:text-4xl text-primary mb-3">{tour.name}</h3>
                    <p className="text-secondary text-sm mb-2 font-medium">{tour.subtitle}</p>
                    <p className="text-primary/60 text-sm leading-relaxed mb-6">{tour.tagline}</p>

                    {/* Route */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tour.route.map((stop, i) => (
                        <span key={stop} className="flex items-center gap-1">
                          <span className="text-xs text-primary/70 bg-cream px-2.5 py-1">{stop}</span>
                          {i < tour.route.length - 1 && <span className="text-primary/30 text-xs">→</span>}
                        </span>
                      ))}
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2 mb-6">
                      {tour.highlights.slice(0, 4).map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-primary/70">
                          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Best for tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {tour.bestFor.map((tag) => (
                        <span key={tag} className="text-[10px] uppercase tracking-widest text-secondary border border-secondary/25 px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price + CTAs */}
                    <div className="mt-auto">
                      <div className="flex items-end gap-3 mb-5">
                        <div>
                          <span className="text-primary/40 text-xs uppercase tracking-wider block mb-1">From (per person)</span>
                          <span className="font-display text-4xl text-primary">${tour.priceUSD.toLocaleString()}</span>
                          <span className="text-primary/50 text-sm ml-1">USD</span>
                        </div>
                        {savings > 0 && (
                          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 mb-1">
                            Save ${savings}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`https://wa.me/918427831127?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Enquire
                        </a>
                        <Link
                          href={`/tours/${tour.slug}`}
                          className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-cream px-4 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
                        >
                          Full Details
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why book with us */}
      <section className="py-20 md:py-28 bg-primary text-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-4">Why YlooTrips</p>
            <h2 className="font-display text-display-lg mb-4">
              Built for international<br />
              <span className="italic">travelers like you</span>
            </h2>
            <p className="text-cream/55 max-w-xl mx-auto text-base">
              We've been hosting visitors from 48 countries since 2012. Here's what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Truly Private Tours',
                desc: 'No strangers in your group. Your vehicle, your guide, your pace. Stop whenever you want, linger as long as you like.',
              },
              {
                title: 'Licensed Expert Guides',
                desc: 'All our guides are government-licensed, English-fluent, and handpicked for knowledge, warmth, and storytelling ability.',
              },
              {
                title: 'Transparent Pricing',
                desc: 'What you see is what you pay. No surprise fees at monuments, no commission shops, no pressure upsells.',
              },
              {
                title: 'Visa Support Letter',
                desc: 'We provide an official invitation letter for your India e-Visa or visa-on-arrival application at no extra charge.',
              },
              {
                title: '24/7 WhatsApp Support',
                desc: 'Your guide\'s number, our emergency line, and a local manager — all on WhatsApp, day and night.',
              },
              {
                title: 'Flexible Cancellation',
                desc: 'Plans change. Free cancellation up to 14 days before travel. We\'ll also rebook at no fee if your flights shift.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="border border-white/8 p-6 hover:border-accent/40 transition-colors">
                <div className="w-1 h-6 bg-accent mb-5" />
                <h3 className="font-semibold text-cream mb-3">{title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample reviews */}
      <section className="py-20 bg-cream-dark">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] text-secondary mb-4">Traveler Stories</p>
            <h2 className="font-display text-display-lg text-primary">
              What our guests say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Mitchell',
                country: 'United States',
                flag: '🇺🇸',
                tour: '10-Day Golden Triangle',
                comment: 'The Taj Mahal at sunrise was every bit as magical as promised — but it was our guide\'s storytelling about Shah Jahan that made it truly unforgettable. Best travel decision we\'ve ever made.',
                rating: 5,
              },
              {
                name: 'James Thornton',
                country: 'United Kingdom',
                flag: '🇬🇧',
                tour: '14-Day Kerala & South India',
                comment: 'Completely exceeded expectations. The houseboat on the Kerala backwaters, the spice plantation visit, the temple ceremonies — everything was seamlessly arranged. Worth every penny.',
                rating: 5,
              },
              {
                name: 'Marie Dubois',
                country: 'France',
                flag: '🇫🇷',
                tour: '7-Day Rajasthan Heritage',
                comment: 'Rajasthan felt like stepping into a storybook. The fort homestays were magical and our guide knew everyone — we got access to places not in any guidebook. Truly special.',
                rating: 5,
              },
            ].map((review) => (
              <div key={review.name} className="bg-cream p-7 border border-primary/8">
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                </div>
                <p className="text-primary/70 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{review.flag}</span>
                  <div>
                    <p className="font-semibold text-primary text-sm">{review.name}</p>
                    <p className="text-primary/40 text-xs">{review.country} · {review.tour}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=80"
          alt="India travel — plan your journey with YlooTrips"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />

        <div className="relative z-10 w-full section-container py-24 md:py-36 text-center text-cream">
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent mb-5">Ready to Go?</p>
          <h2 className="font-display text-display-xl max-w-2xl mx-auto mb-6">
            Let's plan your perfect<br /><span className="italic">India journey</span>
          </h2>
          <p className="text-cream/65 text-base max-w-lg mx-auto mb-10">
            Tell us your travel dates and interests. We'll design a custom itinerary and send pricing within 24 hours — no obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/918427831127?text=Hi%2C%20I%27d%20like%20to%20plan%20an%20India%20tour.%20Please%20share%20your%20package%20options%20and%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-4 text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 border border-cream/30 text-cream hover:bg-cream/10 px-7 py-4 text-xs uppercase tracking-widest transition-all"
            >
              Send an Enquiry
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
