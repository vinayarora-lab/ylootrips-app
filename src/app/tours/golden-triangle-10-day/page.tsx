import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, MapPin, Check, X, Utensils, Building, ChevronRight } from 'lucide-react';
import { TourJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "10-Day Golden Triangle Tour — Delhi, Agra & Jaipur",
  description: "Explore India's iconic Golden Triangle in 10 days. Visit the Taj Mahal, Red Fort, Amber Fort, Hawa Mahal & more. Private guided tour with handpicked hotels. Get a custom quote.",
  keywords: "Golden Triangle tour India, Delhi Agra Jaipur tour, Taj Mahal tour package, India Golden Triangle 10 days, India tour for Americans",
  openGraph: {
    title: "10-Day Golden Triangle Tour — Delhi, Agra & Jaipur | YlooTrips",
    description: "Experience India's most iconic landmarks — Taj Mahal, Red Fort, and Amber Fort — in 10 days. Private guide, handpicked hotels, seamless logistics.",
    url: "https://www.ylootrips.com/tours/golden-triangle-10-day",
  },
  alternates: { canonical: "https://www.ylootrips.com/tours/golden-triangle-10-day" },
};

const itinerary = [
  { day: 1, title: 'Arrival in Delhi', description: 'Airport pickup and transfer to your hotel. Evening orientation walk in Connaught Place. Welcome dinner at a rooftop restaurant with views of Delhi.', meals: 'Dinner', hotel: '4★ Hotel in Central Delhi' },
  { day: 2, title: 'Old Delhi & Humayun\'s Tomb', description: 'Morning rickshaw ride through the lanes of Old Delhi — Jama Masjid, Chandni Chowk spice market, and Red Fort exterior. Afternoon visit Humayun\'s Tomb and the Lodhi Garden. Evening free for exploration.', meals: 'Breakfast, Lunch', hotel: '4★ Hotel in Central Delhi' },
  { day: 3, title: 'New Delhi Highlights', description: 'India Gate, President\'s House (Rashtrapati Bhavan), Qutub Minar, and the National Museum. Afternoon visit to Dilli Haat craft market for Indian handicrafts shopping.', meals: 'Breakfast', hotel: '4★ Hotel in Central Delhi' },
  { day: 4, title: 'Delhi to Agra by Train', description: 'Morning Shatabdi Express to Agra (2 hours). Afternoon visit Agra Fort — the massive red-sandstone Mughal citadel. Sunset at Mehtab Bagh for views of the Taj Mahal silhouette across the river.', meals: 'Breakfast, Dinner', hotel: '4★ Heritage Hotel in Agra' },
  { day: 5, title: 'Taj Mahal at Sunrise', description: 'Pre-dawn departure for the Taj Mahal — experience it in golden morning light before crowds arrive. Your guide will share the full story of Shah Jahan and Mumtaz. Afternoon: Itimad-ud-Daulah ("Baby Taj") and local bazaar walk.', meals: 'Breakfast', hotel: '4★ Heritage Hotel in Agra' },
  { day: 6, title: 'Agra to Fatehpur Sikri to Jaipur', description: 'Morning drive to the ghost city of Fatehpur Sikri — a perfectly preserved 16th-century Mughal capital. Continue to Jaipur (Pink City). Evening arrival and check-in to a heritage haveli.', meals: 'Breakfast, Lunch', hotel: '4★ Heritage Haveli, Jaipur' },
  { day: 7, title: 'Amber Fort & Pink City', description: 'Morning elephant (or Jeep) ride up to the magnificent Amber Fort. Afternoon walk through Jaipur\'s old city — Hawa Mahal (Palace of Winds), City Palace, and Jantar Mantar observatory. Evening bazaar shopping for gems and textiles.', meals: 'Breakfast', hotel: '4★ Heritage Haveli, Jaipur' },
  { day: 8, title: 'Jaipur — Temples & Crafts', description: 'Visit the Galtaji Monkey Temple and the tranquil Sisodia Rani Garden. Afternoon workshop at a block-printing studio and a blue pottery workshop. Optional: cooking class with a local family.', meals: 'Breakfast, cooking class lunch', hotel: '4★ Heritage Haveli, Jaipur' },
  { day: 9, title: 'Day Trip to Ranthambore or Pushkar', description: 'Choose your adventure: early morning wildlife safari at Ranthambore Tiger Reserve (seasonal), OR a peaceful visit to the sacred city of Pushkar and its camel fair (seasonal). Evening back in Jaipur.', meals: 'Breakfast', hotel: '4★ Heritage Haveli, Jaipur' },
  { day: 10, title: 'Departure', description: 'Morning at leisure. Transfer to Jaipur airport for your departure flight, or back to Delhi by express train (3.5 hours) for international connections. Safe travels!', meals: 'Breakfast', hotel: 'Departure' },
];

