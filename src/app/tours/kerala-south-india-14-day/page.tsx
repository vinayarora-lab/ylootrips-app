import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, MapPin, Check, X, Utensils, Building, ChevronRight } from 'lucide-react';
import { TourJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "14-Day Kerala & South India Tour Package",
  description: "Discover Kerala's backwaters, Munnar tea estates, spice gardens, and ancient temples on this 14-day South India tour. Houseboat cruise, Ayurveda massage, and more. Get a quote.",
  keywords: "Kerala tour package, South India tour, Kerala backwaters tour, Munnar tea estate, Kerala houseboat, India south tour 14 days",
  openGraph: {
    title: "14-Day Kerala & South India Tour | YlooTrips",
    description: "Kerala backwaters, Munnar tea estates, ancient temples, and a houseboat cruise on Alleppey. The ultimate South India experience in 14 days.",
    url: "https://www.ylootrips.com/tours/kerala-south-india-14-day",
  },
  alternates: { canonical: "https://www.ylootrips.com/tours/kerala-south-india-14-day" },
};

const itinerary = [
  { day: 1, title: 'Arrive in Kochi (Cochin)', description: 'Airport pickup and check-in to your heritage hotel in Fort Kochi. Evening walk through the colonial quarter — Dutch Palace, Jewish Synagogue, and the iconic Chinese fishing nets at sunset.', meals: 'Dinner', hotel: 'Heritage Boutique Hotel, Fort Kochi' },
  { day: 2, title: 'Fort Kochi & Backwaters Introduction', description: 'Morning guided tour of Fort Kochi — Mattancherry, St Francis Church (where Vasco da Gama was originally buried), and the spice trading hub. Afternoon speedboat cruise through Kochi\'s backwater canals.', meals: 'Breakfast', hotel: 'Heritage Boutique Hotel, Fort Kochi' },
  { day: 3, title: 'Kochi to Munnar (Tea Country)', description: 'Scenic drive up to Munnar through rubber plantations and waterfalls. Afternoon visit to a working tea factory — learn how Darjeeling and Assam teas differ from Kerala varieties. Evening walk in the tea gardens at golden hour.', meals: 'Breakfast, Lunch', hotel: '4★ Estate Bungalow, Munnar' },
  { day: 4, title: 'Munnar — Eravikulam & Spice Gardens', description: 'Morning visit Eravikulam National Park — home to the endangered Nilgiri Tahr mountain goat. Afternoon tour of a cardamom, pepper, and cinnamon spice plantation with a local farmer-guide. Evening campfire dinner.', meals: 'Breakfast, Dinner', hotel: '4★ Estate Bungalow, Munnar' },
  { day: 5, title: 'Munnar to Thekkady (Periyar)', description: 'Drive through the Cardamom Hills to Thekkady. Afternoon boat cruise on Periyar Lake inside the wildlife reserve — spot elephants, bison, and Malabar hornbills on the shore. Evening Kathakali cultural performance.', meals: 'Breakfast', hotel: 'Jungle Lodge, Thekkady' },
  { day: 6, title: 'Periyar Wildlife & Bamboo Rafting', description: 'Morning bamboo rafting through the buffer zone of Periyar Tiger Reserve with tribal guides. Afternoon cooking class — learn to make Kerala fish curry, appam, and payasam with a local family.', meals: 'Breakfast, cooking class lunch', hotel: 'Jungle Lodge, Thekkady' },
  { day: 7, title: 'Thekkady to Alleppey (Houseboat)', description: 'Drive to the backwater town of Alleppey (Alappuzha). Board your private houseboat — your floating hotel for the night. Cruise through rice paddy canals, watching village life unfold on the banks. Sunset on the open lake. Fresh seafood dinner on board.', meals: 'Breakfast, Lunch, Dinner', hotel: 'Private Houseboat (Kerala backwaters)' },
  { day: 8, title: 'Backwater Cruise & Kumarakom', description: 'Morning cruise deeper into the backwater network. Watch toddy-tappers climb coconut palms, birds wading in the shallows. Disembark by noon and drive to Kumarakom Bird Sanctuary for a canoe tour among migratory birds.', meals: 'Breakfast, Lunch', hotel: '5★ Backwater Resort, Kumarakom' },
  { day: 9, title: 'Ayurveda Wellness Day', description: 'Full day at an authentic Ayurveda centre — doctor consultation, Abhyanga massage, Shirodhara treatment, and yoga session. Afternoon free for reading, swimming, or napping in a hammock. Kerala is also a retreat.', meals: 'Breakfast, Lunch', hotel: '5★ Backwater Resort, Kumarakom' },
  { day: 10, title: 'Kovalam Beach & Thiruvananthapuram', description: 'Drive south to the capital, Thiruvananthapuram. Visit Sri Padmanabhaswamy Temple (one of India\'s richest), Napier Museum, and Kerala handicraft emporia. Continue to Kovalam Beach — check into a cliffside resort.', meals: 'Breakfast', hotel: 'Cliffside Resort, Kovalam' },
  { day: 11, title: 'Kovalam Beach Day', description: 'Free day at Kovalam — swim, surf lessons, sunrise yoga on the beach, or simply read. Optional boat trip to a nearby fishing village for a live seafood lunch direct from the boat.', meals: 'Breakfast', hotel: 'Cliffside Resort, Kovalam' },
  { day: 12, title: 'Kovalam to Pondicherry (fly/drive)', description: 'Morning flight or drive to Pondicherry — the French colonial town on India\'s southeast coast. Afternoon cycling tour of the French Quarter — colourful bougainvillaea-draped streets, promenade cafes, and the Sri Aurobindo Ashram.', meals: 'Breakfast, Dinner', hotel: 'French Quarter Boutique Hotel, Pondicherry' },
  { day: 13, title: 'Pondicherry — Auroville & Mahabalipuram', description: 'Morning visit to Auroville — the international utopian township. Afternoon drive to Mahabalipuram (UNESCO) — 7th-century rock-cut temples and stone sculptures on the Bay of Bengal shore. Sunset at Shore Temple.', meals: 'Breakfast', hotel: 'French Quarter Boutique Hotel, Pondicherry' },
  { day: 14, title: 'Chennai & Departure', description: 'Morning drive to Chennai airport (2.5 hours). Transfer and international departure. End of a wonderful South India journey.', meals: 'Breakfast', hotel: 'Departure' },
];

