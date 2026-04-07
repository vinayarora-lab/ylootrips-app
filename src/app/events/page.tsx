'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Calendar, MapPin, Ticket, Phone, Users, Star, Camera, Music, Briefcase, Heart, ChevronRight, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { Event as EventType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const eventCategories = [
  {
    icon: Briefcase,
    title: 'Corporate Events',
    desc: 'Team outings, offsites, conferences, and incentive trips across India\'s best destinations. We handle logistics so your team just shows up.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    color: 'bg-primary',
  },
  {
    icon: Heart,
    title: 'Weddings & Celebrations',
    desc: 'Destination weddings, sangeet nights, mehendi ceremonies, and anniversary getaways. Royal venues, floral decor, and seamless coordination.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    color: 'bg-secondary',
  },
  {
    icon: Camera,
    title: 'Cultural Experiences',
    desc: 'Holi festivals, Diwali celebrations, cooking classes, heritage walks, and immersive cultural programs for groups and individuals.',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&q=80',
    color: 'bg-terracotta',
  },
  {
    icon: Music,
    title: 'Group Adventures',
    desc: 'Wildlife safaris, river rafting, trekking expeditions, and sunset desert camps. Curated adventures for groups of all sizes.',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80',
    color: 'bg-accent',
  },
];

const whyUs = [
  { icon: Users, title: '500+ Events Delivered', desc: 'From intimate gatherings of 10 to corporate events of 2,000+. We\'ve done it all across India.' },
  { icon: MapPin, title: 'Pan-India Reach', desc: 'Rajasthan palaces, Kerala backwaters, Goa beachfronts, Himalayan camps — we operate everywhere.' },
  { icon: Star, title: 'Handpicked Venues', desc: 'Heritage havelis, luxury resorts, forest lodges, and rooftop terraces. We know India\'s best event venues.' },
  { icon: Phone, title: '24/7 On-Ground Support', desc: 'A dedicated event coordinator is with your group from arrival to departure. Nothing falls through the cracks.' },
];

