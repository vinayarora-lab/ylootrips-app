import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Manali Tour Package 2026 — 4 Nights Starting ₹12,999 | YlooTrips',
  description: 'Book Manali tour packages starting ₹12,999. 4 nights / 5 days — Rohtang Pass, Solang Valley, Old Manali, Hadimba Temple. Volvo bus or flights + hotel + transfers included.',
  keywords: 'Manali tour package, Manali trip from Delhi, Manali holiday package 2026, Rohtang Pass package, Solang Valley tour, Manali 4 nights 5 days, Manali package cost, Manali trip cost India, Manali honeymoon package',
  openGraph: {
    title: 'Manali Tour Package 2026 — 4 Nights Starting ₹12,999',
    description: 'All-inclusive Manali holiday — Rohtang Pass, Solang Valley, river rafting, snow activities. Volvo + hotel + transfers included.',
    url: 'https://www.ylootrips.com/manali-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80', width: 1200, height: 630, alt: 'Manali snow mountains Rohtang Pass tour package' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manali Tour Package — ₹12,999 Onwards | YlooTrips',
    description: 'Rohtang Pass + Solang Valley + River Rafting + Snow Activities. Volvo + hotel included.',
    images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/manali-tour-package' },
};

const pkg: PackageData = {
  slug: 'manali-tour-package',
  canonicalUrl: 'https://www.ylootrips.com/manali-tour-package',
  metaTitle: 'Manali Tour Package 2026 — 4 Nights Starting ₹12,999 | YlooTrips',
  metaDescription: 'Book Manali tour packages starting ₹12,999. 4 nights 5 days — Rohtang Pass, Solang Valley, Hadimba Temple. Volvo + hotel + transfers included.',
  keywords: 'Manali tour package from Delhi',
  ogImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=85',
  heroTitle: 'Manali Tour Package',
  heroSubtitle: 'Rohtang Pass · Solang Valley · River Rafting · Snow Activities — The Himalayas in 5 Days',
  tagline: 'Most Popular Hill Station Package',

  duration: '4 Nights / 5 Days',
  groupSize: 'Solo, Couple, Family or Group',
  difficulty: 'Easy to Moderate',
  startLocation: 'Delhi → Manali (Volvo / Flight)',

  priceINR: 12999,
  priceUSD: 156,
  originalPriceINR: 17999,
  depositPercent: 25,

  overview: [
    'Manali — nestled at 2,050 metres in the Kullu Valley of Himachal Pradesh — is India\'s most beloved hill station and the gateway to the Himalayas. Snow-capped peaks, gushing rivers, pine forests, and adventure activities make it the perfect escape from the plains, whether you\'re a honeymooning couple, an adventure seeker, or a family looking for mountain magic.',
    'Our 4-night Manali package covers all the highlights: the legendary Rohtang Pass at 3,978 metres with its year-round snow (permit included), the adrenaline-packed Solang Valley with skiing and zorbing, the ancient Hadimba Devi Temple set amid towering deodar cedars, white-water river rafting on the Beas, and the charming lanes of Old Manali with its Tibetan cafés and handicraft shops.',
    'Travel from Delhi by overnight Volvo AC bus (most popular, 14 hours) or fly to Bhuntar/Kullu Airport (1 hour). Our package handles all transfers in Manali by private Innova, so you can focus on the mountains.',
    'Pay just ₹3,500 advance to confirm. Free cancellation up to 10 days before departure.',
  ],

  highlights: [
    'Rohtang Pass (3,978 m) — snow, glaciers, and Himalayan panoramas',
    'Solang Valley — skiing, zorbing, rope way, paragliding',
    'Hadimba Devi Temple — 500-year-old pagoda in deodar forest',
    'Beas River white-water rafting (Grade II–III rapids)',
    'Old Manali — Tibetan market, cafés, Manu Temple',
    'Kullu Valley — apple orchards and Beas riverside walks',
    'Vashisht hot water springs and temple',
    'All transfers in Manali by private AC Innova',
    'Overnight Volvo AC bus Delhi ↔ Manali (or flight upgrade)',
    '24/7 YlooTrips support throughout',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', alt: 'Manali Rohtang Pass snow mountains Himachal Pradesh', label: 'Rohtang Pass' },
    { src: 'https://images.unsplash.com/photo-1585136917228-e9d0b5bb5b5d?w=800&q=80', alt: 'Solang Valley Manali snow activities skiing', label: 'Solang Valley' },
    { src: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80', alt: 'Hadimba Temple Manali deodar forest', label: 'Hadimba Temple' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Beas River Manali river rafting', label: 'River Rafting' },
    { src: 'https://images.unsplash.com/photo-1548933122-5fedf3661c57?w=800&q=80', alt: 'Old Manali street market Tibetan cafes', label: 'Old Manali' },
  ],

  itinerary: [
    {
      day: 1,
      title: 'Delhi Departure — Overnight Volvo to Manali',
      description: 'Board your overnight Volvo AC semi-sleeper bus from Delhi (ISBT Kashmiri Gate or Majnu ka Tila) at 5–6 PM. The bus winds through Chandigarh and the Kullu Valley, arriving in Manali by 7–8 AM next morning. Sleep through the journey and wake up to your first Himalayan views as the bus climbs into the mountains. Alternatively, fly Delhi → Bhuntar/Kullu Airport (1h), then drive 40 km to Manali (1.5h) — ask us about the flight upgrade.',
      meals: 'None',
      hotel: 'Volvo Bus (overnight)',
      activities: ['Board Volvo from Delhi ISBT', 'Overnight journey through Chandigarh', 'Scenic mountain drive into Kullu Valley'],
    },
    {
      day: 2,
      title: 'Arrive Manali — Old Town & Hadimba Temple',
      description: 'Arrive Manali by 8 AM. Your driver will be waiting at the bus stand. Transfer to hotel, freshen up, and enjoy a hot breakfast. Morning visit to the iconic Hadimba Devi Temple (1553 AD) — a stunning pagoda-style wooden temple set in a grove of ancient deodar cedars, dedicated to Hidimba, the wife of Bhim from the Mahabharata. Nearby, stop at the Dhungri Van Vihar for a peaceful forest walk. Afternoon stroll through Old Manali — the hippie neighbourhood with colourful Tibetan cafés, handicraft shops selling woollen shawls and silver jewellery, and the ancient Manu Temple. Evening at the Mall Road for dinner and shopping.',
      meals: 'Breakfast',
      hotel: '3★ Hotel in Manali',
      activities: ['Hotel check-in', 'Hadimba Devi Temple', 'Dhungri Van forest walk', 'Old Manali & Manu Temple', 'Mall Road evening'],
    },
    {
      day: 3,
      title: 'Rohtang Pass — Snow, Glaciers & Himalayan Views',
      description: 'Early start at 7 AM for the highlight of the trip — Rohtang Pass at 3,978 metres on the Manali-Leh Highway. The drive itself is spectacular, climbing through hairpin bends with views of the Beas Valley below. At Rohtang, year-round snow awaits — enjoy sledging, snowball fights, and walks through the snowfields. The panoramic views of Lahaul Valley, Chandrabhaga peaks, and the Himalayan ranges are breathtaking. Your package includes the Rohtang Pass permit (required for all visitors) and snow gear rental if needed. Return to Manali by 4 PM. Evening at leisure — try hot momos and thukpa at a local Tibetan restaurant.',
      meals: 'Breakfast',
      hotel: '3★ Hotel in Manali',
      activities: ['Drive to Rohtang Pass (3,978 m)', 'Snow activities and sledging', 'Himalayan panoramic views', 'Rohtang permit included', 'Snow gear rental (optional)'],
    },
    {
      day: 4,
      title: 'Solang Valley + Beas River Rafting',
      description: 'Morning drive to Solang Valley — Manali\'s adventure hub, 14 km from town. In summer: zorbing (rolling downhill in a giant transparent ball), quad biking, rope way (chairlift), and paragliding. In winter (Dec–Feb): skiing on the slopes with rentals available. After Solang Valley, drive to the Beas River for white-water rafting — 14 km of Grade II–III rapids through stunning gorge scenery (approx. 1.5 hours on water). Afternoon visit to the Vashisht Village and its ancient hot water sulphur springs — perfect for sore muscles after rafting. Evening free at Mall Road.',
      meals: 'Breakfast',
      hotel: '3★ Hotel in Manali',
      activities: ['Solang Valley — zorbing, quad biking, rope way', 'Beas River white-water rafting', 'Vashisht hot springs', 'Mall Road shopping'],
    },
    {
      day: 5,
      title: 'Kullu Valley — Apple Orchards & Departure',
      description: 'Check out after breakfast. Drive down from Manali towards Delhi, stopping en route in the Kullu Valley — the "Valley of the Gods". Visit Raison and the riverside apple orchards (seasonal). Stop at the Kullu Shawl factories for genuine Kullu wool shawls at factory prices. Visit the Bijli Mahadev Temple if time permits — a 360-step climb rewarded with panoramic valley views. Reach Kullu bus stand by afternoon to board your overnight Volvo back to Delhi (arriving early morning). Alternatively, take the evening flight from Bhuntar Airport.',
      meals: 'Breakfast',
      hotel: 'Volvo Bus (overnight return)',
      activities: ['Hotel checkout', 'Kullu Valley drive', 'Apple orchards and shawl factories', 'Board overnight Volvo to Delhi'],
    },
  ],

  includes: [
    'Overnight Volvo AC semi-sleeper bus Delhi ↔ Manali (both ways)',
    '3 nights in a 3-star hotel in Manali (breakfast included)',
    'All transfers in Manali by private AC Innova',
    'Rohtang Pass permit (mandatory, included)',
    'Solang Valley activities: zorbing, rope way',
    'Beas River white-water rafting (14 km)',
    'Hadimba Temple, Old Manali, Vashisht guided tour',
    'Kullu Valley sightseeing on return',
    'Dedicated YlooTrips coordinator',
    '24/7 WhatsApp emergency support',
  ],

  excludes: [
    'Travel insurance (recommended — from ₹400/person)',
    'Meals other than daily breakfast',
    'Snow gear rental at Rohtang (approx. ₹400/person)',
    'Paragliding at Solang Valley (approx. ₹1,500/person)',
    'Skiing equipment at Solang (seasonal, approx. ₹600/hour)',
    'Horse riding at Rohtang/Solang (approx. ₹500/person)',
    'Personal shopping expenses',
    'Tips for driver and guide (appreciated)',
    'Any service not explicitly listed as included',
  ],

  reviews: [
    {
      name: 'Rahul & Pooja Verma',
      country: 'Delhi, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Perfect honeymoon trip! The snow at Rohtang was magical and river rafting was so much fun. The hotel in Manali had beautiful mountain views. YlooTrips sorted everything — highly recommend this package.',
      date: 'March 2026',
      trip: 'Manali Honeymoon Package',
    },
    {
      name: 'Amit Sharma',
      country: 'Gurgaon, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Took my college friends on this trip and we had a blast. Rohtang Pass was the highlight — snow in April was unreal. The rafting at Beas was equally thrilling. Great value at this price.',
      date: 'April 2026',
      trip: 'Manali Friends Package',
    },
    {
      name: 'Sunita Agarwal',
      country: 'Noida, India',
      flag: '🇮🇳',
      rating: 4,
      text: 'First hill station trip with family and it was wonderful. Kids loved the snow activities. The Volvo was comfortable and the driver in Manali was very knowledgeable. Only wish we had one more day!',
      date: 'May 2026',
      trip: 'Manali Family Package',
    },
    {
      name: 'Deepak Nair',
      country: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 5,
      text: 'Booked last minute and YlooTrips delivered perfectly. Everything was arranged smoothly — Rohtang permit, rafting, hotel. The mountain views from our room were worth it alone. Will be back!',
      date: 'June 2026',
      trip: 'Manali Tour Package',
    },
  ],

  avgRating: 4.8,
  reviewCount: 2340,

  faqs: [
    {
      question: 'What is the best time to visit Manali?',
      answer: 'March to June is peak season — snow at Rohtang Pass, pleasant 10–20°C weather, and all roads open. July to September brings lush green valleys but also monsoon rains and occasional landslides. October and November offer crisp autumn colours. December to February is winter — Solang Valley becomes a ski resort, but Rohtang Pass closes (Atal Tunnel to Lahaul stays open year-round). Best overall: April–June for snow + pleasant weather.',
    },
    {
      question: 'How far is Manali from Delhi and how do I get there?',
      answer: 'Manali is approximately 540 km from Delhi — about 13–14 hours by Volvo AC bus (most popular, affordable, comfortable) or 12 hours by private car. The fastest option is to fly from Delhi to Kullu/Bhuntar Airport (1 hour), then drive 40 km to Manali (1.5 hours). Our package includes the Volvo bus option; flight upgrade is available on request.',
    },
    {
      question: 'Is Rohtang Pass open year-round?',
      answer: 'Rohtang Pass is generally open from May/June to October/November. It closes during heavy winter snowfall (typically November to May). However, the Atal Tunnel (opened 2020) connects Manali to Lahaul year-round, so you can visit the Lahaul Valley even when Rohtang is closed. We always check current permit availability before your trip.',
    },
    {
      question: 'Do I need a permit for Rohtang Pass?',
      answer: 'Yes — all vehicles require a Rohtang Pass permit (Green Tax) to visit. Our package includes the permit at no extra cost. The permit is limited (only 1,200 non-commercial vehicles/day), so we book it well in advance. In peak season (May–June), permits sell out — another reason to book early.',
    },
    {
      question: 'Is Manali safe for solo female travelers?',
      answer: 'Manali is generally safe for solo female travelers, especially Old Manali which has a well-established backpacker community. Our female travelers consistently rate it highly. We recommend staying in the main town areas, using our private transfers, and avoiding isolated areas after dark. Our 24/7 WhatsApp support is always available.',
    },
    {
      question: 'Can I extend to Spiti Valley or Leh-Ladakh from Manali?',
      answer: 'Absolutely — Manali is the starting point for both the legendary Manali-Leh Highway (opens June) and the Spiti Valley circuit. We offer combined packages: Manali + Leh-Ladakh (7N/8D), Manali + Spiti (6N/7D), and Manali + Kasol combo. WhatsApp us at +91-84278-31127 to customise.',
    },
  ],

  related: [
    { title: 'Kashmir Tour Package — 5 Nights', href: '/kashmir-tour-package', priceINR: 18999, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80' },
    { title: 'Dubai Tour Package from Delhi — 5 Nights', href: '/dubai-tour-package-from-delhi', priceINR: 35999, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { title: 'Thailand Budget Trip — 5 Nights', href: '/thailand-budget-trip', priceINR: 28999, image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Manali Tour Package (4 nights ₹12,999). Please share availability and details.",
  bookingHref: '/contact?package=manali-tour-package',

  schemaHighlights: ['Rohtang Pass snow activities', 'Solang Valley zorbing and rope way', 'Beas River white-water rafting', 'Hadimba Devi Temple', 'Old Manali and Tibetan market'],
};

export default function ManaliTourPackagePage() {
  return <PackagePageLayout pkg={pkg} />;
}
