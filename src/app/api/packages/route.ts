import { NextResponse } from 'next/server';

// All packages shown on the website — domestic + international
// This is the single source of truth for the mobile app
const ALL_PACKAGES = [
  // ── Domestic — North India ──────────────────────────────────────────────────
  {
    id: 'dom-001', slug: 'auli-package-from-delhi',
    title: 'Auli Snow Package from Delhi',
    destination: 'Auli, Uttarakhand', category: 'domestic',
    nights: 4, days: 5, price: 6999, originalPrice: 7349,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    badge: 'Winter Favourite', rating: 4.8, reviews: 312,
    highlights: ["Asia's longest cable car", 'Views of Nanda Devi', 'Gorson Bugyal trek', 'Optional snow skiing'],
    description: 'Snow sports, scenic cable car rides and panoramic Himalayan views in Auli, Uttarakhand.',
  },
  {
    id: 'dom-002', slug: 'jibhi-tirthan-valley-trip',
    title: 'Jibhi Tirthan Valley Trip',
    destination: 'Jibhi, Himachal Pradesh', category: 'domestic',
    nights: 4, days: 5, price: 6999, originalPrice: 7349,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    badge: 'Hidden Gem', rating: 4.7, reviews: 198,
    highlights: ['Jalori Pass at 10,800 ft', 'Sarolsar Lake trek', 'Jibhi Waterfall & Thailand Pool', 'YJHD filming location'],
    description: 'Hidden gem of Himachal — serene valleys, waterfalls and Bollywood movie locations.',
  },
  {
    id: 'dom-003', slug: 'manali-solang-kasol-tour',
    title: 'Manali, Solang & Kasol Tour',
    destination: 'Manali + Kasol, Himachal Pradesh', category: 'domestic',
    nights: 4, days: 5, price: 6500, originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    badge: 'Best Seller', rating: 4.8, reviews: 521,
    highlights: ['Solang Valley adventures', 'Atal Tunnel & Sissu', 'Hidimba Temple, Old Manali', 'Kasol & Manikaran Sahib'],
    description: 'The ultimate Himachal escape — snow peaks, rivers, adventure and vibrant culture.',
  },
  {
    id: 'dom-004', slug: 'kedarnath-yatra-from-delhi',
    title: 'Kedarnath Yatra from Delhi',
    destination: 'Kedarnath, Uttarakhand', category: 'domestic',
    nights: 4, days: 5, price: 7999, originalPrice: 8399,
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    badge: 'Pilgrimage', rating: 4.9, reviews: 476,
    highlights: ['One of 12 Jyotirlingas', '16 km trek Gaurikund → Kedarnath (11,755 ft)', 'Devprayag confluence', 'Route via Haridwar & Rishikesh'],
    description: 'Sacred pilgrimage to Kedarnath — one of the 12 Jyotirlingas at 11,755 ft.',
  },
  // ── Domestic — South India ──────────────────────────────────────────────────
  {
    id: 'dom-005', slug: 'lakshadweep-tour-from-mumbai',
    title: 'Lakshadweep Island Tour',
    destination: 'Agatti & Bangaram Islands, Lakshadweep', category: 'beach',
    nights: 4, days: 5, price: 22000, originalPrice: 23100,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    badge: 'Luxury Pick', rating: 4.9, reviews: 167,
    highlights: ['Snorkeling, scuba & kayaking', 'Bangaram Island dolphins & turtles', 'Glass boat rides & island hopping', 'Thinnakara Island sandbank'],
    description: 'Crystal-clear lagoons, coral reefs and pristine beaches of the remote Lakshadweep Islands.',
  },
  {
    id: 'dom-006', slug: 'coorg-tour-from-bangalore',
    title: 'Coorg Weekend Tour from Bangalore',
    destination: 'Coorg (Kodagu), Karnataka', category: 'domestic',
    nights: 2, days: 3, price: 3287, originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    badge: 'Weekend Escape', rating: 4.6, reviews: 289,
    highlights: ['Mandalpatti Viewpoint', 'Abbey Falls', "Raja's Seat sunset", 'Elephant interaction', 'Namdroling Monastery'],
    description: 'Rolling coffee estates, spice trails and misty valleys — the Scotland of India.',
  },
  // ── Domestic — Himalayan Treks ──────────────────────────────────────────────
  {
    id: 'dom-007', slug: 'spiti-valley-winter-tour',
    title: 'Winter Spiti Valley Tour',
    destination: 'Spiti Valley, Himachal Pradesh', category: 'adventure',
    nights: 7, days: 8, price: 14999, originalPrice: 15749,
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    badge: 'Epic Journey', rating: 4.9, reviews: 143,
    highlights: ["World's highest suspension bridge (Chicham)", "World's highest post office (Hikkim)", 'Key & Tabo Monasteries', "Chitkul — India's last village before Tibet"],
    description: 'The last frontier — snow-capped monasteries, desolate valleys and surreal landscapes of Spiti.',
  },
  {
    id: 'dom-008', slug: 'chopta-tungnath-chandrashila-trek',
    title: 'Chopta Tungnath & Chandrashila Trek',
    destination: 'Chopta, Uttarakhand', category: 'adventure',
    nights: 2, days: 3, price: 4899, originalPrice: 5199,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    badge: 'Best Seller', rating: 4.8, reviews: 387,
    highlights: ['Tungnath Temple — highest Shiva temple (1000+ yrs)', 'Chandrashila Peak at 13,000 ft', 'Deoriatal Lake panoramic views', 'Beginner-friendly weekend trek'],
    description: "Uttarakhand's most beautiful weekend trek — ancient temples, snow peaks and panoramic meadows.",
  },
  {
    id: 'dom-009', slug: 'kedarkantha-trek',
    title: 'Kedarkantha Trek',
    destination: 'Sankri, Uttarkashi, Uttarakhand', category: 'adventure',
    nights: 4, days: 5, price: 4499, originalPrice: 4799,
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    badge: 'Winter Trek', rating: 4.9, reviews: 562,
    highlights: ['360° panoramic views at 12,500 ft', 'Juda Ka Talab frozen lake camping', 'Kalanag & Swargarohini peak views', 'Dense rhododendron & oak forests'],
    description: "India's best winter trek — frozen lakes, dense forests and 360° Himalayan panoramas.",
  },
  {
    id: 'dom-010', slug: 'kheerganga-trek-camping',
    title: 'Kheerganga Trek with Camping',
    destination: 'Kasol, Himachal Pradesh', category: 'adventure',
    nights: 1, days: 2, price: 1150, originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&q=80',
    badge: 'Budget Pick', rating: 4.6, reviews: 734,
    highlights: ['Natural hot water springs at Kheerganga', 'Ideal first-timer trek (18 km round trip)', 'Apple orchards & pine forest trail', 'Bonfire & music sessions'],
    description: 'The most popular beginner trek in India — pine forests, hot springs and starry nights.',
  },
  {
    id: 'dom-011', slug: 'dayara-bugyal-trek',
    title: 'Dayara Bugyal Trek',
    destination: 'Raithal, Uttarakhand', category: 'adventure',
    nights: 3, days: 4, price: 5299, originalPrice: 5599,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    badge: 'Alpine Meadow', rating: 4.7, reviews: 298,
    highlights: ["28 sq km meadow at 12,000 ft — India's finest", 'Best winter trek in Himalayas', 'Panoramic Himalayan views', 'Beginner-friendly; year-round'],
    description: "One of India's finest alpine meadows — a wide expanse of snow and wildflowers at 12,000 ft.",
  },
  {
    id: 'dom-012', slug: 'nag-tibba-trek',
    title: 'Nag Tibba Trek',
    destination: 'Dehradun, Uttarakhand', category: 'adventure',
    nights: 1, days: 2, price: 1499, originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    badge: 'Weekend Trek', rating: 4.6, reviews: 612,
    highlights: ['Summit at 9,915 ft — closest high trek from Delhi', 'Kedarnath & Chaukamba peak views', 'Rhododendron & deodar forests', 'Ideal weekend getaway'],
    description: 'Closest high-altitude trek from Delhi — perfect for a quick mountain escape.',
  },
  {
    id: 'dom-013', slug: 'hampta-pass-trek-chandratal',
    title: 'Hampta Pass Trek + Chandratal Lake',
    destination: 'Manali, Himachal Pradesh', category: 'adventure',
    nights: 4, days: 5, price: 6999, originalPrice: 7349,
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    badge: 'Moderate Trek', rating: 4.8, reviews: 276,
    highlights: ['Cross Hampta Pass at 14,039 ft', 'Chandratal Lake at 14,100 ft', '4 nights camping', 'Oxygen cylinders & first aid'],
    description: 'Cross from green Kullu Valley to stark Spiti — one of the most dramatic treks in India.',
  },
  {
    id: 'dom-014', slug: 'sar-pass-trek',
    title: 'Sar Pass Trek',
    destination: 'Kasol, Himachal Pradesh', category: 'adventure',
    nights: 4, days: 5, price: 5899, originalPrice: 6299,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    badge: 'Moderate Trek', rating: 4.7, reviews: 341,
    highlights: ['Cross Sar Pass at 13,799 ft', 'Frozen lakes & snow-capped Parvati Valley', '48 km total trekking', 'Shoes & safety gear included'],
    description: 'Classic Parvati Valley trek with dramatic snow crossings and Himalayan panoramas.',
  },
  {
    id: 'dom-015', slug: 'prashar-lake-trek-camping',
    title: 'Prashar Lake Trek & Camping',
    destination: 'Mandi, Himachal Pradesh', category: 'domestic',
    nights: 1, days: 2, price: 2640, originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    badge: 'Easy Trek', rating: 4.6, reviews: 223,
    highlights: ['Sacred Prashar Lake at 8,900 ft', '360° Himalayan panoramic views', 'Sunrise & sunset at the lake', 'Suitable for beginners'],
    description: 'Sacred lake with floating island — stunning Himalayan views for first-time trekkers.',
  },
  {
    id: 'dom-016', slug: 'har-ki-dun-trek',
    title: 'Har Ki Dun Trek with Camping',
    destination: 'Sankri, Uttarakhand', category: 'adventure',
    nights: 6, days: 7, price: 7999, originalPrice: 8399,
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    badge: 'Moderate Trek', rating: 4.8, reviews: 189,
    highlights: ['Glacial valley at 11,800 ft', 'Swargarohini & Black Peak views', 'Mahabharata-era villages', 'Winter & summer accessible'],
    description: "Valley of Gods — a glacial bowl at the foot of Swargarohini, rich in Mahabharata mythology.",
  },
  {
    id: 'dom-017', slug: 'roopkund-trek',
    title: 'Roopkund Trek',
    destination: 'Lohajung, Uttarakhand', category: 'adventure',
    nights: 7, days: 8, price: 11999, originalPrice: 12599,
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    badge: 'Difficult Trek', rating: 4.9, reviews: 254,
    highlights: ['Mystery Lake at 16,499 ft', '~200 preserved 9th-century skeletal remains', 'Ali & Bedni Bugyal meadows', "India's most iconic high-altitude trek"],
    description: "India's most mysterious high-altitude trek — the Skeleton Lake at 16,499 ft.",
  },
  {
    id: 'dom-018', slug: 'chadar-trek-frozen-zanskar',
    title: 'Chadar Trek — Frozen Zanskar River',
    destination: 'Leh, Ladakh', category: 'adventure',
    nights: 8, days: 9, price: 16999, originalPrice: 17999,
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    badge: 'Bucket List', rating: 4.9, reviews: 312,
    highlights: ['Trek on frozen Zanskar River (11,400 ft)', 'Nerak Waterfall frozen 56 ft mid-air', 'Temperatures as low as −30°C', 'Cold desert landscapes'],
    description: 'One of the world\'s most extreme treks — walking on the frozen Zanskar River in Ladakh.',
  },
  // ── International ──────────────────────────────────────────────────────────
  {
    id: 'int-001', slug: 'bali-honeymoon-package',
    title: 'Bali Honeymoon Package',
    destination: 'Bali, Indonesia', category: 'honeymoon',
    nights: 6, days: 7, price: 52499, originalPrice: 65999,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    badge: 'Honeymoon', rating: 4.9, reviews: 312,
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Private Villa', 'Seminyak Beach'],
    description: 'Romance in paradise — rice terraces, temples, luxury villas and pristine beaches.',
  },
  {
    id: 'int-002', slug: 'kashmir-tour-package',
    title: 'Kashmir Paradise Tour',
    destination: 'Srinagar, Kashmir', category: 'domestic',
    nights: 6, days: 7, price: 18999, originalPrice: 24999,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    badge: 'Trending', rating: 4.9, reviews: 428,
    highlights: ['Dal Lake Shikara', 'Gulmarg Gondola', 'Pahalgam Valley', 'Mughal Gardens'],
    description: 'Shikara rides on Dal Lake, meadows of Pahalgam, and snow-capped Gulmarg.',
  },
  {
    id: 'int-003', slug: 'kerala-tour-package',
    title: 'Kerala Backwaters & Beaches',
    destination: 'Kerala, India', category: 'domestic',
    nights: 7, days: 8, price: 22499, originalPrice: 28999,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    badge: 'Best Value', rating: 4.8, reviews: 356,
    highlights: ['Houseboat Stay', 'Munnar Tea Gardens', 'Kathakali Show', 'Alleppey Canals'],
    description: 'Houseboat stays on serene backwaters, lush tea estates, and golden beaches.',
  },
  {
    id: 'int-004', slug: 'dubai-tour-package-from-delhi',
    title: 'Dubai Luxury Escape',
    destination: 'Dubai, UAE', category: 'international',
    nights: 5, days: 6, price: 45999, originalPrice: 57999,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    badge: 'Luxury', rating: 4.8, reviews: 289,
    highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Gold Souk'],
    description: 'Iconic skyline, desert safaris, gold souks and world-class luxury shopping.',
  },
  {
    id: 'int-005', slug: 'maldives-luxury-package',
    title: 'Maldives Luxury Package',
    destination: 'Maldives', category: 'international',
    nights: 5, days: 6, price: 89999, originalPrice: 115000,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    badge: 'Premium', rating: 4.9, reviews: 198,
    highlights: ['Overwater Villa', 'Snorkelling', 'Dolphin Cruise', 'Spa Retreat'],
    description: 'Overwater bungalows, crystal-clear lagoons and stunning coral reefs.',
  },
  {
    id: 'int-006', slug: 'goa-tour-package',
    title: 'Goa Beach Holiday',
    destination: 'Goa, India', category: 'beach',
    nights: 4, days: 5, price: 12999, originalPrice: 16999,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    badge: 'Beach', rating: 4.7, reviews: 512,
    highlights: ['Baga Beach', 'Old Goa Churches', 'Water Sports', 'Flea Markets'],
    description: 'Sun, sand, Portuguese churches and the most vibrant beach culture in India.',
  },
  {
    id: 'int-007', slug: 'golden-triangle-10-day',
    title: '10-Day Golden Triangle',
    destination: 'Delhi · Agra · Jaipur', category: 'heritage',
    nights: 9, days: 10, price: 117600, originalPrice: 147000,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    badge: 'Most Popular', rating: 4.9, reviews: 312,
    highlights: ['Taj Mahal Sunrise', 'Amber Fort', 'Old Delhi Tour', 'Qutub Minar'],
    description: "India's iconic heritage trail — Taj Mahal, Amber Fort, and Old Delhi.",
  },
  {
    id: 'int-008', slug: 'rajasthan-heritage-7-day',
    title: '7-Day Rajasthan Heritage',
    destination: 'Jaipur · Jodhpur · Udaipur', category: 'heritage',
    nights: 6, days: 7, price: 79600, originalPrice: 99500,
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    badge: 'Quick Escape', rating: 4.8, reviews: 194,
    highlights: ['Desert Safari', 'Lake Palace', 'Blue City', 'Hawa Mahal'],
    description: 'Royal palaces, desert safaris, lake-side palaces and the Blue City in one week.',
  },
  {
    id: 'int-009', slug: 'andaman-tour-package',
    title: 'Andaman Island Escape',
    destination: 'Port Blair · Havelock · Neil Island', category: 'beach',
    nights: 5, days: 6, price: 32999, originalPrice: 42000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    badge: 'Beach', rating: 4.8, reviews: 276,
    highlights: ['Radhanagar Beach', 'Scuba Diving', 'Coral Reefs', 'Elephant Beach'],
    description: 'Crystal-clear waters, coral reefs, and pristine beaches of the Andaman Sea.',
  },
  {
    id: 'int-010', slug: 'ladakh-tour-package',
    title: 'Ladakh High Altitude Trek',
    destination: 'Leh · Nubra · Pangong', category: 'adventure',
    nights: 7, days: 8, price: 28999, originalPrice: 38000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    badge: 'Adventure', rating: 4.9, reviews: 318,
    highlights: ['Pangong Lake', 'Nubra Valley', 'Khardung La', 'Hemis Monastery'],
    description: 'Monasteries, sand dunes, and the highest motorable road in the world.',
  },
  {
    id: 'int-011', slug: 'thailand-tour-package',
    title: 'Thailand Beach & Culture',
    destination: 'Bangkok · Phuket · Krabi', category: 'international',
    nights: 6, days: 7, price: 38999, originalPrice: 48999,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
    badge: 'International', rating: 4.7, reviews: 423,
    highlights: ['Phi Phi Islands', 'Grand Palace', 'Street Food Tour', 'Elephant Sanctuary'],
    description: 'Street food, temples, emerald-green islands and world-famous nightlife.',
  },
  {
    id: 'int-012', slug: 'singapore-tour-package',
    title: 'Singapore City Break',
    destination: 'Singapore', category: 'international',
    nights: 5, days: 6, price: 42999, originalPrice: 54999,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
    badge: 'International', rating: 4.8, reviews: 267,
    highlights: ['Gardens by the Bay', 'Sentosa Island', 'Universal Studios', 'Clarke Quay'],
    description: 'Gardens by the Bay, Marina Bay Sands, Sentosa Island and hawker food paradise.',
  },
  {
    id: 'int-013', slug: 'varanasi-tour-package',
    title: 'Varanasi Spiritual Journey',
    destination: 'Varanasi · Sarnath · Prayagraj', category: 'heritage',
    nights: 3, days: 4, price: 11999, originalPrice: 14999,
    image: 'https://images.unsplash.com/photo-1561361058-c24e01b5e367?w=800&q=80',
    badge: 'Cultural', rating: 4.7, reviews: 389,
    highlights: ['Ganga Aarti', 'Boat Ride', 'Sarnath', 'Ancient Ghats'],
    description: 'Ganga Aarti, ancient ghats, and the spiritual heart of India.',
  },
  {
    id: 'int-014', slug: 'manali-tour-package',
    title: 'Manali Snow Adventure',
    destination: 'Manali · Solang · Rohtang', category: 'domestic',
    nights: 4, days: 5, price: 12999, originalPrice: 16999,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    badge: 'Adventure', rating: 4.8, reviews: 441,
    highlights: ['Rohtang Pass', 'Solang Valley', 'River Rafting', 'Paragliding'],
    description: 'Snow sports, river rafting, and mountain trails in the Kullu Valley.',
  },
  {
    id: 'int-015', slug: 'kerala-south-india-14-day',
    title: '14-Day Kerala & South India',
    destination: 'Kochi · Munnar · Alleppey · Pondicherry', category: 'domestic',
    nights: 13, days: 14, price: 159600, originalPrice: 199500,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    badge: 'Best Value', rating: 4.9, reviews: 287,
    highlights: ['Houseboat Stay', 'Tea Estates', 'French Quarter', 'Meenakshi Temple'],
    description: 'A deep dive into South India — backwaters, spice estates, French Quarter and temple towns.',
  },
  {
    id: 'int-016', slug: 'coorg-tour-package',
    title: 'Coorg Coffee Estate Retreat',
    destination: 'Coorg · Mysore · Wayanad', category: 'domestic',
    nights: 3, days: 4, price: 13999, originalPrice: 17999,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    badge: 'Nature', rating: 4.6, reviews: 203,
    highlights: ['Coffee Plantation', 'Abbey Falls', 'Nagarhole Wildlife', 'Spice Tour'],
    description: 'Rolling coffee plantations, spice trails, and the perfume of the Western Ghats.',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') ?? '50');

  let packages = ALL_PACKAGES;

  // Try to fetch from Express backend and merge (backend packages take priority)
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ??
      'https://trip-backend-65232427280.asia-south1.run.app';
    const res = await fetch(`${backendUrl}/api/packages`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const backendData = await res.json();
      const backendList = Array.isArray(backendData) ? backendData : (backendData.data ?? backendData.packages ?? []);
      if (backendList.length > 0) {
        // Merge: backend packages first, then hardcoded ones not already in backend
        const backendSlugs = new Set(backendList.map((p: { slug?: string }) => p.slug).filter(Boolean));
        const extras = packages.filter(p => !backendSlugs.has(p.slug));
        packages = [...backendList.map((p: Record<string, unknown>) => ({
          id: p._id ?? p.id,
          slug: p.slug,
          title: p.title,
          destination: p.destination,
          category: p.category ?? 'domestic',
          nights: p.nights ?? 3,
          days: p.days ?? 4,
          price: p.price ?? 0,
          originalPrice: p.originalPrice ?? p.price ?? 0,
          image: (Array.isArray(p.images) ? p.images[0] : undefined) ?? p.imageUrl ?? p.image ?? '',
          badge: p.badge,
          rating: p.rating ?? 4.5,
          reviews: p.reviews ?? 0,
          highlights: p.highlights ?? [],
          description: p.description ?? '',
        })), ...extras];
      }
    }
  } catch {
    // Backend unreachable — use hardcoded list only
  }

  // Apply category filter
  if (category && category !== 'all') {
    packages = packages.filter(p => p.category === category);
  }

  // Apply limit
  packages = packages.slice(0, limit);

  return NextResponse.json(packages, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
