import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// ── Mongoose model ────────────────────────────────────────────────────────────
const MobileConfigSchema = new mongoose.Schema(
  { key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed },
  { timestamps: true }
);

const MobileConfig =
  mongoose.models.MobileConfig ||
  mongoose.model('MobileConfig', MobileConfigSchema);

// ── Default config (matches RemoteConfigProvider defaults in Flutter) ─────────
const DEFAULT_CONFIG = {
  banners: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85',
  ],
  bannerLabels: ['Taj Mahal, Agra', 'Dal Lake, Kashmir', 'Bali, Indonesia', 'Kerala Backwaters'],
  stats: { travellers: '25,000+', rating: '4.9★', destinations: '150+', since: '2022' },
  trending: [
    { name: 'Bali',     country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80', price: '₹42,999', duration: '6N/7D' },
    { name: 'Kashmir',  country: 'India',     image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80',     price: '₹24,999', duration: '5N/6D' },
    { name: 'Maldives', country: 'Maldives',  image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80',  price: '₹89,999', duration: '4N/5D' },
    { name: 'Dubai',    country: 'UAE',       image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80',  price: '₹35,999', duration: '5N/6D' },
    { name: 'Thailand', country: 'Thailand',  image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80',    price: '₹28,999', duration: '5N/6D' },
  ],
  categories: [
    { emoji: '🏖️', label: 'Beach',         id: 'beach' },
    { emoji: '💑', label: 'Honeymoon',     id: 'honeymoon' },
    { emoji: '🏔️', label: 'Adventure',    id: 'adventure' },
    { emoji: '🏛️', label: 'Heritage',     id: 'heritage' },
    { emoji: '🌿', label: 'Offbeat',       id: 'offbeat' },
    { emoji: '🌍', label: 'International', id: 'international' },
  ],
  deals: [
    {
      title: 'Bali Honeymoon Special', subtitle: '6N/7D · Overwater Villa Included',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
      originalPrice: '₹89,999', salePrice: '₹62,999', discount: '30%',
      seats: 3, category: 'Honeymoon', badge: '🔥 Flash Sale',
      whatsappMsg: 'Hi! I want to book Bali Honeymoon at ₹62,999',
    },
    {
      title: 'Kashmir Valley Dreams', subtitle: '5N/6D · Houseboat + Gondola',
      image: 'https://www.ylootrips.com/reviews/sagar-kashmir.jpg',
      originalPrice: '₹34,999', salePrice: '₹24,999', discount: '28%',
      seats: 5, category: 'Adventure', badge: '⚡ Early Bird',
      whatsappMsg: 'Hi! I want to book Kashmir Valley Dreams at ₹24,999',
    },
    {
      title: 'Maldives Luxury Escape', subtitle: '4N/5D · Private Beach Resort',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80',
      originalPrice: '₹1,29,999', salePrice: '₹89,999', discount: '31%',
      seats: 2, category: 'International', badge: '💎 Luxury Pick',
      whatsappMsg: 'Hi! I want to book Maldives Luxury Escape at ₹89,999',
    },
    {
      title: 'Rajasthan Royal Circuit', subtitle: '7N/8D · Heritage Hotels',
      image: 'https://www.ylootrips.com/reviews/karan-rajasthan.jpg',
      originalPrice: '₹49,999', salePrice: '₹35,999', discount: '28%',
      seats: 8, category: 'Heritage', badge: '🏰 Bestseller',
      whatsappMsg: 'Hi! I want to book Rajasthan Royal Circuit at ₹35,999',
    },
    {
      title: 'Thailand Beach & Culture', subtitle: '5N/6D · Phuket + Bangkok',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80',
      originalPrice: '₹42,999', salePrice: '₹28,999', discount: '32%',
      seats: 6, category: 'International', badge: '✈️ Group Deal',
      whatsappMsg: 'Hi! I want to book Thailand trip at ₹28,999',
    },
  ],
  promos: [
    { emoji: '🎁', code: 'YLOO10',     title: '10% off on first booking',    sub: 'Use code at checkout' },
    { emoji: '💳', code: 'HDFC20',     title: '₹3,000 off on HDFC cards',    sub: 'Min. booking ₹30,000' },
    { emoji: '💰', code: 'EMI0',       title: '0% EMI on all bookings',       sub: 'No cost EMI up to 12 months' },
    { emoji: '🏆', code: 'WANDERLOOT', title: 'Double cashback this week',   sub: 'Earn 20% WanderLoot' },
  ],
  announcement: '',
  announcementColor: '#DC2626',
  flashSaleText: 'Flash Sale — Up to 33% OFF',
  showFlashSale: true,
  whatsappNumber: '+918427831127',
  contactEmail: 'hello@ylootrips.com',
  phone: '+91-8427831127',


  // ── Package Offers (shown in Info tab of every trip) ─────────────────────────
  packageOffers: [
    {
      icon: 'local_offer',
      color: '#059669',
      bg: '#D1FAE5',
      title: 'Early Bird Discount',
      desc: 'Book 60+ days in advance and save up to 15% on total package cost.',
      badge: 'SAVE 15%',
    },
    {
      icon: 'people',
      color: '#1A73E8',
      bg: '#DBEAFE',
      title: 'Group Booking Offer',
      desc: 'Travelling with 6+ people? Get ₹5,000 cashback per person in your WanderLoot wallet.',
      badge: 'GROUP DEAL',
    },
    {
      icon: 'favorite',
      color: '#DB2777',
      bg: '#FCE7F3',
      title: 'Honeymoon Bonus',
      desc: 'Couples get complimentary room upgrade + flower decoration + welcome cake.',
      badge: 'FREE UPGRADE',
    },
    {
      icon: 'account_balance_wallet',
      color: '#7C3AED',
      bg: '#EDE9FE',
      title: 'WanderLoot Cashback',
      desc: 'Earn ₹2,500 – ₹10,000 cashback on every booking credited to your wallet.',
      badge: '₹2,500 BACK',
    },
  ],

  // ── Visa Data per package slug ────────────────────────────────────────────────
  visaData: {
    'bali-honeymoon-package': {
      type: 'Visa on Arrival',
      fee: '$35 USD (~₹2,900)',
      validity: '30 days (extendable)',
      processing: 'Instant at Bali airport',
      required: 'Passport valid 6+ months, return ticket, hotel booking proof',
      note: '✅ Easy — obtained at the airport on arrival. No prior paperwork needed.',
    },
    'dubai-tour-package-from-delhi': {
      type: 'Tourist Visa (Required)',
      fee: '₹5,500 – ₹7,000 (30-day) | ₹9,500 (60-day)',
      validity: '30 or 60 days',
      processing: '3-5 working days',
      required: 'Passport valid 6+ months, passport photo, bank statement (3 months), confirmed hotel',
      note: '✅ YlooTrips handles your UAE visa application — we submit on your behalf!',
    },
    'maldives-luxury-package': {
      type: 'Free Visa on Arrival',
      fee: 'FREE',
      validity: '30 days',
      processing: 'Instant at Malé airport',
      required: 'Valid passport, return ticket, confirmed hotel / resort booking',
      note: '✅ No cost, no paperwork — smoothest visa in the world!',
    },
  },

  // ── Best Time to Visit per package slug ──────────────────────────────────────
  bestTimeData: {
    'kashmir-tour-package': {
      best: 'Apr – Jun & Sep – Nov',
      avoid: 'Dec – Feb (heavy snowfall, roads close)',
      months: ['❄️Jan','❄️Feb','🌸Mar','✅Apr','✅May','✅Jun','🌧️Jul','🌧️Aug','✅Sep','✅Oct','✅Nov','❄️Dec'],
      weather: 'Spring (Apr-Jun) brings blooming flowers and pleasant 15-25°C. Autumn (Sep-Nov) has clear skies and golden chinar trees.',
      tip: '⭐ Best avoided during peak summer (Jul-Aug) due to heavy rains and peak monsoon.',
    },
    'bali-honeymoon-package': {
      best: 'May – Sep (Dry Season)',
      avoid: 'Dec – Mar (heavy monsoon rains)',
      months: ['🌧️Jan','🌧️Feb','🌧️Mar','🌤️Apr','✅May','✅Jun','✅Jul','✅Aug','✅Sep','🌤️Oct','🌧️Nov','🌧️Dec'],
      weather: 'Dry season (May-Sep) offers sunny days at 27-32°C with cool evenings. Perfect beach and temple weather.',
      tip: '⭐ July-August is peak season — book 3 months in advance for honeymoon villas.',
    },
    'kerala-tour-package': {
      best: 'Oct – Mar (Post-Monsoon & Winter)',
      avoid: 'Jun – Aug (intense monsoon, floods possible)',
      months: ['✅Jan','✅Feb','✅Mar','🌤️Apr','🌤️May','🌧️Jun','🌧️Jul','🌧️Aug','🌤️Sep','✅Oct','✅Nov','✅Dec'],
      weather: 'October to March is ideal with 22-32°C, calm backwaters, and clear beaches. Monsoon (Jun-Aug) offers lush greenery but rough seas.',
      tip: '⭐ Houseboat bookings at 50% higher in December — plan ahead or visit in November for best value.',
    },
    'dubai-tour-package-from-delhi': {
      best: 'Nov – Mar (Cool & Pleasant)',
      avoid: 'Jun – Sep (extreme heat 40-50°C)',
      months: ['✅Jan','✅Feb','✅Mar','🌤️Apr','🌤️May','🌡️Jun','🌡️Jul','🌡️Aug','🌡️Sep','🌤️Oct','✅Nov','✅Dec'],
      weather: 'November to March is the golden window — 20-28°C, no humidity, perfect for desert safari and sightseeing.',
      tip: '⭐ Visit in December for Dubai Shopping Festival or January for DSF sales on luxury brands.',
    },
    'maldives-luxury-package': {
      best: 'Nov – Apr (Dry Season)',
      avoid: 'May – Oct (South-West Monsoon, rough seas)',
      months: ['✅Jan','✅Feb','✅Mar','✅Apr','🌧️May','🌧️Jun','🌧️Jul','🌧️Aug','🌧️Sep','🌤️Oct','✅Nov','✅Dec'],
      weather: 'Dry season brings crystal-clear waters (30m+ visibility), 25-30°C, and perfect snorkelling/diving conditions.',
      tip: '⭐ Manta ray season runs February-April — best time to spot them at Baa Atoll.',
    },
    'goa-tour-package': {
      best: 'Nov – Feb (Peak Season)',
      avoid: 'Jun – Sep (monsoon, rough sea, most shacks closed)',
      months: ['✅Jan','✅Feb','🌤️Mar','🌤️Apr','🌤️May','🌧️Jun','🌧️Jul','🌧️Aug','🌧️Sep','🌤️Oct','✅Nov','✅Dec'],
      weather: 'November to February is perfect at 20-30°C with calm seas, lively beach shacks, and water sports.',
      tip: '⭐ December-January is most expensive — visit in November or February for better hotel rates.',
    },
    'manali-tour-package': {
      best: 'Apr – Jun & Sep – Nov',
      avoid: 'Jan – Feb (extreme cold, Rohtang closed)',
      months: ['❄️Jan','❄️Feb','🌸Mar','✅Apr','✅May','✅Jun','🌧️Jul','🌧️Aug','✅Sep','✅Oct','✅Nov','❄️Dec'],
      weather: 'Summer (Apr-Jun) is perfect for Rohtang Pass and adventure activities at 15-25°C. Autumn clear skies offer Himalayan views.',
      tip: '⭐ For snow activities, go in January-February but expect road closures. For everything else, May-June is ideal.',
    },
    'golden-triangle-10-day': {
      best: 'Oct – Mar (Cool & Clear)',
      avoid: 'Apr – Jun (extreme heat, 40-48°C in Rajasthan)',
      months: ['✅Jan','✅Feb','✅Mar','🌡️Apr','🌡️May','🌡️Jun','🌧️Jul','🌧️Aug','🌤️Sep','✅Oct','✅Nov','✅Dec'],
      weather: 'October to March is ideal — 15-25°C for Agra and Jaipur. The Taj Mahal looks its most magical on misty winter mornings.',
      tip: '⭐ Full moon nights at Taj Mahal (booking required) — check the lunar calendar when planning your trip.',
    },
    'rajasthan-heritage-7-day': {
      best: 'Oct – Mar (Winter, festivals)',
      avoid: 'May – Jul (desert heat up to 50°C)',
      months: ['✅Jan','✅Feb','✅Mar','🌡️Apr','🌡️May','🌡️Jun','🌧️Jul','🌧️Aug','🌤️Sep','✅Oct','✅Nov','✅Dec'],
      weather: 'October to March: 10-25°C, clear desert skies, Pushkar Fair (November), and Jaipur Literature Festival (January).',
      tip: '⭐ Rajasthan is magical during winter festivals — Diwali illuminates every fort and palace.',
    },
  },

  // ── Domestic slugs (no visa needed) ──────────────────────────────────────────
  domesticSlugs: [
    'kashmir-tour-package',
    'kerala-tour-package',
    'kerala-south-india-14-day',
    'goa-tour-package',
    'manali-tour-package',
    'golden-triangle-10-day',
    'rajasthan-heritage-7-day',
  ],

  // ── Hero text (remote-editable) ──────────────────────────────────────────
  heroTitle: 'Find Your Perfect\nHoliday',
  heroPill1: '25,000+ Trips',
  heroPill2: '4.9★ Rated',
  heroPill3: '150+ Destinations',

  // ── Bottom nav labels ────────────────────────────────────────────────────
  navHomeLabel: 'Home',
  navTripsLabel: 'My Trips',
  navOffersLabel: 'Offers',
  navPlannerLabel: 'AI Plan',
  navProfileLabel: 'Profile',

  // ── Quick actions grid (8 icons on home screen) ──────────────────────────
  quickActions: [
    { icon: 'flight',         label: 'Flights',  color: '#006CE4', route: '/flights'    },
    { icon: 'hotel',          label: 'Hotels',   color: '#0F766E', route: '/hotels'     },
    { icon: 'beach_access',   label: 'Holidays', color: '#E64057', route: '/trips'      },
    { icon: 'directions_bus', label: 'Bus',      color: '#B45309', route: '/trips'      },
    { icon: 'directions_car', label: 'Cabs',     color: '#7C3AED', route: '/trips'      },
    { icon: 'flight_land',    label: 'Visa',     color: '#0F766E', route: '/visa-guide' },
    { icon: 'auto_awesome',   label: 'AI Plan',  color: '#6366F1', route: '/planner'    },
    { icon: 'local_offer',    label: 'Offers',   color: '#EF4444', route: '/offers'     },
  ],

  // ── Feature flags (true = enabled, false = hidden) ───────────────────────
  featureFlags: {
    tabFlights:   true,
    tabHotels:    true,
    tabHolidays:  true,
    tabAIPlanner: true,
    showFlights:  true,
    showHotels:   true,
    showVisa:     true,
    showWishlist: true,
    showReviews:  true,
    showBlogs:    true,
    showCashback: true,
  },

  // ── Web route overrides (route → URL opens as WebView) ───────────────────
  // Example: { "/blogs": "https://www.ylootrips.com/blogs" }
  webRoutes: {},

  // ── Popup / modal announcement ───────────────────────────────────────────
  popupTitle:   '',
  popupMessage: '',
  popupCta:     '',
  popupRoute:   '',
};

export async function GET() {
  try {
    await connectDB();
    const doc = await MobileConfig.findOne({ key: 'app_config' }).lean();
    const config = doc ? (doc as { value: typeof DEFAULT_CONFIG }).value : DEFAULT_CONFIG;
    return NextResponse.json(config, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    });
  } catch {
    // DB unreachable — return defaults so app always works
    return NextResponse.json(DEFAULT_CONFIG, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  }
}

export async function PUT(req: Request) {
  // Simple auth check
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();
    await MobileConfig.findOneAndUpdate(
      { key: 'app_config' },
      { key: 'app_config', value: body },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
