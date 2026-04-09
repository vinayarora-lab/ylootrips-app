import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Kerala Tour Package 2026 — 5 Nights Starting ₹15,999 | YlooTrips',
  description: 'Book Kerala tour packages starting ₹15,999. 5 nights / 6 days — Munnar tea gardens, Alleppey houseboat, Kovalam beach, Thekkady wildlife. Flights + houseboat + hotel included.',
  keywords: 'Kerala tour package, Kerala trip from Delhi, Kerala holiday package 2026, Alleppey houseboat package, Munnar tour package, Kerala 5 nights 6 days, Kerala package cost, God\'s Own Country tour',
  openGraph: {
    title: 'Kerala Tour Package 2026 — 5 Nights Starting ₹15,999',
    description: 'All-inclusive Kerala holiday — Munnar tea gardens, Alleppey houseboat, Kovalam beach, Thekkady wildlife. Flights + houseboat + hotel included.',
    url: 'https://www.ylootrips.com/kerala-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80', width: 1200, height: 630, alt: 'Kerala backwaters Alleppey houseboat tour package' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerala Tour Package — ₹15,999 Onwards | YlooTrips',
    description: 'Munnar + Alleppey Houseboat + Kovalam Beach + Thekkady. Flights + houseboat + hotel included.',
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/kerala-tour-package' },
};

