'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle, ArrowUpRight, Mountain, Waves, Castle, TreePine,
  Sailboat, Sun, Shield, Users, Globe, Clock, Star, Check,
  CreditCard, MapPin, Phone, BadgeCheck, ChevronDown, ChevronUp,
  Calendar, Tag, X, Loader2, CheckCircle, BadgePercent, ShieldCheck,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useVisitor } from '@/context/VisitorContext';

// ── BanBanjara data + 5% markup ──────────────────────────────────────────────
interface DomesticTrip {
  slug: string;
  title: string;
  location: string;
  region: 'North India' | 'South India' | 'Himalayan Region' | 'Northeast India' | 'East India' | 'West India';
  category: string;
  duration: string;
  nights: number;
  priceINR: number;
  originalPriceINR: number;
  image: string;
  badge?: string;
  difficulty?: string;
  highlights: string[];
  includes: string[];
  itinerary: { day: string; desc: string }[];
}

const DOMESTIC_TRIPS: DomesticTrip[] = [
  {
    slug: 'auli-package-from-delhi',
    title: 'Auli Snow Package from Delhi',
    location: 'Auli, Uttarakhand',
    region: 'North India',
    category: 'Snow Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7349,
    originalPriceINR: 6999,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    badge: 'Winter Favourite',
    highlights: ["Asia's longest cable car / ropeway", 'Views of Nanda Devi (India\'s 2nd highest peak)', 'Gorson Bugyal trek with a professional guide', 'Optional snow skiing'],
    includes: ['Hotel accommodation', 'All meals (dinner D1; breakfast+dinner D2–D3; breakfast D4)', 'Professional guide', 'Transport', 'Bonfire & local sightseeing'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi (9 PM overnight journey)' },
      { day: 'Day 2', desc: 'Devprayag pit-stop → Srinagar breakfast → Joshimath; bonfire' },
      { day: 'Day 3', desc: 'Auli via cable car → snow activities → Gorson Bugyal trek' },
      { day: 'Day 4', desc: 'Depart → Rishikesh / Laxman Jhula → dinner → Delhi journey' },
      { day: 'Day 5', desc: 'Delhi arrival (6–7 AM)' },
    ],
  },
  {
    slug: 'jibhi-tirthan-valley-trip',
    title: 'Jibhi Tirthan Valley Trip',
    location: 'Jibhi, Himachal Pradesh',
    region: 'North India',
    category: 'Nature Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7349,
    originalPriceINR: 6999,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    badge: 'Hidden Gem',
    highlights: ['Jalori Pass at 10,800 ft', 'Sarolsar Lake trek with 360° Himalayan views', 'Jibhi Waterfall & Thailand Pool', '"Yeh Jawaani Hai Deewani" filming location'],
    includes: ['Resort/camp accommodation', 'All meals (breakfast, lunch & dinner)', 'Local guide', 'Private vehicle with driver', 'Trek activities & bonfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi (6:30 PM from Vidhan Sabha Metro)' },
      { day: 'Day 2', desc: 'Arrive Jibhi → Jibhi Waterfall & Thailand Pool → bonfire' },
      { day: 'Day 3', desc: 'Sarolsar Lake trek via Jalori Pass → Bollywood location visit' },
      { day: 'Day 4', desc: 'Sunrise → checkout → Choi Waterfall → Tirthan River → depart' },
      { day: 'Day 5', desc: 'Delhi arrival (8 AM)' },
    ],
  },
  {
    slug: 'manali-solang-kasol-tour',
    title: 'Manali, Solang & Kasol Tour',
    location: 'Manali + Kasol, Himachal Pradesh',
    region: 'North India',
    category: 'Adventure Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 6999,
    originalPriceINR: 6500,
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    badge: 'Best Seller',
    highlights: ['Solang Valley adventure activities', 'Atal Tunnel & Sissu', 'Hidimba Temple, Club House, Old Manali', 'Kasol, Chalal Village & Manikaran Sahib; DJ nights'],
    includes: ['Hotel accommodation', 'Daily breakfast & dinner', 'Bonfire & music nights', 'DJ entertainment', 'Adventure activity access'],
    itinerary: [
      { day: 'Day 1', desc: 'Overnight bus from Delhi (6–8 PM, Majnu Ka Tilla)' },
      { day: 'Day 2', desc: 'Manali: Club House, Hidimba Temple, Old Manali; bonfire' },
      { day: 'Day 3', desc: 'Solang Valley activities, Atal Tunnel, Sissu, Vashisht Temple; DJ night' },
      { day: 'Day 4', desc: 'Kasol – Chalal Village, Parvati River, Manikaran Sahib; return journey' },
      { day: 'Day 5', desc: 'Delhi arrival' },
    ],
  },
  {
    slug: 'kedarnath-yatra-from-delhi',
    title: 'Kedarnath Yatra from Delhi',
    location: 'Kedarnath, Uttarakhand',
    region: 'North India',
    category: 'Pilgrimage',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 8399,
    originalPriceINR: 7999,
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    highlights: ['One of 12 Jyotirlingas — sacred to Lord Shiva', '16 km trek Gaurikund → Kedarnath Temple (11,755 ft)', 'Devprayag confluence of Bhagirathi & Alaknanda', 'Route via Haridwar, Rishikesh, Guptkashi'],
    includes: ['AC bus Delhi–Haridwar', 'Hotel accommodation', 'All meals per itinerary', 'Professional tour guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Delhi → Haridwar (AC bus)' },
      { day: 'Day 2', desc: 'Haridwar → Guptkashi (~225 km, 8–9 hrs); Devprayag stop' },
      { day: 'Day 3', desc: 'Guptkashi → Kedarnath (16 km trek via Gaurikund); temple visit' },
      { day: 'Day 4', desc: 'Morning prayers → trek back to Guptkashi' },
      { day: 'Day 5', desc: 'Return journey to Delhi' },
    ],
  },
  {
    slug: 'lakshadweep-tour-from-mumbai',
    title: 'Lakshadweep Island Tour',
    location: 'Agatti & Bangaram Islands, Lakshadweep',
    region: 'South India',
    category: 'Beach & Water Sports',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 23100,
    originalPriceINR: 22000,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    badge: 'Luxury Pick',
    highlights: ['Snorkeling, scuba, kayaking & windsurfing', 'Bangaram Island — dolphins & turtles', 'Glass boat rides & island hopping', 'Thinnakara Island sandbank'],
    includes: ['AC rooms with beach views', 'Agatti Island entry permit', 'All meals (breakfast, lunch & dinner)', 'Airport transfers', 'Expert guide & water activity access'],
    itinerary: [
      { day: 'Day 1', desc: 'Kochi arrival → Agatti Island → glass boat tour → sunset' },
      { day: 'Day 2', desc: 'Bangaram Island (dolphins/turtles); Thinnakara Island; snorkeling' },
      { day: 'Day 3', desc: 'Water sports day; Lagoon Beach & Andhan Beach leisure' },
      { day: 'Day 4', desc: 'More snorkeling activities; beach relaxation' },
      { day: 'Day 5', desc: 'Breakfast → Agatti Airport (10 AM flight to Kochi)' },
    ],
  },
  {
    slug: 'coorg-tour-from-bangalore',
    title: 'Coorg Weekend Tour from Bangalore',
    location: 'Coorg (Kodagu), Karnataka',
    region: 'South India',
    category: 'Nature Tour',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 3499,
    originalPriceINR: 3287,
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    highlights: ['Mandalpatti Viewpoint', 'Abbey Falls', "Raja's Seat sunset", 'Elephant interaction at Harangi Camp', 'Namdroling Monastery (Golden Temple)'],
    includes: ['1 night accommodation', 'Breakfast (D2–D3) & dinner (D2)', 'Non-AC bus transport', 'Professional driver & tour guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Evening departure Bangalore (multiple pickup points); overnight journey' },
      { day: 'Day 2', desc: 'Morning Coorg: Mandalpatti, Abbey Falls, Raja\'s Seat sunset; campfire dinner' },
      { day: 'Day 3', desc: 'Elephant camp → Namdroling Monastery → evening return to Bangalore' },
    ],
  },
  {
    slug: 'spiti-valley-winter-tour',
    title: 'Winter Spiti Valley Tour',
    location: 'Spiti Valley, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Adventure Tour',
    duration: '8 Days / 7 Nights',
    nights: 7,
    priceINR: 15749,
    originalPriceINR: 14999,
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    badge: 'Epic Journey',
    highlights: ['Chicham Bridge — world\'s highest suspension bridge', 'Hikkim — world\'s highest post office (14,567 ft)', 'Key Monastery & Tabo Monastery', 'Chitkul — India\'s last village before Tibet'],
    includes: ['Homestay accommodation', 'All meals (breakfast, lunch & dinner)', 'Transportation throughout', 'Professional guide'],
    itinerary: [
      { day: 'D1', desc: 'Overnight Delhi → Shimla (Volvo)' },
      { day: 'D2', desc: 'Shimla → Chitkul via Sutlej & Baspa rivers; overnight Rakcham' },
      { day: 'D3', desc: 'Chitkul → Tabo; village exploration' },
      { day: 'D4', desc: 'Tabo Monastery visit → Kaza' },
      { day: 'D5', desc: 'Kaza: Hikkim post office, Komic & Langza villages' },
      { day: 'D6', desc: 'Key Monastery; Chicham Bridge; overnight Kaza' },
      { day: 'D7', desc: 'Kaza → Kalpa via Nako village' },
      { day: 'D8', desc: 'Suicide Point → return Delhi via Shimla' },
    ],
  },
  {
    slug: 'chopta-tungnath-chandrashila-trek',
    title: 'Chopta Tungnath & Chandrashila Trek',
    location: 'Chopta, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 5199,
    originalPriceINR: 4899,
    badge: 'Best Seller',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    highlights: ['Tungnath Temple — 1,000+ yrs old, highest Shiva temple', 'Chandrashila Peak at 13,000 ft', 'Deoriatal Lake with panoramic Himalayan views', 'Beginner-friendly weekend trek'],
    includes: ['AC group transport from Delhi/Rishikesh', 'Swiss tent accommodation & sleeping bags', 'All meals (breakfast, lunch & dinner)', 'Professional trek guide', 'Campfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Overnight departure Delhi → breakfast Rishikesh → drive to Baniya Kund campsite; campfire' },
      { day: 'Day 2', desc: 'Chopta → Tungnath Temple (5 km) → Chandrashila Peak (12,000+ ft) → return camp' },
      { day: 'Day 3', desc: 'Deoriatal Lake trek (2.5 km) → Sari Village → drive back to Delhi' },
    ],
  },
  {
    slug: 'kedarkantha-trek',
    title: 'Kedarkantha Trek',
    location: 'Sankri, Uttarkashi, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 4799,
    originalPriceINR: 4499,
    difficulty: 'Easy to Moderate',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    highlights: ['360° panoramic views at 12,500 ft', 'Juda Ka Talab — frozen lake camping', 'Views of Kalanag, Swargarohini & Bandarpoonch peaks', 'Dense rhododendron & oak forests'],
    includes: ['4 nights campsite accommodation', 'All meals (breakfast, lunch & dinner)', 'Professional trek guides & camping gear', 'Transport Dehradun–Sankri return', 'Forest permits'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Sankri (200 km from Dehradun); orientation' },
      { day: 'Day 2', desc: 'Sankri → Juda Ka Talab (4 km, 9,186 ft) through rhododendron forests' },
      { day: 'Day 3', desc: 'Juda Ka Talab → Kedarkantha Base Camp (4 km, 10,334 ft)' },
      { day: 'Day 4', desc: 'Summit attempt 4 AM (12,500 ft); sunrise views; descend to Juda Ka Talab' },
      { day: 'Day 5', desc: 'Descent to Sankri (6 km); drive back to Dehradun' },
    ],
  },
  {
    slug: 'kheerganga-trek-camping',
    title: 'Kheerganga Trek with Camping',
    location: 'Kasol / Barshaini, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 1299,
    originalPriceINR: 1150,
    difficulty: 'Easy to Moderate',
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&q=80',
    highlights: ['Natural hot water springs at Kheerganga', 'Ideal first-timer trek (18 km round trip)', 'Apple orchards & pine forest trail', 'Bonfire & music sessions at camp'],
    includes: ['Professional guide (Barshaini to Barshaini)', 'Tea & dinner D1, breakfast D2', 'Twin/triple sharing tent', 'Music session & bonfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Meet Barshaini (10:45 AM); 9 km trek through apple orchards (5–6 hrs); hot spring dip; overnight camp' },
      { day: 'Day 2', desc: 'Breakfast; return 9 km trek to Barshaini; optional Parvati Valley sightseeing' },
    ],
  },
  {
    slug: 'dayara-bugyal-trek',
    title: 'Dayara Bugyal Trek',
    location: 'Raithal, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '4 Days / 3 Nights',
    nights: 3,
    priceINR: 5599,
    originalPriceINR: 5299,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    highlights: ['28 sq km meadow at 12,000 ft — one of India\'s finest', 'Best winter trek in Himalayas', 'Panoramic Himalayan views', 'Beginner-friendly; accessible year-round'],
    includes: ['All permits & professional trek leader', '3 nights accommodation (tent/guesthouse)', 'All vegetarian meals D1 dinner to D4 breakfast', 'Transport Dehradun–Raithal return'],
    itinerary: [
      { day: 'Day 1', desc: '7:30 AM pickup Dehradun → drive to Raithal (185 km); evening briefing' },
      { day: 'Day 2', desc: 'Raithal → Gui Campsite (5 km trek through oak forests); acclimatization walk' },
      { day: 'Day 3', desc: 'Gui → Dayara Bugyal summit and return (7 km round trip); packed lunch at viewpoint' },
      { day: 'Day 4', desc: 'Gui → Raithal descent (5 km); 235 km drive back to Dehradun' },
    ],
  },
  {
    slug: 'nag-tibba-trek',
    title: 'Nag Tibba Trek',
    location: 'Dehradun, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 1599,
    originalPriceINR: 1499,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    highlights: ['Summit at 9,915 ft — closest high-altitude trek from Delhi', 'Views of Kedarnath, Chaukamba & Gangotri peaks', 'Rhododendron & deodar forest trails', 'Ideal weekend getaway'],
    includes: ['Tea & dinner D1, breakfast D2', 'Professional trek guide', 'Shared dome tent & campfire', 'Transport (varies by variant) & permits'],
    itinerary: [
      { day: 'Day 1', desc: 'Drive through Doon Valley → Pantwari village; trek to base camp (4–5 km); campfire dinner' },
      { day: 'Day 2', desc: '4:30 AM wake-up → Nag Tibba Top (9,910 ft, arrive 10 AM); panoramic views; descend; drive back' },
    ],
  },
  {
    slug: 'hampta-pass-trek-chandratal',
    title: 'Hampta Pass Trek + Chandratal Lake',
    location: 'Manali, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7349,
    originalPriceINR: 6999,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    highlights: ['Cross Hampta Pass at 14,039 ft (Manali to Spiti)', 'Chandratal Lake at 14,100 ft — Himalayan reflections', '4 nights camping through meadows & alpine forests', 'Oxygen cylinders & first aid included'],
    includes: ['Professional trek leader & support team', '4 nights camping', 'All vegetarian meals D1 lunch to D5 breakfast', 'Round-trip transport from Manali', 'Permits, first aid & oxygen cylinders'],
    itinerary: [
      { day: 'Day 1', desc: 'Drive Manali → Jobra (1 hr); trek to Chika (2 hrs, 10,100 ft)' },
      { day: 'Day 2', desc: 'Chika → Balu Ka Ghera (5.8 km, 5 hrs, 12,000 ft) through rhododendron forests' },
      { day: 'Day 3', desc: 'Balu Ka Ghera → Hampta Pass → Siagoru (7 km, 8 hrs, 14,100 ft pass crossing)' },
      { day: 'Day 4', desc: 'Siagoru → Chatru (6 km); drive to Chandratal Lake (3 hrs)' },
      { day: 'Day 5', desc: 'Drive Chatru/Chandratal → Manali (4–5 hrs)' },
    ],
  },
  {
    slug: 'sar-pass-trek',
    title: 'Sar Pass Trek',
    location: 'Kasol, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 6299,
    originalPriceINR: 5899,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    highlights: ['Cross Sar Pass at 13,799 ft through snow terrain', 'Frozen lakes & snow-capped Parvati Valley', '48 km total trekking distance', 'Trekking shoes & safety coverage included'],
    includes: ['Dome tent accommodation (shared)', 'Experienced guide & permits', 'All meals (breakfast, lunch, snacks & dinner)', 'Camping gear & safety coverage', 'Free trekking gear'],
    itinerary: [
      { day: 'Day 1', desc: 'Kasol → Grahan Village (9 km, 5 hrs) through pine & rhododendron forests' },
      { day: 'Day 2', desc: 'Grahan → Min Thach (4–5 hrs); steep forest terrain; bonfire' },
      { day: 'Day 3', desc: 'Min Thach → Nagaru (6 hrs, 3,795 m); steep snow climb; Parvati Valley views' },
      { day: 'Day 4', desc: 'Nagaru → Biskeri Thatch via Sar Pass (7 hrs); snow descent/slide; summit' },
      { day: 'Day 5', desc: 'Biskeri → Barshaini → Kasol return (5 hrs)' },
    ],
  },
  {
    slug: 'prashar-lake-trek-camping',
    title: 'Prashar Lake Trek & Camping',
    location: 'Mandi, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 2799,
    originalPriceINR: 2640,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    highlights: ['Sacred Prashar Lake at 2,730 m (8,900 ft)', '360° panoramic Himalayan views (Dhauladhars)', 'Sunrise & sunset experiences at the lake', 'Suitable for complete beginners'],
    includes: ['Professional trek guide', 'All meals (breakfast, lunch & dinner)', 'Camping accommodation', 'Night lamps'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Panshara; shared cabs to Jwalapur (25 km); 9 km trek to Prashar Lake; overnight camp' },
      { day: 'Day 2', desc: 'Sunrise viewing; breakfast; 9 km return trek to Jwalapur; drive to Panshara; depart' },
    ],
  },
  {
    slug: 'har-ki-dun-trek',
    title: 'Har Ki Dun Trek with Camping',
    location: 'Sankri, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '7 Days / 6 Nights',
    nights: 6,
    priceINR: 8399,
    originalPriceINR: 7999,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    highlights: ['Glacial valley of Jaundhar at 11,800 ft', 'Views of Swargarohini I/II/III, Bandarpooch & Black Peak', 'Mahabharata-era historical villages', 'Accessible in both winter & summer'],
    includes: ['All vegetarian meals', 'Professional trek guide', 'Camping tents & sleeping bags', '1 night guesthouse/homestay in Sankri', 'Transport Dehradun–Sankri return', 'First aid & safety equipment'],
    itinerary: [
      { day: 'D1', desc: 'Dehradun → Sankri (190 km, 8-hr drive)' },
      { day: 'D2', desc: 'Sankri → Puani Garat (10 km, 5–6 hrs)' },
      { day: 'D3', desc: 'Puani Garat → Boslo (10 km, 5–6 hrs)' },
      { day: 'D4', desc: 'Boslo → Har Ki Dun → Marinda Tal → return Boslo (17 km, 7–8 hrs)' },
      { day: 'D5', desc: 'Boslo → Puani Garat (10 km, 4 hrs)' },
      { day: 'D6', desc: 'Puani Garat → Sankri (10 km, 4–5 hrs)' },
      { day: 'D7', desc: 'Sankri → Dehradun (190 km, 8-hr drive)' },
    ],
  },
  {
    slug: 'roopkund-trek',
    title: 'Roopkund Trek',
    location: 'Lohajung, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '8 Days / 7 Nights',
    nights: 7,
    priceINR: 12599,
    originalPriceINR: 11999,
    difficulty: 'Difficult',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    highlights: ['Mystery Lake at 16,499 ft in shadow of Mt. Trishul', '~200 preserved skeletal remains from 9th-century', 'Ali Bugyal & Bedni Bugyal alpine meadows', 'One of India\'s most iconic high-altitude treks'],
    includes: ['3 vegetarian meals daily', 'First aid kits & oxygen cylinders', 'Experienced trek leader', 'Tent camping accommodation'],
    itinerary: [
      { day: 'D1', desc: 'Kathgodam → Lohajung base camp (7–8 hrs)' },
      { day: 'D2', desc: 'Lohajung → Didna Village via Lord Curzon trail & Bedni River' },
      { day: 'D3', desc: 'Hike to Ali Bugyal (panoramic Garhwal Himalaya views)' },
      { day: 'D4', desc: 'Ali Bugyal → Ghora Lotani across ridge terrain' },
      { day: 'D5', desc: 'Challenging ascent → Bhagwabasa (14,500 ft)' },
      { day: 'D6', desc: 'Bhagwabasa → Roopkund Lake (trek highlight) → return Bhagwabasa' },
      { day: 'D7', desc: 'Descent → Lohajung via Bedni Bugyal & Neel Ganga' },
      { day: 'D8', desc: 'Departure from Lohajung' },
    ],
  },
  {
    slug: 'chadar-trek-frozen-zanskar',
    title: 'Chadar Trek — Frozen Zanskar River',
    location: 'Leh, Ladakh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '9 Days / 8 Nights',
    nights: 8,
    priceINR: 17999,
    originalPriceINR: 16999,
    badge: 'Bucket List',
    difficulty: 'Difficult',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    highlights: ['Trek on frozen Zanskar River (11,400 ft)', 'Nerak Waterfall frozen 56 ft mid-air', 'Temperatures as low as −30°C', 'Cold desert landscapes & Zanskari culture'],
    includes: ['All meals during trek (vegetarian & Jain options)', 'Guesthouse in Leh + camping during trek', 'Transport Leh–Chilling return', 'Experienced trek leader & staff', 'Medical check-up at SNM Hospital', 'Wildlife permits'],
    itinerary: [
      { day: 'D1–D3', desc: 'Arrive Leh; acclimatize; medical clearance; permits' },
      { day: 'D4', desc: 'Drive to Chilling; trek to Gyalpo campsite (1.5 hrs on ice)' },
      { day: 'D5', desc: 'Gyalpo → Tibb Cave (6–7 hrs, 11,800 ft); frozen waterfalls' },
      { day: 'D6', desc: 'Tibb Cave → Nerak (7 hrs); 56-ft frozen waterfall; −30°C overnight' },
      { day: 'D7', desc: 'Nerak → Tibb Cave return (6–7 hrs)' },
      { day: 'D8', desc: 'Final trek → Shingra Koma; drive back to Leh; celebratory dinner' },
      { day: 'D9', desc: 'Departure from Leh' },
    ],
  },
];