export default function GoldenTriangleTour() {
  return (
    <div className="bg-cream min-h-screen">
      <TourJsonLd
        name="10-Day Golden Triangle Tour — Delhi, Agra & Jaipur"
        description="Explore India's iconic Golden Triangle in 10 days. Taj Mahal, Red Fort, Amber Fort, Hawa Mahal and more. Private guided tour with handpicked hotels."
        url="https://www.ylootrips.com/tours/golden-triangle-10-day"
        image="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"
        price="1400"
        duration="10 days / 9 nights"
        startLocation="New Delhi, India"
        highlights={['Taj Mahal sunrise visit', 'Amber Fort jeep ride', 'Old Delhi rickshaw tour', 'Fatehpur Sikri UNESCO site', 'Jaipur gem bazaars']}
        rating={4.9}
        reviewCount={312}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Tours', url: 'https://www.ylootrips.com/trips' },
        { name: '10-Day Golden Triangle Tour', url: 'https://www.ylootrips.com/tours/golden-triangle-10-day' },
      ]} />
      <FaqJsonLd faqs={[
        { question: 'How many days do I need for the Golden Triangle?', answer: '10 days is ideal — 3 days Delhi, 2 days Agra (with a day trip to Fatehpur Sikri), and 4 days Jaipur with time for Amber Fort, city palace, and Ranthambore.' },
        { question: 'What is the best time to visit the Golden Triangle?', answer: 'October to March is the best time — cool and dry. Avoid May–June (extreme heat) and July–September (monsoon, though Rajasthan remains accessible).' },
        { question: 'Is the Golden Triangle safe for solo travelers?', answer: 'Yes. The Golden Triangle is India\'s most visited tourist circuit with excellent infrastructure, English-speaking guides, and tourist police at major sites.' },
        { question: 'Do I need a visa for India?', answer: 'Most nationalities can apply for an e-Visa online at indianvisaonline.gov.in. It takes 2–4 business days and costs $25–$80 depending on nationality.' },
        { question: 'Can I pay in USD for this tour?', answer: 'Yes — YlooTrips accepts all major international credit and debit cards (Visa, Mastercard, Amex) with pricing displayed in USD.' },
      ]} />

      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=85"
          alt="Taj Mahal at sunrise, Agra India — Golden Triangle Tour"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-12 text-cream">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3">Signature Tour</p>
            <h1 className="font-display text-display-xl text-cream">10-Day Golden Triangle Tour</h1>
            <p className="text-cream/75 text-body-lg mt-3">Delhi · Agra · Jaipur</p>
          </div>
        </div>
      </section>

      {/* Mobile/Tablet Booking Bar — hidden on desktop where sidebar handles this */}
      <div className="lg:hidden bg-cream-light border-b border-primary/10 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-caption text-primary/50 uppercase tracking-wider">Starting from</p>
            <p className="font-display text-2xl text-primary">$1,400 <span className="text-sm font-sans text-primary/50">/ person</span></p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20the%2010-Day%20Golden%20Triangle%20Tour."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
            >
              WhatsApp
            </a>
            <Link href="/checkout/tour?tour=golden-triangle-10-day" className="btn-primary text-sm px-4 py-2">
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Clock, label: '10 Days / 9 Nights' },
                { icon: Users, label: 'Private or Group' },
                { icon: Star, label: 'Difficulty: Easy' },
                { icon: MapPin, label: 'Starts in Delhi' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 border border-primary/10 bg-cream-light p-3">
                  <Icon className="w-4 h-4 text-secondary shrink-0" />
                  <span className="text-sm text-primary/70">{label}</span>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h2 className="font-display text-3xl text-primary mb-4">Tour Overview</h2>
              <p className="text-primary/70 leading-relaxed">
                India&apos;s Golden Triangle is the classic introduction to the Subcontinent — and for good reason. This 10-day private tour takes you through the bustling chaos of Delhi, the timeless romance of the Taj Mahal in Agra, and the royal splendour of Jaipur, the Pink City of Rajasthan. Your private English-speaking guide brings centuries of history alive at every monument, and your handpicked hotels — from boutique havelis to heritage palaces — ensure you rest in style each night.
              </p>
            </div>

            {/* Destination Photo Gallery */}
            <div>
              <h2 className="font-display text-3xl text-primary mb-4">Destinations at a Glance</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', alt: 'Red Fort and Old Delhi streets — history and chaos of India\'s capital', label: 'Delhi' },
                  { src: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', alt: 'Taj Mahal at sunrise, Agra — the most iconic monument in India', label: 'Agra · Taj Mahal' },
                  { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80', alt: 'Hawa Mahal Pink City Jaipur Rajasthan — Palace of Winds', label: 'Jaipur' },
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
                  { icon: '✈️', title: 'Flights', text: 'Fly into Delhi (DEL). Direct flights from major US, UK, and European airports. Book 2–3 months ahead for best fares.' },
                  { icon: '💱', title: 'Currency & Payment', text: 'We accept all major international cards — Visa, Mastercard, Amex — with prices in USD. No hidden currency surcharges.' },
                  { icon: '📅', title: 'Best Time', text: 'October to March is ideal — cool and dry. January/February are the most comfortable months for the Golden Triangle circuit.' },
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

            {/* Itinerary */}
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
                        <div className="text-caption text-primary/50 mt-0.5">
                          {day.meals} · {day.hotel}
                        </div>
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

            {/* Includes / Excludes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-2xl text-primary mb-4">What&apos;s Included</h3>
                <ul className="space-y-2">
                  {[
                    '9 nights in handpicked 4★ hotels',
                    'All airport and station transfers',
                    'Private air-conditioned vehicle',
                    'English-speaking expert guide throughout',
                    'Taj Mahal sunrise visit',
                    'Delhi–Agra Shatabdi Express train',
                    'All monument entry fees',
                    'Daily breakfast, select meals as listed',
                    'Cooking class in Jaipur',
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
                    'Optional Ranthambore safari (add-on)',
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

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Price Card */}
            <div className="border border-primary/15 bg-cream-light p-6 sticky top-24">
              <p className="text-caption uppercase tracking-wider text-secondary mb-2">Starting from</p>
              <div className="font-display text-4xl text-primary mb-1">$1,400</div>
              <p className="text-caption text-primary/50 mb-1">per person · private tour</p>
              <p className="text-xs text-secondary font-medium mb-5">💳 EMI from $467/mo · Intl. cards accepted</p>

              <Link
                href="/checkout/tour?tour=golden-triangle-10-day"
                className="btn-primary w-full text-center mb-3"
              >
                Book Now — Pay Online
              </Link>
              <a
                href="https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20the%2010-Day%20Golden%20Triangle%20Tour."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center mb-3"
              >
                WhatsApp Us
              </a>
              <Link href="/contact?tour=golden-triangle-10-day" className="block text-center text-caption text-primary/50 hover:text-secondary transition-colors uppercase tracking-wider">
                Get Custom Quote
              </Link>

              <div className="mt-6 pt-6 border-t border-primary/10 space-y-2">
                {['Free custom itinerary', 'International cards accepted', 'EMI in 3/6 months', 'Flexible cancellation'].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-primary/60">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Other tours */}
            <div className="border border-primary/10 p-5">
              <p className="text-caption uppercase tracking-wider text-secondary mb-4">Also popular</p>
              <div className="space-y-3">
                <Link href="/tours/kerala-south-india-14-day" className="flex items-center gap-2 text-sm text-primary/70 hover:text-secondary transition-colors">
                  <ChevronRight className="w-4 h-4 text-accent" /> 14-Day Kerala & South India Tour
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
