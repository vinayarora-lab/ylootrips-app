import { Shield, Clock, Users, MapPin, Star, HeartHandshake } from 'lucide-react';

const stats = [
  { value: '12+', label: 'Years of Excellence', icon: Star },
  { value: '25,000+', label: 'Happy Travelers', icon: Users },
  { value: '98%', label: 'Satisfaction Rate', icon: HeartHandshake },
  { value: '150+', label: 'Destinations', icon: MapPin },
];

const reasons = [
  {
    icon: Shield,
    title: 'Fully Licensed & Insured',
    description: "Registered travel company with full liability coverage. Your trip is protected end-to-end — flights, hotels, and activities.",
  },
  {
    icon: Clock,
    title: 'Reply Within 1 Hour',
    description: "Our team is online 7 days a week. Send us a WhatsApp or email and get a real response from a travel expert — not a bot.",
  },
  {
    icon: MapPin,
    title: 'Truly Local Knowledge',
    description: "We're based in India. Our guides grew up in Rajasthan, Kerala, and the Himalayas. That insider knowledge makes every trip extraordinary.",
  },
  {
    icon: Users,
    title: 'Private & Small-Group Tours',
    description: "No crowded buses. Choose your style — private car + guide, or intimate small-group trips with like-minded travelers.",
  },
  {
    icon: Star,
    title: 'Handpicked Hotels',
    description: "Every hotel is personally inspected — from palace hotels in Jaipur to eco-lodges in Munnar. Quality guaranteed at every budget level.",
  },
  {
    icon: HeartHandshake,
    title: 'Flexible & Customisable',
    description: "Every itinerary is tailored to you. Change dates, add destinations, adjust the pace. We build what you dream.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-primary text-cream">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
            Why YlooTrips
          </p>
          <h2 className="font-display text-display-lg">
            India experts you can <span className="italic">actually trust</span>
          </h2>
          <p className="mt-4 text-cream/60 text-body-sm max-w-xl mx-auto">
            Trusted by travelers from the USA, UK, Australia, Germany, Canada, and 35+ more countries.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center border border-white/10 p-6 md:p-8">
              <Icon className="w-6 h-6 text-accent mx-auto mb-3" />
              <div className="font-display text-3xl md:text-4xl text-cream mb-1">{value}</div>
              <div className="text-caption uppercase tracking-widest text-cream/50">{label}</div>
            </div>
          ))}
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center mt-0.5">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-cream mb-2">{title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Country flags banner */}
        <div className="mt-14 md:mt-20 border-t border-white/10 pt-10 text-center">
          <p className="text-caption uppercase tracking-[0.25em] text-accent mb-5">
            Trusted by travelers from
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-3xl" role="list" aria-label="Countries our travelers come from">
            {['🇺🇸','🇬🇧','🇦🇺','🇨🇦','🇩🇪','🇫🇷','🇳🇱','🇯🇵','🇸🇬','🇨🇭','🇸🇪','🇳🇿','🇦🇹','🇮🇹','🇪🇸','🇮🇱','🇰🇷','🇺🇦','🇿🇦','🇧🇷'].map((f) => (
              <span key={f} role="listitem">{f}</span>
            ))}
          </div>
          <p className="text-cream/40 text-caption mt-4">+ 20 more countries</p>
        </div>
      </div>
    </section>
  );
}
