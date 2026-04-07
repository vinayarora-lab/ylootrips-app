import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "Best Time to Visit India — Month by Month Guide 2025",
  description: "When is the best time to visit India? Month-by-month breakdown of weather, festivals, crowds, and prices. Find your perfect India travel window.",
  keywords: "best time to visit India, India travel seasons, India weather month by month, India monsoon season, India peak tourist season, when to visit Rajasthan Kerala",
  openGraph: {
    title: "Best Time to Visit India — Month by Month Guide 2025",
    description: "When should you travel to India? Our month-by-month breakdown covers weather, festivals, crowds, and prices for every region.",
    url: "https://www.ylootrips.com/blogs/best-time-to-visit-india",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "India travel seasons — Holi festival colors in Rajasthan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Time to Visit India — Month by Month Guide 2025",
    description: "Month-by-month India weather, festivals, crowds, and prices. Find your perfect travel window.",
    images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/best-time-to-visit-india" },
};

const months = [
  { name: 'January', emoji: '❄️', rating: '★★★★★', weather: 'Cool & dry in North India (8–22°C). Perfect weather across Rajasthan, Agra, Jaipur, Delhi.', regions: 'Golden Triangle, Rajasthan, South India', note: 'Republic Day (Jan 26) — spectacular parade in Delhi. Book hotels early.' },
  { name: 'February', emoji: '🌸', rating: '★★★★★', weather: 'Still cool in the north. Temperatures rising pleasantly. Ideal for Rajasthan and the Deccan Plateau.', regions: 'Rajasthan, Hampi, Kerala, Pondicherry', note: 'Great Backwater weather. Fewer crowds than December/January.' },
  { name: 'March', emoji: '🎨', rating: '★★★★☆', weather: 'Warming up quickly. Still comfortable for mornings. Last good month for North India plains.', regions: 'Rajasthan, South India, Himalayan foothills', note: 'Holi festival (March) — the most colourful event in India. Worth planning around!' },
  { name: 'April', emoji: '☀️', rating: '★★★☆☆', weather: 'Hot in North India (30–38°C). South India and hills are better. Kerala\'s heat balanced by the sea breeze.', regions: 'Kerala, Tamil Nadu, Shimla, Darjeeling', note: 'Last month before pre-monsoon heat in the plains.' },
  { name: 'May', emoji: '🌡️', rating: '★★☆☆☆', weather: 'Very hot in North India (38–46°C). Mountain resorts are excellent — Ladakh opens.', regions: 'Ladakh, Spiti Valley, Manali, Darjeeling', note: 'Best time for Ladakh! Permits often required — book in advance.' },
  { name: 'June', emoji: '🌧️', rating: '★★☆☆☆', weather: 'Monsoon arrives in South India, spreading north by month end. Mountains lush and beautiful.', regions: 'Ladakh (dry), Himachal, Kerala (lush monsoon)', note: 'Kerala during early monsoon is special — fewer crowds, intense greenery.' },
  { name: 'July', emoji: '🌿', rating: '★★★☆☆', weather: 'Monsoon across most of India. Rajasthan gets rain — turns surprisingly green. Waterfalls everywhere.', regions: 'Goa (off-season), Coorg, Sikkim, Ladakh', note: 'Lowest prices and crowds. Ideal if you love dramatic landscapes.' },
  { name: 'August', emoji: '🌊', rating: '★★★☆☆', weather: 'Peak monsoon in most regions. Some roads flood. Himalayas and Ladakh still accessible.', regions: 'Ladakh, Meghalaya (wettest place on earth!), Goa', note: 'Independence Day (Aug 15) — celebrations everywhere. Magical in Delhi.' },
  { name: 'September', emoji: '🌤️', rating: '★★★★☆', weather: 'Monsoon retreating. South India still wet. North India clearing up and cooling down.', regions: 'Rajasthan, Hampi, Ajanta & Ellora caves', note: 'Shoulder season — good prices, thinning crowds, improving weather.' },
  { name: 'October', emoji: '🍂', rating: '★★★★★', weather: 'Near-perfect weather begins across most of India. Cool, clear, and dry.', regions: 'All of India — peak season begins', note: 'Diwali often falls in Oct/Nov — the Festival of Lights. Absolutely magical in Jaipur and Varanasi.' },
  { name: 'November', emoji: '🌟', rating: '★★★★★', weather: 'Excellent weather everywhere. One of the best months for India travel.', regions: 'All of India', note: 'Pushkar Camel Fair (Rajasthan) — a once-in-a-lifetime spectacle.' },
  { name: 'December', emoji: '🎄', rating: '★★★★★', weather: 'Cool to cold nights in North India. Gorgeous days. Goa and South India are buzzing.', regions: 'Golden Triangle, Goa, Kerala, Rajasthan', note: 'Peak tourist season — book 3–4 months in advance. Higher prices near Christmas/NYE.' },
];

