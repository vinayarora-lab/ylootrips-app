'use client';

import { useState, useEffect } from 'react';
import { Star, BadgeCheck, Quote, X, Loader2, CheckCircle, PenLine } from 'lucide-react';
import Image from 'next/image';

// Fallback avatar — shows colored circle + initials when photo fails to load
function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  // deterministic color from name
  const colors = ['bg-orange-500','bg-rose-500','bg-violet-600','bg-teal-600','bg-amber-500','bg-blue-600','bg-green-600','bg-pink-600'];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (failed) {
    return (
      <div className={`w-12 h-12 rounded-full ${color} ring-2 ring-accent/40 shrink-0 flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-accent/40 shrink-0"
    />
  );
}

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const reviews = [
  // ── Indian travelers ──────────────────────────────────────────────────────
  {
    name: 'Avnish & Shivani',
    flag: '🇮🇳',
    country: 'Gurugram, Haryana',
    rating: 5,
    trip: 'Lakshadweep Island Package',
    date: 'April 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800&q=80',
    text: 'Lakshadweep through YlooTrips was simply breathtaking! The itinerary was perfectly planned, transfers were seamless, and the team was just a WhatsApp away every step of the journey. The lagoons, the coral reefs, the silence — it felt like another world. Highly recommend to anyone wanting a truly unique Indian escape!',
  },
  {
    name: 'Neha & Rohan Sharma',
    flag: '🇮🇳',
    country: 'Mumbai, Maharashtra',
    rating: 5,
    trip: 'Bali Honeymoon Package',
    date: 'May 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    text: 'Humari Bali honeymoon bilkul sapne se bhi sundar thi! Overwater villa, private beach dinner, volcano sunrise hike — YlooTrips ne har ek detail ka khayal rakha. Price bhi best tha compared to other agencies. Dil se shukriya! Definitely booking our anniversary trip with them too.',
  },
  {
    name: 'Aditya & Pooja Nair',
    flag: '🇮🇳',
    country: 'Bangalore, Karnataka',
    rating: 5,
    trip: 'Thailand Budget Trip',
    date: 'March 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80',
    text: 'Pehli international trip thi aur YlooTrips ne ise unforgettable bana diya. Phi Phi Islands, Bangkok street food, Chiang Mai temples — sab kuch scheduled tha par feel bilkul spontaneous thi. Coordinator 24/7 WhatsApp pe available tha. Har rupee worth it raha!',
  },
  {
    name: 'Deepak & Sunita Verma',
    flag: '🇮🇳',
    country: 'New Delhi, India',
    rating: 5,
    trip: 'Kashmir Tour Package',
    date: 'June 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1617140237921-de8aea459edd?w=800&q=80',
    text: 'Kashmir mein phoolon ki ghati aur Dal Lake ke shikare pe sunset — aisa nazar kabhi nahi bhoolenge. YlooTrips ne puri family ke liye (6 log) itna smooth trip plan kiya. Hotels top-notch the, guide bilkul knowledgeable tha. Abhi bhi aankhein bhar aati hain yeh sochke!',
  },
  {
    name: 'Meera & Suresh Iyer',
    flag: '🇮🇳',
    country: 'Chennai, Tamil Nadu',
    rating: 5,
    trip: 'Kerala Backwaters Tour',
    date: 'January 2026',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    text: 'Anniversary trip ke liye Kerala — YlooTrips ki team ne itna soulful itinerary banaya. Alleppey houseboat pe do din, Munnar tea estates mein subah, Kovalam beach pe shaam. Fresh Kerala sadya khana toh next level tha. Aisi memories jo kabhi fade nahi hongi. Thank you YlooTrips!',
  },
  {
    name: 'Rajan & Preethi Pillai',
    flag: '🇮🇳',
    country: 'Kochi, Kerala',
    rating: 5,
    trip: 'Maldives Luxury Package',
    date: 'February 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    text: 'Overwater bungalow in Maldives was literally a dream come true. YlooTrips got us an incredible deal on a 5-star resort that we would never have found on our own. Dolphin cruise, sandbank breakfast, snorkeling with turtles — every day was better than the last. Pure luxury at an unbelievable price!',
  },
  {
    name: 'Karan & Rhea Malhotra',
    flag: '🇮🇳',
    country: 'Chandigarh, Punjab',
    rating: 5,
    trip: '7-Day Rajasthan Heritage',
    date: 'December 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    text: 'Rajasthan trip was beyond expectations! Jaipur forts, Jodhpur blue lanes, Udaipur lake palaces — three cities and three completely different moods. Private car and knowledgeable guide made it super comfortable. Heritage hotel stays were the cherry on top. Thanks YlooTrips for making this trip so special!',
  },
  {
    name: 'Amit & Divya Kulkarni',
    flag: '🇮🇳',
    country: 'Pune, Maharashtra',
    rating: 5,
    trip: 'Dubai Tour Package',
    date: 'April 2026',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    text: 'Dubai trip with YlooTrips was absolutely flawless. Visa handled in 2 days, hotel was perfectly located, desert safari was the highlight of our lives! Burj Khalifa at night with the fountain show — goosebumps guaranteed. Value for money is unmatched. Already planning Singapore with them next!',
  },
  // ── International travelers ───────────────────────────────────────────────
  {
    name: 'Sarah Mitchell',
    flag: '🇺🇸',
    country: 'San Francisco, USA',
    rating: 5,
    trip: '10-Day Golden Triangle',
    date: 'March 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    text: 'The Taj Mahal at sunrise left me completely speechless — I still get chills thinking about it. YlooTrips made our first India trip absolutely seamless. Our guide Rajesh knew every story behind every monument. The heritage hotels in Jaipur were magnificent. India is overwhelming in the most beautiful way possible.',
  },
  {
    name: 'James & Emma Hargreaves',
    flag: '🇬🇧',
    country: 'London, UK',
    rating: 5,
    trip: '14-Day Kerala & South India',
    date: 'February 2026',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    text: 'The Kerala houseboat nights were the most romantic experience of our lives — nothing but stars, water, and silence. YlooTrips responded to every WhatsApp message within minutes, even sorted a last-minute hotel switch without fuss. South India is deeply underrated and YlooTrips showed us exactly why.',
  },
  {
    name: 'Lachlan Burgess',
    flag: '🇦🇺',
    country: 'Melbourne, Australia',
    rating: 5,
    trip: '7-Day Rajasthan Heritage',
    date: 'January 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
    text: 'Rajasthan completely blew my expectations — the forts, the camels, the blue city of Jodhpur at golden hour. I travelled solo and felt safe and looked-after throughout. Boutique heritage havelis every night. The local food recommendations from my guide were priceless. Booking my next India trip with YlooTrips without question.',
  },
  {
    name: 'Jennifer Walsh',
    flag: '🇨🇦',
    country: 'Vancouver, Canada',
    rating: 5,
    trip: '12-Day Himalayas & Varanasi',
    date: 'October 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    text: 'YlooTrips built me a completely bespoke itinerary — hidden Himalayan temples, a dawn cooking class in Varanasi, the Kalka-Shimla toy train. Nothing was generic or copy-pasted. They genuinely listened to what I wanted. The sunrise Ganga aarti in Varanasi was the single most moving experience of my life.',
  },
  {
    name: 'Chloé Dubois',
    flag: '🇫🇷',
    country: 'Paris, France',
    rating: 5,
    trip: '14-Day Kerala & South India',
    date: 'November 2025',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&q=80',
    text: 'Kerala was a revelation — emerald tea estates, spice gardens that overwhelm your senses, and a traditional Kathakali performance arranged privately for our group. The Ayurvedic spa retreat was extraordinary. YlooTrips was professional, warm, and clearly passionate about showing us the real Kerala. Je reviendrai pour sûr!',
  },
  {
    name: 'Katrin & Markus Weber',
    flag: '🇩🇪',
    country: 'Munich, Germany',
    rating: 5,
    trip: '10-Day Golden Triangle',
    date: 'December 2025',
    platform: 'TripAdvisor',
    avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    text: 'Every hotel exceeded our expectations — beautifully curated, great locations. The private car and driver gave us total freedom to stop for photos wherever we wanted. Agra Fort at dusk, the pink markets of Jaipur, the ghats of Varanasi — all beyond anything we imagined. We wish we had booked two more weeks.',
  },
  {
    name: 'Aroha & Tama Ngata',
    flag: '🇳🇿',
    country: 'Auckland, New Zealand',
    rating: 5,
    trip: 'Goa Beach & Culture Package',
    date: 'May 2026',
    platform: 'Google',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80',
    tripPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    text: 'We wanted beaches but also culture, and YlooTrips delivered both perfectly. North Goa nightlife, South Goa hidden coves, old Portuguese churches and spice farms — the balance was spot-on. Our beach villa was stunning and the seafood recommendations were world-class. India is now firmly on our must-return list.',
  },
];

const stats = [
  { value: '25,000+', label: 'Happy Travelers' },
  { value: '4.9 ★', label: 'Average Rating' },
  { value: '2,400+', label: 'Verified Reviews' },
  { value: '40+', label: 'Countries Served' },
];

function Stars({ n, interactive, onSelect }: { n: number; interactive?: boolean; onSelect?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  if (interactive) {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button"
            onClick={() => onSelect?.(i + 1)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star className={`w-7 h-7 ${(hover || n) > i ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < n ? 'fill-[#FBBC05] text-[#FBBC05]' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

interface DBReview {
  _id: string;
  name: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  createdAt: string;
  avatarUrl?: string;
  tripPhotoUrl?: string;
}

function compressImage(file: File, maxPx = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function PhotoUpload({
  label, preview, onChange,
}: { label: string; preview: string; onChange: (b64: string) => void }) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    onChange(compressed);
  };
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      <label className="flex items-center gap-3 cursor-pointer group">
        {preview ? (
          <img src={preview} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-amber-400 flex items-center justify-center shrink-0 transition-colors">
            <span className="text-2xl">📷</span>
          </div>
        )}
        <div>
          <span className="text-xs font-medium text-amber-600 underline underline-offset-2">
            {preview ? 'Change photo' : 'Upload photo'}
          </span>
          <p className="text-[10px] text-gray-400 mt-0.5">JPG/PNG · max 2 MB · optional</p>
        </div>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  );
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', trip: '', text: '' });
  const [rating, setRating] = useState(0);
  const [avatarB64, setAvatarB64] = useState('');
  const [tripPhotoB64, setTripPhotoB64] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setErr('Please select a star rating.'); return; }
    setSubmitting(true);
    setErr('');
    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating, avatarUrl: avatarB64 || undefined, tripPhotoUrl: tripPhotoB64 || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Failed. Please try again.'); return; }
      setDone(true);
    } catch {
      setErr('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — uses dvh for correct height on mobile with keyboard */}
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: 'min(90dvh, 90vh)', overflow: 'hidden' }}
      >
        {/* Header — sticky, never scrolls away */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Share Your Experience</h3>
            <p className="text-xs text-gray-500 mt-0.5">Your review will be visible after admin approval</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {done ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Thank you! 🎉</h4>
              <p className="text-gray-500 text-sm max-w-xs">
                Your review has been submitted and will go live after a quick review by our team. We truly appreciate your feedback!
              </p>
              <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4 pb-8">
              {/* Star rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Rating *</label>
                <Stars n={rating} interactive onSelect={setRating} />
                {rating > 0 && (
                  <p className="text-xs text-amber-600 mt-1 font-medium">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
                  </p>
                )}
              </div>

              {/* Name + Country — single col on mobile, 2 col on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input required type="text" placeholder="Full name" maxLength={100}
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City / Country *</label>
                  <input required type="text" placeholder="e.g. Delhi, India" maxLength={100}
                    value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 placeholder:text-gray-400" />
                </div>
              </div>

              {/* Email + Phone — single col on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input required type="email" placeholder="your@email.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input type="tel" placeholder="+91 98765…"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 placeholder:text-gray-400" />
                </div>
              </div>

              {/* Trip name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Which Trip / Package? *</label>
                <input required type="text" placeholder="e.g. Bali Honeymoon Package, 5-Day Manali Trip"
                  value={form.trip} onChange={(e) => setForm({ ...form, trip: e.target.value })}
                  className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 placeholder:text-gray-400" />
              </div>

              {/* Review text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Review * <span className="text-gray-400 font-normal">({form.text.length}/1000)</span>
                </label>
                <textarea required rows={3} placeholder="Tell us about your experience — what made it special?"
                  maxLength={1000}
                  value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full px-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 resize-none leading-relaxed placeholder:text-gray-400" />
              </div>

              {/* Photo uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <PhotoUpload label="Your Profile Photo (optional)" preview={avatarB64} onChange={setAvatarB64} />
                <PhotoUpload label="Trip Photo (optional)" preview={tripPhotoB64} onChange={setTripPhotoB64} />
              </div>

              {err && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{err}</p>}

              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <PenLine size={16} />}
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                Your review will be published after admin approval · Email not shown publicly
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InternationalTestimonials() {
  const [showModal, setShowModal] = useState(false);
  const [dbReviews, setDbReviews] = useState<DBReview[]>([]);

  useEffect(() => {
    fetch('/api/reviews/approved')
      .then(r => r.json())
      .then(d => setDbReviews(d.reviews || []))
      .catch(() => {});
  }, []);

  // Map DB reviews to same shape as static reviews for display
  const dynamicCards = dbReviews.map(r => ({
    name: r.name,
    flag: '⭐',
    country: r.country,
    rating: r.rating,
    trip: r.trip,
    date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    platform: 'YlooTrips' as const,
    avatar: r.avatarUrl || '',
    tripPhoto: r.tripPhotoUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    text: r.text,
    isUserSubmitted: true,
  }));

  const allReviews = [...dynamicCards, ...reviews];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-primary overflow-hidden">
      <div className="section-container">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-caption uppercase tracking-[0.3em] text-cream/40 mb-4">Verified Reviews</p>
          <h2 className="font-display text-display-lg text-cream max-w-3xl mx-auto">
            Travelers from <span className="italic text-cream/70">40+ countries</span> trust us
          </h2>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl text-cream">{s.value}</div>
                <div className="text-xs text-cream/50 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Platform badges */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            {['Google', 'TripAdvisor'].map(platform => (
              <div key={platform} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />)}
                </div>
                <span className="text-cream/60 text-xs">{platform}</span>
                <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {allReviews.map((r, i) => (
            <article
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Trip destination photo */}
              <div className="relative h-44 overflow-hidden shrink-0">
                <Image
                  src={r.tripPhoto}
                  alt={`${r.name} — ${r.trip}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Trip + platform at bottom of photo */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                  <span className="bg-white/15 text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                    {r.trip}
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <BadgeCheck className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-white/70">{r.platform}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* Stars */}
                <Stars n={r.rating} />

                {/* Quote icon + text */}
                <div className="mt-3 flex-1">
                  <Quote className="w-5 h-5 text-accent/40 mb-2" />
                  <p className="text-cream/75 text-sm leading-relaxed">
                    {r.text}
                  </p>
                </div>

                {/* Author row */}
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <Avatar src={r.avatar} name={r.name} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-cream flex items-center gap-1.5 truncate">
                      {r.name} <span className="shrink-0">{r.flag}</span>
                    </div>
                    <div className="text-[10px] text-cream/40 mt-0.5">{r.country}</div>
                    <div className="text-[10px] text-accent/70 uppercase tracking-wider mt-0.5">{r.date}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Write a Review CTA ──────────────────────────────────────── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Traveled with us?</p>
            <h3 className="font-display text-xl text-cream mb-2">Share your story with the world</h3>
            <p className="text-cream/60 text-sm">
              Your review helps thousands of travelers plan their perfect trip. Takes less than 2 minutes.
            </p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />)}
              </div>
              <span className="text-cream/50 text-xs">4.9 · 2,400+ verified reviews</span>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 flex items-center gap-2 bg-accent text-primary font-bold text-sm px-6 py-3.5 rounded-full hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 whitespace-nowrap"
          >
            <PenLine size={16} />
            Write a Review
          </button>
        </div>


      </div>

      {/* Review Modal */}
      {showModal && <ReviewModal onClose={() => setShowModal(false)} />}

    </section>
  );
}
