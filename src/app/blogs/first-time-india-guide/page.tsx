import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "First Time in India? Complete 2025 Guide for International Travelers",
  description: "Everything you need to know before visiting India for the first time. Visa, safety, money, food, transport, cultural tips, and the best places to start. Updated 2025.",
  keywords: "first time India travel guide, India for beginners, India travel tips for first timers, visiting India for the first time, India travel advice",
  openGraph: {
    title: "First Time in India? Complete 2025 Guide for International Travelers",
    description: "The honest, practical guide to your first India trip — from visa to street food, safety to culture shock.",
    url: "https://www.ylootrips.com/blogs/first-time-india-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "First time in India — guide for international travelers visiting the Taj Mahal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "First Time in India? Complete 2025 Guide",
    description: "Everything you need before visiting India — visa, safety, money, food, transport and the best places to start.",
    images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/first-time-india-guide" },
};

export default function FirstTimeIndiaGuide() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'First Time India Guide', url: 'https://www.ylootrips.com/blogs/first-time-india-guide' },
      ]} />
      <ArticleJsonLd
        headline="First Time in India? Complete 2025 Guide for International Travelers"
        description="Everything you need to know before visiting India for the first time. Visa, safety, money, food, transport, cultural tips, and the best places to start."
        url="https://www.ylootrips.com/blogs/first-time-india-guide"
        image="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80"
        datePublished="2024-10-01"
        dateModified="2025-04-01"
        keywords={['first time India', 'India travel guide', 'India visa', 'India safety', 'India travel tips']}
      />
      <FaqJsonLd faqs={[
        { question: 'Is India safe for first-time travelers?', answer: 'Yes — India is safe for tourists, especially on established circuits like the Golden Triangle, Kerala, and Rajasthan. Use registered tour operators, avoid displaying valuables, and follow your guide\'s advice.' },
        { question: 'Do I need a visa to visit India?', answer: 'Most nationalities need a visa. Apply for an Indian e-Visa online at indianvisaonline.gov.in — it costs $25–$80, takes 2–4 business days, and grants 30–180 days depending on nationality.' },
        { question: 'What is the best time to visit India for the first time?', answer: 'October to March is the best time — cool, dry, and ideal for North India. South India (Kerala, Tamil Nadu) is good October to April. Avoid May–June which is extremely hot.' },
        { question: 'How much does a first India trip cost?', answer: 'Budget travelers can manage $40–$60/day; mid-range $80–$150/day; luxury $200–$500+/day. A 10-day guided tour package including accommodation and transport starts from around $1,200.' },
      ]} />

      {/* Hero */}
      <div className="relative h-[45vh] min-h-[320px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1400&q=85"
          alt="India Gate monument, New Delhi — iconic landmark for first-time India visitors"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        {/* Meta */}
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>Travel Guides</span>
          <span>·</span>
          <span>April 2025</span>
          <span>·</span>
          <span>12 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          First Time in India? Complete 2025 Guide for International Travelers
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          India is not a destination — it&apos;s an experience that rewires you. It&apos;s also one of the most logistically complex trips you&apos;ll plan. This guide covers everything you genuinely need to know before landing in India for the first time.
        </p>

        <div className="prose prose-stone max-w-none space-y-8 text-primary/75">

          <h2 className="font-display text-3xl text-primary">1. Should You Go? Honest Expectations</h2>
          <p>
            India will overwhelm your senses within the first 30 minutes. The noise, the traffic, the crowds, the smells — all arriving at once. This is not a bad thing. It&apos;s just different. Travelers who thrive in India are those who stay curious rather than comparing everything to home.
          </p>
          <p>
            The rewards are extraordinary: Taj Mahal at sunrise with almost no one around, a houseboat drifting silently through Kerala&apos;s backwaters, the call to prayer echoing across Jaisalmer&apos;s golden fort at dusk. India delivers moments you will carry for life.
          </p>

          <h2 className="font-display text-3xl text-primary">2. When to Visit</h2>
          <p>
            <strong>October to March</strong> is the best window for most of India. The monsoon has passed, temperatures are comfortable (20–30°C across the north), and the light is extraordinary for photography. December and January mean cold nights in Rajasthan — pack a layer.
          </p>
          <p>
            <strong>April to June</strong> is ferociously hot in the plains (40–48°C) but excellent for the Himalayas. <strong>July to September</strong> (monsoon) brings lush green landscapes, fewer tourists, and the lowest prices — but some roads and trekking routes close.
          </p>

          <h2 className="font-display text-3xl text-primary">3. Visa — Do This First</h2>
          <p>
            Citizens of the USA, UK, Canada, Australia, and most European countries can apply for an Indian e-Visa online — no embassy visit required. Apply at <em>indianvisaonline.gov.in</em> (official site only). Allow 4–5 business days for processing. The tourist e-Visa is typically valid for 1 year with up to 90 days per entry.
          </p>
          <p>
            Read our full <Link href="/india-travel-guide#visa" className="text-secondary underline hover:text-accent transition-colors">India visa guide</Link> for the complete step-by-step process.
          </p>

          <h2 className="font-display text-3xl text-primary">4. Where to Start</h2>
          <p>
            For first-timers, the <strong>Golden Triangle</strong> (Delhi → Agra → Jaipur) is the perfect introduction. It covers three very different cities, includes the Taj Mahal, and has excellent tourist infrastructure. After two weeks, you&apos;ll have a strong sense of North India&apos;s rhythm.
          </p>
          <p>
            Alternatively, <strong>South India</strong> (Kerala, Tamil Nadu, Pondicherry) is a gentler, greener entry — less crowds, slower pace, extraordinary food, and the legendary backwaters.
          </p>

          <div className="relative h-64 md:h-80 overflow-hidden my-2 not-prose">
            <Image src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80" alt="Taj Mahal at sunrise Agra India — first time India visit" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">The Taj Mahal at sunrise — your first India trip should start here.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">5. Getting Around</h2>
          <p>
            For first-time visitors, a <strong>private car + guide</strong> is by far the easiest and most comfortable way to move between cities. You control the schedule, make spontaneous stops, and have someone who speaks the language and knows the shortcuts.
          </p>
          <p>
            Trains are excellent for longer distances — the Shatabdi Express between Delhi and Agra is a fun 2-hour journey. Book train tickets through the IRCTC website or let us handle it for you.
          </p>

          <h2 className="font-display text-3xl text-primary">6. Food — Eat Boldly but Carefully</h2>
          <p>
            Indian food in India bears little resemblance to the Indian food abroad. Start with restaurant meals, work your way to dhaba roadside eateries, and by day 5 you&apos;ll be fearlessly ordering from street stalls. Key rules: stick to bottled water, avoid raw salads in smaller establishments, and eat freshly cooked, hot food.
          </p>
          <p>
            South India is a paradise for vegetarians — the dosa, idli, and Kerala sadya traditions are extraordinary. North India&apos;s butter chicken, dal makhani, and stuffed parathas are worth every calorie.
          </p>

          <h2 className="font-display text-3xl text-primary">7. Money</h2>
          <p>
            Withdraw Indian Rupees (INR) from ATMs on arrival — you&apos;ll get a much better rate than airport exchange counters. Major cities have excellent ATM coverage. Keep some cash for markets and smaller towns. Visa and Mastercard are accepted in most hotels and restaurants.
          </p>
          <p>
            India is excellent value. A good mid-range hotel runs USD $40–80/night. Dinner at a quality restaurant rarely exceeds USD $10–15. Your biggest cost will likely be tours and activities — all worth every penny.
          </p>

          <div className="relative h-64 md:h-80 overflow-hidden my-2 not-prose">
            <Image src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&q=80" alt="Indian street food — thali, chai and spices at a local market" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">Street food in India is a journey in itself. Start bold, eat hot, enjoy every bite.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">8. Cultural Tips</h2>
          <ul className="space-y-2 list-disc pl-6">
            <li>Remove shoes before entering temples and many homes</li>
            <li>Dress modestly at religious sites — shoulders and knees covered</li>
            <li>The head wobble (side-to-side) often means &ldquo;yes&rdquo; or &ldquo;I understand&rdquo;</li>
            <li>Bargaining is expected in markets — not in shops with price tags</li>
            <li>Use your right hand for eating and passing items</li>
            <li>Photographing people: ask first, especially with women and sadhus</li>
          </ul>

          <div className="bg-cream-dark border-l-4 border-accent p-5 mt-8">
            <p className="font-medium text-primary mb-2">Plan your first India trip with experts</p>
            <p className="text-primary/65 text-sm mb-4">YlooTrips has helped 25,000+ first-time India visitors plan seamless trips. We answer every question, handle every booking, and provide 24/7 support on the ground.</p>
            <Link href="/contact" className="btn-primary inline-flex">Get a Free Custom Itinerary</Link>
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-14 pt-10 border-t border-primary/10">
          <h3 className="font-display text-2xl text-primary mb-6">Continue Reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Best Time to Visit India — Month by Month Guide', href: '/blogs/best-time-to-visit-india' },
              { title: 'How to Plan a 2-Week India Trip on a $2,000 Budget', href: '/blogs/2-week-india-trip-budget' },
            ].map(({ title, href }) => (
              <Link key={href} href={href} className="border border-primary/10 bg-cream-light p-5 hover:border-secondary transition-colors">
                <p className="text-sm font-medium text-primary hover:text-secondary transition-colors">{title}</p>
                <p className="text-caption text-primary/40 mt-2 uppercase tracking-wider">Read More →</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
