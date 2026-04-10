import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Kashmir Tour Package 2026 — 5 Nights Starting ₹18,999 | YlooTrips',
  description: 'Book Kashmir tour packages starting ₹18,999. 5 nights / 6 days — Dal Lake houseboat, Gulmarg, Pahalgam, Sonamarg. Flights + hotel + shikara ride included. Book now.',
  keywords: 'Kashmir tour package, Kashmir trip from Delhi, Kashmir holiday package 2026, Dal Lake houseboat package, Gulmarg tour package, Kashmir 5 nights 6 days, Kashmir package cost, Kashmir trip cost India',
  openGraph: {
    title: 'Kashmir Tour Package 2026 — 5 Nights Starting ₹18,999',
    description: 'All-inclusive Kashmir holiday — Dal Lake houseboat, Gulmarg cable car, Pahalgam meadows, Sonamarg glaciers. Flights + hotel + shikara included.',
    url: 'https://www.ylootrips.com/kashmir-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80', width: 1200, height: 630, alt: 'Kashmir Dal Lake houseboat tour package from India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kashmir Tour Package — ₹18,999 Onwards | YlooTrips',
    description: 'Dal Lake Houseboat + Gulmarg + Pahalgam + Sonamarg. Flights + hotel + shikara ride. Book now.',
    images: ['https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/kashmir-tour-package' },
};

