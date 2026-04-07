import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Sun, Heart, Backpack, Syringe, CreditCard, ChevronRight } from 'lucide-react';
import { ArticleJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: "India Travel Guide for International Tourists 2025",
  description: "Complete India travel guide for first-time international visitors. Visa requirements, best time to visit, safety tips, what to pack, health & vaccinations, and currency advice.",
  keywords: "India travel guide, India visa for Americans, is India safe for tourists, India travel tips for first timers, best time to visit India, India packing list, India health tips",
  openGraph: {
    title: "India Travel Guide 2025 — Everything International Tourists Need to Know",
    description: "Visa, safety, health, packing, currency — the complete guide to visiting India for first-time international travelers.",
    url: "https://www.ylootrips.com/india-travel-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "India travel guide for international tourists — Taj Mahal and Rajasthan landmarks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India Travel Guide 2025 | YlooTrips",
    description: "Visa, safety, health, packing, currency — the complete India guide for international visitors.",
    images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"],
  },
  alternates: {
    canonical: "https://www.ylootrips.com/india-travel-guide",
  },
};

const sections = [
  {
    id: 'visa',
    icon: Shield,
    title: 'Visa Requirements',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    id: 'best-time',
    icon: Sun,
    title: 'Best Time to Visit',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    id: 'safety',
    icon: Heart,
    title: 'Safety Tips',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    id: 'packing',
    icon: Backpack,
    title: 'What to Pack',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    id: 'health',
    icon: Syringe,
    title: 'Health & Vaccinations',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    id: 'money',
    icon: CreditCard,
    title: 'Currency & Payments',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
];

export default function IndiaTravelGuide() {
  return (
    <div className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'India Travel Guide', url: 'https://www.ylootrips.com/india-travel-guide' },
      ]} />
      <ArticleJsonLd
        headline="India Travel Guide for International Tourists 2025"
        description="Complete India travel guide for first-time international visitors. Visa requirements, best time to visit, safety tips, what to pack, health & vaccinations, and currency advice."
        url="https://www.ylootrips.com/india-travel-guide"
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"
        datePublished="2024-08-01"
        dateModified="2025-04-01"
        keywords={['India travel guide', 'India visa', 'India safety', 'India health tips', 'India packing list', 'India for tourists']}
      />
      <FaqJsonLd faqs={[
        { question: 'Do I need a visa for India?', answer: 'Most nationalities need an Indian visa. Citizens of 169 countries can apply for an e-Visa online at indianvisaonline.gov.in. It takes 2–4 business days and costs $25–$80 depending on your passport.' },
        { question: 'Is India safe to travel?', answer: 'India is generally safe for tourists. The most popular circuits (Golden Triangle, Kerala, Rajasthan, Goa) have well-developed tourism infrastructure with tourist police, registered guides, and good healthcare.' },
        { question: 'What vaccinations do I need for India?', answer: 'Recommended: Hepatitis A, Typhoid, and Tetanus. Optional (depending on region/season): Hepatitis B, Japanese Encephalitis, Rabies, Malaria prophylaxis. Consult a travel medicine clinic 6–8 weeks before departure.' },
        { question: 'What currency is used in India?', answer: 'The Indian Rupee (INR). Exchange rate is approximately 84 INR = 1 USD. Major credit cards (Visa, Mastercard, Amex) are accepted in cities, hotels, and tourist areas. Carry some cash for markets and rural areas.' },
        { question: 'What is the best time of year to visit India?', answer: 'October to March is ideal for most of India — cool, dry, and festival-rich. South India (Kerala, Tamil Nadu) is also good April–September. Avoid North India in May–June (extreme heat up to 48°C).' },
      ]} />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-primary text-cream">
        <div className="section-container">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
            Free Travel Guide
          </p>
          <h1 className="font-display text-display-xl text-cream mb-6 max-w-3xl">
            India Travel Guide for <span className="italic">International Tourists</span>
          </h1>
          <p className="text-cream/70 text-body-lg max-w-2xl">
            Everything you need to know before your first trip to India — visa, safety, health, money, and what to pack. Updated for 2025.
          </p>
          {/* Jump links */}
          <div className="mt-8 flex flex-wrap gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-caption uppercase tracking-wider text-cream/60 hover:text-accent transition-colors border border-white/15 hover:border-accent/50 px-4 py-2 rounded-full"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="section-container py-12 md:py-20 space-y-16 md:space-y-24">

        {/* ── Visa Requirements ─────────────────────────────── */}
        <section id="visa" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-display text-display-lg text-primary">Visa Requirements</h2>
          </div>

          <div className="prose-lg text-primary/75 space-y-4 max-w-3xl">
            <p>
              Most international travelers — including citizens of the USA, UK, Canada, Australia, Germany, France, and 60+ other countries — can apply for an <strong className="text-primary">e-Visa online</strong> before traveling to India. You do not need to visit an embassy.
            </p>

            <h3 className="font-display text-2xl text-primary mt-8 mb-3">India e-Visa — Key Facts</h3>
            <ul className="space-y-3 list-none pl-0">
              {[
                'Apply online at indianvisaonline.gov.in (official government site only)',
                'Processing time: 72 hours in most cases',
                'Tourist e-Visa: Valid for 1 year from issue date, double or multiple entry',
                'Stay per visit: Up to 90 days per entry (up to 180 days for USA, UK, Canada, Japan)',
                'Cost: approx. USD 25 (varies by nationality — check official site)',
                'You must upload a recent passport-size photo and the first & last page of your passport',
                'Print or save the e-Visa on your phone — you\'ll need to show it at the airport',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-accent mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-cream-dark border-l-4 border-accent p-4 rounded mt-6">
              <p className="text-sm font-medium text-primary">
                ⚠️ Apply at least 4–5 days before travel. YlooTrips provides a visa checklist to every booked traveler — <Link href="/contact" className="text-secondary underline">contact us</Link> for help.
              </p>
            </div>

            <h3 className="font-display text-2xl text-primary mt-8 mb-3">Visa on Arrival</h3>
            <p>
              India does not offer a traditional visa-on-arrival. The e-Visa is the standard process. Apply online before you fly — it is quick, straightforward, and we can guide you through it.
            </p>
          </div>
        </section>

        {/* ── Best Time to Visit ──────────────────────────── */}
        <section id="best-time" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="font-display text-display-lg text-primary">Best Time to Visit India</h2>
          </div>

          <div className="text-primary/75 space-y-4 max-w-3xl">
            <p>
              India is a vast country — different regions have dramatically different climates. Here&apos;s your quick guide:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {[
                {
                  season: '🌟 Oct – Mar (Peak Season)',
                  desc: 'Best weather across most of India. Ideal for Golden Triangle, Rajasthan, Goa, and Kerala. Expect cooler days, clear skies, and festive atmosphere.',
                  tag: 'Recommended for most travelers',
                },
                {
                  season: '☀️ Apr – Jun (Summer)',
                  desc: 'Hot and dry in North India (40–45°C). Great for hill stations like Shimla, Manali, and Darjeeling. Himalayan treks open up.',
                  tag: 'Good for mountains',
                },
                {
                  season: '🌧️ Jul – Sep (Monsoon)',
                  desc: 'Heavy rains across most of India. Kerala is lush and green — popular for Ayurveda retreats. Rajasthan gets fewer crowds. Budget travelers love it.',
                  tag: 'Best value pricing',
                },
                {
                  season: '❄️ Dec – Jan (Winter)',
                  desc: 'Cool evenings in North India (15–22°C days, 5–10°C nights in Rajasthan). Perfect for outdoor sightseeing. Holidays can mean crowds — book early.',
                  tag: 'Best for Golden Triangle',
                },
              ].map(({ season, desc, tag }) => (
                <div key={season} className="border border-primary/10 bg-cream-light p-5">
                  <div className="font-medium text-primary mb-1">{season}</div>
                  <p className="text-sm text-primary/65 leading-relaxed mb-2">{desc}</p>
                  <span className="text-caption uppercase tracking-wider text-secondary">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Safety Tips ────────────────────────────────── */}
        <section id="safety" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-display text-display-lg text-primary">Is India Safe for Tourists?</h2>
          </div>

          <div className="text-primary/75 space-y-4 max-w-3xl">
            <p>
              Yes — India is safe for international tourists, including solo travelers and solo female travelers, when you follow basic precautions. Millions of foreigners visit every year and have wonderful experiences.
            </p>

            <h3 className="font-display text-2xl text-primary mt-6 mb-3">General Safety Tips</h3>
            <ul className="space-y-3 list-none pl-0">
              {[
                'Use reputable, app-based taxis (Ola, Uber) over street cabs — always check the driver name & car number',
                'Keep a photocopy of your passport in your bag; leave the original in the hotel safe',
                'Dress modestly when visiting temples and rural areas — cover shoulders and knees',
                'Drink only bottled water; avoid ice in street food stalls',
                'Be firm but polite when declining persistent touts at tourist sites',
                'Share your itinerary with someone back home — or use YlooTrips\' 24/7 helpline',
                'Avoid flashy displays of expensive cameras/jewelry in crowded markets',
                'Scams are usually minor (overpriced tuk-tuks, gem shops) — just say no firmly and walk away',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm leading-relaxed">
                  <ChevronRight className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            <div className="bg-green-50 border border-green-200 p-4 mt-6">
              <p className="text-sm text-green-800">
                <strong>YlooTrips Safety Promise:</strong> Every traveler gets our 24/7 WhatsApp emergency line. Your guide&apos;s number is shared before your trip begins. We pre-vet all hotels, drivers, and activity providers.
              </p>
            </div>
          </div>
        </section>

        {/* ── What to Pack ───────────────────────────────── */}
        <section id="packing" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Backpack className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-display text-display-lg text-primary">What to Pack for India</h2>
          </div>

          <div className="text-primary/75 space-y-4 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              {[
                {
                  category: '👗 Clothing',
                  items: ['Lightweight, breathable cotton clothes', 'Light layers for evening (North India gets cold in winter)', 'Modest clothing for temples (shawl, long skirt/trousers)', 'Comfortable walking sandals + closed shoes', 'Rain jacket / compact umbrella (if monsoon season)'],
                },
                {
                  category: '💊 Health & Comfort',
                  items: ['Sunscreen SPF 50+', 'Insect repellent (DEET-based)', 'Hand sanitiser & face masks', 'Rehydration sachets (ORS)', 'Basic stomach medicines (loperamide, antacids)', 'Prescription medications in original packaging'],
                },
                {
                  category: '🔌 Electronics',
                  items: ['Universal power adapter (India uses Type C, D, and M plugs)', 'Portable phone charger / power bank', 'Download Google Maps offline before travel', 'Get an Indian SIM at the airport (Airtel or Jio — cheap data)'],
                },
                {
                  category: '📄 Documents',
                  items: ['Passport + printed e-Visa copy', 'Travel insurance documents', 'Hotel booking confirmations', 'Emergency contact list', 'Small denominations of USD cash (for emergencies)'],
                },
              ].map(({ category, items }) => (
                <div key={category} className="border border-primary/10 bg-cream-light p-5">
                  <div className="font-medium text-primary mb-3">{category}</div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="text-accent mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Health & Vaccinations ──────────────────────── */}
        <section id="health" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Syringe className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-display text-display-lg text-primary">Health & Vaccinations</h2>
          </div>

          <div className="text-primary/75 space-y-4 max-w-3xl">
            <p>
              No vaccinations are legally required to enter India unless you are arriving from a yellow fever endemic country. However, several are <strong className="text-primary">strongly recommended</strong>.
            </p>

            <h3 className="font-display text-2xl text-primary mt-6 mb-3">Recommended Vaccinations</h3>
            <ul className="space-y-3 list-none pl-0">
              {[
                { v: 'Hepatitis A & B', note: 'Strongly recommended for all travelers' },
                { v: 'Typhoid', note: 'Recommended, especially if eating street food' },
                { v: 'Tetanus, Diphtheria, Pertussis', note: 'Keep up to date' },
                { v: 'Japanese Encephalitis', note: 'If visiting rural areas or staying >1 month' },
                { v: 'Rabies', note: 'For adventure travelers or those in contact with animals' },
                { v: 'Malaria tablets', note: 'Consult your doctor — depends on specific regions visited' },
              ].map(({ v, note }) => (
                <li key={v} className="flex items-start gap-2 text-sm">
                  <ChevronRight className="w-4 h-4 text-red-400 mt-1 shrink-0" />
                  <span><strong className="text-primary">{v}</strong> — {note}</span>
                </li>
              ))}
            </ul>

            <div className="bg-red-50 border border-red-200 p-4 mt-6">
              <p className="text-sm text-red-800">
                <strong>Always consult your GP or travel clinic</strong> at least 4–6 weeks before departure. Bring adequate travel insurance that covers medical evacuation.
              </p>
            </div>
          </div>
        </section>

        {/* ── Currency & Payments ────────────────────────── */}
        <section id="money" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-teal-600" />
            </div>
            <h2 className="font-display text-display-lg text-primary">Currency & Payments</h2>
          </div>

          <div className="text-primary/75 space-y-4 max-w-3xl">
            <p>
              India&apos;s currency is the <strong className="text-primary">Indian Rupee (INR / ₹)</strong>. The approximate exchange rate is <strong className="text-primary">1 USD ≈ ₹84</strong>, <strong className="text-primary">1 GBP ≈ ₹107</strong>, <strong className="text-primary">1 EUR ≈ ₹91</strong>.
            </p>

            <h3 className="font-display text-2xl text-primary mt-6 mb-3">Money Tips</h3>
            <ul className="space-y-3 list-none pl-0">
              {[
                'Withdraw INR from ATMs in India — much better rate than airport exchange',
                'Major cities have excellent ATM coverage; carry cash for smaller towns',
                'UPI / QR payments are widely used — even street vendors accept it',
                'Visa & Mastercard work in most hotels, restaurants, and shops',
                'Amex is accepted in premium hotels and some restaurants',
                'Tipping: ₹50–₹100 for guides per day, 10% in restaurants (not mandatory)',
                'Bargaining is expected in bazaars — not in shops with fixed-price signs',
                'YlooTrips accepts international bank transfers, Wise, and major credit cards',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm leading-relaxed">
                  <ChevronRight className="w-4 h-4 text-teal-500 mt-1 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="border border-primary/10 bg-cream-light p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl text-primary mb-4">
            Ready to plan your India trip?
          </h2>
          <p className="text-primary/65 mb-8 max-w-xl mx-auto">
            Our India experts will build a custom itinerary around your dates, budget, and travel style. We handle visas, hotels, guides, and transfers — you just show up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Get a Custom Itinerary
            </Link>
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%20read%20the%20India%20Travel%20Guide%20and%20want%20to%20plan%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              WhatsApp Us Now
            </a>
          </div>
          <p className="text-caption text-primary/40 mt-4">Free consultation · Custom itinerary within 24 hours</p>
        </section>
      </div>
    </div>
  );
}
