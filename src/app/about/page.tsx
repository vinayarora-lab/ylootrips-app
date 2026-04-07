import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, Award, Globe, Heart } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About YlooTrips — India\'s Trusted Travel Experts Since 2012',
  description: 'YlooTrips India Pvt. Ltd. has been crafting bespoke India journeys since 2012. 25,000+ happy travelers, 4.9-star Google rating, and expert guides who know every hidden gem. Learn our story.',
  keywords: 'about YlooTrips, India travel company, best India travel agency, trusted India tour operator, India travel experts, New Delhi travel agency',
  openGraph: {
    title: 'About YlooTrips | India\'s Trusted Travel Experts Since 2012',
    description: 'Crafting bespoke India journeys since 2012. 25,000+ happy travelers, 4.9★ Google rating (2,400+ reviews). Based in New Delhi.',
    url: 'https://www.ylootrips.com/about',
    images: [
      {
        url: 'https://www.ylootrips.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YlooTrips team — India travel experts since 2012',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About YlooTrips | India\'s Trusted Travel Experts Since 2012',
    description: 'Crafting bespoke India journeys since 2012. 25,000+ happy travelers, 4.9★ rated.',
    images: ['https://www.ylootrips.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/about' },
};

const values = [
  {
    icon: Heart,
    title: 'Authentic Experiences',
    description: 'We believe in meaningful connections with local cultures, not tourist traps.',
  },
  {
    icon: Globe,
    title: 'Sustainable Travel',
    description: 'Every journey we craft considers its impact on communities and environments.',
  },
  {
    icon: Users,
    title: 'Personal Touch',
    description: 'Each trip is tailored to your unique preferences and travel style.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We partner only with the finest guides, hotels, and experiences.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'About', url: 'https://www.ylootrips.com/about' },
      ]} />

      {/* Hero */}
      <PageHero
        title="Our Story"
        subtitle="Born in New Delhi. Built on trust. Since 2012, we've guided 25,000+ travelers across India's most extraordinary destinations."
        breadcrumb="About"
      />

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                  Our Philosophy
                </p>
                <h2 className="font-display text-display-lg text-primary">
                  Travel changes us.
                  <br />
                  <span className="italic">For the better.</span>
                </h2>
              </div>
              <p className="text-primary/70 text-body-lg leading-relaxed">
                Founded in New Delhi in 2012, YlooTrips began with a conviction that India&apos;s most extraordinary experiences aren&apos;t in guidebooks — they&apos;re in the conversations, the meals, the detours. We&apos;ve spent over a decade building a network of India&apos;s finest local guides, inspected boutique hotels, and trusted partners who share our belief in real, unhurried travel.
              </p>
              <p className="text-primary/70 text-body-lg leading-relaxed">
                Today, we hold MSME certification from the Government of India, serve travelers from 40+ countries, and maintain a 4.9-star Google rating across 2,400+ verified reviews. Every itinerary is hand-crafted by a human — never a template.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6">
                {[
                  { value: '12+', label: 'Years' },
                  { value: '150+', label: 'Destinations' },
                  { value: '25K+', label: 'Travelers' },
                  { value: '98%', label: 'Satisfaction' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-display text-2xl md:text-3xl text-secondary">{stat.value}</div>
                    <div className="text-caption uppercase tracking-widest text-primary/50 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[380px] sm:h-[450px] md:h-[550px] lg:h-[600px]">
              <div className="absolute top-0 right-0 w-3/4 h-2/3 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80"
                  alt="Taj Mahal at sunrise — iconic India travel experience with YlooTrips"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-2/3 h-1/2 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80"
                  alt="Vibrant Rajasthani cultural festival — authentic India immersion with YlooTrips"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Milestones Section */}
      <section className="py-16 md:py-20 bg-primary text-cream">
        <div className="section-container">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4 text-center">Our Journey</p>
          <h2 className="font-display text-display-lg text-cream text-center mb-12">12 years of extraordinary journeys</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-cream/15" />
            {[
              { year: '2012', event: 'Founded in New Delhi', icon: '🏛' },
              { year: '2015', event: 'First 1,000 travelers served', icon: '🎯' },
              { year: '2019', event: 'MSME Certified · GST Registered', icon: '🏅' },
              { year: '2024', event: '25,000+ travelers · 40+ countries', icon: '🌏' },
            ].map(({ year, event, icon }) => (
              <div key={year} className="text-center relative">
                <div className="w-16 h-16 bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-4 text-2xl rounded-full">
                  {icon}
                </div>
                <div className="font-display text-2xl text-accent mb-1">{year}</div>
                <p className="text-cream/60 text-sm">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 bg-cream-dark">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
              What We Believe
            </p>
            <h2 className="font-display text-display-lg text-primary">
              Our guiding principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-cream p-8 text-center group hover:shadow-xl transition-shadow duration-500">
                <div className="w-16 h-16 mx-auto mb-6 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <value.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-display text-xl text-primary mb-3">{value.title}</h3>
                <p className="text-primary/60 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications / Trust Section */}
      <section className="py-12 md:py-16 bg-cream border-y border-primary/8">
        <div className="section-container">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-8 text-center">Verified &amp; Trusted</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { label: 'Govt. of India Registered', sub: 'Licensed Travel Company' },
              { label: 'MSME Certified', sub: 'Ministry of MSME, India' },
              { label: 'GST Registered', sub: 'Tax-compliant business' },
              { label: 'PCI-DSS Compliant', sub: 'Secure payment processing' },
              { label: '4.9★ Google Rating', sub: '2,400+ verified reviews' },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center px-4 py-4 border border-primary/10 bg-cream-dark min-w-[140px]">
                <div className="text-sm font-semibold text-primary mb-0.5">{label}</div>
                <div className="text-[10px] text-primary/45 uppercase tracking-wider">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">Let&apos;s Travel Together</p>
          <h2 className="font-display text-display-lg mb-4">Ready to see India the right way?</h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Our travel specialists respond in under 1 hour, 7 days a week. No bots, no templates — just expert advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/918427831127?text=Hi%2C+I+read+about+YlooTrips+and+want+to+plan+a+trip"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all">
              Plan My Trip <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}