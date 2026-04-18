import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, Award, Globe, Heart, TrendingUp, Shield, Zap, Star, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About YlooTrips — India\'s Fastest-Growing Travel Platform',
  description: 'YlooTrips is India\'s next-gen travel platform — 25,000+ travelers, 4.9★ Google rating, MSME certified. Meet our founder and learn our vision to make premium travel accessible to every Indian.',
  keywords: 'about YlooTrips, India travel startup, best India travel agency, trusted India tour operator, travel tech India',
  openGraph: {
    title: 'About YlooTrips | India\'s Next-Gen Travel Platform',
    description: '25,000+ happy travelers, 4.9★ Google rating. Making premium travel accessible to every Indian.',
    url: 'https://www.ylootrips.com/about',
    images: [{ url: 'https://www.ylootrips.com/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/about' },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'About', url: 'https://www.ylootrips.com/about' },
      ]} />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gray-950">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80"
            alt="India travel"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/40 to-gray-950" />
        </div>
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-8 pb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Our Story</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            We&apos;re building India&apos;s
            <br />
            <span className="italic text-white/80">
              travel-tech future
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            YlooTrips was built on one belief — every Indian deserves a world-class travel experience without overpaying or compromising on trust.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            {[
              { value: '25,000+', label: 'Happy Travelers' },
              { value: '4.9★', label: 'Google Rating' },
              { value: '150+', label: 'Destinations' },
              { value: '₹0', label: 'Hidden Fees' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4">
                <div className="text-2xl md:text-3xl font-black text-white">{s.value}</div>
                <div className="text-white/50 text-xs font-medium mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKET OPPORTUNITY ── */}
      <section className="py-6 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">The Opportunity</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-6">
                India&apos;s travel market is
                <br />
                <span className="italic">growing.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                India&apos;s travel & tourism market is projected to reach <strong className="text-gray-800">$250 billion by 2030</strong>. Domestic travel alone crossed <strong className="text-gray-800">2.3 billion trips in 2023</strong>. Yet most Indians still overpay, get cheated, or settle for cookie-cutter packages. We&apos;re here to change that.
              </p>

              <div className="space-y-4">
                {[
                  { stat: '$250B', desc: 'India travel market by 2030 (CAGR 12%)', icon: TrendingUp },
                  { stat: '2.3B+', desc: 'Domestic trips taken in India in 2023', icon: MapPin },
                  { stat: '$27B', desc: 'Online travel bookings by 2028 in India', icon: Globe },
                  { stat: '70%', desc: 'Travelers prefer transparent pricing over brand', icon: Shield },
                ].map(({ stat, desc, icon: Icon }) => (
                  <div key={stat} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gray-600" />
                    </div>
                    <div>
                      <span className="font-black text-gray-900 text-lg">{stat}</span>
                      <span className="text-gray-500 text-sm ml-2">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Why YlooTrips Wins</p>
                <div className="space-y-5">
                  {[
                    { title: 'No Hidden Costs', desc: 'Price shown = price paid. Always.', icon: '✅' },
                    { title: 'Real Human Support', desc: '1-hour response, 7 days a week. Not bots.', icon: '🧑‍💼' },
                    { title: 'AI-Powered Planning', desc: 'Smart trip builder + Yloo AI assistant.', icon: '🤖' },
                    { title: '10% Cashback', desc: 'WanderLoot rewards on every booking.', icon: '💰' },
                    { title: 'EMI Options', desc: '0% cost EMI — travel now, pay later.', icon: '📆' },
                    { title: 'Verified Reviews', desc: '4.9★ from 2,400+ real travelers.', icon: '⭐' },
                  ].map(({ title, desc, icon }) => (
                    <div key={title} className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section className="py-6 bg-gray-950">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-6">

              {/* Photo */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                  <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    {/* REPLACE with actual founder photo: /founder.jpg */}
                    <Image
                      src="/founder.jpg"
                      alt="Vinay Arora — Founder & CEO, YlooTrips"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-gray-900 text-white rounded-2xl px-4 py-2 shadow-lg">
                    <p className="text-xs font-black uppercase tracking-wider">Founder & CEO</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Meet the Founder</p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-2">
                  Vinay Arora
                </h2>
                <p className="text-white/60 font-semibold text-lg mb-6">Founder & CEO, YlooTrips</p>

                <div className="space-y-4 text-gray-300 text-base leading-relaxed">
                  <p>
                    Vinay started YlooTrips after experiencing firsthand how broken India&apos;s travel industry was — opaque pricing, unreliable operators, and zero post-booking support. He believed technology could fix this.
                  </p>
                  <p>
                    &ldquo;I want every Indian to travel more. Not less. And to do that, we need to make the experience trustworthy, affordable, and genuinely exciting — from the moment you search to the moment you return home.&rdquo;
                  </p>
                  <p>
                    Today, YlooTrips serves 25,000+ travelers with a team that lives and breathes travel — combining AI-powered tools with a deeply human touch.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-8">
                  {['New Delhi, India', 'Travel Tech', 'Ex-Traveler Turned Builder'].map((tag) => (
                    <span key={tag} className="bg-white/5 border border-white/10 text-white/70 text-xs font-medium px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <a
                    href="https://www.instagram.com/ylootrips/"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61574908545709"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-6 bg-gray-950">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">Our North Star</p>
            <h2 className="font-display text-3xl md:text-5xl text-white leading-tight">
              Vision &amp; Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Vision */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <span className="text-2xl">🔭</span>
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Vision</p>
              <h3 className="text-white font-display text-2xl mb-4 leading-tight">
                Make India the world&apos;s most explored travel destination.
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                By 2030, we envision YlooTrips as the platform of choice for every traveler — domestic and international — seeking authentic, premium, and transparent travel experiences across India and beyond.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Mission</p>
              <h3 className="text-white font-display text-2xl mb-4 leading-tight">
                Democratize premium travel for every Indian.
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Deliver world-class travel experiences at honest prices — powered by technology, built on trust, and driven by a team that genuinely loves travel. No hidden fees. No compromises. Ever.
              </p>
            </div>
          </div>

          {/* 3 pillars */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            {[
              { icon: '🤝', title: 'Trust First', desc: 'Every decision we make starts with "would our traveler trust this?"' },
              { icon: '💡', title: 'Tech-Enabled', desc: 'AI planning tools, real-time support, and seamless booking — all in one.' },
              { icon: '🌍', title: 'Impact Driven', desc: 'Supporting local guides, eco-friendly stays, and responsible tourism.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center">
                <span className="text-3xl">{icon}</span>
                <p className="text-white font-bold mt-3 mb-1">{title}</p>
                <p className="text-white/65 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-6 bg-gray-950">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="font-display text-3xl md:text-4xl text-white">Built year by year.</h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-white/15 to-transparent" />
            <div className="space-y-8">
              {[
                { year: '2022', event: 'Founded — Weekend Trips', detail: 'YlooTrips launched with curated weekend getaways across India. Manali, Goa, Coorg, Rishikesh — affordable, transparent, zero hidden fees.', icon: '🏕️' },
                { year: '2022', event: 'Hotel Booking Added', detail: 'Expanded to hotel search and booking — boutique stays, homestays, and handpicked properties across 50+ Indian destinations.', icon: '🏨' },
                { year: '2023', event: 'Flights + Full Packages', detail: 'Launched flight search and end-to-end holiday packages. Domestic multi-city tours with hotel + transport + sightseeing all-inclusive.', icon: '✈️' },
                { year: '2023', event: 'International Packages', detail: 'Expanded beyond India — Dubai, Bali, Singapore, Thailand, Maldives. Premium international packages with visa assistance and full support.', icon: '🌏' },
                { year: '2024', event: 'Events Platform Launched', detail: 'Launched ticketing for concerts, experiences, and curated travel events. 10,000+ travelers milestone. WanderLoot cashback wallet introduced.', icon: '🎉' },
                { year: '2025', event: 'Major Events + MSME Certified', detail: 'Large-scale event management — corporate trips, group travel, destination weddings. MSME certified by Govt. of India. 25,000+ travelers served.', icon: '🏅' },
                { year: '2026', event: 'AI Trip Planner + Scale', detail: 'Launched Yloo AI — smart trip planner powered by AI. Growing 3x YoY. Target: ₹50Cr+ bookings, Series A expansion.', icon: '🤖' },
              ].map(({ year, event, detail, icon }, i) => (
                <div key={`${year}-${i}`} className={`flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 pb-2 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                    <span className="text-white/40 text-xs font-black uppercase tracking-widest">{year}</span>
                    <h3 className="text-white font-bold text-lg mt-1">{event}</h3>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">{detail}</p>
                  </div>
                  {/* Icon node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 bg-gray-800 border-2 border-white/20 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-black/20">
                    {icon}
                  </div>
                  {/* Spacer for right side on desktop */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-6 bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Our DNA</p>
            <h2 className="font-display text-3xl md:text-4xl text-gray-900">What we stand for</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, title: 'Traveler First', desc: 'Every feature, every policy, every decision — we ask "is this good for our traveler?"', color: 'text-rose-500 bg-rose-50' },
              { icon: Shield, title: 'Radical Transparency', desc: 'Price shown = price paid. No surprises at checkout. No hidden hotel charges.', color: 'text-blue-500 bg-blue-50' },
              { icon: Zap, title: 'Move Fast', desc: 'We ship new features weekly. Our travelers\' needs evolve — so do we.', color: 'text-gray-600 bg-gray-100' },
              { icon: Globe, title: 'Real Impact', desc: 'We support local guides, eco stays, and responsible travel practices.', color: 'text-green-500 bg-green-50' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:shadow-lg transition-shadow duration-300 group">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNATIONAL VISITORS ── */}
      <section className="py-6 bg-gray-950 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-500/30 rounded-full px-4 py-1.5 mb-5">
              <span className="text-lg">🌍</span>
              <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">For International Travelers</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-white leading-tight mb-4">
              Explore India with a guide
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">you can actually trust.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              India is breathtaking — but navigating it alone can be overwhelming. YlooTrips gives international travelers a seamless, safe, and unforgettable India experience.
            </p>
          </div>

          {/* Why India + Why YlooTrips */}
          <div className="grid grid-cols-1 gap-5 mb-6">
            {/* Why India */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="text-3xl mb-4">🇮🇳</div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Why India?</p>
              <h3 className="text-white font-display text-2xl mb-4">The world&apos;s most diverse travel destination</h3>
              <div className="space-y-3">
                {[
                  { icon: '🏔️', text: 'Himalayas to tropical beaches — 5000+ years of history in one country' },
                  { icon: '🍛', text: 'World-class cuisine across 29 states, each with a unique flavor' },
                  { icon: '🏛️', text: '40+ UNESCO World Heritage Sites — more than most entire continents' },
                  { icon: '🐯', text: 'Tiger safaris, desert dunes, backwater houseboats — all in one trip' },
                  { icon: '💰', text: 'Premium experiences at a fraction of European or American costs' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <p className="text-white/70 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services for intl travelers */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl p-8">
              <div className="text-3xl mb-4">✈️</div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">We Handle Everything</p>
              <h3 className="text-white font-display text-2xl mb-4">End-to-end support for international guests</h3>
              <div className="space-y-3">
                {[
                  { icon: '📄', title: 'Visa Assistance', desc: 'India e-Visa guidance and documentation support' },
                  { icon: '🚗', title: 'Airport Transfers', desc: 'Meet & greet service, AC cab from airport to hotel' },
                  { icon: '🗣️', title: 'English-Speaking Guides', desc: 'Certified local guides fluent in English, French, German' },
                  { icon: '💳', title: 'International Payments', desc: 'USD, EUR, GBP accepted — Visa, Mastercard, PayPal' },
                  { icon: '📞', title: '24/7 Concierge', desc: 'WhatsApp support throughout your India journey' },
                  { icon: '🏨', title: 'Curated Stays', desc: 'From heritage havelis to 5-star resorts — all vetted' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{title}</p>
                      <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Countries served */}
          <div className="mb-14">
            <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Travelers We&apos;ve Hosted From</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { flag: '🇺🇸', country: 'USA' },
                { flag: '🇬🇧', country: 'UK' },
                { flag: '🇦🇺', country: 'Australia' },
                { flag: '🇨🇦', country: 'Canada' },
                { flag: '🇩🇪', country: 'Germany' },
                { flag: '🇫🇷', country: 'France' },
                { flag: '🇦🇪', country: 'UAE' },
                { flag: '🇸🇬', country: 'Singapore' },
                { flag: '🇯🇵', country: 'Japan' },
                { flag: '🇳🇿', country: 'New Zealand' },
                { flag: '🇮🇹', country: 'Italy' },
                { flag: '🇳🇱', country: 'Netherlands' },
              ].map(({ flag, country }) => (
                <div key={country} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <span className="text-lg">{flag}</span>
                  <span className="text-white/70 text-sm font-medium">{country}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signals for foreign visitors */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {[
              { icon: '🛡️', title: 'Safe & Verified', desc: 'All accommodations and transport operators are personally vetted. We never compromise on traveler safety.', color: 'border-green-500/20 bg-green-500/5' },
              { icon: '📸', title: 'No Surprises', desc: 'Every itinerary detail, hotel name, and inclusion is disclosed upfront. What you see is exactly what you get.', color: 'border-blue-500/20 bg-blue-500/5' },
              { icon: '🌐', title: 'Global Standards', desc: 'We\'ve designed our platform and service for international travelers — English-first, global payments, 24/7 support.', color: 'border-purple-500/20 bg-purple-500/5' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className={`rounded-3xl border p-6 text-center ${color}`}>
                <div className="text-4xl mb-4">{icon}</div>
                <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* International CTA */}
          <div className="text-center">
            <p className="text-white/40 text-sm mb-5">Ready to experience incredible India?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918427831127?text=Hi!%20I%27m%20an%20international%20traveler%20interested%20in%20visiting%20India%20with%20YlooTrips."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-colors shadow-xl shadow-green-500/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Our Team
              </a>
              <Link
                href="/destinations/international"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider hover:opacity-90 transition-opacity shadow-xl shadow-blue-500/20"
              >
                View India Packages <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-10 bg-gray-50 border-y border-gray-100">
        <div className="section-container">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Verified &amp; Trusted</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { label: '🏛 Govt. of India', sub: 'Licensed Travel Company' },
              { label: '📜 MSME Certified', sub: 'Ministry of MSME' },
              { label: '🧾 GST Registered', sub: 'Tax-Compliant Business' },
              { label: '🔒 PCI-DSS Compliant', sub: 'Secure Payment Processing' },
              { label: '⭐ 4.9 Google Rating', sub: '2,400+ Verified Reviews' },
            ].map(({ label, sub }) => (
              <div key={label} className="flex flex-col items-center px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="font-bold text-sm text-gray-800">{label}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-6 bg-gray-950">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Team Online · Responds in &lt;1 hr</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-white mb-4">
            Let&apos;s plan your dream trip.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            No bots. No templates. Real travel experts who answer fast — 7 days a week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918427831127?text=Hi%2C+I+want+to+plan+a+trip+with+YlooTrips"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-colors shadow-xl shadow-green-500/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
            <Link
              href="/trip-planner"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-xl shadow-black/20"
            >
              Plan with AI <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
