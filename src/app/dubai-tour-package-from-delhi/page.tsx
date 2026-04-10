import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Dubai Tour Package from Delhi 2026 — 5 Nights Starting ₹36,499',
  description: 'Book Dubai tour packages from Delhi starting ₹36,499. 5 nights / 6 days — Burj Khalifa, Desert Safari, Dubai Mall, Palm Jumeirah. Flights + hotel + visa assistance included.',
  keywords: 'Dubai tour package from Delhi, Dubai trip from India, Dubai package 2026, Delhi to Dubai holiday package, Dubai 5 nights 6 days, cheapest Dubai tour India',
  openGraph: {
    title: 'Dubai Tour Package from Delhi 2026 — ₹36,499 Onwards',
    description: 'All-inclusive Dubai holiday from Delhi — flights, visa, hotel, Burj Khalifa, Desert Safari. Book with ₹5,000 advance.',
    url: 'https://www.ylootrips.com/dubai-tour-package-from-delhi',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80', width: 1200, height: 630, alt: 'Dubai skyline Burj Khalifa tour package from Delhi India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Tour Package from Delhi — ₹36,499 Onwards | YlooTrips',
    description: 'Flights + Hotel + Visa + Burj Khalifa + Desert Safari. Book now with ₹5,000 advance.',
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/dubai-tour-package-from-delhi' },
};

