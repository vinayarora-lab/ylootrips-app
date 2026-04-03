import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "How to Plan a 2-Week India Trip on a $2,000 Budget",
  description: "Can you visit India for 2 weeks on $2,000? Yes — here's exactly how. Budget breakdown, where to save, where to splurge, and a sample 14-day itinerary.",
  keywords: "India trip budget 2000 dollars, 2 week India trip cost, India travel budget, how much does India trip cost, budget India travel",
  openGraph: {
    title: "How to Plan a 2-Week India Trip on a $2,000 Budget | YlooTrips",
    description: "A realistic budget breakdown for 14 days in India — where to save, where to spend, and a sample itinerary for $2,000.",
    url: "https://www.ylootrips.com/blogs/2-week-india-trip-budget",
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/2-week-india-trip-budget" },
};

const budgetBreakdown = [
  { category: '✈️ International Flights', low: '$400–600', note: 'Book 3–4 months ahead. Flying into Delhi or Mumbai is usually cheapest. Use Google Flights + flexible dates.' },
  { category: '🏨 Accommodation (14 nights)', low: '$140–280', note: '14 nights at $10–20/night: mid-range guesthouses. Step up to $200–400 for boutique hotels. Heritage havelis start from $30–50/night.' },
  { category: '🚗 Transport in India', low: '$150–300', note: 'A private car + driver for the whole 2 weeks: $300–400. Trains for longer hops (very cheap). Auto-rickshaws daily: $2–5/day.' },
  { category: '🍛 Food & Drinks', low: '$100–200', note: 'Street food thali: $1–2. Sit-down restaurant lunch: $3–7. Upmarket dinner: $15–25. Budget $8–15/day for excellent eating.' },
  { category: '🏛️ Activities & Entry Fees', low: '$100–200', note: 'Taj Mahal foreigner entry: $15. Most monuments: $5–10. A full-day guided tour: $30–60. Budget $8–15/day.' },
  { category: '🧴 Miscellaneous', low: '$100–150', note: 'Indian SIM card: $5. Shopping, tips, bottles of water, unexpected extras. Budget a $100 buffer.' },
];

const itinerary = [
  { days: 'Days 1–3', place: 'Delhi', plan: 'Old Delhi street food walk, Red Fort, Humayun\'s Tomb, Lodi Garden, Qutub Minar. Stay in Paharganj or Karol Bagh (budget) or Connaught Place (mid-range).' },
  { days: 'Days 4–5', place: 'Agra', plan: 'Shatabdi train from Delhi (₹700 / $8). Taj Mahal at sunrise, Agra Fort, Baby Taj. Evening at Mehtab Bagh for Taj views.' },
  { days: 'Days 6–8', place: 'Jaipur', plan: 'Bus from Agra (₹200 / $2.50). Amber Fort, City Palace, Jantar Mantar, Pink City bazaars. Try a heritage haveli for one night.' },
  { days: 'Days 9–10', place: 'Jodhpur', plan: 'Overnight bus (₹400 / $5). Mehrangarh Fort, Bishnoi village safari, blue city walk. Food highlight: Jodhpur\'s famous mirchi bada.' },
  { days: 'Days 11–13', place: 'Udaipur', plan: 'Bus or shared taxi (₹350 / $4). City Palace, Lake Pichola boat ride, sunset rooftop. Most romantic city in Rajasthan.' },
  { days: 'Day 14', place: 'Departure', plan: 'Train or flight from Udaipur airport. Or return to Delhi for international departure (Udaipur–Delhi trains are overnight, saving a hotel night).' },
];

