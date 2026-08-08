import type { Metadata } from 'next';
import FlightSearch from '@/components/FlightSearch';
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Cheap Flights to India — Search & Book | YlooTrips',
  description: 'Search cheap flights to India and international destinations. Compare fares across 50+ airlines — Delhi, Mumbai, Goa, Bali, Dubai, Bangkok & more. Book in minutes with YlooTrips.',
  keywords: 'cheap flights to India, flights from USA to India, Delhi flights, Mumbai flights, Goa flights, book flight tickets online, best flight deals India',
  openGraph: {
    title: 'Cheap Flights to India & International — YlooTrips',
    description: 'Compare fares across 50+ airlines. Delhi, Mumbai, Goa, Bali, Dubai & more. Book in minutes.',
    url: 'https://www.ylootrips.com/flights',
    images: [{ url: 'https://www.ylootrips.com/og-image.jpg', width: 1200, height: 630, alt: 'Flight Search — YlooTrips' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/flights' },
};

const FLIGHT_FAQS = [
  { question: 'How do I find cheap flights to India?', answer: 'Use YlooTrips flight search to compare fares across 50+ airlines including IndiGo, Air India, SpiceJet, Emirates, and Qatar Airways. Book 4–8 weeks in advance for the best domestic fares, and 2–3 months ahead for international flights.' },
  { question: 'Which airlines fly from the USA to India?', answer: 'Major airlines flying from the USA to India include Air India (non-stop from NYC, Chicago, San Francisco), United, Delta, Emirates, Qatar Airways, and Etihad. YlooTrips searches all major carriers for the best fare.' },
  { question: 'Is it cheaper to book flights through YlooTrips?', answer: 'YlooTrips searches live fares from 50+ airlines and shows the cheapest available option. We do not charge booking fees and display prices inclusive of taxes.' },
  { question: 'What is the baggage allowance on Indian domestic flights?', answer: 'Most Indian domestic airlines (IndiGo, Air India, SpiceJet, Vistara) allow 15 kg check-in + 7 kg cabin baggage in economy. Business class gets 25–35 kg. Always confirm with the airline at booking.' },
];

export default function FlightsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Flights', url: 'https://www.ylootrips.com/flights' },
      ]} />
      <FaqJsonLd faqs={FLIGHT_FAQS} />
      <FlightSearch />
    </>
  );
}