// ── Domestic Booking Drawer ───────────────────────────────────────────────────
function DomesticBookingDrawer({ trip, onClose, initialTab = 'pay' }: { trip: DomesticTrip; onClose: () => void; initialTab?: 'pay' | 'callback' }) {
  const [tab, setTab] = useState<'pay' | 'callback'>(initialTab);
  const [guests, setGuests] = useState('2');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSent, setCbSent] = useState(false);
  const [cbSending, setCbSending] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const totalPrice = trip.priceINR * Number(guests || 2);
  const emi = Math.ceil(totalPrice / 3);
  const discountAmt = Math.round(totalPrice * 0.05);
  const finalPrice = totalPrice - discountAmt;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone, guests,
          packageTitle: trip.title, destination: trip.location,
          sourceUrl: `https://ylootrips.com/destinations/domestic`,
          ourPrice: finalPrice, marketPrice: totalPrice, priceDiff: discountAmt,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) { window.location.href = data.paymentUrl; }
      else { setPayError(data.error || 'Payment failed. Please try again.'); }
    } catch { setPayError('Network error. Please try again.'); }
    finally { setPaying(false); }
  };

  const handleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cbName, email: 'not-provided@ylootrips.com', phone: cbPhone,
          destination: trip.title,
          message: `Callback request for: ${trip.title} (${trip.duration}, ₹${trip.priceINR.toLocaleString('en-IN')}/person). Guests: ${guests}. Client wants EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true);
    setCbSending(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: 'min(92vh, calc(100dvh - 32px))' }}>
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{trip.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{trip.location} · {trip.duration} · ₹{trip.priceINR.toLocaleString('en-IN')}/person</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0 ml-3"><X size={18} /></button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          {(['pay', 'callback'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${tab === t ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              {t === 'pay' ? <><CreditCard size={15} /> Book & Pay Now</> : <>📞 Free Callback</>}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          {tab === 'pay' && (
            <div className="p-5 space-y-4">
              {/* Guests */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Number of Guests</label>
                <div className="flex gap-2">
                  {['1','2','3','4','5','6'].map(n => (
                    <button key={n} onClick={() => setGuests(n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${guests === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">₹{trip.priceINR.toLocaleString('en-IN')} × {guests} guest{Number(guests)>1?'s':''}</span>
                  <span className="text-gray-700 font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-700">
                  <span className="flex items-center gap-1"><BadgePercent size={13}/> Early bird 5% off</span>
                  <span className="font-semibold">− ₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total payable</span>
                  <span className="font-display text-xl text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              {/* EMI */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-800">No-cost EMI available</p>
                  <p className="text-[11px] text-blue-500 mt-0.5">3 easy monthly installments</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-display text-blue-800">₹{emi.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-blue-400">/month × 3</p>
                </div>
              </div>
              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: <ShieldCheck size={14} className="text-green-600"/>, label: '100% Refund', sub: 'if unavailable' },
                  { icon: <CreditCard size={14} className="text-blue-600"/>, label: 'Secure PG', sub: 'Easebuzz' },
                  { icon: <BadgePercent size={14} className="text-amber-600"/>, label: '5% Off', sub: 'early bird' },
                ].map(({icon,label,sub}) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <div className="flex justify-center mb-1">{icon}</div>
                    <p className="text-[11px] font-bold text-gray-800">{label}</p>
                    <p className="text-[9px] text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>
              {!showForm ? (
                <button onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 transition-colors">
                  <CreditCard size={15}/> Proceed to Pay ₹{finalPrice.toLocaleString('en-IN')}
                </button>
              ) : (
                <form onSubmit={handlePay} className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-700">Enter your details to continue</p>
                  <input required type="text" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900"/>
                  <input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900"/>
                  <input required type="tel" placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900"/>
                  {payError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>}
                  <div className="flex gap-2">
                    <button type="submit" disabled={paying}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3 rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors">
                      {paying ? <Loader2 size={14} className="animate-spin"/> : <CreditCard size={14}/>}
                      {paying ? 'Redirecting…' : `Pay ₹${finalPrice.toLocaleString('en-IN')} via Easebuzz`}
                    </button>
                    <button type="button" onClick={()=>{setShowForm(false);setPayError('');}}
                      className="px-4 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Back</button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">🔒 Secured by Easebuzz · No hidden charges · Full refund policy</p>
                </form>
              )}
            </div>
          )}

          {tab === 'callback' && (
            <div className="p-5 bg-[#1a2535] min-h-full">
              {cbSent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-amber-400"/>
                  </div>
                  <p className="font-display text-xl text-white">You&apos;re all set! 🎉</p>
                  <p className="text-white/60 text-sm max-w-xs">Our Yloo travel expert will call you within <span className="text-amber-400 font-bold">1 hour</span> with best price & EMI plan for {trip.title}.</p>
                  <p className="text-white/30 text-[11px] mt-2">📱 Expect call from +91 84278 31127</p>
                  <button onClick={onClose} className="mt-3 px-6 py-2.5 bg-amber-400 text-gray-900 font-bold rounded-xl text-sm">Done</button>
                </div>
              ) : (
                <form onSubmit={handleCallback} className="space-y-4">
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                      <span className="text-xl">🏕️</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Yloo Concierge Callback</p>
                      <p className="text-white/60 text-xs mt-0.5">Custom price, availability check & flexible EMI — no advance needed.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['📞','Free call'],['💳','EMI plans'],['🔒','No advance']].map(([icon,label])=>(
                      <div key={label} className="bg-white/8 rounded-xl py-2 text-center">
                        <p className="text-lg">{icon}</p>
                        <p className="text-white/60 text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    {[`Custom dates for ${trip.title}`,'Best group price guarantee','Pickup & drop options','Flexible 3/6/12 month EMI'].map(item=>(
                      <p key={item} className="text-white/70 text-xs flex items-center gap-2">
                        <span className="text-amber-400 text-[10px]">✓</span> {item}
                      </p>
                    ))}
                  </div>
                  <input required type="text" placeholder="Your name" value={cbName} onChange={e=>setCbName(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400"/>
                  <input required type="tel" placeholder="Phone number (we'll call you)" value={cbPhone} onChange={e=>setCbPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-amber-400"/>
                  <button type="submit" disabled={cbSending}
                    className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 font-bold text-sm py-3.5 rounded-xl hover:bg-amber-300 disabled:opacity-60 transition-colors">
                    {cbSending ? <Loader2 size={14} className="animate-spin"/> : '📞'}
                    {cbSending ? 'Booking callback…' : 'Get Free Callback + EMI Options'}
                  </button>
                  <p className="text-white/30 text-[10px] text-center">Mon–Sun 9am–10pm · Response within 1 hour</p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripCard({ trip }: { trip: DomesticTrip }) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'pay' | 'callback'>('pay');
  const discount = Math.round(((trip.priceINR - trip.originalPriceINR) / trip.originalPriceINR) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-primary/8 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image src={trip.image} alt={trip.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {trip.badge && (
            <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              {trip.badge}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
            {trip.category}
          </span>
        </div>
        {trip.difficulty && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {trip.difficulty}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-[11px] line-through">₹{trip.originalPriceINR.toLocaleString('en-IN')}</p>
            <p className="text-white font-display text-xl">₹{trip.priceINR.toLocaleString('en-IN')}<span className="text-sm font-normal">/person</span></p>
          </div>
          {discount > 0 && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{discount}% OFF</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg text-primary leading-snug mb-1">{trip.title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-secondary mb-3">
          <span className="flex items-center gap-1"><MapPin size={11} />{trip.location}</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{trip.duration}</span>
        </div>

        {/* Highlights */}
        <ul className="space-y-1 mb-3">
          {trip.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-xs text-primary/70">
              <Check size={11} className="text-green-600 shrink-0 mt-0.5" />
              {h}
            </li>
          ))}
        </ul>

        {/* Includes pills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {trip.includes.slice(0, 3).map((inc) => (
            <span key={inc} className="bg-cream-light text-secondary text-[10px] px-2 py-0.5 rounded-full border border-sand/50">
              {inc.length > 30 ? inc.slice(0, 28) + '…' : inc}
            </span>
          ))}
          {trip.includes.length > 3 && (
            <span className="text-[10px] text-accent font-medium self-center">+{trip.includes.length - 3} more</span>
          )}
        </div>

        {/* Itinerary accordion */}
        <button
          onClick={() => setShowItinerary((v) => !v)}
          className="flex items-center justify-between w-full text-xs text-secondary border border-sand/50 rounded-lg px-3 py-2 hover:bg-cream-light transition-colors mb-3"
        >
          <span className="flex items-center gap-1.5"><Tag size={11} />View itinerary ({trip.itinerary.length} days)</span>
          {showItinerary ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {showItinerary && (
          <div className="bg-cream-light rounded-xl p-3 mb-3 space-y-2">
            {trip.itinerary.map((item) => (
              <div key={item.day} className="flex gap-2 text-xs">
                <span className="font-bold text-accent shrink-0 w-10">{item.day}</span>
                <span className="text-primary/70">{item.desc}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Trust badges strip */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
            💳 EMI from ₹{Math.ceil(trip.priceINR / 3).toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
            🔒 Secure Easebuzz
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-semibold">
            5% Early Bird
          </span>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/8">
          <button
            onClick={() => { setDrawerTab('pay'); setShowDrawer(true); }}
            className="flex items-center justify-center gap-1.5 bg-accent text-primary text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
          >
            <CreditCard size={12} /> Book Now
          </button>
          <button
            onClick={() => { setDrawerTab('callback'); setShowDrawer(true); }}
            className="flex items-center justify-center gap-1.5 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wide py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all"
          >
            📋 Enquiry
          </button>
        </div>
      </div>

      {showDrawer && <DomesticBookingDrawer trip={trip} initialTab={drawerTab} onClose={() => setShowDrawer(false)} />}
    </div>
  );
}

// ── Page constants ────────────────────────────────────────────────────────────
const indiaRegions = [
  { label: 'All India', value: 'All India' },
  { label: 'North India', value: 'North India' },
  { label: 'South India', value: 'South India' },
  { label: 'East India', value: 'East India' },
  { label: 'West India', value: 'West India' },
  { label: 'Northeast', value: 'Northeast India' },
  { label: 'Himalayas', value: 'Himalayan Region' },
];

const highlights = [
  { icon: Mountain, label: 'Himalayan Treks', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Castle, label: 'Heritage & Forts', color: 'text-terracotta', bg: 'bg-orange-50' },
  { icon: Waves, label: 'Beaches & Coasts', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: TreePine, label: 'Wildlife Safaris', color: 'text-green-700', bg: 'bg-green-50' },
  { icon: Sailboat, label: 'Kerala Backwaters', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Sun, label: 'Rajasthan Deserts', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const trustSignals = [
  { icon: Shield, title: 'Fully Licensed & Insured', desc: 'Registered with India\'s Ministry of Tourism. All guides hold national guide cards.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, title: 'English-Speaking Private Guides', desc: 'Dedicated guide throughout your trip. Also available in French, German, Spanish & Japanese.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Globe, title: 'Trusted by 40+ Countries', desc: 'USA, UK, Australia, Canada, Germany, France — 25,000+ international travelers in 12 years.', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: CreditCard, title: 'Secure International Payment', desc: 'Visa, Mastercard, Amex accepted. Prices in USD. No hidden charges. PCI-DSS compliant gateway.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Clock, title: '24/7 Support During Your Trip', desc: 'WhatsApp, email, or phone — someone from our team is always available across all timezones.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: BadgeCheck, title: 'Free Cancellation', desc: 'Full refund up to 7 days before departure. Flexible date changes at no extra cost.', color: 'text-teal-600', bg: 'bg-teal-50' },
];

const privateGuideFeatures = [
  { emoji: '🚗', title: 'Private Air-Conditioned Car', desc: 'Your own vehicle for all transfers and excursions. No shared coaches or public transport.' },
  { emoji: '🗣️', title: 'Dedicated English-Speaking Guide', desc: 'One guide for your group throughout. They know every story, every shortcut, every local secret.' },
  { emoji: '🏨', title: 'Hand-Picked Accommodation', desc: 'Vetted 3★–5★ hotels and heritage havelis. We inspect every property before recommending it.' },
  { emoji: '🎟️', title: 'All Entry Tickets Pre-Booked', desc: 'No queuing at monuments. Priority access to Taj Mahal, Amber Fort, and all major sites.' },
  { emoji: '🍽️', title: 'Curated Local Dining', desc: 'Safe, hygienic restaurants that international travelers trust — from rooftop dinners to street food experiences.' },
  { emoji: '📱', title: 'Local SIM Card Provided', desc: 'Stay connected from day one. We provide a local SIM with data for your entire stay.' },
];

const visaInfo = [
  { q: 'Do I need a visa for India?', a: 'Most nationalities (USA, UK, Australia, Canada, Europe) can get an e-Visa online at indianvisaonline.gov.in. It takes 2–4 business days and costs $25–$80. We send you a step-by-step guide after booking.' },
  { q: 'Is India safe for international travelers?', a: 'India is welcoming to international tourists. The Golden Triangle, Kerala, and Rajasthan are among the most visited circuits in the world. We take additional steps — vetted guides, safe accommodations, 24/7 reachable team — so you can focus on the experience.' },
  { q: 'What is the best time to visit India?', a: 'October to March is ideal for most regions — cool, dry, and clear. North India is best Oct–Mar. Kerala and South India are great year-round. Himalayas are best May–October. We\'ll recommend the best dates for your chosen destinations.' },
  { q: 'What vaccinations do I need?', a: 'Hepatitis A and Typhoid are generally recommended. Some travelers also get Hepatitis B and Rabies. We recommend consulting your doctor or a travel health clinic 4–6 weeks before departure. No mandatory vaccines required for most countries.' },
  { q: 'What currency does India use?', a: 'Indian Rupee (INR). You can withdraw from ATMs in all major cities. Your guide will help you find safe ATMs. For convenience, carry some USD/EUR for exchange. We accept international cards — Visa, Mastercard, Amex — for your booking.' },
];

const countryReviews = [
  { flag: '🇺🇸', country: 'USA', traveler: 'Sarah M.', trip: 'Golden Triangle', text: 'Everything was taken care of. Our guide Arjun was brilliant — knew every detail of every monument. Best vacation of our lives.', rating: 5 },
  { flag: '🇬🇧', country: 'UK', traveler: 'James & Emma H.', trip: 'Kerala & South India', text: 'We were nervous about India — but the team made it completely seamless. The houseboat in Kerala was out of this world.', rating: 5 },
  { flag: '🇦🇺', country: 'Australia', traveler: 'Lachlan B.', trip: 'Rajasthan Heritage', text: 'Worth every dollar. Private jeep ride up to Amber Fort, sunrise at desert dunes, rooftop dinners in Udaipur. Perfection.', rating: 5 },
  { flag: '🇨🇦', country: 'Canada', traveler: 'Marie-Claire D.', trip: 'Kerala & Goa', text: 'Three-week trip planned down to every detail. Guide spoke flawless English and French. India exceeded every expectation.', rating: 5 },
];

function DomesticDestinationsContent() {
  const { visitor } = useVisitor();
  const isInternational = visitor === 'foreigner';
  const [activeRegion, setActiveRegion] = useState('All India');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const tagQuery = searchParams.get('q')?.toLowerCase().trim() ?? '';

  const filtered = useMemo(() => {
    let trips = activeRegion === 'All India'
      ? DOMESTIC_TRIPS
      : DOMESTIC_TRIPS.filter((t) => t.region === activeRegion);
    if (tagQuery) {
      trips = trips.filter((t) =>
        t.title.toLowerCase().includes(tagQuery) ||
        t.location.toLowerCase().includes(tagQuery) ||
        t.category.toLowerCase().includes(tagQuery)
      );
    }
    return trips;
  }, [activeRegion, tagQuery]);

  return (
    <>
      <PageHero
        title={isInternational ? 'Private India Tours for International Travelers' : 'Discover India'}
        subtitle={
          isInternational
            ? 'Handcrafted private tours — Taj Mahal, Kerala, Rajasthan & beyond. English-speaking guides · Licensed operator · Trusted by 25,000+ travelers from USA, UK, Australia & 40+ countries.'
            : 'From the Himalayas to Kerala\'s backwaters — 12+ years crafting India journeys for 25,000+ travelers.'
        }
        breadcrumb={isInternational ? 'India Tours' : 'Domestic'}
        backgroundImage="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-terracotta/50 via-primary/60 to-primary/90"
      />

      {/* International trust bar */}
      {isInternational && (
        <section className="bg-amber-500 text-white py-3">
          <div className="section-container">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-semibold uppercase tracking-wider">
              {['🇺🇸 Trusted by Americans', '🇬🇧 Loved in the UK', '🇦🇺 Top-rated in Australia', '⭐ 4.9 Google · 2,400+ reviews', '🏛️ Ministry of Tourism Registered', '💳 Visa · Mastercard · Amex'].map((item) => (
                <span key={item} className="whitespace-nowrap">{item}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curated tours for international users */}
      {isInternational && (
        <section className="bg-gradient-to-b from-amber-50 to-white border-b border-amber-200/50 py-10 md:py-14">
          <div className="section-container">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                  🌍 Exclusive for International Travelers
                </div>
                <h2 className="font-display text-2xl md:text-display-lg text-primary">Private Guided India Tours</h2>
                <p className="text-primary/55 text-sm mt-2">English-speaking guide · Private AC car · All tickets · Secure USD payment · Free cancellation</p>
              </div>
              <Link href="/tours" className="hidden md:flex items-center gap-1.5 shrink-0 text-xs font-bold text-amber-600 border border-amber-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 px-4 py-2 rounded-full transition-all uppercase tracking-wider">
                All Tours <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { slug: 'golden-triangle-10-day', title: '10-Day Golden Triangle', subtitle: 'Delhi · Agra · Jaipur', price: '$1,400', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', href: '/tours/golden-triangle-10-day', checkoutHref: '/checkout/tour?tour=golden-triangle-10-day', tags: ['Taj Mahal', 'Amber Fort', 'Red Fort'], rating: 4.9, reviews: 312, badge: 'Most Popular', badgeBg: 'bg-amber-500' },
                { slug: 'kerala-south-india-14-day', title: '14-Day Kerala & South India', subtitle: 'Kochi · Munnar · Alleppey · Pondicherry', price: '$1,900', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', href: '/tours/kerala-south-india-14-day', checkoutHref: '/checkout/tour?tour=kerala-south-india-14-day', tags: ['Houseboat', 'Tea Estates', 'French Quarter'], rating: 4.9, reviews: 287, badge: 'Best Value', badgeBg: 'bg-green-600' },
                { slug: 'rajasthan-heritage-7-day', title: '7-Day Rajasthan Heritage', subtitle: 'Jaipur · Jodhpur · Udaipur', price: '$950', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80', href: '/tours/rajasthan-heritage-7-day', checkoutHref: '/checkout/tour?tour=rajasthan-heritage-7-day', tags: ['Desert Safari', 'Lake Palace', 'Blue City'], rating: 4.8, reviews: 194, badge: 'Quick Escape', badgeBg: 'bg-blue-600' },
              ].map((tour) => (
                <div key={tour.slug} className="group bg-white rounded-2xl overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <Link href={tour.href} className="block relative h-52 overflow-hidden">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className={`${tour.badgeBg} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>{tour.badge}</span>
                      <span className="bg-primary/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">🔒 Private Tour</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold">{tour.rating} ({tour.reviews})</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">From {tour.price}</span>
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={tour.href}><h3 className="font-display text-lg text-primary mb-1 group-hover:text-amber-600 transition-colors">{tour.title}</h3></Link>
                    <p className="text-xs text-primary/50 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{tour.subtitle}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tour.tags.map((tag) => <span key={tag} className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">{tag}</span>)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium mb-4">
                      <Check className="w-3.5 h-3.5" /> English guide · Private car · All tickets
                    </div>
                    <div className="flex-1" />
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/8">
                      <Link href={tour.checkoutHref} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl transition-colors">Book Now</Link>
                      <Link href={tour.href} className="flex items-center justify-center gap-1 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wide py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all">Details <ArrowUpRight className="w-3 h-3" /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 py-3 bg-white/70 rounded-xl border border-amber-100">
              {['🔒 256-bit SSL', '💳 Visa · MC · Amex', '🗣️ English Guides', '🆓 Free Cancellation', '🏛️ Govt. Licensed'].map((b) => (
                <span key={b} className="text-xs text-primary/55 font-medium whitespace-nowrap">{b}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights strip */}
      <section className="py-8 md:py-10 bg-cream border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {highlights.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`flex items-center gap-2 ${bg} px-4 py-2.5 rounded-full`}>
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <span className="text-xs font-medium text-primary/80 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International trust section */}
      {isInternational && (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-12">
              <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-3">Why International Travelers Choose Us</p>
              <h2 className="font-display text-display-lg text-primary max-w-2xl mx-auto">Everything handled — <span className="italic">from airport to airport</span></h2>
              <p className="text-primary/60 mt-4 max-w-xl mx-auto">No group tours. No shared coaches. Just you, a private guide who speaks your language, and India at its finest.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trustSignals.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex gap-4 p-5 border border-primary/8 rounded-xl hover:shadow-md transition-shadow bg-cream/30">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
                  <div><h3 className="font-semibold text-primary text-sm mb-1">{title}</h3><p className="text-xs text-primary/60 leading-relaxed">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Private guide features */}
      {isInternational && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-4">Private Guided Tours</p>
                <h2 className="font-display text-display-lg text-primary mb-6">Not a tour group. <span className="italic">Your trip, your pace.</span></h2>
                <p className="text-primary/65 text-body-lg mb-8">Every YlooTrips India tour is fully private. No strangers on your bus, no rushed photo stops. Your own vehicle, your own guide, your own pace — from the moment you land to the moment you leave.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {privateGuideFeatures.map(({ emoji, title, desc }) => (
                    <div key={title} className="flex gap-3 p-4 bg-white rounded-xl border border-primary/8">
                      <span className="text-2xl shrink-0">{emoji}</span>
                      <div><div className="font-semibold text-primary text-sm mb-0.5">{title}</div><div className="text-xs text-primary/55 leading-relaxed">{desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80" alt="Taj Mahal private tour" fill className="object-cover" /></div>
                    <div className="relative aspect-square overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1519307747268-66e3debb7228?w=600&q=80" alt="Private guide India" fill className="object-cover" /></div>
                  </div>
                  <div className="pt-8 space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1603262110263-e5fb6c69ddd9?w=600&q=80" alt="Kerala backwaters" fill className="object-cover" /></div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80" alt="Rajasthan heritage" fill className="object-cover" /></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-amber-500 text-white px-5 py-3 rounded-xl shadow-lg">
                  <div className="font-display text-2xl">25K+</div>
                  <div className="text-xs uppercase tracking-widest opacity-90">Travelers guided</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Country flags / social proof */}
      {isInternational && (
        <section className="py-12 bg-primary text-cream">
          <div className="section-container">
            <p className="text-center text-caption uppercase tracking-[0.3em] text-amber-400 mb-8">Trusted by travelers from</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
              {[{ flag: '🇺🇸', country: 'USA' }, { flag: '🇬🇧', country: 'UK' }, { flag: '🇦🇺', country: 'Australia' }, { flag: '🇨🇦', country: 'Canada' }, { flag: '🇩🇪', country: 'Germany' }, { flag: '🇫🇷', country: 'France' }, { flag: '🇳🇱', country: 'Netherlands' }, { flag: '🇸🇬', country: 'Singapore' }, { flag: '🇯🇵', country: 'Japan' }, { flag: '🇳🇿', country: 'New Zealand' }, { flag: '🇰🇪', country: 'Kenya' }, { flag: '🇧🇷', country: 'Brazil' }].map(({ flag, country }) => (
                <div key={country} className="flex flex-col items-center gap-1">
                  <span className="text-3xl">{flag}</span>
                  <span className="text-[10px] text-cream/50 uppercase tracking-widest">{country}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {countryReviews.map(({ flag, country, traveler, trip, text, rating }) => (
                <div key={country} className="bg-white/8 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{flag}</span>
                    <div><div className="font-medium text-cream text-sm">{traveler}</div><div className="text-xs text-cream/50">{country} · {trip}</div></div>
                  </div>
                  <div className="flex mb-2">{Array.from({ length: rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-xs text-cream/70 leading-relaxed">&ldquo;{text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visa FAQ */}
      {isInternational && (
        <section className="py-16 md:py-20 bg-white">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-10">
              <p className="text-caption uppercase tracking-[0.3em] text-amber-600 mb-3">Before You Go</p>
              <h2 className="font-display text-display-lg text-primary">Visa, Safety & Practical Info</h2>
            </div>
            <div className="space-y-3">
              {visaInfo.map((item, i) => (
                <div key={i} className="border border-primary/10 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/[0.02] transition-colors">
                    <span className="font-medium text-primary text-sm pr-4">{item.q}</span>
                    {openFaq === i ? <ChevronUp size={18} className="text-amber-500 shrink-0" /> : <ChevronDown size={18} className="text-primary/40 shrink-0" />}
                  </button>
                  {openFaq === i && <div className="px-6 pb-5 text-primary/65 text-sm leading-relaxed border-t border-primary/5"><p className="pt-4">{item.a}</p></div>}
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl flex gap-4 items-start">
              <span className="text-2xl shrink-0">📋</span>
              <div>
                <div className="font-semibold text-amber-900 mb-1">Free Pre-Trip India Guide</div>
                <p className="text-sm text-amber-800">After booking, we send you our complete India travel guide — visa step-by-step, what to pack, safety tips, etiquette, money, and day-by-day prep.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active tag filter banner */}
      {tagQuery && (
        <div className="bg-amber-50 border-b border-amber-200 py-2.5">
          <div className="section-container flex items-center justify-between gap-3">
            <p className="text-sm text-amber-800 font-semibold">
              🔍 Showing results for: <span className="capitalize">{tagQuery}</span>
              <span className="ml-2 text-amber-600 font-normal">({filtered.length} trip{filtered.length !== 1 ? 's' : ''})</span>
            </p>
            <a href="/destinations/domestic" className="text-xs font-bold text-amber-700 border border-amber-300 px-3 py-1 rounded-full hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
              Clear filter ✕
            </a>
          </div>
        </div>
      )}

      {/* Region filter */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {indiaRegions.map((r) => (
              <button key={r.value} onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-sm ${activeRegion === r.value ? 'bg-terracotta text-cream shadow-sm' : 'bg-cream text-primary/70 hover:bg-terracotta/10 hover:text-terracotta'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trip grid */}
      <section className="py-12 md:py-20 lg:py-28 bg-cream">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 md:mb-14">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-terracotta mb-2">
                {activeRegion === 'All India' ? (isInternational ? 'Choose Your India Experience' : 'Across India') : activeRegion}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {activeRegion === 'All India' ? (isInternational ? 'Where will your India story begin?' : 'Where in India?') : `Explore ${activeRegion}`}
              </h2>
            </div>
            <p className="text-sm text-primary/50">{filtered.length} trip{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🏔️</p>
              <p className="font-display text-2xl text-primary mb-2">No trips in this region yet</p>
              <p className="text-secondary text-sm mb-6">We're adding more destinations soon. In the meantime, explore all trips.</p>
              <button onClick={() => setActiveRegion('All India')} className="btn-primary">View All Trips</button>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-cream-dark border-y border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center">
            {[{ value: '12+', label: 'Years of India expertise' }, { value: '25K+', label: 'Travelers guided' }, { value: '4.9★', label: 'Google rating' }, { value: '40+', label: 'Countries served' }].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl text-terracotta">{value}</div>
                <div className="text-caption text-primary/50 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption uppercase tracking-[0.3em] text-amber-400 mb-4">
              {isInternational ? 'Start Planning Your India Trip' : 'India Travel Experts'}
            </p>
            <h2 className="font-display text-display-lg mb-4">
              {isInternational ? 'Tell us your dream. We build the trip.' : 'Not sure where to start?'}
            </h2>
            <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
              {isInternational
                ? 'Share your travel dates, group size, and interests. Our India specialists respond within 1 hour with a personalised itinerary and USD pricing — no obligation.'
                : 'Tell us your interests, budget, and travel dates. Our India specialists respond in under 1 hour — 7 days a week.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={isInternational
                  ? 'https://wa.me/918427831127?text=Hi!%20I\'m%20from%20abroad%20and%20planning%20an%20India%20trip.%20Can%20you%20help%3F'
                  : 'https://wa.me/918427831127?text=Hi%2C+I\'m+interested+in+a+domestic+India+trip'}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors rounded-sm"
              >
                <MessageCircle className="w-5 h-5" />
                {isInternational ? 'WhatsApp Our India Experts' : 'Chat on WhatsApp'}
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all rounded-sm">
                {isInternational ? 'Get Free Custom Itinerary' : 'Plan My India Trip'}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-cream/30 text-xs mt-6 uppercase tracking-widest">
              {isInternational ? 'Free · No obligation · Response in 1 hour · USD pricing' : 'Free · No obligation · Response in under 1 hour'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DomesticDestinationsPage() {
  return (
    <Suspense fallback={null}>
      <DomesticDestinationsContent />
    </Suspense>
  );
}
