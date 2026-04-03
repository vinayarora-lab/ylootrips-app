import { Star } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  {
    name: 'Sarah Mitchell',
    flag: '🇺🇸',
    country: 'San Francisco, USA',
    rating: 5,
    trip: '10-Day Golden Triangle Tour',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    text: "YlooTrips made our first India trip absolutely seamless. The day-by-day planning was flawless — from the Taj Mahal at sunrise to the pink streets of Jaipur's old city. Our guide spoke perfect English and knew stories about every monument. India is intense in the best way, and having experts handle logistics let us just soak it all in.",
  },
  {
    name: 'James & Emma Hargreaves',
    flag: '🇬🇧',
    country: 'London, UK',
    rating: 5,
    trip: '14-Day Kerala & South India Tour',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    text: "We'd been nervous about the heat and logistics of India, but YlooTrips put our minds at ease completely. Kerala was breathtaking — the houseboat on the backwaters was the most romantic two days of our entire trip. The team answered every WhatsApp message within minutes, even when we had a last-minute request to change a hotel. Five stars without hesitation.",
  },
  {
    name: 'Lachlan Burgess',
    flag: '🇦🇺',
    country: 'Melbourne, Australia',
    rating: 5,
    trip: '7-Day Rajasthan Heritage Tour',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&q=80',
    text: "Rajasthan absolutely blew my mind — the forts, the camels, the colours of Jodhpur. I came as a solo traveller and felt completely safe and looked after the whole time. The accommodation choices were perfect, always boutique heritage properties. Will 100% book YlooTrips again for Ladakh next year.",
  },
  {
    name: 'Katrin & Markus Berger',
    flag: '🇩🇪',
    country: 'Munich, Germany',
    rating: 5,
    trip: '10-Day Golden Triangle Tour',
    avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=120&q=80',
    text: "Wir haben YlooTrips für unsere Indien-Reise ausgewählt und sind begeistert. The team communicated in excellent English throughout, and every hotel was better than expected. The private car and driver made all the difference — comfortable, safe, and we stopped wherever we wanted for photos. India is now our favourite destination and YlooTrips the reason why.",
  },
  {
    name: 'Priya Sharma',
    flag: '🇨🇦',
    country: 'Toronto, Canada',
    rating: 5,
    trip: '12-Day North India & Himalayas Tour',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    text: "As an Indian-Canadian, I wanted to reconnect with my roots in a meaningful way. YlooTrips built me a completely custom itinerary — they included off-the-beaten-path temples, local cooking classes in Varanasi, and a train journey on the Kalka-Shimla mountain railway. Nothing was copy-pasted from a standard package. Pure magic.",
  },
  {
    name: 'Chloé Dubois',
    flag: '🇫🇷',
    country: 'Paris, France',
    rating: 5,
    trip: '14-Day Kerala & South India Tour',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    text: "J'ai adoré! Kerala is a paradise — the tea estates of Munnar, the spice gardens, and the traditional Kathakali performance arranged just for our group. The food recommendations were especially good; we ate like locals every evening. YlooTrips is professional, warm, and genuinely passionate about sharing India. Je reviendrai!",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-accent text-accent' : 'text-primary/20'}`}
        />
      ))}
    </div>
  );
}

export default function InternationalTestimonials() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-cream-dark">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
            Trusted Worldwide
          </p>
          <h2 className="font-display text-display-lg text-primary">
            Travelers from <span className="italic">40+ countries</span> love YlooTrips
          </h2>
          <p className="mt-4 text-primary/60 text-body-sm max-w-xl mx-auto">
            Real reviews from international visitors who experienced India with us.
          </p>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, i) => (
            <article
              key={i}
              className="bg-cream-light border border-primary/8 p-6 md:p-8 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-500"
            >
              {/* Stars */}
              <StarRating rating={review.rating} />

              {/* Quote */}
              <p className="text-primary/80 text-sm leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-primary/10 pt-4 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/10 shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-primary text-sm flex items-center gap-1.5">
                    {review.name}
                    <span className="text-base">{review.flag}</span>
                  </div>
                  <div className="text-caption text-primary/50 mt-0.5">{review.country}</div>
                  <div className="text-caption text-secondary mt-1 uppercase tracking-wider truncate">
                    {review.trip}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-14">
          <a
            href="/contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            Start Planning Your India Trip
          </a>
          <p className="text-caption text-primary/50 mt-3">
            Custom itinerary sent within 24 hours · No commitment required
          </p>
        </div>
      </div>
    </section>
  );
}
