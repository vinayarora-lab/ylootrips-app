import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, MapPin, Check, X, Utensils, Building, ChevronRight } from 'lucide-react';
import { TourJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "7-Day Rajasthan Heritage Tour — Jaipur, Jodhpur & Udaipur",
  description: "Explore royal Rajasthan in 7 days. Amber Fort, Mehrangarh Fort, Lake Palace, camel rides, and desert sunsets. Private guided tour with palace hotels. Get a custom quote.",
  keywords: "Rajasthan tour package, Jaipur Jodhpur Udaipur tour, Rajasthan heritage tour, camel safari Rajasthan, India desert tour, India royal palaces tour",
  openGraph: {
    title: "7-Day Rajasthan Heritage Tour | YlooTrips — India Travel Experts",
    description: "Royal forts, painted havelis, camel safaris, and lakeside palace hotels — explore Rajasthan's incredible heritage in 7 days.",
    url: "https://www.ylootrips.com/tours/rajasthan-heritage-7-day",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Rajasthan heritage tour — Amber Fort, Mehrangarh Fort and Lake Palace in 7 days",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7-Day Rajasthan Heritage Tour | YlooTrips",
    description: "Royal forts, camel safaris, and palace hotels — Rajasthan in 7 days.",
    images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/tours/rajasthan-heritage-7-day" },
};

const itinerary = [
  { day: 1, title: 'Arrive in Jaipur — The Pink City', description: 'Airport pickup and check-in to a heritage haveli hotel. Evening stroll through the lit-up bazaars of the old walled city. Welcome dinner with traditional Rajasthani thali — 20+ dishes on a brass plate.', meals: 'Dinner', hotel: 'Heritage Haveli, Jaipur Old City' },
  { day: 2, title: 'Jaipur — Amber Fort & Old City', description: 'Morning jeep ride up to the magnificent Amber Fort — a 16th century hilltop palace with mirrored interiors and sweeping valley views. Afternoon: City Palace museum, Jantar Mantar astronomical observatory (UNESCO), and the iconic Hawa Mahal facade.', meals: 'Breakfast', hotel: 'Heritage Haveli, Jaipur Old City' },
  { day: 3, title: 'Jaipur to Jodhpur — The Blue City', description: 'Morning drive to Jodhpur (5 hours), passing through the Thar Desert landscape and roadside markets. Afternoon: walk through the blue-painted houses of Brahmpuri neighbourhood below the looming Mehrangarh Fort. Sunset from Jaswant Thada marble memorial.', meals: 'Breakfast, Lunch', hotel: 'Heritage Hotel, Jodhpur Old City' },
  { day: 4, title: 'Mehrangarh Fort & Bishnoi Village', description: 'Morning inside Mehrangarh Fort — the most dramatic fort in Rajasthan, perched 120m above the city on a sheer rock cliff. Afternoon jeep safari to a Bishnoi tribal village — the world\'s original eco-community who have protected wildlife for 500 years. See blackbucks and peacocks in the wild.', meals: 'Breakfast', hotel: 'Heritage Hotel, Jodhpur Old City' },
  { day: 5, title: 'Jodhpur to Udaipur via Ranakpur', description: 'Morning drive through the Aravalli Hills to the extraordinary Ranakpur Jain temples — 1,444 intricately carved marble pillars, each one unique. Continue to Udaipur — the City of Lakes. Evening boat ride on Lake Pichola with the Lake Palace hotel glowing on the island.', meals: 'Breakfast', hotel: 'Lake View Hotel, Udaipur' },
  { day: 6, title: 'Udaipur — City Palace & Villages', description: 'Morning tour of the magnificent City Palace — a fusion of Rajput and Mughal architecture with stunning lake views from every terrace. Afternoon: visit Saheliyon-ki-Bari gardens and the Old City bazaars for silver jewellery and miniature paintings. Optional: cooking class with a local Rajasthani family.', meals: 'Breakfast', hotel: 'Lake View Hotel, Udaipur' },
  { day: 7, title: 'Udaipur Departure', description: 'Morning at leisure — last walk around Lake Pichola, final shopping, or rooftop breakfast watching the lake wake up. Airport or station transfer. Departure with a heart full of Rajasthan.', meals: 'Breakfast', hotel: 'Departure' },
];

export default function RajasthanTourPage() {
  return (
    <div className="bg-cream min-h-screen">
      <TourJsonLd
        name="7-Day Rajasthan Heritage Tour — Jaipur, Jodhpur & Udaipur"
        description="Explore royal Rajasthan in 7 days. Amber Fort, Mehrangarh Fort, Lake Palace, camel rides, and desert sunsets. Private guided tour with palace hotels."
        url="https://www.ylootrips.com/tours/rajasthan-heritage-7-day"
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"
        price="950"
        duration="7 days / 6 nights"
        startLocation="Jaipur, Rajasthan, India"
        highlights={['Amber Fort jeep ride', 'Mehrangarh Fort Jodhpur', 'Lake Pichola boat ride', 'Bishnoi village safari', 'Ranakpur Jain temples']}
        rating={4.8}
        reviewCount={176}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Tours', url: 'https://www.ylootrips.com/trips' },
        { name: '7-Day Rajasthan Heritage Tour', url: 'https://www.ylootrips.com/tours/rajasthan-heritage-7-day' },
      ]} />
      <FaqJsonLd faqs={[
        { question: 'What is the best time to visit Rajasthan?', answer: 'October to February is the best time — cool and pleasant. Avoid April–June (extreme heat up to 48°C). The Pushkar Camel Fair in November is a spectacular bonus.' },
        { question: 'Is Rajasthan safe for international tourists?', answer: 'Yes. Rajasthan is one of India\'s most-visited states with a well-developed tourism infrastructure. Heritage hotels, tourist police, and English-speaking guides are widely available.' },
        { question: 'What type of accommodation is included?', answer: 'We place you in authentic heritage hotels — converted maharaja havelis and palace mansions that are classified under the Heritage Hotels Association of India.' },
        { question: 'Can I combine Rajasthan with the Taj Mahal?', answer: 'Yes — Jaipur to Agra is just 4 hours by road. We can extend this to a 10-day Golden Triangle + Rajasthan tour that includes Delhi, Agra, and the Taj Mahal. Contact us for pricing.' },
        { question: 'Do you offer camel safaris in Rajasthan?', answer: 'Yes, a sunset camel safari near Osian or Jaisalmer can be added as an optional day-trip extension. Ask about our Rajasthan desert camp add-on.' },
      ]} />

      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=85"
          alt="Amber Fort palace Jaipur Rajasthan India at sunrise"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-12 text-cream">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-3">Royal Rajasthan</p>
            <h1 className="font-display text-display-xl text-cream">7-Day Rajasthan Heritage Tour</h1>
            <p className="text-cream/75 text-body-lg mt-3">Jaipur · Jodhpur · Udaipur</p>
          </div>
        </div>
      </section>

      {/* Mobile/Tablet Booking Bar — hidden on desktop where sidebar handles this */}
      <div className="lg:hidden bg-cream-light border-b border-primary/10 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-caption text-primary/50 uppercase tracking-wider">Starting from</p>
            <p className="font-display text-2xl text-primary">$950 <span className="text-sm font-sans text-primary/50">/ person</span></p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20the%207-Day%20Rajasthan%20Heritage%20Tour."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
            >
              WhatsApp
            </a>
            <Link href="/checkout/tour?tour=rajasthan-heritage-7-day" className="btn-primary text-sm px-4 py-2">
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
                { icon: Clock, label: '7 Days / 6 Nights' },
                { icon: Users, label: 'Private or Group' },
                { icon: Star, label: 'Difficulty: Easy' },
                { icon: MapPin, label: 'Starts in Jaipur' },
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
                Rajasthan is the India of the imagination — vibrant colours, impossibly grand forts, camel caravans at sunset, and royal palaces reflected in still lakes. This 7-day private tour moves between the Pink City of Jaipur, the Blue City of Jodhpur (with its world-class Mehrangarh Fort), and the romantic City of Lakes, Udaipur. You&apos;ll stay in authentic heritage hotels — converted maharaja mansions — and your guide will bring the extraordinary history of Rajput kingdoms to life at every stop.
              </p>
            </div>

            {/* Destination Photo Gallery */}
            <div>
              <h2 className="font-display text-3xl text-primary mb-4">Destinations at a Glance</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80', alt: 'Hawa Mahal Palace of Winds, Jaipur Pink City Rajasthan', label: 'Jaipur' },
                  { src: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', alt: 'Mehrangarh Fort and blue-painted city of Jodhpur, Rajasthan India', label: 'Jodhpur' },
                  { src: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=600&q=80', alt: 'Lake Pichola and City Palace at sunset, Udaipur Rajasthan', label: 'Udaipur' },
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
                  { icon: '✈️', title: 'Flights', text: 'Fly into Jaipur (JAI) or Delhi (DEL) to start this tour. Delhi has better international connections with 1-stop flights from US/UK/Europe.' },
                  { icon: '💱', title: 'Currency & Payment', text: 'We accept all major international cards — Visa, Mastercard, Amex — with prices in USD. No hidden currency surcharges.' },
                  { icon: '📅', title: 'Best Time', text: 'October to February is ideal — cool, dry, and perfect for sightseeing. Avoid April–June (extreme Rajasthan heat).' },
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
                    '6 nights in heritage palace hotels',
                    'Private AC vehicle throughout',
                    'English-speaking guide throughout',
                    'Amber Fort jeep ride',
                    'Bishnoi village safari',
                    'Lake Pichola boat ride',
                    'Ranakpur temples visit',
                    'All monument entry fees',
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
                    'International or domestic flights',
                    'India visa fee',
                    'Travel insurance',
                    'Personal shopping & tips',
                    'Optional camel safari (add-on)',
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
              <div className="font-display text-4xl text-primary mb-1">$950</div>
              <p className="text-caption text-primary/50 mb-1">per person · private tour</p>
              <p className="text-xs text-secondary font-medium mb-5">💳 EMI from $317/mo · Intl. cards accepted</p>
              <Link href="/checkout/tour?tour=rajasthan-heritage-7-day" className="btn-primary w-full text-center mb-3">
                Book Now — Pay Online
              </Link>
              <a
                href="https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20the%207-Day%20Rajasthan%20Heritage%20Tour."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full text-center mb-3"
              >
                WhatsApp Us
              </a>
              <Link href="/contact?tour=rajasthan-heritage-7-day" className="block text-center text-caption text-primary/50 hover:text-secondary transition-colors uppercase tracking-wider">
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
                <Link href="/tours/kerala-south-india-14-day" className="flex items-center gap-2 text-sm text-primary/70 hover:text-secondary transition-colors">
                  <ChevronRight className="w-4 h-4 text-accent" /> 14-Day Kerala & South India Tour
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
