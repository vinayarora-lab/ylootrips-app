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
        name: 'YlooTrips',
        url: 'https://www.ylootrips.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.ylootrips.com/logo.png',
          width: 200,
          height: 60,
        },
        description:
          'YlooTrips crafts bespoke India travel experiences — Golden Triangle, Kerala, Rajasthan, Himalayas and more. Trusted by 25,000+ travelers from 40+ countries.',
        foundingDate: '2012',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
        areaServed: ['IN', 'US', 'GB', 'AU', 'CA', 'DE', 'FR', 'SG'],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91-8427831127',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi'],
            contactOption: 'TollFree',
          },
        ],
        sameAs: [
          'https://www.instagram.com/ylootrips',
          'https://www.facebook.com/ylootrips',
          'https://twitter.com/ylootrips',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '1240',
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
}

export function TourJsonLd({
  name,
  description,
  url,
  image,
  price,
  currency = 'USD',
  duration,
  startLocation,
  highlights,
  rating = 4.8,
  reviewCount = 94,
}: TourJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image,
    brand: { '@type': 'Brand', name: 'YlooTrips' },
    offers: {
      '@type': 'Offer',
      priceCurrency: currency,
      price,
      availability: 'https://schema.org/InStock',
      url,
      seller: {
        '@type': 'Organization',
        name: 'YlooTrips',
        url: 'https://www.ylootrips.com',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Duration', value: duration },
      { '@type': 'PropertyValue', name: 'Starting Location', value: startLocation },
      ...highlights.slice(0, 5).map((h) => ({
        '@type': 'PropertyValue',
        name: 'Highlight',
        value: h,
      })),
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