const pkg: PackageData = {
  slug: 'kashmir-tour-package',
  canonicalUrl: 'https://www.ylootrips.com/kashmir-tour-package',
  metaTitle: 'Kashmir Tour Package 2026 — 5 Nights Starting ₹18,999 | YlooTrips',
  metaDescription: 'Book Kashmir tour packages starting ₹18,999. 5 nights 6 days — Dal Lake houseboat, Gulmarg, Pahalgam, Sonamarg. Flights + hotel + shikara included.',
  keywords: 'Kashmir tour package from Delhi',
  ogImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1600&q=85',
  heroTitle: 'Kashmir Tour Package',
  heroSubtitle: 'Dal Lake · Gulmarg · Pahalgam · Sonamarg — Heaven on Earth in 6 Days',
  tagline: 'Most Popular Domestic Honeymoon Destination',

  duration: '5 Nights / 6 Days',
  groupSize: 'Couple, Family or Group',
  difficulty: 'Easy to Moderate',
  startLocation: 'Delhi → Srinagar (SXR)',

  priceINR: 18999,
  priceUSD: 228,
  originalPriceINR: 24999,
  depositPercent: 25,

  overview: [
    'Kashmir — rightfully called "Heaven on Earth" — is India\'s most breathtaking destination. Snow-capped Himalayan peaks, emerald meadows bursting with wildflowers, the serene expanse of Dal Lake with its iconic shikaras and houseboats, and the charming hospitality of Kashmiri people make this a journey unlike any other in the world.',
    'Our 5-night Kashmir package covers the four essential experiences: a night on a traditional wooden houseboat on Dal Lake, the Gulmarg Gondola cable car to 13,000 feet with its panoramic Himalayan views and winter skiing, the pastoral beauty of Pahalgam and Betaab Valley immortalised in Bollywood films, and the otherworldly glacial landscape of Sonamarg.',
    'Kashmir is a year-round destination — visit in summer (April to September) for meadows carpeted in wildflowers, or in winter (December to February) for magical snowscapes and skiing in Gulmarg. Our Kashmiri guides have 10+ years of experience and speak Hindi, English, and Kashmiri — ensuring a safe, immersive experience.',
    'Book with just ₹5,000 advance. Balance due 30 days before travel. Free cancellation up to 14 days before departure.',
  ],

  highlights: [
    'Return flights from Delhi to Srinagar',
    'Night on iconic Dal Lake houseboat (traditional wooden houseboat)',
    'Shikara ride on Dal Lake at sunrise',
    'Gulmarg Gondola — Phase 1 + Phase 2 cable car to 13,400 ft',
    'Pahalgam + Betaab Valley + Aru Valley day trip',
    'Sonamarg glacier day trip (Thajiwas Glacier)',
    'Old Srinagar City Tour — Mughal Gardens, Shankaracharya Temple',
    'All hotel/houseboat accommodation with meals',
    'All transfers in AC Innova / Tempo Traveller',
    '24/7 YlooTrips + local guide support throughout',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80', alt: 'Dal Lake Kashmir houseboat shikara sunrise', label: 'Dal Lake' },
    { src: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80', alt: 'Gulmarg Kashmir snow mountains cable car', label: 'Gulmarg' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Pahalgam valley Kashmir green meadows river', label: 'Pahalgam' },
    { src: 'https://images.unsplash.com/photo-1548933122-5fedf3661c57?w=800&q=80', alt: 'Sonamarg Kashmir glacier snow mountains', label: 'Sonamarg' },
    { src: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80', alt: 'Mughal Gardens Srinagar Kashmir tulips', label: 'Mughal Gardens' },
  ],

  itinerary: [
    {
      day: 1,
      title: 'Delhi → Srinagar — Dal Lake Houseboat Check-in',
      description: 'Fly from Delhi to Srinagar (approx. 1h 30m) on IndiGo or Air India. On arrival at Sheikh ul-Alam International Airport, your Kashmiri guide will be waiting. Transfer directly to Dal Lake and board your traditional wooden houseboat — lovingly hand-carved and furnished with walnut wood furniture and Kashmiri carpets. Settle in over a cup of hot Kashmiri kahwa (saffron tea). Evening shikara ride on the glassy waters of Dal Lake, gliding past the famous floating vegetable markets, lotus gardens, and cheerful shikara vendors. Dinner aboard your houseboat — a feast of authentic Wazwan cuisine: rogan josh, yakhni, dam aloo, and Kashmiri pulao.',
      meals: 'Dinner',
      hotel: 'Luxury Houseboat on Dal Lake',
      activities: ['Airport pickup', 'Dal Lake houseboat check-in', 'Evening shikara ride', 'Wazwan dinner onboard'],
    },
    {
      day: 2,
      title: 'Dal Lake Sunrise Shikara + Srinagar City Tour',
      description: 'Wake up early for the most magical experience in Kashmir — a sunrise shikara ride through the floating flower market. Watch Kashmiri farmers paddle their vegetable-laden boats to market in the golden morning light. Breakfast on the houseboat. Morning visit to the famous Mughal Gardens: Nishat Bagh (Garden of Joy, built 1633) and Shalimar Bagh (Garden of Love, built by Emperor Jahangir for his queen Nur Jahan). Visit the 1,000-year-old Shankaracharya Temple perched on a hill with panoramic views of Srinagar. Afternoon at the Hazratbal Shrine and the old city bazaars — pick up Kashmiri handicrafts: pashmina shawls, walnut wood carvings, saffron, and carpets. Check-in at hotel in the evening.',
      meals: 'Breakfast',
      hotel: '4★ Hotel in Srinagar',
      activities: ['Sunrise shikara + floating flower market', 'Nishat Bagh & Shalimar Bagh Mughal Gardens', 'Shankaracharya Temple', 'Hazratbal Shrine', 'Srinagar bazaar shopping'],
    },
    {
      day: 3,
      title: 'Gulmarg — Gondola Cable Car to the Top of the World',
      description: 'Drive 50 km from Srinagar to Gulmarg (Meadow of Flowers) at 2,653 metres. En route, stop at the Bibi Nandini temple and enjoy views of snow peaks. At Gulmarg, board the famous Gulmarg Gondola — one of the world\'s highest cable car systems. Phase 1 takes you to Kongdori (3,099 m) for stunning views of the Pir Panjal range and the Himalayas including Nanga Parbat (8,126 m). Phase 2 continues to Apharwat Peak at 3,979 metres — often snow-covered even in summer. At the top, walk on snow, enjoy hot maggi and tea, and take panoramic photos of an entire world of white peaks. In winter (Dec–Feb), Gulmarg is one of Asia\'s best skiing destinations — we can arrange ski equipment rental. Return to Srinagar hotel by evening.',
      meals: 'Breakfast',
      hotel: '4★ Hotel in Srinagar',
      activities: ['Drive Srinagar → Gulmarg', 'Gulmarg Gondola Phase 1 & Phase 2', 'Snow activities at Apharwat Peak', 'Pir Panjal panoramic views'],
    },
    {
      day: 4,
      title: 'Pahalgam — Betaab Valley, Aru Valley & Lidder River',
      description: 'Drive 2.5 hours from Srinagar to Pahalgam (Valley of Shepherds) at 2,130 metres — the filming location for countless Bollywood blockbusters including "Bobby", "Jab Tak Hai Jaan", and "Paheli". Stop at Awantipora ruins — the 9th-century temples of King Avantivarman. Arrive in Pahalgam and explore the beautiful Aru Valley, a flat meadow surrounded by pine forests and snow peaks — perfect for a gentle walk. Visit the famous Betaab Valley (named after the 1983 Bollywood film shot here) with its crystal-clear Lidder River and dramatic rock cliffs. Optional: pony ride or walk to Chandanwari (4 km). Return to Srinagar in the evening.',
      meals: 'Breakfast',
      hotel: '4★ Hotel in Srinagar',
      activities: ['Drive to Pahalgam via Awantipora', 'Betaab Valley (Bollywood location)', 'Aru Valley walk', 'Lidder River bank', 'Optional: pony ride'],
    },
    {
      day: 5,
      title: 'Sonamarg — Thajiwas Glacier & Himalayan Meadows',
      description: 'Drive 80 km northeast of Srinagar to Sonamarg (Meadow of Gold) at 2,740 metres — one of the most scenic drives in India through the Sindh Valley. Sonamarg is the last accessible major point before Ladakh on the Srinagar-Leh highway. From the meadow, hire a pony or local vehicle (additional cost) to reach the Thajiwas Glacier — a massive river of blue-white ice descending from Himalayan peaks. Walk on the glacier, play in the snow, and take in the extraordinary landscape of ice, wildflowers, and towering peaks. The views on the drive back towards Srinagar as the sun sets over the mountains are unforgettable. Evening at leisure in Srinagar.',
      meals: 'Breakfast',
      hotel: '4★ Hotel in Srinagar',
      activities: ['Drive Srinagar → Sonamarg', 'Sindh Valley scenic drive', 'Thajiwas Glacier (pony/walk)', 'Snow activities', 'Return to Srinagar'],
    },
    {
      day: 6,
      title: 'Departure — Srinagar to Delhi',
      description: 'Final morning breakfast at the hotel. Time permitting, visit the Lal Chowk clock tower — the historic heart of Srinagar. Last-minute shopping at the Government Arts Emporium for quality-certified Kashmiri handicrafts: genuine pashmina, khatamband woodwork, and Kashmiri saffron (world\'s most expensive spice). Transfer to Srinagar Airport for your return flight to Delhi. Arrive back in Delhi by afternoon. Your Kashmir memories will last a lifetime.',
      meals: 'Breakfast',
      hotel: 'Departure',
      activities: ['Lal Chowk visit', 'Handicrafts shopping', 'Airport transfer', 'Depart Srinagar → Delhi'],
    },
  ],

  includes: [
    'Return economy class flights Delhi ↔ Srinagar (IndiGo/Air India)',
    '1 night on luxury Dal Lake houseboat (all meals)',
    '4 nights in a 4-star hotel in Srinagar (breakfast included)',
    'All transfers in private AC Innova / Tempo Traveller',
    'Gulmarg Gondola — Phase 1 + Phase 2 tickets',
    'Dal Lake shikara ride (sunrise + evening)',
    'Mughal Gardens entry (Nishat Bagh + Shalimar Bagh)',
    'Pahalgam + Betaab Valley + Aru Valley excursion',
    'Sonamarg + Thajiwas Glacier excursion',
    'Srinagar city tour (Shankaracharya Temple, Hazratbal)',
    'Experienced local Kashmiri guide throughout',
    '24/7 YlooTrips + emergency WhatsApp support',
  ],

  excludes: [
    'Travel insurance (strongly recommended — from ₹600/person)',
    'Meals other than houseboat meals and hotel breakfast',
    'Pony rides at Sonamarg and Pahalgam (approx. ₹400–800/person)',
    'Skiing equipment rental at Gulmarg (seasonal)',
    'Personal shopping expenses',
    'Tips for guides and drivers (appreciated)',
    'Any Ladakh extensions (we offer separate Leh-Ladakh packages)',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    {
      name: 'Neha & Rohit Gupta',
      country: 'Delhi, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Booked Kashmir as our honeymoon destination — it was absolutely ethereal. The houseboat night on Dal Lake was magical, and the Gulmarg gondola views are something we\'ll never forget. YlooTrips handled everything perfectly.',
      date: 'April 2026',
      trip: 'Kashmir Honeymoon Package',
    },
    {
      name: 'Suresh Patel',
      country: 'Ahmedabad, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Took the family of 5 to Kashmir. The kids loved playing in snow at Gulmarg. Our guide Altaf was incredibly knowledgeable and made the trip extra special. Value for money is excellent — highly recommend YlooTrips.',
      date: 'May 2026',
      trip: 'Kashmir Family Package',
    },
    {
      name: 'Anjali Sharma',
      country: 'Pune, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'First time visiting Kashmir and I was blown away. The houseboat experience alone is worth the trip. Betaab Valley was like stepping into a Bollywood movie. Everything was organised flawlessly by YlooTrips.',
      date: 'June 2026',
      trip: 'Kashmir Tour Package',
    },
    {
      name: 'Karan Malhotra',
      country: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 4,
      text: 'Great package overall. Sonamarg and Pahalgam were the highlights. Only minor issue: we wished we had one more day in Pahalgam. Otherwise everything was smooth and well-coordinated. Will book YlooTrips again.',
      date: 'March 2026',
      trip: 'Kashmir Tour Package',
    },
  ],

  avgRating: 4.9,
  reviewCount: 1124,

  faqs: [
    {
      question: 'What is the best time to visit Kashmir?',
      answer: 'Kashmir is beautiful year-round. April to June is peak season — tulips bloom (April), weather is pleasant (15–25°C), and all roads are open. July to September brings lush green meadows and the famous Dal Lake at its most scenic. October sees changing autumn colours. December to February offers magical snow and world-class skiing at Gulmarg, though temperatures drop to -5°C to -15°C.',
    },
    {
      question: 'Is Kashmir safe to visit in 2026?',
      answer: 'Kashmir is safe for tourists in 2026. The tourism industry is thriving — hotels, restaurants, and houseboat businesses depend on tourism and are extremely welcoming. Our local guides are from Kashmir and have been operating for 10+ years. We stay updated on ground conditions and proactively advise customers. Millions of Indian tourists visit Kashmir annually without any issues.',
    },
    {
      question: 'How much does a Kashmir trip cost from Delhi?',
      answer: 'Our all-inclusive Kashmir package starts at ₹18,999 per person for 5 nights. This includes return flights from Delhi, houseboat night, 4-star hotel (4 nights), all transfers, Gulmarg Gondola, and all excursions. Budget ₹3,000–₹5,000 extra per person for additional activities (pony rides, skiing), meals outside breakfast, and shopping.',
    },
    {
      question: 'Do I need any special permits to visit Kashmir?',
      answer: 'Indian citizens do not need any special permit to visit Srinagar, Gulmarg, Pahalgam, or Sonamarg. These are the standard tourist areas covered in our package. If you want to extend to Leh-Ladakh (requires an Inner Line Permit for certain areas), we can arrange that separately. Foreign nationals require standard Indian tourist visa — no additional permit needed for main Kashmir areas.',
    },
    {
      question: 'What should I pack for Kashmir?',
      answer: 'In summer (April–September): light woollens, a fleece jacket, sunscreen, and sunglasses (UV is intense at altitude). In winter (October–February): heavy winter jacket, thermal innerwear, snow boots, gloves, and a balaclava. Year-round: comfortable walking shoes, a rain jacket (July–August monsoons), and an extra layer — temperatures drop significantly at night even in summer.',
    },
    {
      question: 'Can I extend to Leh-Ladakh from this Kashmir package?',
      answer: 'Yes! We offer a popular Kashmir + Ladakh combo — typically 9 nights (5N Kashmir + 4N Leh-Ladakh). The journey from Sonamarg to Leh via the Zoji La pass (open June to October) is one of India\'s most spectacular drives. WhatsApp us at +91-84278-31127 to customise your itinerary.',
    },
  ],

  related: [
    { title: 'Dubai Tour Package from Delhi — 5 Nights', href: '/dubai-tour-package-from-delhi', priceINR: 36499, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { title: 'Maldives Luxury Package — 4 Nights', href: '/maldives-luxury-package', priceINR: 89999, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Kashmir Tour Package (5 nights ₹18,999). Please share availability and details.",
  bookingHref: '/contact?package=kashmir-tour-package',

  schemaHighlights: ['Dal Lake houseboat and shikara ride', 'Gulmarg Gondola to 13,400 feet', 'Pahalgam Betaab Valley', 'Sonamarg Thajiwas Glacier', 'Return flights from Delhi'],
};

export default function KashmirTourPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