export default function BestTimeToVisitIndia() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Best Time to Visit India', url: 'https://www.ylootrips.com/blogs/best-time-to-visit-india' },
      ]} />
      <ArticleJsonLd
        headline="Best Time to Visit India — Month by Month Guide 2025"
        description="When is the best time to visit India? Month-by-month breakdown of weather, festivals, crowds, and prices."
        url="https://www.ylootrips.com/blogs/best-time-to-visit-india"
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"
        datePublished="2024-09-15"
        dateModified="2025-04-01"
        keywords={['best time visit India', 'India seasons', 'India weather', 'India monsoon', 'India festivals']}
      />
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=85"
          alt="India travel seasons — festival of Holi colors in Rajasthan"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>Travel Guides</span><span>·</span><span>April 2025</span><span>·</span><span>8 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          Best Time to Visit India — Month by Month Guide 2025
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          India is a subcontinent — its size means that what&apos;s true for one region is completely false for another. Here&apos;s your definitive month-by-month breakdown.
        </p>

        <div className="prose-stone space-y-8 text-primary/75">
          <h2 className="font-display text-3xl text-primary">The Quick Answer</h2>
          <p>
            <strong className="text-primary">October to March</strong> is the best time to visit most of India — especially the iconic north (Delhi, Agra, Jaipur, Rajasthan) and the south (Kerala, Tamil Nadu). The weather is dry, temperatures are comfortable, and the landscapes are beautiful. <strong className="text-primary">October and November</strong> are arguably the sweet spot: great weather, fewer crowds than December, and the Diwali festival to look forward to.
          </p>

          <div className="relative h-64 md:h-80 overflow-hidden my-2 not-prose">
            <Image src="https://images.unsplash.com/photo-1624461050280-d59b3066afef?w=1200&q=80" alt="Diwali festival of lights in India — the best season to visit" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">Diwali — Festival of Lights. October/November is the magic window.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary">Month-by-Month Breakdown</h2>
          <div className="space-y-4 not-prose">
            {months.map((m) => (
              <div key={m.name} className="border border-primary/10 bg-cream-light p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{m.emoji}</span>
                  <div>
                    <div className="font-medium text-primary">{m.name}</div>
                    <div className="text-caption text-amber-500">{m.rating}</div>
                  </div>
                </div>
                <p className="text-sm text-primary/65 mb-1">{m.weather}</p>
                <p className="text-caption text-secondary uppercase tracking-wider mb-1">Best for: {m.regions}</p>
                <p className="text-caption text-primary/50 italic">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="relative h-64 md:h-80 overflow-hidden my-2 not-prose">
            <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80" alt="Ladakh mountain landscape India — best visited June to September" fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-primary/50 py-2 px-4">
              <p className="text-cream text-xs text-center tracking-wider">Ladakh is open June–September — a world apart from the rest of India.</p>
            </div>
          </div>

          <h2 className="font-display text-3xl text-primary mt-10">Best Time by Region</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            {[
              { region: 'Golden Triangle (Delhi/Agra/Jaipur)', best: 'October – March', avoid: 'May – August' },
              { region: 'Rajasthan', best: 'October – March', avoid: 'June – August' },
              { region: 'Kerala & South India', best: 'October – March', avoid: 'July (monsoon — still beautiful)' },
              { region: 'Goa', best: 'November – February', avoid: 'July – September' },
              { region: 'Ladakh & Himalayan Treks', best: 'June – September', avoid: 'November – March (roads close)' },
              { region: 'Darjeeling & Sikkim', best: 'March – May & Sep – Nov', avoid: 'June – August (heavy monsoon)' },
            ].map(({ region, best, avoid }) => (
              <div key={region} className="border border-primary/10 bg-cream-light p-4">
                <div className="font-medium text-primary text-sm mb-2">{region}</div>
                <div className="text-caption text-green-600">✓ Best: {best}</div>
                <div className="text-caption text-red-500">✗ Avoid: {avoid}</div>
              </div>
            ))}
          </div>

          <div className="bg-cream-dark border-l-4 border-accent p-5 mt-8">
            <p className="font-medium text-primary mb-2">Ready to plan your India trip?</p>
            <p className="text-sm text-primary/65 mb-4">Tell us your preferred travel dates and we&apos;ll build a custom itinerary that makes the most of the season.</p>
            <Link href="/contact" className="btn-primary inline-flex">Get a Custom Itinerary</Link>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-primary/10">
          <h3 className="font-display text-2xl text-primary mb-6">Continue Reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'First Time in India? Complete 2025 Guide', href: '/blogs/first-time-india-guide' },
              { title: 'Solo Female Travel in India: Honest Safety Guide', href: '/blogs/solo-female-travel-india' },
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
