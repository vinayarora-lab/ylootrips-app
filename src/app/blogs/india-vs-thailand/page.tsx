import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "India vs Thailand: Which Should You Visit First?",
  description: "Comparing India and Thailand for international travelers. Cost, safety, food, culture, beaches, and which destination is right for first-time Asia visitors.",
  keywords: "India vs Thailand travel, should I visit India or Thailand first, India Thailand comparison, best Asia destination first timer",
  openGraph: {
    title: "India vs Thailand: Which Should You Visit First? | YlooTrips",
    description: "An honest comparison of India and Thailand — cost, culture, safety, food, and which one is right for your travel style.",
    url: "https://www.ylootrips.com/blogs/india-vs-thailand",
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/india-vs-thailand" },
};

const comparisons = [
  {
    category: '💰 Cost',
    india: 'Budget: $30–50/day. Mid-range: $80–150/day. Luxury: $200–500/day. Excellent value across all budgets.',
    thailand: 'Budget: $25–45/day. Mid-range: $70–120/day. Slightly cheaper for backpackers, similar for mid-range.',
    winner: 'Draw — both excellent value',
  },
  {
    category: '🛡️ Safety',
    india: 'Safe for tourists with normal urban precautions. Solo female travel requires more awareness in some regions. Book a reputable tour company for your first visit.',
    thailand: 'Generally considered beginner-friendly. Very well-trodden tourist trail. Scams are common near tourist sites but rarely dangerous.',
    winner: 'Thailand (marginally easier for first solo trips)',
  },
  {
    category: '🍛 Food',
    india: 'One of the world\'s greatest food cultures. Enormous regional variety — from Rajasthani dal baati to Kerala fish curry to Mughlai biryani. Vegetarian paradise.',
    thailand: 'Excellent street food and restaurant scene. Tom Yum, pad thai, green curry. Less regional variety but consistently delicious and accessible.',
    winner: 'India (sheer depth and variety)',
  },
  {
    category: '🏖️ Beaches',
    india: 'Goa, Kerala, Andaman Islands — beautiful and diverse. Less developed than Thailand. Often feel more authentic.',
    thailand: 'World-class beaches — Koh Samui, Krabi, Koh Lanta. Clear water, excellent infrastructure, very tourist-friendly.',
    winner: 'Thailand (beach infrastructure wins)',
  },
  {
    category: '🏛️ History & Culture',
    india: 'Unparalleled. 5,000+ years of continuous civilisation. Mughal architecture, Hindu temples, Buddhist monasteries, British colonial heritage, living traditions.',
    thailand: 'Rich Buddhist temple culture. Chiang Mai\'s Doi Suthep, Sukhothai ruins, Grand Palace. Excellent — but India\'s depth is incomparable.',
    winner: 'India (nothing compares)',
  },
  {
    category: '🗺️ Ease of Travel',
    india: 'More complex logistics — distances are vast, transport options many, some regions need more planning. A good tour company transforms the experience.',
    thailand: 'Straightforward. Excellent domestic transport, English widely spoken in tourist areas, compact enough to cover key sights in 2 weeks easily.',
    winner: 'Thailand (easier for independent travel)',
  },
  {
    category: '🤯 Transformative Power',
    india: 'The highest-impact travel destination in the world. India rewires how you see the world. You will not return the same person.',
    thailand: 'A wonderful trip. Relaxing, beautiful, and culturally enriching — but rarely described as life-changing in the same way.',
    winner: 'India (it\'s simply in a different category)',
  },
];

