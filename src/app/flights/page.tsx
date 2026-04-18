import type { Metadata } from 'next';
import FlightSearch from '@/components/FlightSearch';

export const metadata: Metadata = {
  title: 'Flight Search — Best Fares | YlooTrips',
  description: 'Search and book flights to India and international destinations. Best fares on domestic and international routes.',
};

export default function FlightsPage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <div className="bg-gray-900 px-4 pt-5 pb-8">
        <h1 className="font-playfair text-2xl text-white font-semibold mb-1">Flights</h1>
        <p className="text-white/60 text-sm">Best fares across 50+ airlines</p>
      </div>
      <div className="-mt-4">
        <FlightSearch />
      </div>
    </div>
  );
}
