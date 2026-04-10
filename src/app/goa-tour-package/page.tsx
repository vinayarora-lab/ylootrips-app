import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Goa Tour Package 2026 — 3 Nights Starting ₹9,999 | YlooTrips',
  description: 'Book Goa tour packages starting ₹9,999. 3 nights / 4 days — North Goa beaches, South Goa, water sports, Dudhsagar Falls, Old Goa churches. Flights + hotel included.',
  keywords: 'Goa tour package, Goa trip from Delhi, Goa holiday package 2026, Goa beach package, Goa 3 nights 4 days, Goa package cost, Goa trip cost India, Goa honeymoon package, North Goa South Goa package',
  openGraph: {
    title: 'Goa Tour Package 2026 — 3 Nights Starting ₹9,999',
    description: 'All-inclusive Goa holiday — North Goa beaches, water sports, Dudhsagar Falls, South Goa, Old Goa churches. Flights + hotel included.',
    url: 'https://www.ylootrips.com/goa-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80', width: 1200, height: 630, alt: 'Goa beach sunset tour package from India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goa Tour Package — ₹9,999 Onwards | YlooTrips',
    description: 'North Goa beaches + Water Sports + Dudhsagar Falls + South Goa. Flights + hotel included.',
    images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/goa-tour-package' },
};

