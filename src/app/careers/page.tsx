import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Clock, Heart, Globe, Users, Briefcase } from 'lucide-react';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Careers at YlooTrips — Join India\'s Travel Experts',
  description: 'Join YlooTrips India Pvt. Ltd. and help craft extraordinary journeys for travelers from 40+ countries. Based in New Delhi. View open positions.',
  alternates: { canonical: 'https://www.ylootrips.com/careers' },
};

const perks = [
  {
    icon: Globe,
    title: 'Travel the Country',
    desc: 'Explore India\'s destinations firsthand. We believe our team should experience what we sell.',
  },
  {
    icon: Heart,
    title: 'Meaningful Work',
    desc: 'Every booking you handle transforms someone\'s life. That\'s not a small thing.',
  },
  {
    icon: Users,
    title: 'Small, Close Team',
    desc: 'No corporate bureaucracy. Your ideas are heard, your growth is a priority.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    desc: 'We care about results, not clock-watching. Flexible work arrangements available.',
  },
];

const openings = [
  {
    title: 'Travel Consultant',
    type: 'Full-time',
    location: 'New Delhi (Hybrid)',
    desc: 'Design custom India itineraries, handle client enquiries via WhatsApp & email, and ensure every journey goes smoothly from first contact to safe return.',
    skills: ['1+ year travel industry experience', 'Excellent written English', 'Knowledge of Indian destinations', 'Customer-first mindset'],
  },
  {
    title: 'Digital Marketing Executive',
    type: 'Full-time',
    location: 'New Delhi / Remote',
    desc: 'Own our SEO, social media, and content strategy. Help more travelers find us and choose us over the competition.',
    skills: ['SEO & content writing', 'Instagram & Facebook management', 'Google Ads experience a plus', 'Passion for travel'],
  },
  {
    title: 'Operations Coordinator',
    type: 'Full-time',
    location: 'New Delhi',
    desc: 'Coordinate with hotels, guides, and transport partners to deliver seamless on-ground experiences for our travelers.',
    skills: ['Strong organisational skills', 'Vendor management experience', 'Problem-solving under pressure', 'Hindi & English fluency'],
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Work With Us"
        subtitle="We're a small team that does big things. If travel is your passion and excellence is your standard, let's talk."
        breadcrumb="Careers"
        backgroundImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-primary/60 via-primary/65 to-primary/90"
      />

      {/* Why join us */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Why YlooTrips</p>
            <h2 className="font-display text-display-lg text-primary">
              A place where travel <span className="italic">matters</span>
            </h2>
            <p className="text-primary/55 text-body-sm max-w-xl mx-auto mt-4">
              Based in New Delhi, we serve travelers from 40+ countries. Our team is small, our standards are high, and our culture is built on trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-cream-light border border-primary/8 p-7 text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-secondary/20 transition-colors">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display text-lg text-primary mb-2">{title}</h3>
                <p className="text-sm text-primary/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="section-container">
          <div className="mb-12">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Open Positions</p>
            <h2 className="font-display text-display-lg text-primary">Current openings</h2>
          </div>

          <div className="space-y-5">
            {openings.map((job) => (
              <div key={job.title} className="bg-cream border border-primary/8 p-6 md:p-8 hover:shadow-md transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-xl md:text-2xl text-primary">{job.title}</h3>
                      <span className="px-3 py-1 bg-accent/15 text-primary text-[10px] uppercase tracking-widest font-medium">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary/50 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <a
                    href={`mailto:connectylootrips@gmail.com?subject=Application: ${encodeURIComponent(job.title)}&body=Hi YlooTrips team,%0A%0AI'd like to apply for the ${encodeURIComponent(job.title)} position.%0A%0A[Please attach your resume]`}
                    className="shrink-0 inline-flex items-center gap-2 bg-primary text-cream px-6 py-3 text-sm uppercase tracking-widest hover:bg-secondary transition-colors"
                  >
                    Apply Now <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-primary/65 text-sm leading-relaxed mb-5">{job.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 border border-primary/12 text-primary/60 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No matching role */}
      <section className="py-14 md:py-20 bg-cream">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center border border-primary/10 bg-cream-light p-8 md:p-12">
            <Briefcase className="w-10 h-10 text-primary/25 mx-auto mb-5" />
            <h3 className="font-display text-2xl text-primary mb-3">Don't see the right role?</h3>
            <p className="text-primary/60 text-sm leading-relaxed mb-7">
              We occasionally hire for guide, photography, and content roles. Send us your resume and tell us how you'd add value to the team.
            </p>
            <a
              href="mailto:connectylootrips@gmail.com?subject=General Application — YlooTrips&body=Hi YlooTrips team,%0A%0AI'd love to explore opportunities at YlooTrips.%0A%0A[Tell us about yourself and attach your resume]"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Send Open Application
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-cream">
        <div className="section-container text-center">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">New Delhi · Est. 2012</p>
          <h2 className="font-display text-display-lg mb-4">Join a team that loves what it does</h2>
          <p className="text-cream/55 text-body-sm max-w-lg mx-auto mb-8">
            25,000+ travelers helped. 4.9★ on Google. 98% satisfaction rate. We're proud of what we've built — come help us grow it.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all">
            Learn About Us <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
