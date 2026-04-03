'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const recentBookings = [
    { name: 'Sarah M.', country: '🇺🇸', location: 'New York', trip: 'Golden Triangle Tour', time: '2 mins ago' },
    { name: 'James H.', country: '🇬🇧', location: 'London', trip: 'Kerala Backwaters', time: '5 mins ago' },
    { name: 'Lachlan B.', country: '🇦🇺', location: 'Sydney', trip: 'Rajasthan Heritage', time: '8 mins ago' },
    { name: 'Katrin B.', country: '🇩🇪', location: 'Berlin', trip: 'Himalayan Trek', time: '12 mins ago' },
    { name: 'Priya S.', country: '🇨🇦', location: 'Toronto', trip: 'North India Tour', time: '18 mins ago' },
    { name: 'Chloé D.', country: '🇫🇷', location: 'Paris', trip: 'Kerala Ayurveda', time: '22 mins ago' },
    { name: 'Aarav P.', country: '🇮🇳', location: 'Mumbai', trip: 'Manali Adventure', time: '3 mins ago' },
    { name: 'Emma W.', country: '🇺🇸', location: 'Chicago', trip: 'Taj Mahal Sunrise', time: '9 mins ago' },
    { name: 'Rohan K.', country: '🇮🇳', location: 'Bangalore', trip: 'Goa Beach Trip', time: '14 mins ago' },
    { name: 'Sophie L.', country: '🇸🇬', location: 'Singapore', trip: 'India Cultural Tour', time: '27 mins ago' },
];

export default function SocialProofToast() {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (dismissed) return;

        // Show first toast after 6s
        const initial = setTimeout(() => setVisible(true), 6000);

        return () => clearTimeout(initial);
    }, [dismissed]);

    useEffect(() => {
        if (!visible || dismissed) return;

        // Hide after 5s, then show next after 12s gap
        const hideTimer = setTimeout(() => {
            setVisible(false);
            const nextTimer = setTimeout(() => {
                setCurrent((c) => (c + 1) % recentBookings.length);
                setVisible(true);
            }, 12000);
            return () => clearTimeout(nextTimer);
        }, 5000);

        return () => clearTimeout(hideTimer);
    }, [visible, dismissed]);

    const booking = recentBookings[current];

    if (dismissed || !visible) return null;

    return (
        <div
            className={`fixed bottom-24 left-4 z-50 max-w-[280px] bg-white border border-primary/10 shadow-xl rounded-lg p-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 text-primary/30 hover:text-primary/60 text-xs leading-none"
                aria-label="Dismiss"
            >
                ✕
            </button>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-xl shrink-0">
                    {booking.country}
                </div>
                <div>
                    <p className="text-sm font-medium text-primary leading-snug">
                        {booking.name} from {booking.location} just booked
                    </p>
                    <p className="text-sm text-secondary font-medium mt-0.5 leading-snug">
                        {booking.trip}
                    </p>
                    <p className="text-xs text-primary/40 mt-1">{booking.time}</p>
                </div>
            </div>
        </div>
    );
}
