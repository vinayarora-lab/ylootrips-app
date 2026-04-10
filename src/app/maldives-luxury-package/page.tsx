import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Maldives Luxury Package from India 2026 — 4 Nights Starting ₹89,999',
  description: 'Book Maldives luxury packages from India starting ₹89,999. 4 nights / 5 days — overwater bungalow, snorkeling, dolphin cruise, couples spa, private beach. Flights + resort + transfers included.',
  keywords: 'maldives luxury package from india, maldives trip from india cost, maldives honeymoon package india, maldives overwater bungalow india, maldives 5 days package',
  openGraph: {
    title: 'Maldives Luxury Package from India 2026 — ₹89,999 Onwards',
    description: 'All-inclusive Maldives luxury holiday from India — flights, overwater bungalow, snorkeling, dolphin cruise, couples spa. Book with ₹10,000 advance.',
    url: 'https://www.ylootrips.com/maldives-luxury-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80', width: 1200, height: 630, alt: 'Maldives overwater bungalow luxury package from India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maldives Luxury Package from India — ₹89,999 Onwards | YlooTrips',
    description: 'Flights + Overwater Bungalow + Snorkeling + Dolphin Cruise + Spa. Book now with ₹10,000 advance.',
    images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/maldives-luxury-package' },
};

const pkg: PackageData = {
  slug: 'maldives-luxury-package',
  canonicalUrl: 'https://www.ylootrips.com/maldives-luxury-package',
  metaTitle: 'Maldives Luxury Package from India 2026 — 4 Nights Starting ₹89,999',
  metaDescription: 'Book Maldives luxury packages from India starting ₹89,999. 4 nights 5 days — overwater bungalow, snorkeling, dolphin cruise, couples spa, private beach. Flights included.',
  keywords: 'maldives luxury package from india, maldives trip from india cost, maldives honeymoon package india',
  ogImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=85',
  heroTitle: 'Maldives Luxury Package',
  heroSubtitle: 'Overwater Bungalow · Crystal Lagoons · Snorkeling · Dolphin Cruise · Couples Spa — Pure Island Bliss',
  tagline: 'Most Exclusive Island Escape',

  duration: '4 Nights / 5 Days',
  groupSize: 'Couple, Honeymoon or Family',
  difficulty: 'Easy (All Ages)',
  startLocation: 'Mumbai (BOM) / Delhi (DEL) → Malé (MLE)',

  priceINR: 89999,
  priceUSD: 1079,
  originalPriceINR: 115000,
  depositPercent: 25,

  overview: [
    'The Maldives — 1,200 coral islands scattered across the Indian Ocean like jewels on silk — is the world\'s most sought-after luxury destination. And it\'s closer than you think: just a 3–4 hour flight from Mumbai or Delhi, with no visa required for Indian passport holders.',
    'Our Maldives Luxury Package from India is built around the centrepiece every traveller dreams of: a private overwater bungalow perched above a turquoise lagoon, with a glass floor panel revealing the reef below and direct ladder access into the warm Indian Ocean. Your 4 nights are spent in a premium water villa at a 5-star resort on a private atoll — fully secluded, utterly breathtaking.',
    'The itinerary balances adventure and relaxation in perfect measure: sunrise snorkeling over a house reef teeming with sea turtles and manta rays, a sunset dolphin cruise where pods of spinner dolphins race the boat, a full couples\' spa day with traditional Maldivian healing therapies, and long golden afternoons on your private sundeck with nothing but ocean as far as the eye can see.',
    'Every detail is handled by YlooTrips: return flights from Mumbai or Delhi, speedboat transfer from Malé airport to your resort, all meals (breakfast, lunch, and dinner at the resort), and a dedicated coordinator available around the clock. Pay just ₹10,000 advance to lock in your dates — the Maldives waits for no one.',
  ],

  highlights: [
    'Return flights from Mumbai or Delhi to Malé (MLE)',
    'Overwater bungalow / water villa (5-star resort, private atoll)',
    'Sunrise snorkeling over the house reef — turtles & manta rays',
    'Sunset dolphin cruise (spinner dolphins guaranteed)',
    'Couples spa — 90-min traditional Maldivian massage',
    'Semi-submarine or glass-bottom boat reef tour',
    'Full-board meals (breakfast, lunch & dinner at resort)',
    'Speedboat airport transfers (Malé ↔ resort)',
    'Private sundeck with direct ocean access',
    '24/7 YlooTrips coordinator throughout the trip',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', alt: 'Maldives overwater bungalow turquoise lagoon', label: 'Overwater Bungalow' },
    { src: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80', alt: 'Maldives snorkeling coral reef tropical fish', label: 'Snorkeling' },
    { src: 'https://images.unsplash.com/photo-1540202404-a2f29564651e?w=800&q=80', alt: 'Maldives sunset dolphin cruise ocean', label: 'Dolphin Cruise' },
    { src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80', alt: 'Maldives spa overwater treatment room', label: 'Spa & Wellness' },
    { src: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800&q=80', alt: 'Maldives private beach sunset couple', label: 'Private Beach' },
  ],

  itinerary: [
    {
      day: 1,
      title: 'Arrival in Malé — Transfer to Resort & Overwater Bungalow Check-In',
      description: 'Depart Mumbai or Delhi on your morning flight to Malé (MLE). Most IndiGo, Air India, or SriLankan Airlines flights arrive in the early afternoon. After clearing the swift immigration (no visa required for Indians), our representative will escort you to the speedboat jetty for a scenic 30–45 minute transfer across the glittering Indian Ocean to your private-island resort. Check in to your overwater bungalow — take a moment to stand on your glass floor panel and watch the reef life swimming beneath your feet. The afternoon is yours: dive straight from your private deck ladder into the warm lagoon, order a welcome coconut on the sundeck, or simply lie back and absorb the impossible blue of the horizon. Welcome dinner at the resort\'s overwater restaurant as the sun melts into the sea.',
      meals: 'Dinner',
      hotel: '5★ Overwater Water Villa',
      activities: ['Flight Mumbai/Delhi → Malé', 'Speedboat transfer to resort', 'Overwater bungalow check-in', 'Private deck swim', 'Welcome dinner at overwater restaurant'],
    },
    {
      day: 2,
      title: 'Sunrise Snorkeling — House Reef & Marine Life Discovery',
      description: 'Rise before dawn for the most magical experience in the Maldives: sunrise snorkeling on the house reef. The early-morning water is glass-calm and the reef is alive — nurse sharks resting on the sandy bottom, hawksbill sea turtles gliding past, and vast shoals of parrotfish and angelfish catching the first rays of light filtering through the coral. Your resort marine biologist accompanies the group, identifying species and pointing out hidden nudibranchs and lionfish. Back for a lavish breakfast buffet on the beach. Spend the afternoon at leisure — kayaking through the lagoon, paddleboarding, or hammock-reading above the water. Optional: join the resort\'s coral-planting programme and adopt a coral frame. Dinner is a beachside barbecue with fresh Maldivian tuna and lobster.',
      meals: 'Breakfast, Dinner',
      hotel: '5★ Overwater Water Villa',
      activities: ['Sunrise snorkeling — house reef', 'Sea turtle & reef shark sighting', 'Marine biologist guided tour', 'Kayaking & paddleboarding', 'Coral planting (optional)', 'Beach barbecue dinner'],
    },
    {
      day: 3,
      title: 'Sunset Dolphin Cruise & Couples Spa Day',
      description: 'A day of pure indulgence. After breakfast, check in to your spa appointment: a 90-minute couples massage using traditional Maldivian techniques — coconut oil, pandanus leaf, and volcanic stone — in an overwater treatment room with floor-to-ceiling views of the lagoon. Lunch at the resort\'s alfresco restaurant. At 4:30 PM, board the resort\'s dhoni (traditional Maldivian boat) for the sunset dolphin cruise. The waters around North Malé Atoll are home to large pods of spinner dolphins that leap and spin alongside the bow at dusk — it is one of the most exhilarating wildlife encounters you will ever have. Watch the sun slip below the horizon from the boat, then return to the resort for a candlelit private dinner on your overwater deck (a romantic add-on we strongly recommend).',
      meals: 'Breakfast, Lunch',
      hotel: '5★ Overwater Water Villa',
      activities: ['Couples spa — 90-min Maldivian massage', 'Overwater treatment room', 'Sunset dolphin cruise (dhoni boat)', 'Spinner dolphin sightings', 'Optional: private candlelit deck dinner'],
    },
    {
      day: 4,
      title: 'Glass-Bottom Boat Tour, Sandbank Picnic & Free Afternoon',
      description: 'Morning semi-submarine or glass-bottom boat tour over the outer reef — see coral gardens, reef sharks, eagle rays, and the surreal geometry of coral formations without getting your hair wet. After the tour, your resort arranges a sandbank excursion: a 10-minute speedboat ride to a deserted strip of white sand barely above sea level, surrounded entirely by ocean. Your butler has packed a picnic hamper with fresh fruit, sandwiches, and sparkling water. Spend a couple of hours on your own private sandbank — swim, sunbathe, or simply marvel at the fact that you are standing on a speck of sand in the middle of the Indian Ocean with no one else in sight. Back to the resort by mid-afternoon for free time: visit the underwater restaurant, try the resort\'s water slides, or do some final souvenir shopping at the boutique. Farewell dinner at the signature restaurant.',
      meals: 'Breakfast, Dinner',
      hotel: '5★ Overwater Water Villa',
      activities: ['Glass-bottom boat / semi-submarine reef tour', 'Private sandbank picnic excursion', 'Eagle rays & reef shark sightings', 'Underwater restaurant visit (optional)', 'Farewell dinner at signature restaurant'],
    },
    {
      day: 5,
      title: 'Departure — Malé Airport & Fly Home',
      description: 'Your final morning in paradise. Late checkout is available until 12:00 PM (subject to availability — confirm with your coordinator). Enjoy one last breakfast on the deck with the lagoon shimmering below. At the scheduled time, board the speedboat for your transfer back to Malé (MLE) airport. Our representative will be on hand to assist with check-in formalities. Flights depart Malé in the afternoon and evening, arriving Mumbai or Delhi late evening / early morning. You land back in India with a Maldives tan, a phone full of jaw-dropping photos, and memories that will last a lifetime.',
      meals: 'Breakfast',
      hotel: 'Departure',
      activities: ['Late checkout (subject to availability)', 'Final breakfast on overwater deck', 'Speedboat transfer to Malé airport', 'Depart Malé (MLE)', 'Arrive Mumbai / Delhi'],
    },
  ],

  includes: [
    'Return economy class flights Mumbai or Delhi ↔ Malé (IndiGo/Air India/SriLankan)',
    'Speedboat airport transfers Malé ↔ resort (both legs)',
    '4 nights in a premium overwater bungalow / water villa (5-star resort)',
    'Full-board meals — breakfast, lunch & dinner throughout',
    'Sunrise snorkeling session with marine biologist guide',
    'Sunset dolphin cruise on traditional dhoni boat',
    'Couples spa — 90-minute traditional Maldivian massage',
    'Glass-bottom boat or semi-submarine reef tour',
    'Private sandbank picnic excursion',
    'All non-motorised watersports (kayaking, paddleboard, snorkel gear)',
    'Dedicated YlooTrips coordinator throughout',
    '24/7 WhatsApp emergency support',
  ],

  excludes: [
    'Travel insurance (strongly recommended — from ₹1,200/person)',
    'Alcoholic beverages and premium minibar items',
    'Motorised watersports (jet ski, parasailing — resort rates apply)',
    'PADI scuba diving courses or dive excursions (available at resort, additional cost)',
    'Private candlelit dinner on overwater deck (romantic add-on — ₹6,500/couple)',
    'Resort spa treatments beyond the included couples massage',
    'Souvenir shopping and personal expenses',
    'Visa or entry fees for any third country transits',
    'Gratuities for resort staff and boat crews (appreciated)',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    {
      name: 'Sneha & Arjun Mehta',
      country: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Booked the Maldives luxury package for our honeymoon and it was absolutely worth every rupee. The overwater bungalow was stunning — we could literally watch fish swimming through the glass floor at midnight! The dolphin cruise was surreal. YlooTrips handled everything so seamlessly, we had zero stress. Will recommend to every couple we know.',
      date: 'February 2026',
      trip: 'Maldives Honeymoon Package',
    },
    {
      name: 'Kavitha Nair',
      country: 'Bengaluru, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Travelled with my husband for our 10th anniversary. The resort was breathtaking and the spa day was a highlight — most relaxing experience of my life. Sunrise snorkeling with sea turtles was something I will never forget. The YlooTrips coordinator was brilliant and always responded within minutes on WhatsApp.',
      date: 'January 2026',
      trip: 'Maldives Anniversary Package',
    },
    {
      name: 'Rohan Desai',
      country: 'Pune, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'First time in the Maldives and I was completely blown away. The sandbank picnic was the best thing I have ever done on a holiday — just us on a strip of white sand in the middle of the ocean. The food at the resort was incredible too. Full-board really means you eat like royalty. 100% booking again next year.',
      date: 'March 2026',
      trip: 'Maldives Luxury Island Escape',
    },
    {
      name: 'Preethi & Siddharth Rao',
      country: 'Hyderabad, India',
      flag: '🇮🇳',
      rating: 4,
      text: 'Phenomenal package at a price that genuinely surprised us. The overwater bungalow, the dolphin cruise, the snorkeling — all world-class. One small thing: our speedboat transfer was delayed by 40 minutes due to weather, but the coordinator kept us updated throughout and the resort offered complimentary drinks while we waited. Great overall experience!',
      date: 'December 2025',
      trip: 'Maldives Couples Package',
    },
  ],

  avgRating: 4.9,
  reviewCount: 612,

  faqs: [
    {
      question: 'What is the actual total cost of a Maldives trip from India in 2026?',
      answer: 'Our all-inclusive Maldives luxury package from India starts at ₹89,999 per person for 4 nights, covering return flights, overwater bungalow, full-board meals, snorkeling, dolphin cruise, spa, and all transfers. Budget an additional ₹8,000–₹15,000 per person for alcoholic drinks, motorised watersports, scuba diving, and personal expenses. The total Maldives trip cost from India for a couple is typically ₹1,80,000–₹2,10,000 all-in.',
    },
    {
      question: 'Do Indians need a visa to visit the Maldives?',
      answer: 'No, Indian passport holders receive a free 30-day on-arrival visa to the Maldives — no pre-application required. You only need a valid passport (6+ months validity), confirmed return ticket, and proof of accommodation (which we provide). The visa is stamped at Malé Velana International Airport immediately on arrival.',
    },
    {
      question: 'What is the best time to visit the Maldives from India?',
      answer: 'November to April is the best time to visit the Maldives — the northeast monsoon season brings dry weather, crystal-clear water visibility (up to 30 metres), and calm seas ideal for snorkeling and water activities. May to October is the wetter southwest monsoon season; resorts offer heavy discounts (up to 40%) but you may encounter rain showers. Our package operates year-round — contact us for the best seasonal rates.',
    },
    {
      question: 'Is the Maldives worth it for Indian travellers — is it overhyped?',
      answer: 'Genuinely, the Maldives is one of those rare destinations that exceeds the hype. The colour of the water, the coral reef beneath your bungalow, the total isolation of a private island — no photograph fully prepares you for it. For Indian travellers, the flight time is short (3–4 hours), the currency is easy (USD accepted everywhere), and no visa is needed. At ₹89,999 for a full luxury package including overwater villa and full-board, the value is exceptional by international standards.',
    },
    {
      question: 'Can I upgrade to a bigger water villa or add extra nights?',
      answer: 'Absolutely. We offer custom packages from 3 to 10 nights across multiple resort categories — from boutique 4-star guesthouses on local islands to ultra-luxury 5-star private-island resorts with butler service. We can also add Abu Dhabi or Sri Lanka as a stopover. WhatsApp us at +91-84278-31127 to customise your Maldives itinerary — we respond within 1 hour.',
    },
    {
      question: 'What payment options are available and is the package refundable?',
      answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (GPay, PhonePe, Paytm), Net Banking, and no-cost EMI for up to 6 months. Pay just ₹10,000 per person advance to confirm your booking. Full cancellation is free up to 21 days before departure; 50% refund between 14–21 days; no refund within 14 days (resort cancellation policy applies). Travel insurance is strongly recommended.',
    },
  ],

  related: [
    { title: 'Dubai Tour Package from Delhi — 5 Nights', href: '/dubai-tour-package-from-delhi', priceINR: 36499, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { title: 'Thailand Budget Trip — 5 Nights', href: '/thailand-budget-trip', priceINR: 49499, image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Maldives Luxury Package (4 nights ₹89,999). Please share availability and details.",
  bookingHref: '/contact?package=maldives-luxury-package',

  schemaHighlights: [
    'Overwater bungalow / water villa at 5-star resort',
    'Sunrise snorkeling with sea turtles and manta rays',
    'Sunset dolphin cruise on traditional dhoni boat',
    '90-minute couples spa with Maldivian massage',
    'Private sandbank picnic excursion',
    'Return flights from Mumbai or Delhi',
  ],
};

export default function MaldivesLuxuryPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
