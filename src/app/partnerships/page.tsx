import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Hotel, Map, Camera, Bus, CheckCircle2, MessageCircle } from 'lucide-react';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Partnerships — Work With YlooTrips',
  description: 'Partner with YlooTrips India Pvt. Ltd. — hotels, guides, transport providers, and travel agents. Join our network serving 25,000+ travelers from 40+ countries.',
  alternates: { canonical: 'https://www.ylootrips.com/partnerships' },
};

const partnerTypes = [
  {
    icon: Hotel,
    title: 'Hotels & Resorts',
    desc: 'Boutique properties, heritage havelis, eco-lodges, and luxury resorts. We personally inspect every property we recommend and send guests who are pre-briefed on what to expect.',
    benefits: ['Pre-vetted guests with confirmed bookings', 'Direct booking — no OTA commissions', 'Featured placement in our itineraries', 'Long-term relationship, not one-off deals'],
  },
  {
    icon: Map,
    title: 'Local Guides',
    desc: 'Knowledgeable, passionate, English-speaking guides who understand our standards for guest experience. We work with guides across all major Indian destinations.',
    benefits: ['Consistent bookings from international clients', 'Fair, transparent payment terms', 'Training on international traveler expectations', 'Part of a trusted, growing network'],
  },
  {
    icon: Bus,
    title: 'Transport Providers',
    desc: 'Well-maintained vehicles, professional drivers, and reliable service. We require AC vehicles, clean interiors, and GST-registered businesses.',
    benefits: ['Regular, predictable trip assignments', 'Clear route briefings in advance', 'Prompt payment on invoice', 'Long-term preferred vendor status'],
  },
  {
    icon: Camera,
    title: 'Travel Agents & Affiliates',
    desc: 'Travel agents, bloggers, and influencers who recommend YlooTrips to their clients or audiences. Earn referral commissions on confirmed bookings.',
    benefits: ['Competitive referral commission', 'Dedicated partner support contact', 'Real-time booking status updates', 'Co-branded marketing materials available'],
  },
];

const requirements = [
  'GST-registered business (or individual with PAN)',
  'Minimum 2 years of relevant operating experience',
  'Strong reviews or verifiable references',
  'Commitment to YlooTrips\' guest experience standards',
  'Responsiveness — replies within 4 hours during business hours',
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        title="Partner With Us"
        subtitle="We work with India's finest hotels, guides, and transport providers to deliver extraordinary experiences. If your standards match ours, let's build something together."
        breadcrumb="Partnerships"
        backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-secondary/50 via-primary/65 to-primary/90"
      />

      {/* Who we work with */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Partnership Types</p>
            <h2 className="font-display text-display-lg text-primary">
              Who we partner <span className="italic">with</span>
            </h2>
            <p className="text-primary/55 text-body-sm max-w-xl mx-auto mt-4">
              We serve 25,000+ travelers from 40+ countries. Our partners are the backbone of every experience we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerTypes.map(({ icon: Icon, title, desc, benefits }) => (
              <div key={title} className="bg-cream-light border border-primary/8 p-7 md:p-8 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-5">
                  <div className="shrink-0 w-11 h-11 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-primary mb-1">{title}</h3>
                    <p className="text-sm text-primary/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-primary/65">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-14 md:py-20 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3 text-center">Our Standards</p>
            <h2 className="font-display text-display-lg text-cream text-center mb-10">
              What we look for in partners
            </h2>
            <div className="space-y-3">
              {requirements.map((req) => (
                <div key={req} className="flex items-start gap-3 p-4 border border-white/10 bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-cream/75 text-sm">{req}</span>
                </div>
              ))}
            </div>
            <p className="text-cream/40 text-xs mt-6 text-center">
              We conduct due diligence on all partners before onboarding. Quality over quantity — always.
            </p>
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="py-14 md:py-20 bg-cream-dark">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Get Started</p>
            <h2 className="font-display text-display-lg text-primary mb-4">
              Ready to partner with us?
            </h2>
            <p className="text-primary/60 text-body-sm leading-relaxed mb-10 max-w-xl mx-auto">
              Send us a WhatsApp message or email introducing your business. Include your location, what you offer, and a link to your reviews or portfolio. We'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918427831127?text=Hi%2C+I'd+like+to+explore+a+partnership+with+YlooTrips.%0A%0ABusiness+name%3A+%0AType%3A+%0ALocation%3A+"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
              <a
                href="mailto:connectylootrips@gmail.com?subject=Partnership Enquiry — YlooTrips&body=Hi YlooTrips team,%0A%0AI'd like to explore a partnership.%0A%0ABusiness name:%0AType of partnership:%0ALocation:%0AWebsite / Reviews:%0A%0A[Tell us more about your business]"
                className="inline-flex items-center justify-center gap-2 border border-primary/20 text-primary hover:bg-primary hover:text-cream px-8 py-4 text-sm uppercase tracking-widest transition-all"
              >
                Send Email <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            <p className="text-primary/35 text-xs mt-6 uppercase tracking-widest">We respond within 24 hours · No spam</p>
          </div>
        </div>
      </section>

      {/* Bottom trust bar */}
      <section className="py-10 bg-cream border-t border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {[
              { value: '12+', label: 'Years operating' },
              { value: '500+', label: 'Partner network' },
              { value: '25K+', label: 'Travelers served' },
              { value: '40+', label: 'Source countries' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl text-secondary">{value}</div>
                <div className="text-caption text-primary/45 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
