'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle, ArrowUpRight, Mountain, Waves, Castle, TreePine,
  Sailboat, Sun, Shield, Users, Globe, Clock, Star, Check,
  CreditCard, MapPin, Phone, BadgeCheck, ChevronDown, ChevronUp,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';
import { useVisitor } from '@/context/VisitorContext';

const indiaRegions = [
  { label: 'All India', value: 'All India' },
  { label: 'North India', value: 'North India' },
  { label: 'South India', value: 'South India' },
  { label: 'East India', value: 'East India' },
  { label: 'West India', value: 'West India' },
  { label: 'Northeast', value: 'Northeast India' },
  { label: 'Himalayas', value: 'Himalayan Region' },
];

const highlights = [
  { icon: Mountain, label: 'Himalayan Treks', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Castle, label: 'Heritage & Forts', color: 'text-terracotta', bg: 'bg-orange-50' },
  { icon: Waves, label: 'Beaches & Coasts', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: TreePine, label: 'Wildlife Safaris', color: 'text-green-700', bg: 'bg-green-50' },
  { icon: Sailboat, label: 'Kerala Backwaters', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Sun, label: 'Rajasthan Deserts', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const trustSignals = [
  {
    icon: Shield,
    title: 'Fully Licensed & Insured',
    desc: 'Registered with India\'s Ministry of Tourism. All guides hold national guide cards.',
    color: 'text-blue-600', bg: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'English-Speaking Private Guides',
    desc: 'Dedicated guide throughout your trip. Also available in French, German, Spanish & Japanese.',
    color: 'text-amber-600', bg: 'bg-amber-50',
  },
  {
    icon: Globe,
    title: 'Trusted by 40+ Countries',
    desc: 'USA, UK, Australia, Canada, Germany, France — 25,000+ international travelers in 12 years.',
    color: 'text-green-600', bg: 'bg-green-50',
  },
  {
    icon: CreditCard,
    title: 'Secure International Payment',
    desc: 'Visa, Mastercard, Amex accepted. Prices in USD. No hidden charges. PCI-DSS compliant gateway.',
    color: 'text-purple-600', bg: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: '24/7 Support During Your Trip',
    desc: 'WhatsApp, email, or phone — someone from our team is always available across all timezones.',
    color: 'text-rose-600', bg: 'bg-rose-50',
  },
  {
    icon: BadgeCheck,
    title: 'Free Cancellation',
    desc: 'Full refund up to 7 days before departure. Flexible date changes at no extra cost.',
    color: 'text-teal-600', bg: 'bg-teal-50',
  },
];

const privateGuideFeatures = [
  { emoji: '🚗', title: 'Private Air-Conditioned Car', desc: 'Your own vehicle for all transfers and excursions. No shared coaches or public transport.' },
  { emoji: '🗣️', title: 'Dedicated English-Speaking Guide', desc: 'One guide for your group throughout. They know every story, every shortcut, every local secret.' },
  { emoji: '🏨', title: 'Hand-Picked Accommodation', desc: 'Vetted 3★–5★ hotels and heritage havelis. We inspect every property before recommending it.' },
  { emoji: '🎟️', title: 'All Entry Tickets Pre-Booked', desc: 'No queuing at monuments. Priority access to Taj Mahal, Amber Fort, and all major sites.' },
  { emoji: '🍽️', title: 'Curated Local Dining', desc: 'Safe, hygienic restaurants that international travelers trust — from rooftop dinners to street food experiences.' },
  { emoji: '📱', title: 'Local SIM Card Provided', desc: 'Stay connected from day one. We provide a local SIM with data for your entire stay.' },
];

const visaInfo = [
  { q: 'Do I need a visa for India?', a: 'Most nationalities (USA, UK, Australia, Canada, Europe) can get an e-Visa online at indianvisaonline.gov.in. It takes 2–4 business days and costs $25–$80. We send you a step-by-step guide after booking.' },
  { q: 'Is India safe for international travelers?', a: 'India is welcoming to international tourists. The Golden Triangle, Kerala, and Rajasthan are among the most visited circuits in the world. We take additional steps — vetted guides, safe accommodations, 24/7 reachable team — so you can focus on the experience.' },
  { q: 'What is the best time to visit India?', a: 'October to March is ideal for most regions — cool, dry, and clear. North India is best Oct–Mar. Kerala and South India are great year-round. Himalayas are best May–October. We\'ll recommend the best dates for your chosen destinations.' },
  { q: 'What vaccinations do I need?', a: 'Hepatitis A and Typhoid are generally recommended. Some travelers also get Hepatitis B and Rabies. We recommend consulting your doctor or a travel health clinic 4–6 weeks before departure. No mandatory vaccines required for most countries.' },
  { q: 'What currency does India use?', a: 'Indian Rupee (INR). You can withdraw from ATMs in all major cities. Your guide will help you find safe ATMs. For convenience, carry some USD/EUR for exchange. We accept international cards — Visa, Mastercard, Amex — for your booking.' },
];

const countryReviews = [
  { flag: '🇺🇸', country: 'USA', traveler: 'Sarah M.', trip: 'Golden Triangle', text: 'Everything was taken care of. Our guide Arjun was brilliant — knew every detail of every monument. Best vacation of our lives.', rating: 5 },
  { flag: '🇬🇧', country: 'UK', traveler: 'James & Emma H.', trip: 'Kerala & South India', text: 'We were nervous about India — but the team made it completely seamless. The houseboat in Kerala was out of this world.', rating: 5 },
  { flag: '🇦🇺', country: 'Australia', traveler: 'Lachlan B.', trip: 'Rajasthan Heritage', text: 'Worth every dollar. Private jeep ride up to Amber Fort, sunrise at desert dunes, rooftop dinners in Udaipur. Perfection.', rating: 5 },
  { flag: '🇨🇦', country: 'Canada', traveler: 'Marie-Claire D.', trip: 'Kerala & Goa', text: 'Three-week trip planned down to every detail. Guide spoke flawless English and French. India exceeded every expectation.', rating: 5 },
];

export default function DomesticDestinationsPage() {
  const { visitor } = useVisitor();
  const isInternational = visitor === 'foreigner';
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All India');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        const india = (response.data || []).filter(
          (d: Destination) => (d.country || '').toLowerCase() === 'india'
        );
        setDestinations(india);
        setError(null);
      } catch {
        setError('Unable to load destinations.');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Map backend region values to filter tab values
  const REGION_ALIASES: Record<string, string> = {
    'Jammu & Kashmir': 'Himalayan Region',
    'Jammu and Kashmir': 'Himalayan Region',
    'J&K': 'Himalayan Region',
    'Northeast': 'Northeast India',
    'North East India': 'Northeast India',
    'North East': 'Northeast India',
  };

  const filtered =
    activeRegion === 'All India'
      ? destinations
      : destinations.filter((d) => {
          const region = d.region || '';
          const mapped = REGION_ALIASES[region] || region;
          return mapped === activeRegion;
        });

  return (
    <>
      <PageHero
        title={isInternational ? 'Private India Tours for International Travelers' : 'Discover India'}
        subtitle={
          isInternational
            ? 'Handcrafted private tours — Taj Mahal, Kerala, Rajasthan & beyond. English-speaking guides · Licensed operator · Trusted by 25,000+ travelers from USA, UK, Australia & 40+ countries.'
            : 'From the Himalayas to Kerala\'s backwaters — 12+ years crafting India journeys for 25,000+ travelers.'
        }
        breadcrumb={isInternational ? 'India Tours' : 'Domestic'}
        backgroundImage="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-terracotta/50 via-primary/60 to-primary/90"
      />

      {/* International trust bar */}
      {isInternational && (
        <section className="bg-amber-500 text-white py-3">
          <div className="section-container">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-semibold uppercase tracking-wider">
              {[
                '🇺🇸 Trusted by Americans',
                '🇬🇧 Loved in the UK',
                '🇦🇺 Top-rated in Australia',
                '⭐ 4.9 Google · 2,400+ reviews',
                '🏛️ Ministry of Tourism Registered',
                '💳 Visa · Mastercard · Amex',
              ].map((item) => (
                <span key={item} className="whitespace-nowrap">{item}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CURATED TOURS — shown immediately at top for international users ── */}
      {isInternational && (
        <section className="bg-gradient-to-b from-amber-50 to-white border-b border-amber-200/50 py-10 md:py-14">
          <div className="section-container">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                  🌍 Exclusive for International Travelers
                </div>
                <h2 className="font-display text-2xl md:text-display-lg text-primary">
                  Private Guided India Tours
                </h2>
                <p className="text-primary/55 text-sm mt-2">
                  English-speaking guide · Private AC car · All tickets · Secure USD payment · Free cancellation
                </p>
              </div>
              <Link href="/tours" className="hidden md:flex items-center gap-1.5 shrink-0 text-xs font-bold text-amber-600 border border-amber-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 px-4 py-2 rounded-full transition-all uppercase tracking-wider">
                All Tours <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  slug: 'golden-triangle-10-day',
                  title: '10-Day Golden Triangle',
                  subtitle: 'Delhi · Agra · Jaipur',
                  price: '$1,400', priceINR: 117600,
                  image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
                  href: '/tours/golden-triangle-10-day',
                  checkoutHref: '/checkout/tour?tour=golden-triangle-10-day',
                  tags: ['Taj Mahal', 'Amber Fort', 'Red Fort'],
                  rating: 4.9, reviews: 312,
                  badge: 'Most Popular', badgeBg: 'bg-amber-500',
                },
                {
                  slug: 'kerala-south-india-14-day',
                  title: '14-Day Kerala & South India',
                  subtitle: 'Kochi · Munnar · Alleppey · Pondicherry',
                  price: '$1,900', priceINR: 159600,
                  image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
                  href: '/tours/kerala-south-india-14-day',
                  checkoutHref: '/checkout/tour?tour=kerala-south-india-14-day',
                  tags: ['Houseboat', 'Tea Estates', 'French Quarter'],
                  rating: 4.9, reviews: 287,
                  badge: 'Best Value', badgeBg: 'bg-green-600',
                },
                {
                  slug: 'rajasthan-heritage-7-day',
                  title: '7-Day Rajasthan Heritage',
                  subtitle: 'Jaipur · Jodhpur · Udaipur',
                  price: '$950', priceINR: 79800,
                  image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
                  href: '/tours/rajasthan-heritage-7-day',
                  checkoutHref: '/checkout/tour?tour=rajasthan-heritage-7-day',
                  tags: ['Desert Safari', 'Lake Palace', 'Blue City'],
                  rating: 4.8, reviews: 194,
                  badge: 'Quick Escape', badgeBg: 'bg-blue-600',
                },
              ].map((tour) => (
                <div key={tour.slug} className="group bg-white rounded-2xl overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <Link href={tour.href} className="block relative h-52 overflow-hidden">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className={`${tour.badgeBg} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>{tour.badge}</span>
                      <span className="bg-primary/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">🔒 Private Tour</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{tour.rating} ({tour.reviews})</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">From {tour.price}</span>
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={tour.href}>
                      <h3 className="font-display text-lg text-primary mb-1 group-hover:text-amber-600 transition-colors">{tour.title}</h3>
                    </Link>
                    <p className="text-xs text-primary/50 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" />{tour.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tour.tags.map((tag) => (
                        <span key={tag} className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium mb-4">
                      <Check className="w-3.5 h-3.5" /> English guide · Private car · All tickets
                    </div>
                    <div className="flex-1" />
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/8">
                      <Link href={tour.checkoutHref} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl transition-colors">
                        Book Now
                      </Link>
                      <Link href={tour.href} className="flex items-center justify-center gap-1 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wide py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all">
                        Details <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 py-3 bg-white/70 rounded-xl border border-amber-100">
              {['🔒 256-bit SSL', '💳 Visa · MC · Amex', '🗣️ English Guides', '🆓 Free Cancellation', '🏛️ Govt. Licensed'].map((b) => (
                <span key={b} className="text-xs text-primary/55 font-medium whitespace-nowrap">{b}</span>
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link href="/tours" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 underline underline-offset-4">
                View all private India tours <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Highlights strip */}
      <section className="py-8 md:py-10 bg-cream border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {highlights.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`flex items-center gap-2 ${bg} px-4 py-2.5 rounded-full`}>
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <span className="text-xs font-medium text-primary/80 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNATIONAL TRUST SECTION ── */}
      {isInternational && (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-12">
              <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-3">Why International Travelers Choose Us</p>
              <h2 className="font-display text-display-lg text-primary max-w-2xl mx-auto">
                Everything handled — <span className="italic">from airport to airport</span>
              </h2>
              <p className="text-primary/60 mt-4 max-w-xl mx-auto">
                No group tours. No shared coaches. Just you, a private guide who speaks your language, and India at its finest.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trustSignals.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex gap-4 p-5 border border-primary/8 rounded-xl hover:shadow-md transition-shadow bg-cream/30">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm mb-1">{title}</h3>
                    <p className="text-xs text-primary/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHAT'S INCLUDED IN PRIVATE TOUR ── */}
      {isInternational && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-4">Private Guided Tours</p>
                <h2 className="font-display text-display-lg text-primary mb-6">
                  Not a tour group. <span className="italic">Your trip, your pace.</span>
                </h2>
                <p className="text-primary/65 text-body-lg mb-8">
                  Every YlooTrips India tour is fully private. No strangers on your bus, no rushed photo stops.
                  Your own vehicle, your own guide, your own pace — from the moment you land to the moment you leave.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {privateGuideFeatures.map(({ emoji, title, desc }) => (
                    <div key={title} className="flex gap-3 p-4 bg-white rounded-xl border border-primary/8">
                      <span className="text-2xl shrink-0">{emoji}</span>
                      <div>
                        <div className="font-semibold text-primary text-sm mb-0.5">{title}</div>
                        <div className="text-xs text-primary/55 leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                      <Image src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80" alt="Taj Mahal private tour" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <Image src="https://images.unsplash.com/photo-1519307747268-66e3debb7228?w=600&q=80" alt="Private guide India" fill className="object-cover" />
                    </div>
                  </div>
                  <div className="pt-8 space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                      <Image src="https://images.unsplash.com/photo-1603262110263-e5fb6c69ddd9?w=600&q=80" alt="Kerala backwaters" fill className="object-cover" />
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                      <Image src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80" alt="Rajasthan heritage" fill className="object-cover" />
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-amber-500 text-white px-5 py-3 rounded-xl shadow-lg">
                  <div className="font-display text-2xl">25K+</div>
                  <div className="text-xs uppercase tracking-widest opacity-90">Travelers guided</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── COUNTRY FLAGS / SOCIAL PROOF ── */}
      {isInternational && (
        <section className="py-12 bg-primary text-cream">
          <div className="section-container">
            <p className="text-center text-caption uppercase tracking-[0.3em] text-amber-400 mb-8">Trusted by travelers from</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
              {[
                { flag: '🇺🇸', country: 'USA' }, { flag: '🇬🇧', country: 'UK' },
                { flag: '🇦🇺', country: 'Australia' }, { flag: '🇨🇦', country: 'Canada' },
                { flag: '🇩🇪', country: 'Germany' }, { flag: '🇫🇷', country: 'France' },
                { flag: '🇳🇱', country: 'Netherlands' }, { flag: '🇸🇬', country: 'Singapore' },
                { flag: '🇯🇵', country: 'Japan' }, { flag: '🇳🇿', country: 'New Zealand' },
                { flag: '🇰🇪', country: 'Kenya' }, { flag: '🇧🇷', country: 'Brazil' },
              ].map(({ flag, country }) => (
                <div key={country} className="flex flex-col items-center gap-1">
                  <span className="text-3xl">{flag}</span>
                  <span className="text-[10px] text-cream/50 uppercase tracking-widest">{country}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {countryReviews.map(({ flag, country, traveler, trip, text, rating }) => (
                <div key={country} className="bg-white/8 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{flag}</span>
                    <div>
                      <div className="font-medium text-cream text-sm">{traveler}</div>
                      <div className="text-xs text-cream/50">{country} · {trip}</div>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-cream/70 leading-relaxed">&ldquo;{text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VISA & SAFETY FAQ ── */}
      {isInternational && (
        <section className="py-16 md:py-20 bg-white">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-10">
              <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-3">Before You Go</p>
              <h2 className="font-display text-display-lg text-primary">Visa, Safety & Practical Info</h2>
            </div>
            <div className="space-y-3">
              {visaInfo.map((item, i) => (
                <div key={i} className="border border-primary/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/[0.02] transition-colors"
                  >
                    <span className="font-medium text-primary text-sm pr-4">{item.q}</span>
                    {openFaq === i
                      ? <ChevronUp size={18} className="text-amber-500 shrink-0" />
                      : <ChevronDown size={18} className="text-primary/40 shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-primary/65 text-sm leading-relaxed border-t border-primary/5">
                      <p className="pt-4">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl flex gap-4 items-start">
              <span className="text-2xl shrink-0">📋</span>
              <div>
                <div className="font-semibold text-amber-900 mb-1">Free Pre-Trip India Guide</div>
                <p className="text-sm text-amber-800">After booking, we send you our complete India travel guide — visa step-by-step, what to pack, safety tips, etiquette, money, and day-by-day prep.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Region filter */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {indiaRegions.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-sm ${
                  activeRegion === r.value
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'bg-cream text-primary/70 hover:bg-terracotta/10 hover:text-terracotta'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Destination grid */}
      <section className="py-12 md:py-20 lg:py-28 bg-cream">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 md:mb-14">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-terracotta mb-2">
                {activeRegion === 'All India' ? (isInternational ? 'Choose Your India Experience' : 'Across India') : activeRegion}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {activeRegion === 'All India'
                  ? (isInternational ? 'Where will your India story begin?' : 'Where in India?')
                  : `Explore ${activeRegion}`}
              </h2>
            </div>
            {!loading && filtered.length > 0 && (
              <p className="text-sm text-primary/50">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[420px] bg-cream-dark animate-pulse rounded-sm" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} theme="domestic" />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan
              scopeFilter="Domestic"
              activeRegion={activeRegion}
              onViewAll={() => setActiveRegion('All India')}
            />
          )}
        </div>
      </section>


      {/* Stats */}
      <section className="py-8 bg-cream-dark border-y border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center">
            {[
              { value: '12+', label: 'Years of India expertise' },
              { value: '25K+', label: 'Travelers guided' },
              { value: '4.9★', label: 'Google rating' },
              { value: '40+', label: 'Countries served' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl text-terracotta">{value}</div>
                <div className="text-caption text-primary/50 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption uppercase tracking-[0.3em] text-amber-400 mb-4">
              {isInternational ? 'Start Planning Your India Trip' : 'India Travel Experts'}
            </p>
            <h2 className="font-display text-display-lg mb-4">
              {isInternational ? 'Tell us your dream. We build the trip.' : 'Not sure where to start?'}
            </h2>
            <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
              {isInternational
                ? 'Share your travel dates, group size, and interests. Our India specialists respond within 1 hour with a personalised itinerary and USD pricing — no obligation.'
                : 'Tell us your interests, budget, and travel dates. Our India specialists respond in under 1 hour — 7 days a week.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={isInternational
                  ? 'https://wa.me/918427831127?text=Hi!%20I%27m%20from%20abroad%20and%20planning%20an%20India%20trip.%20Can%20you%20help%3F'
                  : 'https://wa.me/918427831127?text=Hi%2C+I\'m+interested+in+a+domestic+India+trip'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors rounded-sm"
              >
                <MessageCircle className="w-5 h-5" />
                {isInternational ? 'WhatsApp Our India Experts' : 'Chat on WhatsApp'}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all rounded-sm"
              >
                {isInternational ? 'Get Free Custom Itinerary' : 'Plan My India Trip'}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-cream/30 text-xs mt-6 uppercase tracking-widest">
              {isInternational ? 'Free · No obligation · Response in 1 hour · USD pricing' : 'Free · No obligation · Response in under 1 hour'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
