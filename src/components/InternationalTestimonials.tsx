import { Star, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const reviews = [
  {
    name: 'Sarah Mitchell',
    flag: '🇺🇸',
    country: 'San Francisco, USA',
    rating: 5,
    trip: '10-Day Golden Triangle',
    date: 'March 2024',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    text: "YlooTrips made our first India trip absolutely seamless. The day-by-day planning was flawless — Taj Mahal at sunrise, pink streets of Jaipur. Our guide spoke perfect English and knew stories about every monument. India is intense in the best way, and having experts handle logistics let us just soak it all in.",
  },
  {
    name: 'James & Emma Hargreaves',
    flag: '🇬🇧',
    country: 'London, UK',
    rating: 5,
    trip: '14-Day Kerala & South India',
    date: 'February 2024',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    text: "We were nervous about India's heat and logistics, but YlooTrips put our minds at ease completely. The Kerala houseboat was the most romantic two days of our lives. The team answered every WhatsApp within minutes — even for last-minute hotel changes. Five stars without hesitation.",
  },
  {
    name: 'Lachlan Burgess',
    flag: '🇦🇺',
    country: 'Melbourne, Australia',
    rating: 5,
    trip: '7-Day Rajasthan Heritage',
    date: 'January 2024',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&q=80',
    text: "Rajasthan blew my mind — the forts, camels, colours of Jodhpur. I came solo and felt completely safe and looked after the whole time. Accommodation was always boutique heritage properties. 100% booking YlooTrips again for Ladakh next year.",
  },
  {
    name: 'Katrin & Markus Berger',
    flag: '🇩🇪',
    country: 'Munich, Germany',
    rating: 4,
    trip: '10-Day Golden Triangle',
    date: 'November 2023',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=120&q=80',
    text: "The team communicated in excellent English throughout, and every hotel was better than expected. The private car and driver made all the difference — comfortable, safe, and we stopped wherever we wanted for photos. We wish we had one more day in Varanasi, hence 4 stars, but overall a wonderful experience.",
  },
  {
    name: 'Priya Sharma',
    flag: '🇨🇦',
    country: 'Toronto, Canada',
    rating: 5,
    trip: '12-Day North India & Himalayas',
    date: 'October 2023',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    text: "As an Indian-Canadian I wanted to reconnect with my roots meaningfully. YlooTrips built me a completely custom itinerary — off-the-beaten-path temples, cooking classes in Varanasi, and the Kalka-Shimla mountain railway. Nothing was copy-pasted from a standard package. Pure magic.",
  },
  {
    name: 'Chloé Dubois',
    flag: '🇫🇷',
    country: 'Paris, France',
    rating: 5,
    trip: '14-Day Kerala & South India',
    date: 'September 2023',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    text: "Kerala is a paradise — tea estates of Munnar, spice gardens, traditional Kathakali arranged just for our group. The food recommendations were especially good; we ate like locals every evening. YlooTrips is professional, warm, and genuinely passionate about sharing India. Je reviendrai!",
  },
];

const aggregate = { score: '4.9', total: '2,400+', platforms: ['Google', 'TripAdvisor'] };

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < n ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-primary/15'}`} />
      ))}
    </div>
  );
}

export default function InternationalTestimonials() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-cream-dark">
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">Real Reviews</p>
          <h2 className="font-display text-display-lg text-primary">
            Travelers from <span className="italic">40+ countries</span> trust us
          </h2>

          {/* Aggregate rating */}
          <div className="mt-6 inline-flex items-center gap-4 bg-cream border border-primary/10 px-6 py-3 rounded-full shadow-sm">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />)}
            </div>
            <span className="font-display text-2xl text-primary">{aggregate.score}</span>
            <div className="border-l border-primary/15 pl-4">
              <p className="text-xs font-medium text-primary/80">{aggregate.total} reviews</p>
              <p className="text-[10px] text-primary/45">{aggregate.platforms.join(' · ')}</p>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-10 md:mb-14">
          {reviews.map((r, i) => (
            <article key={i} className="bg-cream border border-primary/8 p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              {/* Header: stars + platform */}
              <div className="flex items-center justify-between">
                <Stars n={r.rating} />
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] text-primary/40 uppercase tracking-wider">{r.platform}</span>
                </div>
              </div>

              {/* Quote */}
              <p className="text-primary/75 text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-primary/8 pt-4 flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/8 shrink-0">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover"
                    onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
                    {r.name} <span>{r.flag}</span>
                  </div>
                  <div className="text-[10px] text-primary/45 mt-0.5">{r.country}</div>
                  <div className="text-[10px] text-secondary uppercase tracking-wider mt-1">{r.trip} · {r.date}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
            Start Planning Your Trip
          </Link>
          <p className="text-caption text-primary/45 mt-3">
            Custom itinerary within 24 hrs · No commitment · Free cancellation
          </p>
        </div>

      </div>
    </section>
  );
}
