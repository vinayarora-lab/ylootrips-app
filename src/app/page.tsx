import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle, ChevronRight, Sparkles, Plane, Hotel,
  Award, Lock, HeadphonesIcon, Users, TrendingUp,
  ArrowRight, MessageCircle, Calendar, Phone, Star,
} from 'lucide-react';
import InternationalTestimonials from '@/components/InternationalTestimonials';
import HomeDestinations from './HomeDestinations';
import { FaqJsonLd, HowToJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

/* ── Metadata (SSR — enables Google to index & rank the homepage) ─────────── */
export const metadata: Metadata = {
  title: 'YlooTrips — India Tour Packages | Bali, Kashmir, Dubai & 150+ Destinations',
  description: 'Book India & international tour packages starting ₹9,999. Bali, Kashmir, Dubai, Maldives, Kerala, Goa & 150+ destinations. 4.9★ rated. MSME certified. Free AI trip planner. Get a custom quote in 1 hour.',
  keywords: [
    'India tour packages', 'Bali tour package from India', 'Kashmir tour package',
    'Dubai tour package from India', 'Maldives luxury package', 'Kerala tour package',
    'Goa tour package', 'best travel agency India', 'AI trip planner', 'honeymoon packages India',
    'international tour packages', 'YlooTrips', 'travel booking India',
  ].join(', '),
  openGraph: {
    title: 'YlooTrips | India & International Tour Packages Starting ₹9,999',
    description: 'Bali, Kashmir, Dubai, Maldives & 150+ destinations. 25,000+ happy travelers. 4.9★ rated. Free AI trip planner. Book in minutes.',
    type: 'website',
    siteName: 'YlooTrips',
    url: 'https://www.ylootrips.com',
    images: [{ url: 'https://www.ylootrips.com/og-image.jpg', width: 1200, height: 630, alt: 'YlooTrips — India Tour Packages' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YlooTrips | Tour Packages Starting ₹9,999',
    description: 'Bali, Kashmir, Dubai, Maldives & 150+ destinations. 4.9★ rated. Book now.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com' },
};

/* ── Static data ─────────────────────────────────────────────────────────── */
const TRUST_PILLARS = [
  { icon: Award,          title: 'MSME Certified',  sub: 'Govt. of India recognised', color: 'text-amber-600',  bg: 'bg-amber-50'  },
  { icon: Lock,           title: '100% Secure',      sub: 'PCI-DSS & 256-bit SSL',    color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { icon: HeadphonesIcon, title: '24/7 Support',     sub: 'Real humans, not bots',    color: 'text-emerald-600',bg: 'bg-emerald-50'},
  { icon: TrendingUp,     title: 'Price Match',      sub: 'Best price + ₹500 credit', color: 'text-purple-600', bg: 'bg-purple-50' },
];

const QUICK_ACTIONS = [
  { icon: Sparkles, label: 'AI Planner', sub: 'Free itinerary', href: '/trip-planner', bg: 'bg-gray-900',    iconColor: 'text-white' },
  { icon: Plane,    label: 'Flights',    sub: 'Best fares',     href: '/flights',      bg: 'bg-blue-600',    iconColor: 'text-white' },
  { icon: Hotel,    label: 'Hotels',     sub: '200+ stays',     href: '/hotels',       bg: 'bg-amber-500',   iconColor: 'text-white' },
  { icon: Hotel,    label: 'Packages',   sub: '40+ trips',      href: '/trips',        bg: 'bg-emerald-600', iconColor: 'text-white' },
];

const STATS = [
  { value: '25K+', label: 'Trips Planned'   },
  { value: '4.9★', label: 'Average Rating'  },
  { value: '40+',  label: 'Countries'       },
  { value: '1 hr', label: 'Response Time'   },
];

/* ── FAQ data for AEO / Google featured snippets ────────────────────────── */
const HOME_FAQS = [
  {
    question: 'How much does a tour package cost at YlooTrips?',
    answer: 'YlooTrips offers tour packages starting from ₹9,999 per person for domestic trips like Goa. International packages start from ₹24,999 (Thailand), ₹35,999 (Dubai), ₹42,999 (Bali), and ₹89,999 (Maldives). All packages include hotel, transfers, and sightseeing.',
  },
  {
    question: 'Is YlooTrips a trusted and certified travel company?',
    answer: 'Yes. YlooTrips India Pvt. Ltd. is MSME certified by the Government of India, GST registered, PCI-DSS payment certified, and rated 4.9 out of 5 by 2,400+ verified travellers. We have served 25,000+ customers across 40+ countries since 2022.',
  },
  {
    question: 'Which destinations does YlooTrips cover?',
    answer: 'YlooTrips covers 150+ destinations including Kashmir, Goa, Kerala, Manali, Rajasthan, Leh-Ladakh and Andaman domestically, and Bali, Dubai, Maldives, Thailand, Singapore, Europe and more internationally.',
  },
  {
    question: 'Can I get a custom itinerary from YlooTrips?',
    answer: 'Yes. YlooTrips offers a free AI-powered trip planner. You can also WhatsApp our travel experts at +91-84278-31127 or call us for a personalised custom itinerary. We respond within 1 hour.',
  },
  {
    question: 'What is the cancellation policy at YlooTrips?',
    answer: 'YlooTrips offers free cancellation up to 14 days before departure with a full refund. We also offer a 100% Money-Back Guarantee on all bookings. Partial payments (25% deposit) are accepted at booking.',
  },
  {
    question: 'Does YlooTrips have a mobile app?',
    answer: 'Yes. The YlooTrips app is available on the Google Play Store. It features AI trip planning, flight and hotel search, cashback rewards (WanderLoot loyalty points), and full booking management.',
  },
];

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* Structured data — SSR for Google indexing */}
      <BreadcrumbJsonLd items={[{ name: 'Home', url: 'https://www.ylootrips.com' }]} />
      <FaqJsonLd faqs={HOME_FAQS} />
      <HowToJsonLd
        name="How to Book a Tour Package with YlooTrips"
        description="Book your dream holiday in 3 simple steps — choose destination, customise, and pay securely."
        totalTime="PT10M"
        steps={[
          {
            name: 'Choose Your Destination',
            text: 'Browse 150+ destinations on ylootrips.com or use the free AI Trip Planner to get a personalised itinerary instantly.',
            image: 'https://www.ylootrips.com/og-image.jpg',
          },
          {
            name: 'Customise Your Package',
            text: 'Select your travel dates, number of guests, room type, and add-ons. WhatsApp our experts for special requests.',
            image: 'https://www.ylootrips.com/og-image.jpg',
          },
          {
            name: 'Book & Pay Securely',
            text: 'Pay just 25% deposit to confirm your booking. The balance is due 30 days before travel. UPI, cards, EMI, and bank transfer accepted.',
            image: 'https://www.ylootrips.com/og-image.jpg',
          },
        ]}
      />

      <div className="bg-[#F5F1EB] min-h-full">

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative -mt-14 h-[72vw] min-h-[300px] max-h-[420px] overflow-hidden">
          <video
            autoPlay muted loop playsInline preload="auto"
            poster="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=60"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-ocean.mp4" type="video/mp4" />
            <Image
              src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=85"
              alt="India travel destinations — Bali, Kashmir, Dubai, Maldives"
              fill className="object-cover" priority
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-teal-900/20 to-black/85" />
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-7">
            <p className="text-[#F5753A] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
              Trusted by 25,000+ travellers
            </p>
            <h1 className="font-playfair text-white text-[2rem] leading-[1.1] font-semibold mb-3">
              India & International<br />Tour Packages
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-white/80 text-[11px] font-semibold">4.9 · 2,400+ verified reviews</span>
            </div>
          </div>
        </section>

        {/* ── SEARCH BAR ─────────────────────────────────────────────────── */}
        <section className="px-4 -mt-5 relative z-10">
          <Link href="/trip-planner" className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-xl border border-gray-100 active:scale-[0.98] transition-transform">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
              <Sparkles size={17} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">YLOO AI Trip Planner</p>
              <p className="text-sm font-semibold text-gray-700 truncate">Where would you like to go?</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <ChevronRight size={15} className="text-gray-500" />
            </div>
          </Link>
        </section>

        {/* ── QUICK ACTIONS ──────────────────────────────────────────────── */}
        <section className="px-4 mt-5">
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href, bg, iconColor }) => (
              <Link key={href + label} href={href} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-md`}>
                  <Icon size={24} className={iconColor} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{label}</p>
                  <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── TRUST STRIP ────────────────────────────────────────────────── */}
        <section className="mx-4 mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-4">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`flex flex-col items-center justify-center py-4 ${i < 3 ? 'border-r border-gray-100' : ''}`}>
                <span className="text-base font-black text-gray-900 leading-tight">{value}</span>
                <span className="text-[9px] font-semibold text-gray-400 mt-0.5 text-center leading-tight px-1">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED DESTINATIONS (interactive — client component) ─────── */}
        <HomeDestinations />

        {/* ── WHY YLOO ───────────────────────────────────────────────────── */}
        <section className="mt-8 px-4">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Why Choose Us</p>
            <h2 className="font-playfair text-2xl text-gray-900 font-semibold leading-tight">
              Built on trust,<br />backed by experts
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TRUST_PILLARS.map(({ icon: Icon, title, sub, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={color} />
                </div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
                <p className="text-[11px] text-gray-400 mt-1 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-gray-900 rounded-2xl px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">100% Money-Back Guarantee</p>
              <p className="text-white/60 text-[11px] mt-0.5">Free cancellation up to 14 days before travel</p>
            </div>
          </div>
        </section>

        {/* ── AI PLANNER PROMO ───────────────────────────────────────────── */}
        <section className="mt-6 mx-4">
          <Link href="/trip-planner" className="relative block overflow-hidden rounded-3xl active:scale-[0.98] transition-transform">
            <Image
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
              alt="AI Trip Planner — plan your holiday in 30 seconds"
              width={800} height={340}
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-5">
              <div className="inline-flex items-center gap-1.5 bg-amber-500 rounded-full px-3 py-1 self-start mb-2">
                <Sparkles size={11} className="text-white" />
                <span className="text-white text-[10px] font-black uppercase tracking-wider">Free · AI Powered</span>
              </div>
              <h3 className="font-playfair text-white text-xl font-semibold leading-tight mb-1">
                Plan your perfect<br />trip in 30 seconds
              </h3>
              <p className="text-white/70 text-[11px]">Powered by YLOO AI</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-white text-xs font-bold">Try free now</span>
                <ArrowRight size={14} className="text-white" />
              </div>
            </div>
          </Link>
        </section>

        {/* ── REVIEWS ────────────────────────────────────────────────────── */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4 px-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Social Proof</p>
              <h2 className="font-playfair text-2xl text-gray-900 font-semibold leading-tight">
                Real stories,<br />real travellers
              </h2>
            </div>
            <Link href="/reviews" className="text-xs font-bold text-gray-500 underline underline-offset-2">
              2,400+ reviews
            </Link>
          </div>
          <InternationalTestimonials />
        </section>

        {/* ── CERTIFICATIONS ─────────────────────────────────────────────── */}
        <section className="mt-8 mx-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">
            Verified & Certified
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '🏛️', title: 'MSME',      sub: 'Govt. Registered'  },
              { icon: '🔒', title: 'SSL 256-bit', sub: 'End-to-end secure' },
              { icon: '💳', title: 'PCI-DSS',     sub: 'Payment certified' },
              { icon: '📋', title: 'GST Reg.',    sub: 'Tax compliant'     },
              { icon: '⭐', title: 'ISO Rated',   sub: '4.9 / 5.0'        },
              { icon: '🛡️', title: 'Insured',    sub: 'Licensed ops'      },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <span className="text-2xl mb-1">{icon}</span>
                <p className="text-[11px] font-bold text-gray-900">{title}</p>
                <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONCIERGE CTA ──────────────────────────────────────────────── */}
        <section className="mt-6 mx-4 mb-6">
          <div className="bg-gray-900 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <Image
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=60"
                alt="" fill className="object-cover"
              />
            </div>
            <div className="relative px-5 py-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0">
                  <HeadphonesIcon size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-playfair text-lg font-semibold leading-tight">
                    Speak to your<br />travel expert
                  </p>
                  <p className="text-white/60 text-[11px] mt-1">Response guaranteed in 1 hour</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="flex -space-x-2">
                  {['photo-1500648767791-00dcc994a43e','photo-1580489944761-15a19d654956','photo-1570295999919-56ceb5ecca61'].map((id, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 overflow-hidden">
                      <Image src={`https://images.unsplash.com/${id}?w=80&q=80`} alt="Travel expert" width={32} height={32} className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white text-xs font-bold">50+ Travel Experts</p>
                  <p className="text-white/50 text-[10px]">Available right now</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/contact" className="flex-1 bg-amber-500 rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                  <MessageCircle size={16} className="text-white" />
                  <span className="text-white text-sm font-bold">WhatsApp Us</span>
                </Link>
                <Link href="/contact" className="flex-1 bg-white/10 border border-white/20 rounded-2xl py-3.5 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                  <Phone size={16} className="text-white" />
                  <span className="text-white text-sm font-bold">Call Now</span>
                </Link>
              </div>
              <p className="text-white/40 text-[10px] text-center mt-3 font-medium">
                +91 84278 31127 · hello@ylootrips.com
              </p>
            </div>
          </div>
        </section>

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        <section className="px-4 mb-8">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Everything You Need</p>
            <h2 className="font-playfair text-2xl text-gray-900 font-semibold">Our Services</h2>
          </div>
          <div className="space-y-3">
            {[
              { icon: Calendar,  label: 'Custom Itineraries', sub: 'Tailored to your style, pace & budget',  href: '/contact', color: 'bg-indigo-100 text-indigo-600' },
              { icon: Plane,     label: 'Flight Bookings',    sub: 'Best fares across 50+ airlines',         href: '/flights', color: 'bg-blue-100 text-blue-600'   },
              { icon: Hotel,     label: 'Hotel Reservations', sub: '200+ curated properties across India',   href: '/hotels',  color: 'bg-amber-100 text-amber-600' },
              { icon: Users,     label: 'Group Travel',       sub: 'Corporate & group trips — 20% off',      href: '/contact', color: 'bg-emerald-100 text-emerald-600' },
            ].map(({ icon: Icon, label, sub, href, color }) => (
              <Link key={label} href={href} className="flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={19} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{sub}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
