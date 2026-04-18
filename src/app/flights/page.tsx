import type { Metadata } from 'next';
import FlightSearch from '@/components/FlightSearch';

export const metadata: Metadata = {
  title: 'Flight Search — Best Fares | YlooTrips',
  description: 'Search and book flights to India and international destinations. Best fares on domestic and international routes.',
};

export default function FlightsPage() {
  return <FlightSearch />;
}