const pkg: PackageData = {
  slug: 'dubai-tour-package-from-delhi',
  canonicalUrl: 'https://www.ylootrips.com/dubai-tour-package-from-delhi',
  metaTitle: 'Dubai Tour Package from Delhi 2026 — 5 Nights Starting ₹36,499',
  metaDescription: 'Book Dubai tour packages from Delhi starting ₹36,499. 5 nights 6 days — Burj Khalifa, Desert Safari, Dubai Mall, Palm Jumeirah. Flights included.',
  keywords: 'Dubai tour package from Delhi',
  ogImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=85',
  heroTitle: 'Dubai Tour Package from Delhi',
  heroSubtitle: 'Burj Khalifa · Desert Safari · Palm Jumeirah · Dubai Mall — All in One Unforgettable Holiday',
  tagline: 'Most Popular International Package',

  duration: '5 Nights / 6 Days',
  groupSize: 'Solo, Couple or Family',
  difficulty: 'Easy (All Ages)',
  startLocation: 'Delhi (DEL) → Dubai (DXB)',

  priceINR: 36499,
  priceUSD: 437,
  originalPriceINR: 46999,
  depositPercent: 25,

  overview: [
    'Dubai — the city of gold, glamour, and jaw-dropping architecture — is India\'s most popular international destination. And for good reason: it\'s just 3 hours from Delhi, visa-on-arrival for Indians, and offers a dizzying blend of ultramodern skyscrapers, ancient souks, and endless desert dunes.',
    'Our 5-night Dubai package from Delhi covers everything you need for a truly memorable holiday: return flights, a centrally located 4-star hotel, the iconic Burj Khalifa At The Top experience, an exhilarating desert safari with barbecue dinner, a guided city tour covering Old Dubai and the Dubai Creek, a full day at Dubai Parks, and plenty of time for world-class shopping at Dubai Mall and Mall of the Emirates.',
    'Whether you\'re planning a honeymoon, a family holiday, or a solo adventure, this package is designed to maximise your time in Dubai while keeping costs affordable. Our on-ground team handles all logistics — airport transfers, activity bookings, and 24/7 support — so you can focus on making memories.',
    'Booking is easy: pay just ₹5,000 to secure your spot, and clear the balance 30 days before departure. Free cancellation up to 14 days before travel.',
  ],

  highlights: [
    'Return flights from Delhi (Indira Gandhi Airport)',
    'Burj Khalifa At The Top (124th floor observation deck)',
    'Desert Safari with BBQ dinner and cultural show',
    'Dubai City Tour — Creek, Gold Souk, Spice Souk, Burj Al Arab view',
    'Palm Jumeirah monorail and Atlantis photo stop',
    'Dubai Mall + Aquarium visit',
    'UAE Tourist Visa assistance (fees included)',
    'Airport transfers in Dubai (all 4 legs)',
    'Daily breakfast at hotel',
    '24/7 YlooTrips support during travel',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', alt: 'Dubai Burj Khalifa skyline at night', label: 'Burj Khalifa' },
    { src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', alt: 'Dubai desert safari camels dunes sunset', label: 'Desert Safari' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Dubai Creek dhow old souk', label: 'Old Dubai' },
    { src: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80', alt: 'Palm Jumeirah Dubai aerial view', label: 'Palm Jumeirah' },
    { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', alt: 'Dubai luxury hotel pool', label: 'Hotel' },
  ],

  itinerary: [
    { day: 1, title: 'Delhi Departure — Arrive Dubai', description: 'Depart Delhi on your morning/afternoon IndiGo/Air Arabia/Emirates flight (approx. 3h 15m). On arrival at Dubai International Airport, our driver will be waiting in the arrivals hall with your name board. Transfer to your 4-star hotel in Deira or Bur Dubai. Check-in, freshen up, and head out for a relaxed first evening at Dubai Creek — take an Abra (traditional water taxi) across the creek for ₹150 and explore the Gold Souk and Spice Souk at your own pace. Welcome dinner at a rooftop restaurant is optional but highly recommended.', meals: 'None', hotel: '4★ Hotel in Deira / Bur Dubai', activities: ['Airport pickup', 'Hotel check-in', 'Dubai Creek Abra ride', 'Gold Souk & Spice Souk stroll'] },
    { day: 2, title: 'Burj Khalifa + Dubai Mall', description: 'Start the day with a buffet breakfast at the hotel. Morning visit to the iconic Burj Khalifa At The Top — the world\'s tallest building at 828 metres. Your ticket includes access to the 124th-floor observation deck with sweeping 360° views across the city, desert, and Arabian Sea. Afternoon in the Dubai Mall — the world\'s largest shopping mall — including the Dubai Aquarium (underwater tunnel), indoor ice skating rink observation, and window shopping across 1,200 stores. Catch the Dubai Fountain show at sunset (free, every 30 minutes).', meals: 'Breakfast', hotel: '4★ Hotel', activities: ['Burj Khalifa 124th floor', 'Dubai Mall (4M sq ft)', 'Dubai Aquarium visit', 'Dubai Fountain show at sunset'] },
    { day: 3, title: 'Desert Safari — The Quintessential Dubai Experience', description: 'Morning free to explore at leisure — perfect for a visit to the Dubai Frame, a 150-metre picture frame that offers views of old and new Dubai, or Jumeirah Beach for photos of the sail-shaped Burj Al Arab hotel. Afternoon, your desert safari pick-up arrives at 3:30 PM. Drive 45 minutes into the red sand dunes of Lahbab Desert for an adrenaline-pumping dune bashing session in 4×4 Land Cruisers. As the sun sets, your Bedouin camp awaits: camel riding, sandboarding, henna, shisha, traditional Arabian costumes for photos, unlimited BBQ dinner with grills and salads, and a live belly dance and Tanoura show.', meals: 'Breakfast, BBQ Dinner', hotel: '4★ Hotel', activities: ['Dune bashing in 4×4', 'Camel riding', 'Sandboarding', 'Henna art', 'BBQ dinner under stars', 'Belly dance & Tanoura show'] },
    { day: 4, title: 'Palm Jumeirah + Marina + JBR Beach', description: 'Take the Palm Monorail across the iconic Palm Jumeirah — the world\'s largest man-made island. Stops at Atlantis The Palm for iconic photos and the Aquaventure Waterpark observation. Afternoon stroll along Dubai Marina, one of the world\'s largest artificial marinas, and the buzzing JBR (Jumeirah Beach Residence) walk. Enjoy sunset drinks with Marina skyline views. Optional: Dubai Marina dinner cruise (sunset dhow cruise, additional cost).', meals: 'Breakfast', hotel: '4★ Hotel', activities: ['Palm Monorail ride', 'Atlantis photo stop', 'Dubai Marina Walk', 'JBR Beach', 'Sunset Marina views'] },
    { day: 5, title: 'Dubai Parks or Free Shopping Day', description: 'Choose your Day 5 experience: Option A — Visit Motiongate Dubai, Legoland, or IMG Worlds of Adventure (largest indoor theme park in the world). Option B — Dedicate the day to shopping at Mall of the Emirates (home to Ski Dubai — indoor ski slope), Dubai Outlet Mall, or the traditional Textile Souk in Bur Dubai for bargain shopping. Evening at leisure — explore Global Village (seasonal, Oct–April) or a world-class dinner at DIFC.', meals: 'Breakfast', hotel: '4★ Hotel', activities: ['Theme park or Shopping', 'Mall of the Emirates', 'Ski Dubai (optional)', 'Textile Souk', 'Global Village (seasonal)'] },
    { day: 6, title: 'Departure — Fly Back to Delhi', description: 'Hotel breakfast and late checkout (subject to availability). Transfer to Dubai International Airport (Terminal 1/3) for your return flight to Delhi. Arrive Delhi in the afternoon/evening. Our driver will be waiting at IGI arrivals for your transfer home if pre-booked. Trip ends here — until the next adventure!', meals: 'Breakfast', hotel: 'Departure', activities: ['Hotel checkout', 'Airport transfer', 'Depart Dubai', 'Arrive Delhi'] },
  ],

  includes: [
    'Return economy class flights Delhi ↔ Dubai (IndiGo/Air Arabia/Emirates)',
    'UAE Tourist Visa (30 days single entry, all nationalities)',
    '5 nights in a 4-star centrally located hotel',
    'Daily breakfast (American buffet)',
    'All airport transfers in Dubai (4 legs, private AC vehicle)',
    'Burj Khalifa At The Top (124th floor) ticket',
    'Desert Safari with BBQ dinner (pickup + drop)',
    'Dubai City Tour (half-day, AC coach)',
    'Palm Jumeirah Monorail ticket',
    'Dubai Aquarium viewing tunnel ticket',
    'Dedicated YlooTrips coordinator throughout',
    '24/7 WhatsApp emergency support',
  ],

  excludes: [
    'Travel insurance (strongly recommended — from ₹800/person)',
    'Meals other than daily breakfast',
    'Theme park tickets (Motiongate, IMG Worlds — optional add-on)',
    'Ski Dubai entry ticket (optional — ₹3,200/person)',
    'Dhow dinner cruise (optional — ₹2,500/person)',
    'Personal shopping expenses',
    'Alcohol and bar bills',
    'Gratuities for guides and drivers (appreciated)',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    { name: 'Priya Sharma', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Booked the Dubai package for our honeymoon and it was beyond expectations! Every detail was sorted — from airport pickup to Burj Khalifa. The desert safari was the highlight of our trip. Will definitely book YlooTrips again.', date: 'February 2026', trip: 'Dubai Honeymoon Package' },
    { name: 'Rajesh Kumar', country: 'Noida, India', flag: '🇮🇳', rating: 5, text: 'Took my family of 4 on this Dubai package. The value for money is incredible — flights, visa, hotel, all activities covered at this price. The coordinator was responsive on WhatsApp throughout. Kids loved the desert safari!', date: 'January 2026', trip: 'Dubai Family Package' },
    { name: 'Ananya Verma', country: 'Gurgaon, India', flag: '🇮🇳', rating: 4, text: 'Solo female traveler here — felt completely safe and well-looked-after throughout. The hotel was in a great location, easy to explore on my own. Only feedback: the city tour could be slightly longer. Otherwise perfect!', date: 'March 2026', trip: 'Dubai Solo Trip' },
    { name: 'Vikram Singh', country: 'Chandigarh, India', flag: '🇮🇳', rating: 5, text: 'This was my third time with YlooTrips — they never disappoint. Dubai package was seamlessly organised. The visa assistance alone saved me so much stress. Highly recommend for first-time Dubai visitors.', date: 'December 2025', trip: 'Dubai Tour Package' },
  ],

  avgRating: 4.9,
  reviewCount: 847,

  faqs: [
    { question: 'How much does a Dubai trip from Delhi actually cost in 2026?', answer: 'Our all-inclusive Dubai package from Delhi starts at ₹36,499 per person for 5 nights. This includes return flights, visa, 4-star hotel with breakfast, Burj Khalifa, desert safari, and airport transfers. Budget ₹5,000–₹10,000 extra per person for meals, shopping, and optional activities like Ski Dubai or dhow cruise.' },
    { question: 'Do I need a visa for Dubai from India?', answer: 'Indian passport holders can get a UAE Tourist Visa on arrival free of charge (valid for 30 days, extendable). Our package includes visa assistance at zero extra cost. Processing takes 1–3 business days. You need a valid Indian passport (6+ months validity), confirmed return tickets, and hotel booking — which we provide.' },
    { question: 'What is the best time to visit Dubai from India?', answer: 'October to April is the best time to visit Dubai — the weather is pleasant with temperatures between 18–28°C. May to September is extremely hot (40°C+) but hotels and flights are cheaper. Ramadan (dates vary) is a good time to visit for cultural experiences, though nightlife is limited.' },
    { question: 'Can I extend the Dubai package to 7 nights?', answer: 'Yes! We offer custom packages from 3 nights to 10 nights. Call or WhatsApp us at +91-84278-31127 to customise your Dubai itinerary — we can add Abu Dhabi day trip, Yas Island, Hatta mountain safari, or upgrade to a 5-star hotel.' },
    { question: 'Is Dubai safe for solo female travelers from India?', answer: 'Dubai is one of the safest cities in the world for solo female travelers. The UAE has strict laws against harassment, the public transport is excellent, and you can wear western clothing in most areas. Our coordinator is available 24/7 on WhatsApp throughout your trip.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (GPay, PhonePe, Paytm), Net Banking, and EMI (6-month no-cost EMI available). You only need to pay ₹5,000 advance to confirm your booking.' },
  ],

  related: [
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 42999, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { title: 'Thailand Budget Trip — 5 Nights', href: '/thailand-budget-trip', priceINR: 28999, image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80' },
    { title: 'Maldives Luxury Package — 4 Nights', href: '/maldives-luxury-package', priceINR: 89999, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Dubai Tour Package from Delhi (5 nights ₹36,499). Please share availability and details.",
  bookingHref: '/contact?package=dubai-tour-package-from-delhi',

  schemaHighlights: ['Burj Khalifa observation deck', 'Desert Safari with BBQ dinner', 'Dubai Mall and Aquarium', 'Palm Jumeirah monorail', 'Return flights from Delhi'],
};

export default function DubaiTourPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