export default function IndiaBudgetGuide() {
  return (
    <article className="bg-cream min-h-screen">
      <ArticleJsonLd
        headline="How to Plan a 2-Week India Trip on a $2,000 Budget"
        description="Can you visit India for 2 weeks on $2,000? Yes — budget breakdown, where to save, where to splurge, and a sample 14-day itinerary."
        url="https://www.ylootrips.com/blogs/2-week-india-trip-budget"
        image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"
        datePublished="2024-12-01"
        dateModified="2025-04-01"
        keywords={['India trip budget', '2 week India cost', 'India travel cost', 'budget India trip', 'India $2000']}
      />
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&q=85"
          alt="India travel on a budget — colorful markets and street food in Rajasthan"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>Travel Guides</span><span>·</span><span>April 2025</span><span>·</span><span>8 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          How to Plan a 2-Week India Trip on a $2,000 Budget
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Two weeks in India for $2,000 — including international flights — is absolutely achievable. Here&apos;s the honest breakdown, where to save money without sacrificing experience, and a concrete sample itinerary.
        </p>

        <div className="text-primary/75 space-y-8">

          <h2 className="font-display text-3xl text-primary">Is $2,000 Realistic?</h2>
          <p>
            Yes — easily. India is one of the world&apos;s best value destinations. Your $2,000 budget breaks down roughly as: $500 for flights, $1,500 for 14 days on the ground. That&apos;s about $107/day for everything — accommodation, food, transport, activities, and shopping. That&apos;s genuinely comfortable mid-range travel in India.
          </p>
          <p>
            Want to go further? Backpacker-style travel in India can be done for $30–40/day. Comfortable mid-range (the sweet spot) runs $60–100/day. Private luxury tours start at $150–250+/day.
          </p>

          <div className="relative h-64 md:h-80 overflow-hidden not-prose my-2">
            <Image src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&q=80" alt="Indian street food market — budget travel in India" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">Street food thalis from $1–2. India rewards budget travelers with extraordinary flavour.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">Budget Breakdown</h2>
          <div className="space-y-4 not-prose">
            {budgetBreakdown.map(({ category, low, note }) => (
              <div key={category} className="border border-primary/10 bg-cream-light p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary text-sm">{category}</span>
                  <span className="text-caption font-bold text-terracotta">{low}</span>
                </div>
                <p className="text-sm text-primary/60 leading-relaxed">{note}</p>
              </div>
            ))}
            <div className="border-2 border-accent bg-accent/10 p-5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">Total (excluding flights)</span>
                <span className="font-bold text-primary text-lg">$590–$1,130</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-primary">Total (including flights)</span>
                <span className="font-bold text-primary text-lg">$990–$1,730</span>
              </div>
              <p className="text-caption text-primary/50 mt-2">Well within the $2,000 budget — leaving room for splurges and shopping.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">Sample 14-Day Itinerary</h2>
          <p>This is the classic budget-friendly route — Delhi → Agra → Jaipur → Jodhpur → Udaipur. It covers the best of North India and Rajasthan using cheap trains and buses.</p>
          <div className="space-y-3 not-prose">
            {itinerary.map(({ days, place, plan }) => (
              <div key={days} className="border border-primary/10 bg-cream-light p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-caption uppercase tracking-wider text-accent font-medium">{days}</span>
                  <span className="font-display text-xl text-primary">{place}</span>
                </div>
                <p className="text-sm text-primary/65 leading-relaxed">{plan}</p>
              </div>
            ))}
          </div>

          <div className="relative h-64 md:h-80 overflow-hidden not-prose my-2">
            <Image src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1200&q=80" alt="Hawa Mahal Jaipur Pink City Rajasthan India budget itinerary" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">Hawa Mahal, Jaipur — entry fee under $5. Budget travel doesn't mean missing the icons.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">Where to Save vs Splurge</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
            <div>
              <h3 className="font-medium text-primary mb-3">✅ Save Here</h3>
              <ul className="space-y-2 text-sm text-primary/65">
                {['Take overnight trains (saves accommodation cost)', 'Eat at local dhabas and street stalls — often better than restaurants', 'Use Indian SIM for maps and Ola/Uber', 'Visit monuments in the afternoon (off-peak prices)', 'Use the state bus for intercity travel'].map(t => (
                  <li key={t} className="flex items-start gap-2"><span className="text-green-500">↓</span>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-primary mb-3">💎 Splurge Here</h3>
              <ul className="space-y-2 text-sm text-primary/65">
                {['One night in a heritage haveli or palace hotel (worth every rupee)', 'A private guide for major monuments (transforms the experience)', 'The Taj Mahal — get the sunrise ticket, it\'s not expensive', 'A proper Rajasthani thali dinner', 'A YlooTrips custom package (often cheaper than booking separately)'].map(t => (
                  <li key={t} className="flex items-start gap-2"><span className="text-accent">↑</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-cream-dark border-l-4 border-accent p-5 mt-8">
            <p className="font-medium text-primary mb-2">Let us build your budget India itinerary</p>
            <p className="text-sm text-primary/65 mb-4">Tell us your budget and travel dates. We&apos;ll build a custom plan that maximises every dollar — and often find deals you wouldn&apos;t find on your own.</p>
            <Link href="/contact" className="btn-primary inline-flex">Get a Free Quote</Link>
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
