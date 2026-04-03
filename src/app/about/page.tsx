import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, Award, Globe, Heart } from 'lucide-react';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'About YlooTrips — India\'s Trusted Travel Experts Since 2012',
  description: 'YlooTrips has been crafting bespoke India journeys since 2012. 25,000+ happy travelers, 98% satisfaction rate, and guides who know every hidden gem. Learn our story.',
  keywords: 'about YlooTrips, India travel company, best India travel agency, trusted India tour operator, India travel experts',
  openGraph: {
    title: 'About YlooTrips | India\'s Trusted Travel Experts',
    description: 'Crafting bespoke India journeys since 2012. 25,000+ happy travelers, 98% satisfaction rate.',
    url: 'https://www.ylootrips.com/about',
  },
  alternates: { canonical: 'https://www.ylootrips.com/about' },
};

const team = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Former National Geographic explorer with 15 years of travel experience.',
  },
  {
    name: 'Marcus Williams',
    role: 'Head of Experiences',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Adventure enthusiast who has traveled to over 80 countries.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: 'Visual storyteller passionate about capturing authentic moments.',
  },
  {
    name: 'James Nakamura',
    role: 'Partnerships Lead',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: 'Building relationships with local communities worldwide.',
  },
];

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
      {/* Hero */}
      <PageHero
        title="Our Story"
        subtitle="We're a team of passionate travelers dedicated to crafting transformative journeys that connect you with the world's most extraordinary places and people."
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
                Founded in 2012, YlooTrips began with a simple belief: the best travel experiences
                happen when you move beyond the familiar and embrace the unknown. We&apos;ve spent
                over a decade perfecting the art of crafting journeys that transform, inspire, and
                connect travelers with the soul of each destination.
              </p>
              <p className="text-primary/70 text-body-lg leading-relaxed">
                Today, we work with a carefully curated network of local experts, boutique properties,
                and sustainable operators who share our vision of responsible, immersive travel.
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
                  alt="Travel experience"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-2/3 h-1/2 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80"
                  alt="Cultural immersion"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
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

      {/* Team Section */}
      {/* <section className="py-24 md:py-32 bg-cream">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
              The Team
            </p>
            <h2 className="font-display text-display-lg text-primary">
              Meet the dreamers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="relative aspect-portrait overflow-hidden mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <h3 className="font-display text-xl text-primary mb-1">{member.name}</h3>
                <p className="text-caption uppercase tracking-widest text-secondary mb-3">{member.role}</p>
                <p className="text-primary/60 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Let&apos;s create something extraordinary together.
          </p>
          <Link href="/contact" className="btn-primary bg-accent text-primary hover:bg-accent-warm">
            <span>Get in Touch</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}