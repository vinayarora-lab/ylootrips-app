'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Mail, Calendar, Users } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference');
    
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!reference) {
                router.push('/trips');
                return;
            }
            
            try {
                const response = await api.getBooking(reference);
                setBooking(response.data);
            } catch {
                // booking fetch failed, show generic confirmation
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [reference, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading booking details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-16 mt-20">
            <div className="section-container">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h1 className="text-display-xl mb-4">Booking Confirmed!</h1>
                        <p className="text-body-lg text-text-secondary">
                            Thank you for your booking. We've sent a confirmation email to your registered email address.
                        </p>
                    </div>

                    {booking && (
                        <div className="bg-cream-light p-8 border border-primary/10 mb-8 text-left">
                            <h2 className="text-2xl font-light mb-6">Booking Details</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Booking Reference</span>
                                    <span className="font-medium">{booking.bookingReference}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Trip</span>
                                    <span className="font-medium">{booking.trip?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Destination</span>
                                    <span className="font-medium">{booking.trip?.destination}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Travel Date</span>
                                    <span className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Number of Guests</span>
                                    <span className="font-medium">{booking.numberOfGuests}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-primary/10">
                                    <span className="text-xl font-light">Total Amount</span>
                                    <span className="text-2xl font-light">₹{booking.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {booking?.bookingReference && (
                            <Link href={`/my-booking?ref=${booking.bookingReference}`} className="btn-primary">
                                Track My Booking
                            </Link>
                        )}
                        <Link href="/trips" className="btn-outline">
                            Browse More Trips
                        </Link>
                        <Link href="/" className="btn-outline">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading booking details...</p>
                </div>
            </div>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    );
}