const pkg: PackageData = {
  slug: 'goa-tour-package',
  canonicalUrl: 'https://www.ylootrips.com/goa-tour-package',
  metaTitle: 'Goa Tour Package 2026 — 3 Nights Starting ₹9,999 | YlooTrips',
  metaDescription: 'Book Goa tour packages starting ₹9,999. 3 nights 4 days — North Goa beaches, water sports, Dudhsagar Falls, Old Goa churches. Flights + hotel included.',
  keywords: 'Goa tour package from Delhi',
  ogImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=85',
  heroTitle: 'Goa Tour Package',
  heroSubtitle: 'Beaches · Water Sports · Dudhsagar Falls · Sunset Cruises — Sun, Sand & Spice in 4 Days',
  tagline: 'India\'s Most Popular Beach Destination',

  duration: '3 Nights / 4 Days',
  groupSize: 'Solo, Couple, Family or Group',
  difficulty: 'Easy (All Ages)',
  startLocation: 'Delhi / Mumbai → Goa (GOI/GOX)',

  priceINR: 9999,
  priceUSD: 120,
  originalPriceINR: 13999,
  depositPercent: 25,

  overview: [
    'Goa — India\'s smallest state and its most famous beach destination — is a world unto itself. Portuguese colonial churches, golden beaches stretching for kilometres, coconut-fringed coastlines, spiced seafood, beach shacks serving cold beer at sunset, and a laid-back vibe that\'s impossible to replicate. Whether you\'re after relaxation, adventure, history, or nightlife, Goa delivers it all.',
    'Our 3-night Goa package covers both the buzzing North and the serene South. Hit the famous North Goa beaches — Baga, Calangute, Anjuna — for water sports and beach shacks. Explore the baroque splendour of Old Goa\'s UNESCO World Heritage churches. Venture to the majestic Dudhsagar Waterfall — one of India\'s tallest at 310 metres. And unwind on the unspoilt white sands of South Goa\'s Palolem and Agonda beaches.',
    'Goa is extremely well-connected — direct flights from Delhi (2.5h), Mumbai (1h), Bangalore (1h), and most major Indian cities. Our package includes flights, hotel, and all transfers so you can focus on the beaches.',
    'Book with ₹2,500 advance. Free cancellation up to 10 days before departure.',
  ],

  highlights: [
    'Return flights from Delhi/Mumbai/Bangalore to Goa',
    'North Goa beaches — Baga, Calangute, Anjuna, Vagator',
    'Water sports at Baga — jet ski, parasailing, banana boat, kayaking',
    'Dudhsagar Waterfall jeep safari (310 m, one of India\'s tallest)',
    'Old Goa UNESCO heritage — Basilica of Bom Jesus, Se Cathedral',
    'South Goa — Palolem Beach, Colva Beach, Cola Beach',
    'Sunset cruise on the Mandovi River with music and dinner',
    'Spice plantation tour with Goan lunch',
    'All transfers in Goa by private AC vehicle',
    '24/7 YlooTrips support throughout',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', alt: 'Goa beach sunset palm trees', label: 'Goa Beach' },
    { src: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=800&q=80', alt: 'Dudhsagar Waterfall Goa jeep safari', label: 'Dudhsagar Falls' },
    { src: 'https://images.unsplash.com/photo-1559592413-7cbb1a8d1b68?w=800&q=80', alt: 'Old Goa Basilica of Bom Jesus church', label: 'Old Goa' },
    { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', alt: 'Goa water sports parasailing jet ski', label: 'Water Sports' },
    { src: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80', alt: 'South Goa Palolem beach peaceful', label: 'South Goa' },
  ],

  itinerary: [
    {
      day: 1,
      title: 'Arrive Goa — North Goa Beaches & Beach Shacks',
      description: 'Fly to Goa (Dabolim/Mopa Airport). Your driver will be waiting at arrivals. Transfer to your hotel in North Goa (Calangute/Baga area — the heart of the action). Check in and head straight to the beach. Baga Beach and Calangute Beach are just minutes away — hire a sunbed, take a dip in the Arabian Sea, and settle into the famous Goa pace. Lunch at a beach shack — try prawn curry rice, fish thali, and bebinca (Goan coconut dessert). Afternoon: wander through the colourful Anjuna Flea Market (Wednesdays only) or explore the boutiques in Arpora. Sundowner drinks at Baga Beach with views of the sunset over the sea. Dinner at one of Goa\'s famous beach restaurants — we recommend Britto\'s, Fiesta, or A Reverie.',
      meals: 'None',
      hotel: '3★ Hotel in North Goa',
      activities: ['Airport pickup', 'Baga and Calangute beaches', 'Beach shack lunch', 'Anjuna Flea Market (Wednesdays)', 'Sunset at Baga'],
    },
    {
      day: 2,
      title: 'Water Sports + Old Goa Heritage + Sunset Cruise',
      description: 'Morning at Baga Beach for Goa\'s famous water sports — your package includes jet ski, parasailing, banana boat ride, and bumper boat. For the brave: try the Flyboard (hovering above water on jets, additional cost) or scuba diving (additional cost, year-round). Late morning, drive to Old Goa — the former Portuguese capital and a UNESCO World Heritage Site. Visit the magnificent Basilica of Bom Jesus (1605), which houses the mortal remains of St. Francis Xavier (shown to public every 10 years). Se Cathedral (1619) is the largest church in Asia. The Church of Our Lady of Immaculate Conception in Panaji is unmissable for its famous white baroque facade. Evening: board the sunset cruise on the Mandovi River — live music, Goan buffet dinner, and glittering city lights from the water.',
      meals: 'Breakfast, Dinner (cruise)',
      hotel: '3★ Hotel in North Goa',
      activities: ['Baga water sports (jet ski, parasailing, banana boat)', 'Old Goa UNESCO churches', 'Basilica of Bom Jesus', 'Sunset Mandovi River cruise with dinner'],
    },
    {
      day: 3,
      title: 'Dudhsagar Waterfall + Spice Plantation',
      description: 'Early start for the most spectacular day of the trip — the Dudhsagar Waterfall jeep safari. Drive deep into the Bhagwan Mahavir Wildlife Sanctuary through dense jungle. Board a 4×4 jeep for the thrilling off-road trail to Dudhsagar — a 310-metre, four-tiered waterfall that plunges into an emerald pool ("Dudhsagar" means Sea of Milk). Take a dip in the natural pool at the base — unforgettable. Return via a Goa spice plantation for a guided tour of cardamom, vanilla, black pepper, turmeric, and cashew trees, followed by a traditional Goan thali lunch under the plantation canopy. Afternoon free — relax at the hotel pool or explore the Mapusa Market for Goan cashews, feni (local spirit), and spices.',
      meals: 'Breakfast, Lunch (spice plantation)',
      hotel: '3★ Hotel in North Goa',
      activities: ['Dudhsagar Falls jeep safari', 'Swimming in waterfall pool', 'Goa spice plantation tour', 'Traditional Goan thali lunch', 'Mapusa Market'],
    },
    {
      day: 4,
      title: 'South Goa Beaches + Departure',
      description: 'Check out of hotel (luggage can be stored). Morning drive to South Goa — a completely different world from the North. Palolem Beach is one of India\'s most beautiful crescent beaches, framed by headlands and lined with coconut palms. Cola Beach (hidden gem, 30-minute walk or boat ride) has a stunning freshwater lagoon meeting the sea. Colva Beach is the longest beach in Goa. South Goa has fewer crowds, calmer water, and a more relaxed atmosphere — perfect for a final morning swim and seafood lunch. Transfer to Goa Airport in time for your return flight to Delhi/Mumbai/Bangalore.',
      meals: 'Breakfast',
      hotel: 'Departure',
      activities: ['South Goa — Palolem Beach', 'Cola Beach (hidden gem)', 'Colva Beach', 'Seafood lunch', 'Airport transfer & departure'],
    },
  ],

  includes: [
    'Return economy class flights India ↔ Goa (IndiGo/Air India/SpiceJet)',
    '3 nights in a 3-star hotel in North Goa (breakfast included)',
    'All transfers in Goa by private AC vehicle',
    'Water sports at Baga: jet ski, parasailing, banana boat, bumper boat',
    'Dudhsagar Waterfall jeep safari (includes entry + jeep)',
    'Goa spice plantation tour with Goan thali lunch',
    'Old Goa heritage tour (Basilica of Bom Jesus, Se Cathedral)',
    'Mandovi River sunset cruise with dinner and live music',
    'Dedicated YlooTrips coordinator',
    '24/7 WhatsApp emergency support',
  ],

  excludes: [
    'Travel insurance (recommended — from ₹400/person)',
    'Meals other than breakfast, plantation lunch, and cruise dinner',
    'Scuba diving (optional — approx. ₹3,500/person)',
    'Flyboard at Baga (optional — approx. ₹2,500/person)',
    'Anjuna Flea Market purchases',
    'Personal shopping and alcohol',
    'Tips for driver and guide (appreciated)',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    {
      name: 'Priyanka & Vivek',
      country: 'Delhi, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Our Goa honeymoon was absolutely perfect. The Dudhsagar waterfall was breathtaking and the sunset cruise was so romantic. YlooTrips organised everything seamlessly — we just showed up and enjoyed!',
      date: 'February 2026',
      trip: 'Goa Honeymoon Package',
    },
    {
      name: 'Nikhil Joshi',
      country: 'Pune, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Went with a group of 8 friends. Best trip ever! Water sports were a blast, the beach shacks had amazing food, and Old Goa was surprisingly beautiful. Would book YlooTrips again without hesitation.',
      date: 'January 2026',
      trip: 'Goa Friends Package',
    },
    {
      name: 'Kavita Singh',
      country: 'Hyderabad, India',
      flag: '🇮🇳',
      rating: 4,
      text: 'First time in Goa and it lived up to the hype. The spice plantation lunch was a highlight I didn\'t expect to enjoy so much! South Goa beaches are stunning. Great value package.',
      date: 'March 2026',
      trip: 'Goa Tour Package',
    },
    {
      name: 'Rohan Mehta',
      country: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Smooth trip from start to finish. Driver was punctual, hotel was clean and close to the beach. Dudhsagar in a jeep was incredible. YlooTrips made it all effortless.',
      date: 'December 2025',
      trip: 'Goa Tour Package',
    },
  ],

  avgRating: 4.8,
  reviewCount: 3210,

  faqs: [
    {
      question: 'What is the best time to visit Goa?',
      answer: 'November to February is peak season — clear skies, 27–32°C, calm sea, and all beach shacks open. This is also the busiest and most expensive period. March to May is hot but beach activities continue. June to September is monsoon — dramatic green landscapes, Dudhsagar at its fullest, but rough seas mean water sports are suspended. October is shoulder season — beaches recovering, fewer crowds, better prices.',
    },
    {
      question: 'How much does a Goa trip cost from Delhi?',
      answer: 'Our all-inclusive Goa package from Delhi starts at ₹9,999 per person for 3 nights. This includes return flights, 3-star hotel, water sports, Dudhsagar jeep safari, Old Goa tour, spice plantation lunch, and sunset cruise. Budget ₹3,000–₹5,000 extra for additional meals, beach shopping, feni, scuba diving, or nightlife.',
    },
    {
      question: 'Is Goa suitable for families with children?',
      answer: 'Absolutely. Goa is excellent for families. South Goa (Palolem, Colva) has calmer waters ideal for children. Dudhsagar waterfall is a favourite with kids. Old Goa churches and the spice plantation are educational and fun. Most hotels have pools. We recommend families stay in South Goa for a calmer experience.',
    },
    {
      question: 'What is the difference between North and South Goa?',
      answer: 'North Goa (Calangute, Baga, Anjuna, Vagator) is lively, touristy, and packed with beach shacks, water sports, nightlife, and markets. South Goa (Palolem, Agonda, Cola, Colva) is quieter, more scenic, and less commercialised — better for relaxation and honeymooners. Our package covers both.',
    },
    {
      question: 'Is Goa safe for solo female travelers?',
      answer: 'Goa is generally safe and very popular with solo female travelers, especially North Goa which has an established international tourist community. We recommend using our private transfers (avoid shared autos at night), staying in the main tourist areas, and keeping our WhatsApp number saved. Standard precautions apply as with any tourist destination.',
    },
    {
      question: 'Can I extend this package to 5 or 7 nights?',
      answer: 'Yes — we offer Goa packages from 2 nights to 7 nights. A longer stay lets you explore Chapora Fort, Anjuna Cliff, the hidden Butterfly Beach, the Indo-Portuguese mansions of Fontainhas, and a day trip to Dudhsagar by train (the famous train journey). WhatsApp us at +91-84278-31127 for a custom quote.',
    },
  ],

  related: [
    { title: 'Kerala Tour Package — 5 Nights', href: '/kerala-tour-package', priceINR: 15999, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
    { title: 'Manali Tour Package — 4 Nights', href: '/manali-tour-package', priceINR: 6999, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Goa Tour Package (3 nights ₹9,999). Please share availability and details.",
  bookingHref: '/contact?package=goa-tour-package',

  schemaHighlights: ['North Goa beaches and water sports', 'Dudhsagar Waterfall jeep safari', 'Old Goa UNESCO heritage churches', 'Mandovi River sunset cruise', 'South Goa Palolem beach'],
};

export default function GoaTourPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
