'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import PaintSplashBg from '@/components/PaintSplashBg';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { currency } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [txnid, setTxnid] = useState<string | null>(null);

    // Get URL params - handle both Next.js searchParams and window.location for external redirects
    const getUrlParams = () => {
        if (typeof window === 'undefined') return { txnid: null, status: null, type: null };

        // Try Next.js searchParams first
        try {
            const txnid = searchParams?.get('txnid');
            const status = searchParams?.get('status');
            const type = searchParams?.get('type');
            if (txnid) {
                return { txnid, status, type };
            }
        } catch (e) {
            console.log('searchParams not ready, using window.location');
        }

        // Fallback to window.location for external redirects
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return {
                txnid: params.get('txnid'),
                status: params.get('status'),
                type: params.get('type')
            };
        }

        return { txnid: null, status: null, type: null };
    };

    useEffect(() => {
        // Ensure we're in the browser
        setMounted(true);

        // Handle page reload - clear any cached data
        const handleBeforeUnload = () => {
            // Clear session storage to force fresh data on reload
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const txnid = new URLSearchParams(window.location.search).get('txnid');
                if (txnid) {
                    sessionStorage.setItem('lastPaymentTxnid', txnid);
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const verifyPayment = async () => {
            // Small delay to ensure URL params are available after external redirect
            await new Promise(resolve => setTimeout(resolve, 100));

            const { txnid: urlTxnid, status, type } = getUrlParams();

            console.log('Payment success page - URL params:', { urlTxnid, status, type });

            if (!urlTxnid) {
                console.error('Missing transaction ID in URL');
                setError('Invalid payment response. Missing transaction ID.');
                setLoading(false);
                return;
            }

            setTxnid(urlTxnid);

            // Event bookings: use event status API. Infer from type=event OR reference prefix EVT-
            const isEvent = type === 'event' || (urlTxnid && urlTxnid.toUpperCase().startsWith('EVT-'));

            // Set a timeout to prevent infinite loading
            const timeoutId = setTimeout(() => {
                console.error('API call timeout');
                setError('Request timed out. Please try refreshing the page.');
                setLoading(false);
            }, 10000); // 10 second timeout

            try {
                console.log('Calling API for booking:', urlTxnid, isEvent ? '(event)' : '(trip)');

                // Retry logic for 405 errors (might be a caching issue)
                let response;
                let retries = 0;
                const maxRetries = 2;
                while (retries <= maxRetries) {
                    try {
                        response = isEvent
                            ? await api.getEventPaymentStatus(urlTxnid)
                            : await api.getPaymentStatus(urlTxnid);
                        break; // Success, exit retry loop
                    } catch (retryErr: any) {
                        if (retryErr.response?.status === 405 && retries < maxRetries) {
                            console.log(`405 error, retrying... (${retries + 1}/${maxRetries})`);
                            retries++;
                            await new Promise(resolve => setTimeout(resolve, 500 * retries)); // Exponential backoff
                            continue;
                        }
                        throw retryErr; // Re-throw if not 405 or max retries reached
                    }
                }

                clearTimeout(timeoutId);

                if (!response) {
                    throw new Error('No response received from API');
                }

                console.log('API response received:', response);
                const bookingData = response.data;

                if (!bookingData) {
                    console.error('No booking data in response');
                    setNotFound(true);
                    setLoading(false);
                    return;
                }

                console.log('Booking data:', bookingData);
                setBooking(bookingData);

                // Check payment status
                if (bookingData.paymentStatus === 'PAID' || status === 'success') {
                    // Payment successful - send confirmation email
                    const customerEmail = bookingData.customerEmail || bookingData.email;
                    if (customerEmail) {
                        fetch('/api/send-confirmation', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: customerEmail, booking: bookingData }),
                        }).catch((e) => console.warn('Email send failed:', e));
                    }
                    setError(null);
                } else {
                    setError('Payment verification failed. Payment status: ' + (bookingData.paymentStatus || 'Unknown'));
                }
            } catch (err: any) {
                clearTimeout(timeoutId);
                console.error('Error verifying payment:', err);
                console.error('Error details:', {
                    message: err.message,
                    response: err.response,
                    status: err.response?.status,
                    data: err.response?.data
                });

                // Handle different error types
                if (err.response?.status === 405) {
                    setError('Method not allowed. Please contact support if this issue persists.');
                } else if (err.response?.status === 404 || err.message?.includes('not found') || err.message?.includes('Not Found')) {
                    setNotFound(true);
                } else if (err.response?.status === 500) {
                    const serverMsg = err.response?.data?.error ?? err.response?.data?.message ?? err.response?.data?.details;
                    setError(serverMsg ? `Server error: ${serverMsg}` : 'Server error. Please try again later.');
                } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                    setError('Request timed out. Please try refreshing the page.');
                } else {
                    setError('Failed to verify payment: ' + (err.response?.data?.message || err.message || 'Unknown error'));
                }
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [mounted, searchParams, router]);

    if (loading) {
        return (
            <PaintSplashBg className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">Verifying payment...</p>
                </div>
            </PaintSplashBg>
        );
    }

    if (notFound) {
        return (
            <PaintSplashBg className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
                    <h1 className="text-3xl font-light mb-4">Booking Not Found</h1>
                    <p className="text-text-secondary mb-6">
                        We couldn't find a booking with reference: <strong>{txnid || 'Unknown'}</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/trips')}
                            className="btn-primary"
                        >
                            Browse Trips
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="btn-outline"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </PaintSplashBg>
        );
    }

    if (error) {
        return (
            <PaintSplashBg className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
                    <h1 className="text-3xl font-light mb-4">Payment Verification Failed</h1>
                    <p className="text-text-secondary mb-6">{error}</p>
                    {txnid && (
                        <p className="text-sm text-text-secondary mb-4">
                            Booking Reference: <strong>{txnid}</strong>
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => {
                                setLoading(true);
                                setError(null);
                                window.location.reload();
                            }}
                            className="btn-primary"
                        >
                            Retry Verification
                        </button>
                        <button
                            onClick={() => router.push('/trips')}
                            className="btn-outline"
                        >
                            Back to Trips
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="btn-outline"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </PaintSplashBg>
        );
    }

    return (
        <PaintSplashBg className="min-h-screen flex items-center justify-center mt-20 py-16">
            <div className="text-center max-w-2xl mx-auto px-4">
                <CheckCircle className="w-20 h-20 text-success text-green-600 mx-auto mb-6" />
                <h1 className="text-display-xl mb-4">Payment Successful!</h1>
                <p className="text-body-lg text-text-secondary mb-8">
                    Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>

                {booking && (
                    <div className="bg-white/60 backdrop-blur-sm p-8 border border-primary/10 rounded-xl mb-8 text-left">
                        <h2 className="text-2xl font-light mb-6">Booking Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Booking Reference</span>
                                <span className="font-medium">{booking.bookingReference}</span>
                            </div>
                            {booking.trip && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Trip</span>
                                        <span className="font-medium">{booking.trip.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Destination</span>
                                        <span className="font-medium">{booking.trip.destination}</span>
                                    </div>
                                </>
                            )}
                            {booking.event && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Event</span>
                                        <span className="font-medium">{booking.event.title}</span>
                                    </div>
                                    {booking.eventDate && (
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Event Date</span>
                                            <span className="font-medium">{new Date(booking.eventDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {booking.numberOfTickets != null && (
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Tickets</span>
                                            <span className="font-medium">{booking.numberOfTickets}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            {booking.travelDate && !booking.event && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Travel Date</span>
                                    <span className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            {booking.numberOfGuests != null && !booking.event && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Number of Guests</span>
                                    <span className="font-medium">{booking.numberOfGuests}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-4 border-t border-primary/10">
                                <span className="text-xl font-light">Amount Paid</span>
                                <span className="text-2xl font-light">
                                    {formatPriceWithCurrency(booking.finalAmount || booking.totalAmount, currency)}
                                </span>
                            </div>
                            {booking.paymentStatus && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Payment Status</span>
                                    <span className="font-medium text-success">{booking.paymentStatus}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push(booking?.event ? '/events' : '/trips')}
                        className="btn-primary"
                    >
                        {booking?.event ? 'Browse more events' : 'Browse More Trips'}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-outline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </PaintSplashBg>
    );
}

export default function PaymentSuccessPage() {
    // Force dynamic rendering and disable caching for payment success page
    // This ensures fresh data on every load, especially after external redirects
    if (typeof window !== 'undefined') {
        // Clear any cached data
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('payment') || name.includes('success')) {
                        caches.delete(name);
                    }
                });
            });
        }
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading payment details...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}

