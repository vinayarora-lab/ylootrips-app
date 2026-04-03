import { MessageCircle, FileText, Luggage, Compass } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: MessageCircle,
    title: 'Tell us your dream',
    description: "Fill out our quick form or drop us a WhatsApp. Tell us your travel style, budget, dates, and destinations on your bucket list. We listen carefully.",
  },
  {
    number: '02',
    icon: FileText,
    title: 'Get a custom itinerary',
    description: "Within 24 hours, you'll receive a detailed day-by-day itinerary — handcrafted for you. Adjust anything until it's perfect. No generic templates.",
  },
  {
    number: '03',
    icon: Luggage,
    title: 'We handle everything',
    description: "Hotels, transfers, guides, entry tickets, visa tips, and 24/7 on-trip support. You confirm, we book. Simple, transparent pricing with no hidden fees.",
  },
  {
    number: '04',
    icon: Compass,
    title: 'You enjoy India',
    description: "Land in India and your private car is waiting. Your guide knows your name. Every detail is ready. All you do is explore, eat, and make memories.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-cream">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
            The Process
          </p>
          <h2 className="font-display text-display-lg text-primary">
            Your India trip in <span className="italic">4 easy steps</span>
          </h2>
          <p className="mt-4 text-primary/60 text-body-sm max-w-xl mx-auto">
            We&apos;ve helped 25,000+ travelers navigate India effortlessly. Here&apos;s how it works.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-primary/10" aria-hidden="true" />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative flex flex-col items-start md:items-center text-left md:text-center gap-4">
              {/* Icon circle */}
              <div className="relative w-20 h-20 rounded-full bg-cream-dark border-2 border-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-8 h-8 text-secondary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center font-display">
                  {number}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl text-primary mb-2">{title}</h3>
                <p className="text-primary/60 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-primary">
            Start Planning Now
          </Link>
          <a
            href="https://wa.me/918427831127?text=Hi!%20I%27d%20like%20to%20plan%20an%20India%20trip.%20Can%20you%20help?"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            WhatsApp Us Directly
          </a>
        </div>

        {/* Avg response time badge */}
        <p className="text-center text-caption text-primary/40 mt-4 uppercase tracking-wider">
          ⏱ Avg. reply time: under 1 hour · 7 days a week
        </p>
      </div>
    </section>
  );
}
