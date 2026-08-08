/**
 * JSON-LD structured data components for rich Google results.
 * Usage: <OrganizationJsonLd /> in layout, <TourJsonLd ... /> on tour pages, etc.
 */

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TravelAgency', 'LocalBusiness'],
        '@id': 'https://www.ylootrips.com/#organization',
        name: 'YlooTrips India Pvt. Ltd.',
        alternateName: 'YlooTrips',
        url: 'https://www.ylootrips.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.ylootrips.com/logo.png',
          width: 200,
          height: 60,
        },
        description:
          'YlooTrips India Pvt. Ltd. crafts bespoke India travel experiences — Golden Triangle, Kerala, Rajasthan, Himalayas and more. Trusted by 25,000+ travelers from 40+ countries since 2022.',
        foundingDate: '2022',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
        areaServed: ['IN', 'US', 'GB', 'AU', 'CA', 'DE', 'FR', 'SG'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New Delhi',
          addressRegion: 'Delhi',
          addressCountry: 'IN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91-8427831127',
            email: 'hello@ylootrips.com',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi'],
          },
        ],
        sameAs: [
          'https://www.instagram.com/ylootrips',
          'https://www.facebook.com/ylootrips',
          'https://twitter.com/ylootrips',
          'https://www.linkedin.com/company/ylootrips',
          'https://www.youtube.com/@ylootrips',
          'https://play.google.com/store/apps/details?id=com.ylootrips.app',
        ],
        knowsAbout: [
          'India tour packages', 'luxury India travel', 'honeymoon packages India',
          'Kashmir tour', 'Bali tour packages', 'Dubai holiday packages',
          'Maldives luxury packages', 'Kerala backwaters', 'Rajasthan heritage tours',
          'AI trip planning', 'flight booking India', 'hotel booking India',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '2400',
          bestRating: '5',
          worstRating: '1',
        },
        priceRange: '$$',
        currenciesAccepted: 'INR, USD, GBP, EUR, AUD',
        paymentAccepted: 'Visa, Mastercard, Amex, UPI, Bank Transfer',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.ylootrips.com/#website',
        url: 'https://www.ylootrips.com',
        name: 'YlooTrips',
        publisher: { '@id': 'https://www.ylootrips.com/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.ylootrips.com/trips?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface TourJsonLdProps {
  name: string;
  description: string;
  url: string;
  image: string;
  price: string;
  currency?: string;
  duration: string;
  startLocation: string;
  highlights: string[];
  rating?: number;
  reviewCount?: number;
  destination?: string;
}

export function TourJsonLd({
  name,
  description,
  url,
  image,
  price,
  currency = 'INR',
  duration,
  startLocation,
  highlights,
  rating = 4.9,
  reviewCount = 847,
  destination,
}: TourJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // TouristTrip — correct type for travel packages (enables rich snippets)
      {
        '@type': 'TouristTrip',
        '@id': `${url}#trip`,
        name,
        description,
        url,
        image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
        touristType: ['FamilyTourist', 'HoneymoonTourist', 'GroupTourist', 'SoloTourist'],
        availableLanguage: ['English', 'Hindi'],
        itinerary: {
          '@type': 'ItemList',
          name: `${name} — Day by Day`,
          description: `Complete ${duration} itinerary for ${name}`,
        },
        provider: {
          '@type': 'TravelAgency',
          name: 'YlooTrips',
          url: 'https://www.ylootrips.com',
          telephone: '+91-8427831127',
          email: 'hello@ylootrips.com',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: currency,
          price,
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url,
          validFrom: '2026-01-01',
          seller: {
            '@type': 'TravelAgency',
            name: 'YlooTrips',
            url: 'https://www.ylootrips.com',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          reviewCount: reviewCount.toString(),
          bestRating: '5',
          worstRating: '1',
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Duration', value: duration },
          { '@type': 'PropertyValue', name: 'Departure City', value: startLocation },
          ...(destination ? [{ '@type': 'PropertyValue', name: 'Destination', value: destination }] : []),
          ...highlights.slice(0, 6).map((h) => ({
            '@type': 'PropertyValue',
            name: 'Highlight',
            value: h,
          })),
        ],
      },
      // Product schema — enables price + star ratings in Google Shopping & SERPs
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name,
        description,
        image,
        brand: { '@type': 'Brand', name: 'YlooTrips' },
        offers: {
          '@type': 'Offer',
          priceCurrency: currency,
          price,
          availability: 'https://schema.org/InStock',
          url,
          seller: { '@type': 'Organization', name: 'YlooTrips', url: 'https://www.ylootrips.com' },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          reviewCount: reviewCount.toString(),
          bestRating: '5',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'YlooTrips Editorial Team',
  keywords = [],
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://www.ylootrips.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YlooTrips',
      url: 'https://www.ylootrips.com',
      logo: { '@type': 'ImageObject', url: 'https://www.ylootrips.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: keywords.join(', '),
    inLanguage: 'en',
    about: { '@type': 'Thing', name: 'India Travel' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── HowTo Schema — tells Google HOW to book / use a feature ──────────────────
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  totalTime: string; // ISO 8601 duration e.g. "PT10M"
  steps: HowToStep[];
}

export function HowToJsonLd({ name, description, totalTime, steps }: HowToJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    supply: [
      { '@type': 'HowToSupply', name: 'Internet connection' },
      { '@type': 'HowToSupply', name: 'Travel dates and destination in mind' },
    ],
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: { '@type': 'ImageObject', url: s.image } } : {}),
    })),
    provider: {
      '@type': 'TravelAgency',
      name: 'YlooTrips',
      url: 'https://www.ylootrips.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Speakable Schema — helps Google Assistant / voice search ─────────────────
export function SpeakableJsonLd({ cssSelectors, url }: { cssSelectors: string[]; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
