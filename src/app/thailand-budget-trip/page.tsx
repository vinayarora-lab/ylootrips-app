import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Thailand Budget Trip 2026 — 5 Nights from ₹49,499 | YlooTrips',
  description: 'Cheapest Thailand tour packages from India starting ₹49,499. 5 nights Bangkok + Phuket — temples, street food, islands, nightlife. Flights + hotel + transfers included.',
  keywords: 'Thailand budget trip from India, Thailand tour package cheap, Bangkok Phuket package, Thailand trip cost from India 2026, cheap Thailand holiday, Thailand 5 nights 6 days',
  openGraph: {
    title: 'Thailand Budget Trip 2026 — ₹49,499 Per Person | YlooTrips',
    description: 'Bangkok temples, Phi Phi islands, floating markets, street food, nightlife. All-inclusive Thailand on a budget from India.',
    url: 'https://www.ylootrips.com/thailand-budget-trip',
    images: [{ url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80', width: 1200, height: 630, alt: 'Thailand Bangkok temple Wat Phra Kaew budget trip from India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thailand Budget Trip 2026 — ₹49,499 | YlooTrips',
    description: 'Bangkok + Phuket on a budget. Temples, islands, street food, nightlife. Book with ₹5,000 advance.',
    images: ['https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/thailand-budget-trip' },
};

const pkg: PackageData = {
  slug: 'thailand-budget-trip',
  canonicalUrl: 'https://www.ylootrips.com/thailand-budget-trip',
  metaTitle: 'Thailand Budget Trip 2026 — 5 Nights from ₹49,499',
  metaDescription: 'Cheapest Thailand packages from India starting ₹49,499. 5 nights Bangkok + Phuket — temples, islands, street food. Flights + hotel included.',
  keywords: 'Thailand budget trip from India',
  ogImage: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1600&q=85',
  heroTitle: 'Thailand Budget Trip',
  heroSubtitle: 'Bangkok Temples · Phi Phi Islands · Floating Markets · World-Class Street Food — Thailand on Your Budget',
  tagline: '5 Nights · Bangkok + Phuket · Best Value',

  duration: '5 Nights / 6 Days',
  groupSize: 'Solo, Couple or Group',
  difficulty: 'Easy (All Budgets)',
  startLocation: 'Delhi/Mumbai/Bangalore → Bangkok (BKK)',

  priceINR: 49499,
  priceUSD: 593,
  originalPriceINR: 61999,
  depositPercent: 25,

  overview: [
    'Thailand is hands-down the best value international destination from India — incredible food, stunning beaches, exotic temples, vibrant nightlife, and warm smiles everywhere you go, all at prices that leave you shocked at how little you spent. India to Bangkok is just 4 hours by air, making it ideal for long weekends and short breaks.',
    'Our budget Thailand trip splits your time between Bangkok (2 nights — temples, markets, street food, rooftop bars) and Phuket (3 nights — white sand beaches, island-hopping, snorkeling, Thai boxing shows). Both are connected by a quick 1-hour domestic flight included in your package price.',
    'This is India\'s most booked international package for good reason: you get everything — flights, hotels, transfers, guided city tour, Phi Phi island day trip, Thai cooking class, night market dinner, and more — for ₹49,499 per person. Thailand doesn\'t require a visa for Indians (30 days visa-free since 2024), and the baht is very favorable against the rupee.',
    'Whether you\'re planning your first international trip, a bachelor/bachelorette trip, a honeymoon on a budget, or a solo adventure — Thailand delivers every time. Our coordinator is on WhatsApp throughout your trip for instant support.',
  ],

  highlights: [
    'Grand Palace and Wat Phra Kaew (Temple of the Emerald Buddha)',
    'Phi Phi Islands and Maya Bay day trip by speedboat',
    'Damnoen Saduak Floating Market visit',
    'Elephant Sanctuary ethical visit (no riding)',
    'Thai cooking class with local chef',
    'Bangla Road nightlife and Muay Thai boxing show',
    'Patong or Kata Beach full day',
    'Bangkok Chinatown street food night walk',
    'Visa-free entry for Indian passport holders (30 days)',
    'All domestic Bangkok → Phuket flights included',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80', alt: 'Bangkok Grand Palace Wat Phra Kaew Thailand temple', label: 'Bangkok' },
    { src: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80', alt: 'Phi Phi Islands Phuket Thailand crystal clear water boats', label: 'Phi Phi Islands' },
    { src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80', alt: 'Thailand floating market Damnoen Saduak Bangkok', label: 'Floating Market' },
    { src: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=80', alt: 'Patong beach Phuket Thailand sunset people', label: 'Phuket Beach' },
    { src: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', alt: 'Thailand street food Bangkok night market', label: 'Street Food' },
  ],

  itinerary: [
    { day: 1, title: 'Arrive Bangkok — City of Angels', description: 'Land at Suvarnabhumi Airport (BKK). Your driver meets you at arrivals and transfers you to your hotel in central Bangkok. Evening: explore Khao San Road — the legendary backpacker street full of street food, cheap cocktails, and a carnival atmosphere. Try Pad Thai from a street cart (₹80), mango sticky rice (₹60), and a coconut smoothie. Optional: rooftop bar at Vertigo (Banyan Tree) for Bangkok skyline views.', meals: 'None', hotel: '3★ Boutique Hotel, Bangkok', activities: ['Airport transfer', 'Khao San Road', 'Street food dinner', 'Rooftop bar (optional)'] },
    { day: 2, title: 'Bangkok Temples + Floating Market', description: 'Early start for the Damnoen Saduak Floating Market (7 AM arrival before tourists flood in). Buy fresh tropical fruit, pad krapao, and boat noodles from vendors in wooden boats. Drive back to Bangkok for the Grand Palace and Wat Phra Kaew (Temple of the Emerald Buddha) — Thailand\'s most sacred site. Afternoon: Wat Arun (Temple of Dawn) accessible by the Chao Phraya ferry (₹20). Evening: Bangkok Chinatown (Yaowarat) for the city\'s best street seafood — fried crab, tom yum soup, and Thai iced tea at outdoor tables.', meals: 'Breakfast', hotel: '3★ Boutique Hotel, Bangkok', activities: ['Damnoen Saduak Floating Market', 'Grand Palace + Wat Phra Kaew', 'Wat Arun ferry trip', 'Yaowarat Chinatown street food'] },
    { day: 3, title: 'Bangkok to Phuket — Beach Life Begins', description: 'Hotel breakfast and check-out. Transfer to Suvarnabhumi Airport for your domestic flight to Phuket (1 hour, Air Asia). Arrive Phuket, pick up by hotel shuttle or private transfer to Patong or Kata Beach hotel. Afternoon: first beach day — clear Andaman Sea, sunbeds, banana boats, jet ski. Sunset drinks at a beachside bar. Evening: explore Bangla Road — Phuket\'s legendary entertainment street lined with bars, clubs, cabaret shows (Simon Cabaret), and street performances.', meals: 'Breakfast', hotel: '3★ Beach Hotel, Phuket', activities: ['Bangkok to Phuket domestic flight', 'Beach arrival', 'Patong Beach afternoon', 'Bangla Road evening'] },
    { day: 4, title: 'Phi Phi Islands — Speedboat Day Trip', description: 'The highlight of every Phuket trip. Depart at 8 AM by speedboat to the Phi Phi archipelago (45 min from Phuket). Stop at Viking Cave, snorkel at the famous Pileh Lagoon with its translucent turquoise water and limestone karsts, land at Phi Phi Don village for lunch and beach time, and — if permitted at the time of visit — see Maya Bay where The Beach was filmed. Return to Phuket by 5 PM. Dinner at Kata Beach seafood restaurant with fresh catch of the day.', meals: 'Breakfast, Seafood Dinner', hotel: '3★ Beach Hotel, Phuket', activities: ['Phi Phi speedboat tour', 'Pileh Lagoon snorkeling', 'Phi Phi Don village', 'Maya Bay visit', 'Seafood dinner'] },
    { day: 5, title: 'Elephant Sanctuary + Muay Thai Evening', description: 'Morning: visit a reputable ethical elephant sanctuary in Phuket — no riding, just observing, feeding, and bathing elephants in their natural habitat. A genuinely moving and educational experience. Afternoon: Big Buddha viewpoint (45-metre white marble Buddha on a hilltop with panoramic Phuket views) and Chalong Temple. Evening: watch a live Muay Thai boxing match at Bangla Stadium — the real deal, not a tourist show.', meals: 'Breakfast', hotel: '3★ Beach Hotel, Phuket', activities: ['Ethical elephant sanctuary', 'Big Buddha viewpoint', 'Chalong Temple', 'Muay Thai boxing match'] },
    { day: 6, title: 'Morning Beach + Departure', description: 'Final morning at Phuket\'s beach — swim, collect shells, and say goodbye to the Andaman. Hotel checkout by noon. Transfer to Phuket International Airport for your return flight to India. Land in Delhi/Mumbai/Bangalore in the evening. Trip ends here. Khob Khun Kha (Thank you in Thai)!', meals: 'Breakfast', hotel: 'Departure', activities: ['Morning beach', 'Hotel checkout', 'Airport transfer', 'Return to India'] },
  ],

  includes: [
    'Return international flights India ↔ Bangkok (IndiGo/AirAsia/Thai Airways)',
    'Bangkok to Phuket domestic flight (included)',
    '2 nights 3-star boutique hotel in Bangkok (central location)',
    '3 nights 3-star beach hotel in Phuket (Patong/Kata)',
    'Daily breakfast at both hotels',
    'All airport and hotel transfers (private AC vehicle)',
    'Bangkok city tour (Grand Palace, Wat Phra Kaew, Wat Arun)',
    'Damnoen Saduak Floating Market excursion',
    'Phi Phi Islands speedboat day trip with snorkeling',
    'Ethical elephant sanctuary visit',
    '24/7 YlooTrips WhatsApp support',
  ],

  excludes: [
    'Thailand visa (free for Indians — 30-day visa exemption)',
    'Travel insurance (strongly recommended)',
    'Meals other than daily breakfast and stated dinners',
    'Muay Thai boxing match ticket (optional — approx ₹1,200)',
    'Simon Cabaret show ticket (optional — ₹1,500)',
    'Thai cooking class (optional add-on — ₹2,000)',
    'Personal shopping',
    'Alcohol and bar bills',
    'Gratuities',
  ],

  reviews: [
    { name: 'Aditya Nair', country: 'Bangalore, India', flag: '🇮🇳', rating: 5, text: 'First international trip ever and I chose Thailand with YlooTrips — best decision of my life! The Phi Phi Islands are unreal. The package covers so much at such an affordable price. The coordinator was available on WhatsApp any time I needed help.', date: 'March 2026', trip: 'Thailand Budget Trip' },
    { name: 'Meera & Friends', country: 'Mumbai, India', flag: '🇮🇳', rating: 5, text: 'Bachelor trip for 8 people — YlooTrips organised it seamlessly. Bangla Road, Phi Phi, the floating market, Muay Thai... ticked every box. Amazing value for money. We will definitely use YlooTrips for our next group trip.', date: 'February 2026', trip: 'Thailand Group Package' },
    { name: 'Siddharth Joshi', country: 'Pune, India', flag: '🇮🇳', rating: 4, text: 'Great package overall — the Phi Phi speedboat trip alone is worth the full price. Minor suggestion: add a night at Koh Samui to the itinerary. The hotels were clean and centrally located. Would recommend to anyone planning their first international trip.', date: 'January 2026', trip: 'Thailand 6 Days Budget' },
    { name: 'Pooja Sharma', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Solo female traveler here and felt completely safe throughout. Bangkok was vibrant and fascinating, Phuket was paradise. The elephant sanctuary was the emotional highlight — you can see the animals are genuinely happy and well-cared for. YlooTrips really picks good operators.', date: 'December 2025', trip: 'Thailand Solo Budget' },
  ],

  avgRating: 4.8,
  reviewCount: 1124,

  faqs: [
    { question: 'What is the total cost of a Thailand trip from India in 2026?', answer: 'Our all-inclusive Thailand budget package starts at ₹49,499 per person (5 nights, Bangkok + Phuket). This includes return international flights, Bangkok–Phuket domestic flight, hotels, breakfast, and all listed activities. Budget ₹8,000–₹15,000 extra per person for meals, shopping, nightlife, and optional add-ons.' },
    { question: 'Do Indians need a visa for Thailand?', answer: 'No! Indians get a 30-day visa-free entry to Thailand since November 2024. You need a valid Indian passport (6+ months validity), a return ticket, and hotel booking proof. No advance application needed — you simply clear immigration on arrival.' },
    { question: 'Is Thailand budget-friendly for Indian travelers?', answer: 'Thailand is one of the most affordable international destinations for Indians. Meals cost ₹150–₹500, local transport ₹50–₹200, and accommodation ₹1,500–₹3,000/night. The exchange rate is approximately ₹2.4 per Thai Baht, making it very favorable for Indian tourists.' },
    { question: 'Which is better — Bangkok or Phuket for a first-time visitor?', answer: 'Both! Bangkok is the cultural and urban experience — temples, markets, street food, nightlife, and city energy. Phuket is the beach and island experience — crystal clear water, island hopping, snorkeling, and beach clubs. Our package gives you both in 6 days.' },
    { question: 'Can I extend the Thailand package to include Koh Samui or Chiang Mai?', answer: 'Yes! We offer custom Thailand itineraries from 5 to 14 days. Popular extensions include Chiang Mai (northern temples, trekking, night bazaar), Koh Samui (luxury island), and Krabi (rock climbing, mangroves). WhatsApp us for a customized quote.' },
    { question: 'Is Thailand safe for solo Indian travelers?', answer: 'Thailand is extremely safe for solo travelers including solo women. It\'s one of the most tourist-friendly countries in Asia. Keep standard precautions (don\'t leave drinks unattended, watch out for tuk-tuk scams), and you\'ll have a wonderful time. Our WhatsApp coordinator is available 24/7 during your trip.' },
  ],

  related: [
    { title: 'Dubai Tour Package from Delhi — 5 Nights', href: '/dubai-tour-package-from-delhi', priceINR: 35999, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 42999, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { title: 'Maldives Luxury Package — 4 Nights', href: '/maldives-luxury-package', priceINR: 89999, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Thailand Budget Trip (5 nights ₹49,499). Please share availability and details.",
  bookingHref: '/contact?package=thailand-budget-trip',
  schemaHighlights: ['Phi Phi Islands speedboat trip', 'Grand Palace Bangkok', 'Damnoen Saduak floating market', 'Ethical elephant sanctuary', 'Bangla Road nightlife'],
};

export default function ThailandBudgetTripPage() {
  return <PackagePageLayout pkg={pkg} />;
}
