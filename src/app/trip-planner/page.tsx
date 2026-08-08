import type { Metadata } from 'next';
import { Suspense } from 'react';
import TripPlannerChat from '@/components/TripPlannerChat';
import { BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Free AI Trip Planner — Personalised Itinerary in 30 Seconds | YlooTrips',
  description: 'Plan your perfect trip with YLOO AI — get a free, personalised day-by-day itinerary for India, Bali, Dubai, Thailand and 150+ destinations in under 30 seconds. No sign-up needed.',
  keywords: 'AI trip planner, free trip planner, India itinerary planner, Bali itinerary, Dubai trip plan, personalised travel itinerary, AI travel assistant, YlooTrips planner',
  openGraph: {
    title: 'Free AI Trip Planner — Get Your Itinerary in 30 Seconds | YlooTrips',
    description: 'Personalised day-by-day itinerary for India, Bali, Dubai & 150+ destinations. Free, instant, no sign-up needed.',
    url: 'https://www.ylootrips.com/trip-planner',
    images: [{ url: 'https://www.ylootrips.com/og-image.jpg', width: 1200, height: 630, alt: 'YLOO AI Trip Planner' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/trip-planner' },
};

const PLANNER_FAQS = [
  { question: 'Is the YLOO AI Trip Planner free to use?', answer: 'Yes, completely free. No sign-up or account required. Just type your destination and travel dates and get a full personalised itinerary in seconds.' },
  { question: 'Which destinations can the AI planner create itineraries for?', answer: 'YLOO AI can plan trips to 150+ destinations including all major India destinations (Kashmir, Goa, Kerala, Rajasthan, Himalayas) and international ones like Bali, Dubai, Maldives, Thailand, Singapore, Europe, and more.' },
  { question: 'How accurate is the AI-generated itinerary?', answer: 'The AI creates realistic day-by-day itineraries with activities, hotels, and timing based on real travel data. Our travel experts then review and can customise it further — WhatsApp us at +91-84278-31127 for a personalised consultation.' },
  { question: 'Can I book directly after getting my AI itinerary?', answer: 'Yes. Once your itinerary is ready, you can WhatsApp it to our travel experts who will convert it into a full confirmed booking with hotels, flights, and guides — all in one go.' },
];

export default function TripPlannerPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'AI Trip Planner', url: 'https://www.ylootrips.com/trip-planner' },
      ]} />
      <FaqJsonLd faqs={PLANNER_FAQS} />
      <HowToJsonLd
        name="How to Use YLOO AI Trip Planner"
        description="Get a free personalised travel itinerary in 3 easy steps"
        totalTime="PT2M"
        steps={[
          { name: 'Enter Your Destination', text: 'Type the destination you want to visit (e.g. "Bali honeymoon 7 days" or "Kashmir family trip June").' },
          { name: 'Get Your Itinerary', text: 'YLOO AI generates a complete day-by-day itinerary with activities, hotels, and tips — in under 30 seconds.' },
          { name: 'Book with YlooTrips', text: 'Share your itinerary with our travel experts via WhatsApp or email to convert it into a confirmed booking with the best prices.' },
        ]}
      />
      <Suspense fallback={<div className="min-h-screen bg-cream-light" />}>
        <TripPlannerChat />
      </Suspense>
    </>
  );
}