const pkg: PackageData = {
  slug: 'kerala-tour-package',
  canonicalUrl: 'https://www.ylootrips.com/kerala-tour-package',
  metaTitle: 'Kerala Tour Package 2026 — 5 Nights Starting ₹15,999 | YlooTrips',
  metaDescription: 'Book Kerala tour packages starting ₹15,999. 5 nights 6 days — Munnar tea gardens, Alleppey houseboat, Kovalam beach, Thekkady wildlife. Flights + houseboat + hotel included.',
  keywords: 'Kerala tour package from Delhi',
  ogImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=85',
  heroTitle: 'Kerala Tour Package',
  heroSubtitle: 'Munnar · Alleppey Backwaters · Thekkady · Kovalam — God\'s Own Country in 6 Days',
  tagline: 'India\'s Most Scenic State',

  duration: '5 Nights / 6 Days',
  groupSize: 'Couple, Family or Group',
  difficulty: 'Easy (All Ages)',
  startLocation: 'Delhi / Mumbai → Kochi (COK)',

  priceINR: 15999,
  priceUSD: 192,
  originalPriceINR: 20999,
  depositPercent: 25,

  overview: [
    'Kerala — "God\'s Own Country" — is India\'s most breathtakingly beautiful state. Emerald tea estates rolling across misty hilltops, serene backwater canals lined with coconut palms, pristine beaches where the Arabian Sea meets golden sand, and dense forests teeming with elephants and rare birds. Kerala is a destination that genuinely earns its reputation.',
    'Our 5-night Kerala package covers the four essential experiences: the cool highlands of Munnar with their endless carpets of tea gardens, a night on a traditional Kerala kettuvallam (rice boat houseboat) gliding through the famous Alleppey backwaters, the wildlife of Thekkady\'s Periyar Tiger Reserve, and the golden beaches of Kovalam and Varkala.',
    'Kerala is also India\'s wellness capital — Ayurvedic massages, yoga retreats, and traditional cooking classes are woven into the itinerary. The food alone (sadya feast, appam with stew, Malabar biryani, fresh kingfish curry) makes the trip worthwhile.',
    'Pay ₹4,000 advance to confirm. Free cancellation up to 10 days before departure.',
  ],

  highlights: [
    'Return flights from Delhi/Mumbai to Kochi',
    'Munnar — Eravikulam National Park, tea factory tour, Top Station viewpoint',
    'Night on Alleppey premium houseboat (full board, AC cabin)',
    'Shikara ride through narrow Alleppey backwater canals',
    'Thekkady Periyar Tiger Reserve boat safari',
    'Spice plantation visit — cardamom, pepper, vanilla',
    'Kovalam Beach — lighthouse beach, Hawa Beach',
    'Kerala Ayurvedic massage (60-minute session included)',
    'All transfers in Kerala by private AC vehicle',
    '24/7 YlooTrips support throughout',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', alt: 'Kerala Alleppey backwaters houseboat palm trees', label: 'Alleppey Backwaters' },
    { src: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800&q=80', alt: 'Munnar Kerala tea gardens hills misty', label: 'Munnar Tea Gardens' },
    { src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', alt: 'Thekkady Periyar wildlife elephants Kerala', label: 'Thekkady Wildlife' },
    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', alt: 'Kovalam beach Kerala lighthouse sunset', label: 'Kovalam Beach' },
    { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', alt: 'Kerala Ayurveda massage wellness spa', label: 'Ayurveda Wellness' },
  ],

  itinerary: [
    {
      day: 1,
      title: 'Arrive Kochi — Fort Kochi Heritage Walk',
      description: 'Fly into Cochin International Airport. Transfer to Fort Kochi — one of India\'s most charming heritage neighbourhoods, with Dutch, Portuguese, and British colonial architecture lining its quiet streets. Check in to your boutique heritage hotel in Fort Kochi. Evening heritage walk: the famous Chinese Fishing Nets (cantilever nets first introduced by traders from the court of Kublai Khan), the Santa Cruz Basilica (1505 AD), the Jewish Synagogue in Jew Town, and the spice markets of Mattancherry. Dinner at a Fort Kochi restaurant — try Kerala fish curry, prawn moilee, and appam with coconut milk stew.',
      meals: 'None',
      hotel: 'Heritage Hotel in Fort Kochi',
      activities: ['Airport pickup', 'Fort Kochi heritage walk', 'Chinese Fishing Nets', 'Jewish Synagogue', 'Spice market', 'Kerala seafood dinner'],
    },
    {
      day: 2,
      title: 'Munnar — Tea Gardens & Misty Highlands',
      description: 'Drive from Kochi to Munnar (130 km, 3.5 hours) through increasingly dramatic scenery — rubber plantations, waterfalls, and the first glimpses of tea estates. Arrive in Munnar by noon. Afternoon visits: Eravikulam National Park, home to the endangered Nilgiri Tahr mountain goat (April–June only), and the breathtaking Top Station viewpoint at 1,700 metres with panoramic views into Tamil Nadu. Visit a working tea factory for a guided tour of tea processing — from leaf plucking to packing. Walk through the Kolukkumalai tea estate (world\'s highest organic tea estate). Evening at leisure — Munali\'s misty evenings are perfect for a warm cup of fresh Munnar tea and Kerala snacks.',
      meals: 'Breakfast',
      hotel: 'Tea Estate Bungalow / Resort in Munnar',
      activities: ['Drive Kochi → Munnar', 'Eravikulam National Park', 'Top Station viewpoint', 'Tea factory tour', 'Kolukkumalai estate walk'],
    },
    {
      day: 3,
      title: 'Thekkady — Periyar Tiger Reserve & Spice Plantation',
      description: 'Drive from Munnar to Thekkady (85 km, 2.5 hours) through the Cardamom Hills. Check in at your jungle resort on the edge of the Periyar Tiger Reserve. Morning: guided spice plantation tour through cardamom, pepper, vanilla, cinnamon, and clove groves — your guide will explain the spices used in Kerala cooking. Afternoon: boat safari on Periyar Lake — cruise through the heart of the tiger reserve watching herds of wild elephants, gaur (Indian bison), Sambar deer, and prolific birdlife from the water. Kathakali dance performance in the evening — Kerala\'s classical dance-drama with elaborate costumes and makeup. Dinner at the resort.',
      meals: 'Breakfast, Dinner',
      hotel: 'Jungle Resort in Thekkady',
      activities: ['Drive Munnar → Thekkady', 'Spice plantation guided tour', 'Periyar Lake boat safari', 'Wildlife: elephants, bison, deer', 'Kathakali dance performance'],
    },
    {
      day: 4,
      title: 'Alleppey Houseboat — Backwaters of Kerala',
      description: 'Drive from Thekkady to Alleppey (140 km, 3.5 hours) — the "Venice of the East". Board your premium AC kettuvallam houseboat at noon — a traditional rice boat converted into a luxury floating cottage with a furnished bedroom, living area, sundeck, and kitchen crew. Spend the afternoon gliding through the vast network of canals, lagoons, and lakes that make up the Kerala backwaters. Watch village life unfold on the banks — women washing clothes, fishermen casting nets, children playing by the water. Sunset over the backwaters from the sundeck with fresh coconut water. Your onboard cook will prepare a spectacular Keralite dinner: karimeen pollichathu (pearl spot fish), avial, thoran, rice, and payasam dessert.',
      meals: 'Breakfast, Lunch, Dinner (onboard)',
      hotel: 'Premium AC Houseboat on Alleppey Backwaters',
      activities: ['Drive Thekkady → Alleppey', 'Houseboat boarding at noon', 'Backwater canal cruise', 'Village life observation', 'Sunset on the sundeck', 'Kerala feast dinner onboard'],
    },
    {
      day: 5,
      title: 'Alleppey Morning + Kovalam Beach',
      description: 'Wake up to a golden sunrise over the backwaters. Morning shikara ride through narrow village canals — narrower waterways inaccessible to the main houseboat, lined with coconut trees and water hyacinth. Disembark after breakfast. Drive to Kovalam (150 km, 3.5 hours) — Kerala\'s most famous beach resort. Kovalam has three crescent beaches: Lighthouse Beach (most popular, with the red-and-white lighthouse), Hawa Beach (calmer, more scenic), and Samudra Beach. Afternoon at leisure on the beach. Evening: your package includes a 60-minute traditional Kerala Ayurvedic massage at a reputed Ayurveda centre — relieving the journey fatigue with warm herbal oils. Dinner at a Kovalam beach restaurant.',
      meals: 'Breakfast, Dinner',
      hotel: 'Beach Resort in Kovalam',
      activities: ['Sunrise over backwaters', 'Village shikara ride', 'Drive to Kovalam', 'Kovalam Lighthouse Beach', 'Hawa Beach', '60-min Ayurvedic massage'],
    },
    {
      day: 6,
      title: 'Kovalam + Trivandrum Departure',
      description: 'Final morning at Kovalam Beach — last swim and breakfast by the sea. Drive to Thiruvananthapuram (Trivandrum, 16 km) for your return flight. Time permitting, visit the Padmanabhaswamy Temple — one of India\'s wealthiest temples, whose underground vaults hold an estimated ₹1.2 lakh crore in treasure. The Napier Museum of Natural History and the Kerala Zoological Gardens are also nearby. Transfer to Trivandrum International Airport for your return flight to Delhi/Mumbai. Arrive home with memories of coconut trees, backwaters, and the warmth of Kerala.',
      meals: 'Breakfast',
      hotel: 'Departure',
      activities: ['Final Kovalam beach morning', 'Drive to Trivandrum', 'Padmanabhaswamy Temple (exterior)', 'Airport transfer & departure'],
    },
  ],

  includes: [
    'Return economy class flights India ↔ Kochi (IndiGo/Air India)',
    '1 night in heritage hotel in Fort Kochi',
    '1 night in tea estate bungalow/resort in Munnar',
    '1 night in jungle resort in Thekkady',
    '1 night on premium AC houseboat (all meals)',
    '1 night in beach resort in Kovalam',
    'Daily breakfast at all hotels',
    'All transfers in Kerala by private AC vehicle',
    'Periyar Lake boat safari ticket',
    'Tea factory guided tour',
    'Spice plantation guided tour',
    '60-minute Kerala Ayurvedic massage',
    'Dedicated YlooTrips coordinator throughout',
    '24/7 WhatsApp emergency support',
  ],

  excludes: [
    'Travel insurance (recommended — from ₹500/person)',
    'Meals other than those listed above',
    'Eravikulam National Park entry (seasonal)',
    'Kathakali performance entry (approx. ₹250/person)',
    'Water sports at Kovalam (optional)',
    'Tips for driver and guide (appreciated)',
    'Any personal expenses',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    {
      name: 'Aakash & Shreya',
      country: 'Delhi, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Kerala honeymoon was everything we dreamed of. The houseboat night on the Alleppey backwaters was the most romantic experience of our lives. Munnar was misty and magical. YlooTrips made it flawless.',
      date: 'January 2026',
      trip: 'Kerala Honeymoon Package',
    },
    {
      name: 'Geeta Krishnamurthy',
      country: 'Bangalore, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Visited Kerala with my parents and it was perfect for all ages. The houseboat crew was incredibly hospitable — the food they cooked onboard was the best we had in Kerala. Thekkady wildlife safari was wonderful.',
      date: 'February 2026',
      trip: 'Kerala Family Package',
    },
    {
      name: 'Sameer Khurana',
      country: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'The variety in this package is incredible — mountains, backwaters, wildlife, beaches, all in 6 days. The Ayurvedic massage at Kovalam was a bonus I didn\'t expect to enjoy so much. Excellent organisation by YlooTrips.',
      date: 'March 2026',
      trip: 'Kerala Tour Package',
    },
    {
      name: 'Vandana Iyer',
      country: 'Chennai, India',
      flag: '🇮🇳',
      rating: 4,
      text: 'Beautiful trip overall. Fort Kochi was a lovely surprise — the heritage area is so charming. Wished we had more time in Munnar but overall a very well-designed package. The houseboat dinner was outstanding.',
      date: 'December 2025',
      trip: 'Kerala Tour Package',
    },
  ],

  avgRating: 4.9,
  reviewCount: 1876,

  faqs: [
    {
      question: 'What is the best time to visit Kerala?',
      answer: 'September to March is the best time — the monsoon has cleared, weather is pleasant (22–33°C), and all attractions are open. December to February is peak season (book well in advance). April to June is hot but manageable in the hill stations (Munnar). June to August is the Kerala monsoon — dramatically green and lush, but some outdoor activities are curtailed. The famous Onam festival (August/September) is a wonderful time to visit.',
    },
    {
      question: 'What is an Alleppey houseboat experience like?',
      answer: 'A Kerala kettuvallam houseboat is a traditional rice barge converted into a floating home. Our package includes a premium houseboat with 1 or 2 AC bedrooms, a furnished living room, open sundeck, fully equipped kitchen, and a crew of 2–3 (captain, cook, attendant). You cruise through the backwaters from noon to 8 AM next morning (overnight stay). All meals are freshly cooked onboard — it\'s one of India\'s most unique accommodation experiences.',
    },
    {
      question: 'Is this Kerala package suitable for senior travelers?',
      answer: 'Yes — Kerala is one of the most accessible Indian states for senior travelers. The terrain is flat (except Munnar), roads are excellent, and the pace of the itinerary is relaxed. The houseboat is very comfortable and low-activity. The Ayurvedic massage is therapeutic for seniors. We can customise the itinerary to reduce distances or add rest days.',
    },
    {
      question: 'Can I see elephants in Kerala?',
      answer: 'Yes — Kerala has a significant elephant population. The best places to see wild elephants are the Periyar Tiger Reserve at Thekkady (our boat safari often encounters elephants at the water\'s edge) and Wayanad Wildlife Sanctuary. Kerala also has many elephant camps and Ayurvedic elephant care centres where you can interact ethically with domesticated elephants.',
    },
    {
      question: 'What is Kerala Ayurvedic massage?',
      answer: 'Kerala is the home of authentic Panchakarma Ayurveda — a 5,000-year-old system of wellness using herbal oils, steam, and therapeutic massage. Our package includes a 60-minute Abhyangam (full-body warm oil massage) — deeply relaxing and medically beneficial. Kerala Ayurveda centres are certified by the Government of Kerala. For longer Ayurvedic treatments (7–21 days), we can arrange dedicated retreat packages.',
    },
    {
      question: 'Can I combine Kerala with Sri Lanka or Maldives?',
      answer: 'Absolutely — Trivandrum is the closest Indian city to both Sri Lanka (1.5h flight) and the Maldives (1h flight). A popular combination is 4N Kerala + 3N Maldives. We also do Kerala + Sri Lanka (Colombo/Sigiriya) packages. WhatsApp us at +91-84278-31127 for a custom multi-destination quote.',
    },
  ],

  related: [
    { title: 'Goa Tour Package — 3 Nights', href: '/goa-tour-package', priceINR: 9999, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
    { title: 'Kashmir Tour Package — 5 Nights', href: '/kashmir-tour-package', priceINR: 18999, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80' },
    { title: 'Maldives Luxury Package — 4 Nights', href: '/maldives-luxury-package', priceINR: 89999, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Kerala Tour Package (5 nights ₹15,999). Please share availability and details.",
  bookingHref: '/contact?package=kerala-tour-package',

  schemaHighlights: ['Alleppey houseboat overnight in Kerala backwaters', 'Munnar tea gardens and Eravikulam', 'Thekkady Periyar Tiger Reserve boat safari', 'Kovalam beach and Ayurvedic massage', 'Return flights from Delhi'],
};

export default function KeralaToursPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
