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