const destinationEvents = [
  { city: 'Rajasthan', tag: 'Palace Weddings & Offsites', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80' },
  { city: 'Kerala', tag: 'Backwater Retreats & Wellness', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
  { city: 'Goa', tag: 'Beach Events & Celebrations', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' },
  { city: 'Himalayas', tag: 'Adventure & Team Building', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('');
  const [guests, setGuests] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Events');

  const eventFilters = ['All Events', 'Corporate', 'Wedding', 'Cultural', 'Adventure'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        const data = response.data;
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.content) ? data.content : []);
        setEvents(list);
        setError(null);
      } catch {
        setError('Unable to load events.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi! I'd like to plan an event.%0AName: ${name}%0AEmail: ${email}%0AEvent Type: ${eventType}%0AGuests: ${guests}`;
    window.open(`https://wa.me/918427831127?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Events', url: 'https://www.ylootrips.com/events' },
      ]} />

      {/* ── HERO ── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=85"
          alt="Royal palace events across India — YlooTrips event planning"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-primary/30" />
        <div className="absolute inset-0 flex items-center pt-20">
          <div className="section-container text-cream">
            <p className="text-caption uppercase tracking-[0.4em] text-accent mb-4">Events & Experiences</p>
            <h1 className="font-display text-display-xl text-cream max-w-3xl leading-tight mb-6">
              Unforgettable Events.<br />
              <span className="italic text-accent">Extraordinary</span> Destinations.
            </h1>
            <p className="text-cream/75 text-body-lg max-w-xl mb-10 leading-relaxed">
              Corporate offsites, destination weddings, cultural festivals, and group adventures — planned and delivered across India&apos;s most spectacular venues.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/918427831127?text=Hi!%20I%27d%20like%20to%20plan%20an%20event%20with%20YlooTrips."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-accent text-primary hover:bg-accent-warm px-8 py-4 text-sm uppercase tracking-widest"
              >
                Plan My Event
              </a>
              <a
                href="#upcoming-events"
                className="px-8 py-4 border border-cream/40 text-cream text-sm uppercase tracking-widest hover:bg-cream/10 transition-colors"
              >
                View Upcoming Events
              </a>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 backdrop-blur-sm">
          <div className="section-container">
            <div className="grid grid-cols-3 divide-x divide-cream/10 py-4">
              {[
                { num: '500+', label: 'Events Organised' },
                { num: '50+', label: 'Destinations' },
                { num: '98%', label: 'Client Satisfaction' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center px-4 py-1">
                  <div className="font-display text-2xl text-accent">{num}</div>
                  <div className="text-cream/60 text-caption uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT CATEGORIES ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">What We Plan</p>
            <h2 className="font-display text-display-lg text-primary">
              Every occasion, <span className="italic">expertly crafted</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventCategories.map(({ icon: Icon, title, desc, image }) => (
              <Link key={title} href={`/contact?event=${encodeURIComponent(title)}`} className="group relative overflow-hidden bg-cream-light border border-primary/8 hover:shadow-xl transition-all duration-500 block">
                <div className="relative h-48 overflow-hidden">
                  <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'; }} />
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-500" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-cream/15 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cream" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-primary mb-2 group-hover:text-secondary transition-colors">{title}</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">{desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-secondary text-caption font-medium uppercase tracking-wider group-hover:gap-2 transition-all">
                    Enquire Now <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3">Why YlooTrips</p>
            <h2 className="font-display text-display-lg text-cream">
              India&apos;s events, <span className="italic text-accent">without the stress</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 border border-accent/30 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display text-xl text-cream mb-3">{title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-10 border-t border-cream/10 flex flex-wrap items-center justify-center gap-6">
            {['Free site visits for large groups', 'Customisable packages', 'Transparent pricing', 'Visa & travel assistance included'].map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm text-cream/70">
                <Check className="w-4 h-4 text-accent shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="bg-accent/10 border-y border-accent/20 py-4">
        <div className="section-container flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-primary/70">
          <span>✓ Free consultation</span>
          <span>✓ Custom packages for all budgets</span>
          <span>✓ Dedicated coordinator</span>
          <span>✓ Reply in under 1 hour</span>
        </div>
      </div>

      {/* ── UPCOMING / LIVE EVENTS ── */}
      <section id="upcoming-events" className="py-20 md:py-28 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Live Listings</p>
              <h2 className="font-display text-display-lg text-primary">Upcoming Events</h2>
            </div>
            <Link href="/contact" className="btn-outline shrink-0">
              Request Custom Event
            </Link>
          </div>
          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {eventFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition-all border ${activeFilter === filter
                  ? 'bg-secondary text-cream border-secondary'
                  : 'bg-transparent text-primary/60 border-primary/20 hover:border-secondary/50 hover:text-secondary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-cream animate-pulse" />
              ))}
            </div>
          )}

          {!loading && (error || events.length === 0) && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Rajasthan Royal Diwali Celebration',
                  desc: 'An evening of fireworks, royal thali dinner, and cultural performances at a 17th-century haveli in Jaipur.',
                  category: 'Cultural Festival',
                  city: 'Jaipur',
                  date: 'Oct 2025',
                  price: 4500,
                  image: 'https://images.unsplash.com/photo-1624461050280-d59b3066afef?w=800&q=80',
                },
                {
                  title: 'Kerala Backwater Corporate Offsite',
                  desc: '3-day houseboat retreat for teams — Ayurveda sessions, team building, and sunset cruises through the backwaters.',
                  category: 'Corporate',
                  city: 'Alleppey',
                  date: 'Nov 2025',
                  price: 18000,
                  image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
                },
                {
                  title: 'Thar Desert Sunset Camp Experience',
                  desc: 'Overnight desert camp with camel ride, folk music, bonfire dinner, and stargazing in the Thar Desert.',
                  category: 'Adventure',
                  city: 'Jaisalmer',
                  date: 'Dec 2025',
                  price: 6500,
                  image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80',
                },
              ].map((ev) => (
                <article key={ev.title} className="bg-cream overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-500 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-primary/20" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent text-primary text-[10px] uppercase tracking-widest font-medium">
                        {ev.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-primary/55 line-clamp-2 mb-4 leading-relaxed">{ev.desc}</p>
                    <div className="flex items-center gap-4 text-caption text-primary/50 mb-5">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ev.city}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-primary/8 pt-4">
                      <div>
                        <p className="text-caption text-primary/40 uppercase tracking-wider">From</p>
                        <p className="font-display text-xl text-primary">{formatPrice(ev.price)}</p>
                      </div>
                      <Link href="/contact" className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-cream text-xs font-semibold uppercase tracking-widest hover:bg-secondary/80 transition-colors">
                        Book Tickets <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeFilter === 'All Events' ? events : events.filter(e => e.category?.toLowerCase().includes(activeFilter.toLowerCase()))).map((event) => {
                const price = typeof event.price === 'number' ? event.price : parseFloat(String(event.price ?? 0));
                const dateStr = typeof event.eventDate === 'string' ? event.eventDate : '';
                return (
                  <article key={event.id} className="bg-cream overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-500 group">
                    <Link href={`/events/${event.slug || event.id}`} className="block">
                      <div className="relative h-56 overflow-hidden">
                        {event.imageUrl ? (
                          <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <Ticket className="w-16 h-16 text-primary/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/15" />
                        {event.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-accent text-primary text-[10px] uppercase tracking-widest font-medium">Featured</span>
                          </div>
                        )}
                        {event.category && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-primary/70 text-cream text-[10px] uppercase tracking-widest">{event.category}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                          {event.title}
                        </h3>
                        {event.shortDescription && (
                          <p className="text-sm text-primary/55 line-clamp-2 mb-4 leading-relaxed">{event.shortDescription}</p>
                        )}
                        <div className="flex items-center gap-4 text-caption text-primary/50 mb-5">
                          {dateStr && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                          {event.city && (
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between border-t border-primary/8 pt-4">
                          <div>
                            <p className="text-caption text-primary/40 uppercase tracking-wider">From</p>
                            <p className="font-display text-xl text-primary">
                              {formatPrice(price)}
                              {event.originalPrice && (
                                <span className="text-sm text-primary/40 line-through ml-2">
                                  {formatPrice(typeof event.originalPrice === 'number' ? event.originalPrice : parseFloat(String(event.originalPrice)))}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-cream text-xs font-semibold uppercase tracking-widest hover:bg-secondary/80 transition-colors">
                            Book Tickets <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── DESTINATION EVENTS ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Where We Operate</p>
            <h2 className="font-display text-display-lg text-primary">
              Events across <span className="italic">India&apos;s finest</span> destinations
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {destinationEvents.map(({ city, tag, image }) => (
              <Link
                key={city}
                href={`/contact?destination=${encodeURIComponent(city)}`}
                className="group relative h-72 overflow-hidden"
              >
                <Image src={image} alt={`${city} events`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-caption uppercase tracking-wider text-accent mb-1">{tag}</p>
                  <h3 className="font-display text-xl text-cream">{city}</h3>
                  <p className="text-cream/50 text-xs mt-1 group-hover:text-cream/80 transition-colors">Plan event here →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ENQUIRY FORM ── */}
      <section className="py-20 md:py-28 bg-cream-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Get Started</p>
              <h2 className="font-display text-display-lg text-primary mb-6">
                Let&apos;s plan your<br /><span className="italic">celebration</span>
              </h2>
              <p className="text-primary/60 text-body-lg leading-relaxed mb-8">
                Tell us about your event and we&apos;ll get back to you within 1 hour with venue options, pricing, and a customised proposal.
              </p>
              <div className="space-y-4">
                {[
                  'Free consultation & venue suggestions',
                  'Custom packages for all budgets',
                  'Dedicated coordinator from start to finish',
                  'On-ground support across all Indian cities',
                ].map((p) => (
                  <div key={p} className="flex items-center gap-3 text-primary/70 text-sm">
                    <div className="w-5 h-5 bg-accent/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {p}
                  </div>
                ))}
              </div>
              <div className="mt-10 flex items-center gap-4">
                <a
                  href="https://wa.me/918427831127"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" /> WhatsApp Us Now
                </a>
                <p className="text-primary/50 text-caption">Reply in &lt; 1 hour</p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-cream border border-primary/10 p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl text-primary mb-2">We&apos;ll be in touch!</h3>
                  <p className="text-primary/60 text-sm">Our team will WhatsApp you within 1 hour with ideas and pricing.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="space-y-5">
                  <div>
                    <label className="block text-caption uppercase tracking-wider text-primary/60 mb-2">Your Name *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John & Sarah"
                      className="w-full px-4 py-3 bg-cream-light border border-primary/15 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-wider text-primary/60 mb-2">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-cream-light border border-primary/15 text-primary placeholder:text-primary/30 focus:outline-none focus:border-secondary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-wider text-primary/60 mb-2">Type of Event *</label>
                    <select
                      required
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-light border border-primary/15 text-primary focus:outline-none focus:border-secondary text-sm"
                    >
                      <option value="">Select event type…</option>
                      <option>Corporate Offsite / Team Outing</option>
                      <option>Destination Wedding</option>
                      <option>Birthday / Anniversary Celebration</option>
                      <option>Cultural Experience / Festival</option>
                      <option>Adventure Group Trip</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-wider text-primary/60 mb-2">Number of Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 bg-cream-light border border-primary/15 text-primary focus:outline-none focus:border-secondary text-sm"
                    >
                      <option value="">Select group size…</option>
                      <option>1–10 guests</option>
                      <option>11–25 guests</option>
                      <option>26–50 guests</option>
                      <option>51–100 guests</option>
                      <option>100+ guests</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-sm uppercase tracking-widest mt-2">
                    Send Enquiry via WhatsApp
                  </button>
                  <p className="text-center text-caption text-primary/40">We respond within 1 hour · No spam</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg text-cream mb-4">
            Ready to create something <span className="italic text-accent">extraordinary?</span>
          </h2>
          <p className="text-cream/55 text-body-lg max-w-xl mx-auto mb-10">
            From a 10-person desert camp to a 500-person corporate gala — we&apos;ve planned it all. Let&apos;s start with a conversation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary bg-accent text-primary hover:bg-accent-warm px-10 py-4 text-sm uppercase tracking-widest">
              Get a Free Quote
            </Link>
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%27d%20like%20to%20discuss%20an%20event%20with%20YlooTrips."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border border-cream/30 text-cream text-sm uppercase tracking-widest hover:bg-cream/10 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
