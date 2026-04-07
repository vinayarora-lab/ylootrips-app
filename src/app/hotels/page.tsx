'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star, MapPin } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';

interface Hotel {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number | { value: string };
  type: string;
  amenities: string[];
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await api.getFeaturedHotels();
        setHotels(response.data);
        setError(null);
      } catch {
        setError('Unable to load hotels. Please ensure the backend is running.');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const formatPrice = (price: number | { value: string }) => {
    const numPrice = typeof price === 'object' ? parseFloat(price.value) : price;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <>
      <PageHero
        title="Boutique Stays"
        subtitle="Hand-selected accommodations that embody the spirit of their destination. From cliffside villas to hidden riads, every stay is an experience."
        breadcrumb="Stays"
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Hotels Grid */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="section-container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[450px] bg-cream-dark animate-pulse" />
              ))}
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${hotel.id}`}
                  className="group block bg-cream-light overflow-hidden transition-all duration-500 hover:shadow-xl"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {hotel.type && (
                      <div className="absolute top-4 right-4 bg-cream px-3 py-1.5 text-caption uppercase tracking-widest">
                        {hotel.type}
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-cream/90 px-3 py-1.5 flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-secondary/60 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-caption uppercase tracking-wider">{hotel.city}, {hotel.country}</span>
                    </div>

                    <h3 className="font-display text-2xl text-primary group-hover:text-secondary transition-colors mb-3">
                      {hotel.name}
                    </h3>

                    <p className="text-primary/60 text-sm mb-4 line-clamp-2">
                      {hotel.description}
                    </p>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="px-3 py-1 bg-cream-dark text-caption text-primary/60">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                      <div>
                        <span className="font-display text-2xl text-primary">{formatPrice(hotel.pricePerNight)}</span>
                        <span className="text-primary/50 text-sm"> / night</span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-primary/60">No hotels available. Please seed the database.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-secondary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-6">
            Looking for something special?
          </h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Our travel experts can find the perfect accommodation for your unique preferences.
          </p>
          <Link href="/contact" className="btn-primary bg-cream text-primary hover:bg-cream-dark">
            <span>Speak With an Expert</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}