export default function IndiaVsThailand() {
  return (
    <article className="bg-cream min-h-screen">
      <ArticleJsonLd
        headline="India vs Thailand: Which Should You Visit First?"
        description="Comparing India and Thailand for international travelers — cost, safety, food, culture, beaches, and which is right for first-time Asia visitors."
        url="https://www.ylootrips.com/blogs/india-vs-thailand"
        image="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"
        datePublished="2024-11-01"
        dateModified="2025-04-01"
        keywords={['India vs Thailand', 'India or Thailand first', 'best Asia destination', 'India travel', 'Thailand travel']}
      />
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&q=85"
          alt="India vs Thailand travel comparison — Rajasthan desert vs Thai temples"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>Travel Guides</span><span>·</span><span>April 2025</span><span>·</span><span>7 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          India vs Thailand: Which Should You Visit First?
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Both India and Thailand are bucket-list Asian destinations. Both offer extraordinary food, ancient temples, stunning landscapes, and warm hospitality. So how do you choose — and does it even matter which comes first?
        </p>

        <div className="text-primary/75 space-y-8">
          <h2 className="font-display text-3xl text-primary">The Short Answer</h2>
          <p>
            If you want a relaxed, easy introduction to Asia with excellent beaches and simple logistics — go to Thailand first. If you want the most transformative, culturally rich, historically staggering travel experience of your life — go to India first. The two countries are so different that comparing them is almost unfair to both.
          </p>

          <div className="grid grid-cols-2 gap-2 not-prose my-2">
            <div className="relative h-52 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80" alt="Amber Fort Jaipur India — Rajasthan golden landscape" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-primary/60 py-1.5 px-3">
                <p className="text-cream text-xs text-center tracking-wider">🇮🇳 India — Amber Fort, Jaipur</p>
              </div>
            </div>
            <div className="relative h-52 overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80" alt="Thailand temple golden pagoda Bangkok" fill className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-primary/60 py-1.5 px-3">
                <p className="text-cream text-xs text-center tracking-wider">🇹🇭 Thailand — Temple, Bangkok</p>
              </div>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">Head-to-Head Comparison</h2>
          <div className="space-y-6 not-prose">
            {comparisons.map(({ category, india, thailand, winner }) => (
              <div key={category} className="border border-primary/10 bg-cream-light overflow-hidden">
                <div className="bg-primary/5 px-5 py-3 font-medium text-primary">{category}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-primary/10">
                  <div className="p-5">
                    <div className="text-caption uppercase tracking-wider text-terracotta mb-2">🇮🇳 India</div>
                    <p className="text-sm text-primary/65 leading-relaxed">{india}</p>
                  </div>
                  <div className="p-5">
                    <div className="text-caption uppercase tracking-wider text-secondary mb-2">🇹🇭 Thailand</div>
                    <p className="text-sm text-primary/65 leading-relaxed">{thailand}</p>
                  </div>
                </div>
                <div className="bg-accent/10 px-5 py-2.5 text-caption text-primary/60">
                  <strong>Winner:</strong> {winner}
                </div>
              </div>
            ))}
          </div>

          <div className="relative h-64 md:h-80 overflow-hidden not-prose my-2">
            <Image src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80" alt="Kerala backwaters India — a world away from Thailand beaches" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">Kerala backwaters — India's answer to paradise. Different from Thailand's beaches, but equally unforgettable.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary mt-10">Our Recommendation</h2>
          <p>
            Do Thailand first <em>only</em> if you&apos;re a nervous first-time Asia traveler who wants to ease in gently. The beaches are world-class and the tourist infrastructure is excellent. Thailand will give you confidence for bigger adventures.
          </p>
          <p>
            But go to <strong className="text-primary">India first</strong> if you want a story you&apos;ll be telling for decades. India is demanding, surprising, occasionally maddening, and ultimately unforgettable in a way that no other country is. Many travelers who go to India first say they can never quite settle for anything less afterwards.
          </p>
          <p>
            The best answer? <strong className="text-primary">Do both.</strong> Pair them in a 4-week Asia trip — 2 weeks in India, 2 weeks in Thailand. The contrast will be one of the great travel experiences of your life.
          </p>

          <div className="bg-cream-dark border-l-4 border-accent p-5 mt-8">
            <p className="font-medium text-primary mb-2">Ready to explore India?</p>
            <p className="text-sm text-primary/65 mb-4">YlooTrips specialises in making India accessible, enjoyable, and extraordinary for first-time international visitors. Start with a free consultation.</p>
            <Link href="/contact" className="btn-primary inline-flex">Plan My India Trip</Link>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-primary/10">
          <h3 className="font-display text-2xl text-primary mb-6">Continue Reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'First Time in India? Complete 2025 Guide', href: '/blogs/first-time-india-guide' },
              { title: 'Best Time to Visit India — Month by Month', href: '/blogs/best-time-to-visit-india' },
            ].map(({ title, href }) => (
              <Link key={href} href={href} className="border border-primary/10 bg-cream-light p-5 hover:border-secondary transition-colors">
                <p className="text-sm font-medium text-primary">{title}</p>
                <p className="text-caption text-primary/40 mt-2 uppercase tracking-wider">Read More →</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
