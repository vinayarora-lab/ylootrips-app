import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Singapore Tour Package from India 2026 — 4 Nights Starting ₹32,999',
  description: 'Book Singapore tour packages from India starting ₹32,999. 4 nights / 5 days — Gardens by the Bay, Universal Studios, Sentosa, Marina Bay Sands. Flights + hotel + transfers included.',
  keywords: 'Singapore tour package from India, Singapore trip from India, Singapore package 2026, Singapore holiday package India, Singapore 4 nights 5 days, cheapest Singapore tour India, Singapore trip cost India',
  openGraph: {
    title: 'Singapore Tour Package from India 2026 — ₹32,999 Onwards',
    description: 'All-inclusive Singapore holiday from India — flights, hotel, Gardens by the Bay, Universal Studios, Marina Bay Sands. Book with ₹5,000 advance.',
    url: 'https://www.ylootrips.com/singapore-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&q=80', width: 1200, height: 630, alt: 'Singapore Marina Bay Sands skyline tour package from India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singapore Tour Package from India — ₹32,999 Onwards | YlooTrips',
    description: 'Flights + Hotel + Gardens by the Bay + Universal Studios + Sentosa. Book now with ₹5,000 advance.',
    images: ['https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/singapore-tour-package' },
};

const pkg: PackageData = {
  slug: 'singapore-tour-package',
  canonicalUrl: 'https://www.ylootrips.com/singapore-tour-package',
  metaTitle: 'Singapore Tour Package from India 2026 — 4 Nights Starting ₹32,999',
  metaDescription: 'Book Singapore tour packages from India starting ₹32,999. 4 nights 5 days — Gardens by the Bay, Universal Studios, Marina Bay Sands. Flights included.',
  keywords: 'Singapore tour package from India',
  ogImage: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1600&q=85',
  heroTitle: 'Singapore Tour Package from India',
  heroSubtitle: 'Gardens by the Bay · Universal Studios · Marina Bay Sands · Sentosa Island — The Lion City in 5 Days',
  tagline: 'Most Popular Southeast Asia Package',

  duration: '4 Nights / 5 Days',
  groupSize: 'Solo, Couple or Family',
  difficulty: 'Easy (All Ages)',
  startLocation: 'Delhi / Mumbai → Singapore (SIN)',

  priceINR: 32999,
  priceUSD: 396,
  originalPriceINR: 42999,
  depositPercent: 25,

  overview: [
    'Singapore — Asia\'s most dazzling city-state — packs an astonishing amount into just 730 square kilometres. World-class theme parks, futuristic gardens, a stunning waterfront, and Michelin-starred street food sit side by side in one of the world\'s safest and cleanest cities. No wonder it\'s India\'s most popular Southeast Asia destination.',
    'Our 4-night Singapore package from India covers everything that makes the Lion City unforgettable: return flights, a well-located hotel, the mesmerising Gardens by the Bay with its Supertree light show, the thrilling Universal Studios Singapore, the iconic Marina Bay Sands infinity pool observation, a full day on Sentosa Island, and a taste of the famous Singapore hawker food scene.',
    'Singapore is extremely easy for Indian travelers — no language barrier, excellent Indian food everywhere, and one of the smoothest airport experiences in the world. Our package handles all logistics: airport transfers, attraction tickets, and 24/7 WhatsApp support so you can focus entirely on enjoying the trip.',
    'Pay just ₹5,000 to confirm your booking. Balance due 30 days before travel. Free cancellation up to 14 days before departure.',
  ],

  highlights: [
    'Return flights from Delhi or Mumbai to Singapore',
    'Gardens by the Bay — Flower Dome, Cloud Forest & Supertree Grove night show',
    'Universal Studios Singapore (full-day ticket)',
    'Marina Bay Sands SkyPark Observation Deck',
    'Sentosa Island — S.E.A. Aquarium + cable car',
    'Singapore City Tour — Merlion, Chinatown, Little India, Orchard Road',
    'Singapore Tourist Visa (e-Visa, included for eligible nationalities)',
    'Airport transfers in Singapore (all 4 legs, private)',
    'Daily breakfast at hotel',
    '24/7 YlooTrips support during travel',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800&q=80', alt: 'Singapore Marina Bay Sands and city skyline at night', label: 'Marina Bay' },
    { src: 'https://images.unsplash.com/photo-1555639039-f8d51a7c0d67?w=800&q=80', alt: 'Gardens by the Bay Supertrees Singapore', label: 'Gardens by the Bay' },
    { src: 'https://images.unsplash.com/photo-1559592413-7cbb1a8d1b68?w=800&q=80', alt: 'Universal Studios Singapore entrance', label: 'Universal Studios' },
    { src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', alt: 'Sentosa Island beach Singapore', label: 'Sentosa Island' },
    { src: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80', alt: 'Singapore Chinatown street food hawker', label: 'Singapore Food' },
  ],

  itinerary: [
    {
      day: 1,
      title: 'Arrive Singapore — Merlion & Marina Bay Evening',
      description: 'Fly from Delhi or Mumbai on IndiGo / Air India / Singapore Airlines (approx. 5h 30m from Delhi, 5h from Mumbai). On arrival at Changi Airport — consistently ranked the world\'s best — your YlooTrips representative will be waiting. Transfer to your hotel in the city centre. After check-in and freshen up, head out to the iconic Merlion Park for your first Singapore photo. Stroll along the Marina Bay waterfront and take in the glittering skyline. If you arrive early enough, catch the spectacular free Garden Rhapsody light show at Gardens by the Bay Supertrees (7:45 PM and 8:45 PM). Welcome dinner at a nearby hawker centre to try Hainanese chicken rice and laksa.',
      meals: 'None',
      hotel: '4★ Hotel in City Centre',
      activities: ['Airport pickup', 'Hotel check-in', 'Merlion Park photos', 'Marina Bay waterfront walk', 'Supertree light show (if time permits)'],
    },
    {
      day: 2,
      title: 'Gardens by the Bay + Marina Bay Sands SkyPark',
      description: 'After breakfast, head to Gardens by the Bay — Singapore\'s iconic 101-hectare nature park. Your ticket includes the breathtaking Flower Dome (world\'s largest glass greenhouse with flowers from five continents) and the misty Cloud Forest with its 35-metre indoor waterfall. Spend the morning exploring the Supertree Grove walkway 22 metres above ground. Post-lunch, visit the Marina Bay Sands hotel — one of the most photographed buildings in Asia. Head to the SkyPark Observation Deck (57th floor) for panoramic views across Singapore, the Straits of Johor, and the Indonesian islands. Evening free to explore the Marina Bay Sands mall or watch the free light and water show "Spectra" at the waterfront (8 PM and 9 PM).',
      meals: 'Breakfast',
      hotel: '4★ Hotel',
      activities: ['Gardens by the Bay: Flower Dome', 'Cloud Forest', 'Supertree Walkway', 'MBS SkyPark Observation', 'Spectra light show'],
    },
    {
      day: 3,
      title: 'Universal Studios Singapore — Full Day',
      description: 'Today is fully dedicated to Universal Studios Singapore on Sentosa Island — Southeast Asia\'s only Universal Studios theme park. With 7 themed zones including Jurassic World, Transformers, Minion Land, Far Far Away, and the Hollywood zone, there\'s a full day of thrills ahead. Standout rides include Battlestar Galactica (Asia\'s tallest duelling roller coasters), the Transformers The Ride 3D, and the Revenge of the Mummy indoor roller coaster. After the park, stroll Sentosa\'s waterfront and take the Singapore Cable Car across the harbour for stunning sunset views (optional add-on). Dinner at one of Sentosa\'s many restaurants.',
      meals: 'Breakfast',
      hotel: '4★ Hotel',
      activities: ['Universal Studios Singapore (full day)', 'Jurassic World, Transformers, Minion Land', 'Singapore Cable Car (optional)', 'Sentosa waterfront evening'],
    },
    {
      day: 4,
      title: 'Singapore City Tour — Chinatown, Little India & Orchard Road',
      description: 'Morning city tour covering Singapore\'s cultural heritage. Start at the Sri Veeramakaliamman Temple in Little India — the heart of Indian Singapore with its fragrant flower shops, curry houses, and sari stores. Walk through colourful Kampong Glam and the Sultan Mosque. After lunch at a Halal hawker stall, visit the lively Chinatown Heritage Centre with its beautifully preserved shophouses. Afternoon free on Orchard Road — Singapore\'s legendary 2.2-kilometre shopping street lined with over 50 malls and international luxury brands. Pick up Singapore souvenirs and duty-free electronics. Evening at Clarke Quay, Singapore\'s riverfront entertainment district with riverside dining and nightlife.',
      meals: 'Breakfast',
      hotel: '4★ Hotel',
      activities: ['Little India & Sri Veeramakaliamman Temple', 'Kampong Glam & Sultan Mosque', 'Chinatown Heritage', 'Orchard Road shopping', 'Clarke Quay evening'],
    },
    {
      day: 5,
      title: 'S.E.A. Aquarium + Departure',
      description: 'After breakfast, check out of the hotel (luggage storage available). Visit the S.E.A. Aquarium on Sentosa — one of the world\'s largest aquariums with 100,000 marine animals and the 36-metre Open Ocean habitat. Back to the hotel to collect luggage, then transfer to Changi Airport for your return flight to India. Changi itself is worth 2 hours — explore the Jewel Changi\'s 40-metre indoor waterfall and lush forest valley even before your departure. Arrive back in Delhi or Mumbai same evening.',
      meals: 'Breakfast',
      hotel: 'Departure',
      activities: ['S.E.A. Aquarium Sentosa', 'Hotel checkout', 'Jewel Changi Airport', 'Airport transfer & departure'],
    },
  ],

  includes: [
    'Return economy class flights India ↔ Singapore (IndiGo/Air India/Singapore Airlines)',
    'Singapore Tourist Visa (e-Visa, eligible nationalities)',
    '4 nights in a 4-star hotel in the city centre',
    'Daily breakfast (buffet)',
    'All airport transfers in Singapore (4 legs, private AC vehicle)',
    'Gardens by the Bay — Flower Dome + Cloud Forest tickets',
    'Universal Studios Singapore full-day ticket',
    'Marina Bay Sands SkyPark Observation Deck ticket',
    'S.E.A. Aquarium entry ticket',
    'Singapore City Tour (half-day, AC coach)',
    'Dedicated YlooTrips coordinator throughout',
    '24/7 WhatsApp emergency support',
  ],

  excludes: [
    'Travel insurance (strongly recommended — from ₹800/person)',
    'Meals other than daily breakfast',
    'Singapore Cable Car (optional — approx. SGD 35/person)',
    'Night Safari (optional add-on, approx. ₹3,500/person)',
    'Sentosa beach clubs and water activities',
    'Personal shopping expenses',
    'Gratuities for guides and drivers (appreciated)',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    {
      name: 'Meera Nair',
      country: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Booked Singapore package for our anniversary and it was absolutely perfect. The hotel was centrally located, Universal Studios was a blast, and the Supertree show was magical. YlooTrips handled every detail seamlessly.',
      date: 'January 2026',
      trip: 'Singapore Anniversary Package',
    },
    {
      name: 'Arjun Mehta',
      country: 'Delhi, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Took my wife and two kids to Singapore on this package. The kids absolutely loved Universal Studios, and we loved how clean and safe Singapore is. The package is great value — everything was included as promised.',
      date: 'March 2026',
      trip: 'Singapore Family Package',
    },
    {
      name: 'Divya Krishnan',
      country: 'Bangalore, India',
      flag: '🇮🇳',
      rating: 4,
      text: 'Smooth trip from start to finish. The YlooTrips coordinator was responsive on WhatsApp whenever we had questions. Gardens by the Bay and Marina Bay Sands were the highlights. Singapore is so easy for Indians!',
      date: 'February 2026',
      trip: 'Singapore Tour Package',
    },
    {
      name: 'Sanjay Bhatia',
      country: 'Chandigarh, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Third time booking with YlooTrips and they always deliver. Singapore package was seamlessly organised. Loved the Chinatown and Little India day — felt oddly at home! Great value for the price.',
      date: 'December 2025',
      trip: 'Singapore Tour Package',
    },
  ],

  avgRating: 4.8,
  reviewCount: 634,

  faqs: [
    {
      question: 'How much does a Singapore trip from India cost in 2026?',
      answer: 'Our all-inclusive Singapore package from India starts at ₹32,999 per person for 4 nights. This includes return flights, visa, 4-star hotel, breakfast, airport transfers, and entry tickets to Gardens by the Bay, Universal Studios, Marina Bay Sands SkyPark, and S.E.A. Aquarium. Budget ₹5,000–₹8,000 extra per person for additional meals, shopping, and optional activities like Night Safari or cable car.',
    },
    {
      question: 'Do I need a visa for Singapore from India?',
      answer: 'Indian passport holders require a Singapore Tourist Visa. Our package includes visa assistance at no extra charge. The e-Visa is processed online and takes 3–5 business days. You\'ll need a valid Indian passport (6+ months validity), confirmed return tickets, hotel booking, and bank statement showing sufficient funds (approx. SGD 500 minimum).',
    },
    {
      question: 'What is the best time to visit Singapore from India?',
      answer: 'Singapore is a year-round destination with tropical weather (25–32°C throughout the year). February to April is considered the driest period. June to August is also good. December and January can see more rain. Singapore\'s biggest festival is Chinese New Year (January/February) — worth experiencing if your dates align.',
    },
    {
      question: 'Is Singapore safe for Indian families and solo travelers?',
      answer: 'Singapore consistently ranks as one of the safest cities in the world. It has extremely low crime rates, an excellent healthcare system, and strict law enforcement. Indian food is widely available in Little India (Tekka Centre hawker food is a must). The MRT metro system is world-class — easy for first-time international travelers.',
    },
    {
      question: 'Can I fly from cities other than Delhi?',
      answer: 'Yes! We arrange flights from all major Indian cities — Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, and more. IndiGo, Air India, and Singapore Airlines all operate direct or one-stop flights to Singapore. Prices may vary slightly by departure city.',
    },
    {
      question: 'Can I customise this Singapore package?',
      answer: 'Absolutely. Call or WhatsApp us at +91-84278-31127 to customise — we can add a Bali extension (Singapore + Bali in one trip), upgrade to a 5-star hotel, add Night Safari, or extend to 6 nights. We specialise in bespoke itineraries.',
    },
  ],

  related: [
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { title: 'Thailand Budget Trip — 5 Nights', href: '/thailand-budget-trip', priceINR: 49499, image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80' },
    { title: 'Dubai Tour Package from Delhi — 5 Nights', href: '/dubai-tour-package-from-delhi', priceINR: 36499, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Singapore Tour Package from India (4 nights ₹32,999). Please share availability and details.",
  bookingHref: '/contact?package=singapore-tour-package',

  schemaHighlights: ['Gardens by the Bay Flower Dome & Cloud Forest', 'Universal Studios Singapore', 'Marina Bay Sands SkyPark', 'Sentosa Island & S.E.A. Aquarium', 'Return flights from India'],
};

export default function SingaporeTourPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