export default function KeralaToursPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TourJsonLd
        name="14-Day Kerala & South India Tour Package"
        description="Discover Kerala's backwaters, Munnar tea estates, spice gardens, Ayurveda retreats, and ancient temples on this 14-day South India tour. Includes houseboat cruise and Pondicherry."
        url="https://www.ylootrips.com/tours/kerala-south-india-14-day"
        image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"
        price="1900"
        duration="14 days / 13 nights"
        startLocation="Kochi, Kerala, India"
        highlights={['Kerala houseboat overnight', 'Munnar tea plantation walk', 'Ayurveda wellness day', 'Periyar tiger reserve', 'Pondicherry French quarter']}
        rating={4.9}
        reviewCount={218}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Tours', url: 'https://www.ylootrips.com/trips' },
        { name: '14-Day Kerala & South India Tour', url: 'https://www.ylootrips.com/tours/kerala-south-india-14-day' },
      ]} />
      <FaqJsonLd faqs={[
        { question: 'What is the best time to visit Kerala?', answer: 'September to March is ideal. Avoid June–August (heavy monsoon). The post-monsoon season (September–October) is lush and beautiful with fewer crowds.' },
        { question: 'Is Kerala suitable for first-time India visitors?', answer: 'Absolutely. Kerala is one of India\'s easiest states for international travelers — English is widely spoken, roads are good, and the pace is relaxed compared to North India.' },
        { question: 'What is included in the Kerala houseboat experience?', answer: 'The overnight houseboat cruise on Alleppey backwaters includes a private chef cooking fresh Kerala seafood, AC bedroom, sundeck, and a sunset cruise through village canals.' },
        { question: 'Can I extend this tour to include North India?', answer: 'Yes — we can combine this South India tour with a Golden Triangle (Delhi–Agra–Jaipur) extension. Contact us for a customized 21-day India itinerary.' },
      ]} />

      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=85"
          alt="Kerala backwaters houseboat cruise, Alleppey South India"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-12 text-cream">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3">South India Highlight</p>
            <h1 className="font-display text-display-xl text-cream">14-Day Kerala & South India Tour</h1>
            <p className="text-cream/75 text-body-lg mt-3">Kochi · Munnar · Thekkady · Alleppey · Kovalam · Pondicherry</p>
          </div>
        </div>
      </section>

      {/* Mobile/Tablet Booking Bar — hidden on desktop where sidebar handles this */}
      <div className="lg:hidden bg-cream-light border-b border-primary/10 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-caption text-primary/50 uppercase tracking-wider">Starting from</p>
            <p className="font-display text-2xl text-primary">$1,900 <span className="text-sm font-sans text-primary/50">/ person</span></p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20the%2014-Day%20Kerala%20%26%20South%20India%20Tour."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
            >
              WhatsApp
            </a>
            <Link href="/checkout/tour?tour=kerala-south-india-14-day" className="btn-primary text-sm px-4 py-2">
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: '14 Days / 13 Nights' },
                { icon: Users, label: 'Private or Group' },
                { icon: Star, label: 'Difficulty: Easy' },
                { icon: MapPin, label: 'Starts in Kochi' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 border border-primary/10 bg-cream-light p-3">
                  <Icon className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-sm text-primary/70">{label}</span>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-display text-3xl text-primary mb-4">Tour Overview</h2>
              <p className="text-primary/70 leading-relaxed">
                South India is a completely different world from the north — lush, green, slower-paced, and deeply spiritual. This 14-day journey takes you from the colonial waterways of Fort Kochi, up into the misty tea estates of Munnar, through the wildlife of Periyar, onto the legendary Kerala backwaters for a private houseboat night, down to the beaches of Kovalam, and finally to the French colonial charm of Pondicherry. A Kathakali performance, an Ayurveda wellness day, and a spice plantation tour round out one of the most diverse itineraries in India.
              </p>
            </div>

            {/* Destination Photo Gallery */}
            <div>
              <h2 className="font-display text-3xl text-primary mb-4">Destinations at a Glance</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { src: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=600&q=80', alt: 'Chinese fishing nets at sunset, Fort Kochi — colonial heritage of Kerala', label: 'Kochi' },
                  { src: 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=600&q=80', alt: 'Munnar tea plantation hills Kerala — misty emerald landscape', label: 'Munnar' },
                  { src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', alt: 'Kerala backwaters houseboat cruise at sunset, Alleppey', label: 'Alleppey Backwaters' },
                ].map(({ src, alt, label }) => (
                  <div key={label} className="relative h-48 overflow-hidden group">
                    <Image src={src} alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-primary/30" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-cream text-xs font-medium uppercase tracking-wider">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* International Visitors Info */}
            <div className="bg-cream-dark border border-primary/10 p-6">
              <h3 className="font-display text-2xl text-primary mb-4">For International Visitors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { icon: '🛂', title: 'Visa', text: 'Most nationalities can get an India e-Visa online at indianvisaonline.gov.in in 2–4 business days for $25–80.' },
                  { icon: '✈️', title: 'Flights', text: 'Fly into Kochi (COK) to start this tour. Direct or 1-stop flights from major US, UK, and European airports.' },
                  { icon: '💱', title: 'Currency & Payment', text: 'We accept all major international cards — Visa, Mastercard, Amex — with prices in USD. No hidden currency surcharges.' },
                  { icon: '📅', title: 'Best Time', text: 'September to March is ideal for Kerala. Post-monsoon October–November is particularly lush and beautiful.' },
                ].map(({ icon, title, text }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-medium text-primary text-sm mb-1">{title}</div>
                      <p className="text-sm text-primary/60 leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-primary mb-6">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <details key={day.day} className="border border-primary/10 bg-cream-light group">
                    <summary className="flex items-center gap-4 p-5 cursor-pointer list-none hover:bg-cream-dark transition-colors">
                      <span className="w-8 h-8 rounded-full bg-primary text-cream text-sm font-bold flex items-center justify-center shrink-0">
                        {day.day}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-primary">Day {day.day}: {day.title}</div>
                        <div className="text-caption text-primary/50 mt-0.5">{day.meals} · {day.hotel}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary/30 group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 pt-2 text-primary/65 text-sm leading-relaxed border-t border-primary/10">
                      {day.description}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-primary/10">
                        <div className="flex items-center gap-1.5 text-caption text-primary/50">
                          <Utensils className="w-3.5 h-3.5" /> {day.meals}
                        </div>
                        <div className="flex items-center gap-1.5 text-caption text-primary/50">
                          <Building className="w-3.5 h-3.5" /> {day.hotel}
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-2xl text-primary mb-4">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {[
                    '13 nights in handpicked hotels & houseboat',
                    'All transfers in private AC vehicle',
                    'English-speaking guide throughout',
                    'Private houseboat night (Alleppey)',
                    'Ayurveda wellness day',
                    'Kathakali performance',
                    'Cooking class with local family',
                    'Periyar Lake cruise',
                    'Spice plantation guided tour',
                    'All entry fees',
                    'Daily breakfast, select meals as listed',
                    '24/7 YlooTrips support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-primary/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-2xl text-primary mb-4">Not Included</h3>
                <ul className="space-y-2">
                  {[
                    'International flights',
                    'India visa fee',
                    'Travel insurance',
                    'Personal shopping & tips',
                    'Optional Pondicherry–Chennai flight',
                    'Lunches & dinners not listed',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <X className="w-4 h-4 text-terracotta mt-0.5 shrink-0" />
                      <span className="text-primary/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border border-primary/15 bg-cream-light p-6 sticky top-24">
              <p className="text-caption uppercase tracking-wider text-secondary mb-2">Starting from</p>
              <div className="font-display text-4xl text-primary mb-1">$1,900</div>
              <p className="text-caption text-primary/50 mb-1">per person · private tour</p>
              <p className="text-xs text-secondary font-medium mb-5">💳 EMI from $633/mo · Intl. cards accepted</p>
              <Link href="/checkout/tour?tour=kerala-south-india-14-day" className="btn-primary w-full text-center mb-3">
                Book Now — Pay Online
              </Link>
              <a
                href="https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20the%2014-Day%20Kerala%20%26%20South%20India%20Tour."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center mb-3"
              >
                WhatsApp Us
              </a>
              <Link href="/contact?tour=kerala-south-india-14-day" className="block text-center text-caption text-primary/50 hover:text-secondary transition-colors uppercase tracking-wider">
                Get Custom Quote
              </Link>
              <div className="mt-6 pt-6 border-t border-primary/10 space-y-2">
                {['Free custom itinerary', 'International cards accepted', 'EMI in 3/6 months', 'Flexible cancellation'].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-primary/60">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" /> {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-primary/10 p-5">
              <p className="text-caption uppercase tracking-wider text-secondary mb-4">Also popular</p>
              <div className="space-y-3">
                <Link href="/tours/golden-triangle-10-day" className="flex items-center gap-2 text-sm text-primary/70 hover:text-secondary transition-colors">
                  <ChevronRight className="w-4 h-4 text-accent" /> 10-Day Golden Triangle Tour
                </Link>
                <Link href="/tours/rajasthan-heritage-7-day" className="flex items-center gap-2 text-sm text-primary/70 hover:text-secondary transition-colors">
                  <ChevronRight className="w-4 h-4 text-accent" /> 7-Day Rajasthan Heritage Tour
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
