'use client';

import { useState } from 'react';
import { Plane, ArrowRight, Clock, Users, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

interface Flight {
    id: string;
    airline: string;
    airlineCode: string;
    logo: string;
    from: string;
    to: string;
    departTime: string;
    arriveTime: string;
    duration: string;
    stops: number;
    stopInfo: string;
    price: number;
    class: string;
    seatsLeft: number;
}

const AIRLINES = [
    { name: 'Air India', code: 'AI', logo: '🇮🇳' },
    { name: 'Emirates', code: 'EK', logo: '🇦🇪' },
    { name: 'Qatar Airways', code: 'QR', logo: '🇶🇦' },
    { name: 'Singapore Airlines', code: 'SQ', logo: '🇸🇬' },
    { name: 'British Airways', code: 'BA', logo: '🇬🇧' },
    { name: 'IndiGo', code: '6E', logo: '✈️' },
];

function generateFlights(from: string, to: string, date: string, passengers: number): Flight[] {
    if (!from || !to || !date) return [];
    const seed = (from + to + date).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = (min: number, max: number, offset = 0) => min + ((seed + offset) % (max - min));

    return AIRLINES.map((airline, i) => {
        const depHour = rand(5, 22, i * 17);
        const depMin = rand(0, 59, i * 13);
        const durationH = rand(7, 16, i * 11);
        const durationM = rand(0, 59, i * 7);
        const arrHour = (depHour + durationH) % 24;
        const arrMin = (depMin + durationM) % 60;
        const stops = i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2;
        const basePrice = 350 + rand(50, 600, i * 23) + stops * -40;
        return {
            id: `${airline.code}-${i}`,
            airline: airline.name,
            airlineCode: airline.code,
            logo: airline.logo,
            from: from.toUpperCase().slice(0, 3),
            to: to.toUpperCase().slice(0, 3),
            departTime: `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`,
            arriveTime: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
            duration: `${durationH}h ${durationM}m`,
            stops,
            stopInfo: stops === 0 ? 'Non-stop' : stops === 1 ? '1 stop · Dubai' : '2 stops · Dubai · Mumbai',
            price: Math.max(250, basePrice) * passengers,
            class: 'Economy',
            seatsLeft: rand(2, 8, i * 31),
        };
    }).sort((a, b) => a.price - b.price);
}

const POPULAR_ORIGINS = [
    'New York (JFK)', 'London (LHR)', 'Dubai (DXB)', 'Singapore (SIN)',
    'Sydney (SYD)', 'Toronto (YYZ)', 'Los Angeles (LAX)', 'Frankfurt (FRA)',
    'Paris (CDG)', 'Tokyo (NRT)',
];

interface FlightBookingSectionProps {
    destination: string;
    travelDate: string;
    guests: number;
}

export default function FlightBookingSection({ destination, travelDate, guests }: FlightBookingSectionProps) {
    const [open, setOpen] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState(destination || 'Delhi (DEL)');
    const [date, setDate] = useState(travelDate || '');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(guests || 1);
    const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
    const [flights, setFlights] = useState<Flight[]>([]);
    const [searched, setSearched] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [booked, setBooked] = useState(false);
    const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);
    const [expandedFlight, setExpandedFlight] = useState<string | null>(null);

    const handleSearch = () => {
        if (!from || !to || !date) return;
        const results = generateFlights(from, to, date, passengers);
        setFlights(results);
        setSearched(true);
        setSelectedFlight(null);
        setShowBookingForm(false);
        setBooked(false);
    };

    const handleSelectFlight = (flight: Flight) => {
        setSelectedFlight(flight);
        setShowBookingForm(true);
        setBooked(false);
    };

    const handleBookFlight = async () => {
        if (!bookingForm.name || !bookingForm.email || !bookingForm.phone) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setBooked(true);
    };

    return (
        <section className="border border-blue-200 rounded-lg overflow-hidden">
            {/* Header toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-5 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Plane size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-blue-900 text-lg">Book Your Flights</p>
                        <p className="text-sm text-blue-600">Search & book flights directly for this trip</p>
                    </div>
                </div>
                {open ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-blue-600" />}
            </button>

            {open && (
                <div className="p-6 bg-white space-y-6">
                    {/* Trip type toggle */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                        {(['one-way', 'round-trip'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTripType(t)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tripType === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t === 'one-way' ? 'One Way' : 'Round Trip'}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">From</label>
                            <select
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                            >
                                <option value="">Select origin city</option>
                                {POPULAR_ORIGINS.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">To</label>
                            <input
                                type="text"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                placeholder="Destination"
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Depart Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                            />
                        </div>

                        {tripType === 'round-trip' ? (
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Return Date</label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={e => setReturnDate(e.target.value)}
                                    min={date || new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Passengers</label>
                                <select
                                    value={passengers}
                                    onChange={e => setPassengers(Number(e.target.value))}
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                                >
                                    {[1,2,3,4,5,6,7,8].map(n => (
                                        <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {tripType === 'round-trip' && (
                        <div className="max-w-xs">
                            <label className="text-xs font-medium text-gray-500 mb-1 block uppercase tracking-wide">Passengers</label>
                            <select
                                value={passengers}
                                onChange={e => setPassengers(Number(e.target.value))}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-400"
                            >
                                {[1,2,3,4,5,6,7,8].map(n => (
                                    <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={handleSearch}
                        disabled={!from || !to || !date}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plane size={18} />
                        Search Flights
                    </button>

                    {/* Flight Results */}
                    {searched && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{flights.length} flights found</h3>
                                <span className="text-sm text-gray-500">{from} → {to} · {passengers} pax</span>
                            </div>

                            {flights.map(flight => (
                                <div
                                    key={flight.id}
                                    className={`border rounded-xl overflow-hidden transition-all ${selectedFlight?.id === flight.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Airline */}
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <span className="text-2xl">{flight.logo}</span>
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{flight.airline}</p>
                                                    <p className="text-xs text-gray-400">{flight.airlineCode} · {flight.class}</p>
                                                </div>
                                            </div>

                                            {/* Route & Time */}
                                            <div className="flex items-center gap-4 flex-1 justify-center">
                                                <div className="text-center">
                                                    <p className="text-xl font-light text-gray-900">{flight.departTime}</p>
                                                    <p className="text-xs text-gray-500">{flight.from}</p>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 flex-1 max-w-[120px]">
                                                    <p className="text-xs text-gray-400">{flight.duration}</p>
                                                    <div className="flex items-center w-full gap-1">
                                                        <div className="h-px flex-1 bg-gray-300"></div>
                                                        <Plane size={12} className="text-gray-400" />
                                                        <div className="h-px flex-1 bg-gray-300"></div>
                                                    </div>
                                                    <p className={`text-xs font-medium ${flight.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {flight.stopInfo}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-light text-gray-900">{flight.arriveTime}</p>
                                                    <p className="text-xs text-gray-500">{flight.to}</p>
                                                </div>
                                            </div>

                                            {/* Price & Book */}
                                            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 min-w-[120px]">
                                                <div className="text-right">
                                                    <p className="text-2xl font-light text-gray-900">${flight.price}</p>
                                                    <p className="text-xs text-gray-400">total · {passengers} pax</p>
                                                    {flight.seatsLeft <= 4 && (
                                                        <p className="text-xs text-red-500 font-medium">{flight.seatsLeft} seats left</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleSelectFlight(flight)}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                                                >
                                                    Select
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expand details */}
                                        <button
                                            onClick={() => setExpandedFlight(expandedFlight === flight.id ? null : flight.id)}
                                            className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            {expandedFlight === flight.id ? 'Hide details' : 'View details'}
                                            {expandedFlight === flight.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>

                                        {expandedFlight === flight.id && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 grid sm:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Included</p>
                                                    <ul className="space-y-1">
                                                        {['1 cabin bag (7 kg)', 'Checked baggage (23 kg)', 'Meal on board', 'Seat selection'].map(item => (
                                                            <li key={item} className="flex items-center gap-2 text-gray-600">
                                                                <Check size={12} className="text-green-500 shrink-0" />{item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Not Included</p>
                                                    <ul className="space-y-1">
                                                        {['Extra baggage', 'Priority boarding', 'Travel insurance'].map(item => (
                                                            <li key={item} className="flex items-center gap-2 text-gray-600">
                                                                <X size={12} className="text-red-400 shrink-0" />{item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Fare Rules</p>
                                                    <ul className="space-y-1 text-gray-600">
                                                        <li>Cancellation: $80 fee</li>
                                                        <li>Date change: $60 fee</li>
                                                        <li>Refundable: Yes (partial)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Booking Form */}
                    {showBookingForm && selectedFlight && !booked && (
                        <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50 space-y-4">
                            <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                <Plane size={18} className="text-blue-600" />
                                Complete Flight Booking
                            </h3>

                            {/* Selected flight summary */}
                            <div className="bg-white border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{selectedFlight.logo}</span>
                                    <div>
                                        <p className="font-medium text-sm">{selectedFlight.airline}</p>
                                        <p className="text-xs text-gray-500">{selectedFlight.from} → {selectedFlight.to} · {selectedFlight.departTime} – {selectedFlight.arriveTime}</p>
                                        <p className="text-xs text-gray-400">{selectedFlight.stopInfo} · {selectedFlight.duration}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-light">${selectedFlight.price}</p>
                                    <p className="text-xs text-gray-400">{passengers} pax</p>
                                </div>
                            </div>

                            {/* Passenger details */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="As on passport"
                                        value={bookingForm.name}
                                        onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        placeholder="For e-ticket"
                                        value={bookingForm.email}
                                        onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        value={bookingForm.phone}
                                        onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="text-lg font-medium text-gray-900">Total: <span className="text-blue-700">${selectedFlight.price}</span></p>
                                    <p className="text-xs text-gray-400">Includes taxes & fees · {passengers} passenger{passengers > 1 ? 's' : ''}</p>
                                </div>
                                <button
                                    onClick={handleBookFlight}
                                    disabled={!bookingForm.name || !bookingForm.email || !bookingForm.phone || submitting}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {submitting ? (
                                        <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Processing...</>
                                    ) : (
                                        <><Plane size={16} /> Book Flight</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Booking confirmed */}
                    {booked && selectedFlight && (
                        <div className="border-2 border-green-200 rounded-xl p-6 bg-green-50 text-center space-y-3">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <Check size={28} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-800">Flight Booked!</h3>
                            <p className="text-green-700">
                                {selectedFlight.airline} · {selectedFlight.from} → {selectedFlight.to}
                            </p>
                            <p className="text-sm text-green-600">
                                {selectedFlight.departTime} – {selectedFlight.arriveTime} · {selectedFlight.stopInfo}
                            </p>
                            <p className="text-sm text-green-700 font-medium">
                                Confirmation sent to {bookingForm.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Booking ref: FL-{Math.random().toString(36).toUpperCase().slice(2, 9)}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
