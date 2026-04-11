'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Plane, Hotel, Calendar, Users, Mail, Phone, Clock, CheckCircle,
    XCircle, AlertCircle, RefreshCw, Search, Download, Eye, Filter,
    ArrowLeft, TrendingUp, DollarSign, BookOpen, Luggage, CreditCard,
    BarChart3, ChevronDown, ChevronUp
} from 'lucide-react';
import { api } from '@/lib/api';

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }
function fmtDate(d: string) {
    try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return d; }
}

const STATUS_COLORS: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-amber-100 text-amber-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    TICKET_SENT: 'bg-purple-100 text-purple-700',
    FAILED: 'bg-red-100 text-red-700',
};

type BookingTab = 'flights' | 'trips' | 'events' | 'pg-dashboard';

interface FlightBooking {
    txnid: string;
    savedAt: string;
    status: string;
    flight: { airline: string; flightNum: string; from: string; to: string; dep: string; arr: string; date: string; dur: string; stops: number; price: number };
    passengers: Array<{ title: string; firstName: string; lastName: string; dob: string; gender: string; nationality: string }>;
    contact: { email: string; phone: string };
}

export default function AdminBookingsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<BookingTab>('flights');
    const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([]);
    const [tripBookings, setTripBookings] = useState<Record<string, unknown>[]>([]);
    const [eventBookings, setEventBookings] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) { router.push('/admin'); return; }
        loadAll();
    }, [router]);

    // Normalize backend response — handles [], { data: [] }, { data: { data: [] } }
    function extractList(raw: unknown): Record<string, unknown>[] {
        if (Array.isArray(raw)) return raw;
        if (raw && typeof raw === 'object') {
            const r = raw as Record<string, unknown>;
            if (Array.isArray(r.data)) return r.data as Record<string, unknown>[];
            if (r.data && typeof r.data === 'object') {
                const inner = r.data as Record<string, unknown>;
                if (Array.isArray(inner.data)) return inner.data as Record<string, unknown>[];
            }
        }
        return [];
    }

    const loadAll = async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken') || '';
        try {
            const [flightRes, tripRes, eventRes] = await Promise.allSettled([
                fetch('/api/admin/flight-bookings').then(r => r.json()),
                // Use server-side proxy — fetches ALL statuses (pending, confirmed, failed, cancelled)
                fetch('/api/admin/trip-bookings', {
                    headers: { 'x-admin-token': token },
                }).then(r => r.json()),
                api.admin.getEventBookings(),
            ]);
            if (flightRes.status === 'fulfilled') setFlightBookings(flightRes.value.data || []);
            if (tripRes.status === 'fulfilled') setTripBookings(extractList(tripRes.value));
            if (eventRes.status === 'fulfilled') setEventBookings(extractList(eventRes.value));
        } finally {
            setLoading(false);
        }
    };

    const updateFlightStatus = async (txnid: string, status: string) => {
        setUpdatingStatus(txnid);
        try {
            await fetch('/api/admin/flight-bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txnid, status }),
            });
            setFlightBookings(prev => prev.map(b => b.txnid === txnid ? { ...b, status } : b));
        } finally {
            setUpdatingStatus(null);
        }
    };

    const sendTicket = async (b: FlightBooking) => {
        await fetch('/api/flights/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'client_confirmation', booking: b, to: b.contact.email }),
        });
        await updateFlightStatus(b.txnid, 'TICKET_SENT');
    };

    // Stats
    const flightRevenue = flightBookings.reduce((s, b) => s + (b.flight?.price || 0), 0);
    const tripRevenue = tripBookings.reduce((s: number, b: Record<string, unknown>) => s + Number(b.finalAmount || b.totalAmount || 0), 0);
    const eventRevenue = eventBookings.reduce((s: number, b: Record<string, unknown>) => s + Number(b.finalAmount || b.totalAmount || 0), 0);
    const totalRevenue = flightRevenue + tripRevenue + eventRevenue;

    const filteredFlights = flightBookings.filter(b => {
        const q = search.toLowerCase();
        const matchSearch = !q || b.txnid?.toLowerCase().includes(q) ||
            b.contact?.email?.toLowerCase().includes(q) ||
            b.contact?.phone?.includes(q) ||
            b.passengers?.[0]?.firstName?.toLowerCase().includes(q) ||
            b.flight?.from?.toLowerCase().includes(q) ||
            b.flight?.to?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const filteredTrips = tripBookings.filter((b: Record<string, unknown>) => {
        const q = search.toLowerCase();
        return !q ||
            String(b.bookingReference || '').toLowerCase().includes(q) ||
            String(b.customerEmail || '').toLowerCase().includes(q) ||
            String(b.customerName || '').toLowerCase().includes(q) ||
            String(b.customerPhone || '').includes(q);
    });

    const filteredEvents = eventBookings.filter((b: Record<string, unknown>) => {
        const q = search.toLowerCase();
        return !q ||
            String(b.bookingReference || '').toLowerCase().includes(q) ||
            String(b.customerEmail || '').toLowerCase().includes(q) ||
            String(b.customerName || '').toLowerCase().includes(q);
    });

    // PG Dashboard: group trip bookings by customer, show PG collected vs sale
    interface PGRow {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        bookings: Record<string, unknown>[];
        totalSale: number;
        totalPGCollected: number;
        gap: number;
    }
    const pgRows: PGRow[] = Object.values(
        tripBookings.reduce((acc: Record<string, PGRow>, b: Record<string, unknown>) => {
            const key = String(b.customerEmail || b.customerPhone || b.customerName || 'unknown');
            if (!acc[key]) acc[key] = {
                customerName: String(b.customerName || ''),
                customerEmail: String(b.customerEmail || ''),
                customerPhone: String(b.customerPhone || ''),
                bookings: [],
                totalSale: 0,
                totalPGCollected: 0,
                gap: 0,
            };
            acc[key].bookings.push(b);
            // finalAmount = PG collected (what customer paid), totalAmount = sale amount
            const pgCollected = Number(b.finalAmount || b.totalAmount || 0);
            const saleAmount = Number(b.totalAmount || b.finalAmount || 0);
            acc[key].totalPGCollected += pgCollected;
            acc[key].totalSale += saleAmount;
            acc[key].gap = acc[key].totalSale - acc[key].totalPGCollected;
            return acc;
        }, {})
    );

    const totalPGCollected = pgRows.reduce((s, r) => s + r.totalPGCollected, 0);
    const totalSale = pgRows.reduce((s, r) => s + r.totalSale, 0);

    const tabs = [
        { id: 'flights' as BookingTab, label: 'Flight Bookings', count: flightBookings.length, icon: Plane },
        { id: 'trips' as BookingTab, label: 'Trip Bookings', count: tripBookings.length, icon: Luggage },
        { id: 'events' as BookingTab, label: 'Event Bookings', count: eventBookings.length, icon: Calendar },
        { id: 'pg-dashboard' as BookingTab, label: 'PG vs Sale', count: pgRows.length, icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                        <ArrowLeft size={16} /> Admin
                    </Link>
                    <span className="text-gray-600">/</span>
                    <span className="font-semibold">All Bookings</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={loadAll} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* Revenue Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Revenue', value: `₹${fmt(totalRevenue)}`, icon: TrendingUp, color: 'from-amber-400 to-orange-500', sub: 'All bookings' },
                        { label: 'Flight Revenue', value: `₹${fmt(flightRevenue)}`, icon: Plane, color: 'from-blue-400 to-blue-600', sub: `${flightBookings.length} bookings` },
                        { label: 'Trip Revenue', value: `₹${fmt(tripRevenue)}`, icon: Luggage, color: 'from-green-400 to-emerald-500', sub: `${tripBookings.length} bookings` },
                        { label: 'Event Revenue', value: `₹${fmt(eventRevenue)}`, icon: Calendar, color: 'from-purple-400 to-purple-600', sub: `${eventBookings.length} bookings` },
                    ].map(s => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-gray-500 font-medium">{s.label}</span>
                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                                        <Icon size={16} className="text-white" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search by name, email, phone, booking ref..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    {activeTab === 'flights' && (
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white">
                            {['ALL', 'PENDING', 'CONFIRMED', 'TICKET_SENT', 'COMPLETED', 'CANCELLED', 'FAILED'].map(s => (
                                <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s.replace('_', ' ')}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.id} onClick={() => setActiveTab(t.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                <Icon size={14} />{t.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.id ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {t.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ── FLIGHT BOOKINGS ── */}
                        {activeTab === 'flights' && (
                            <div className="space-y-3">
                                {filteredFlights.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                        <Plane size={40} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No flight bookings yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Flight bookings will appear here after customers book.</p>
                                    </div>
                                ) : filteredFlights.map(b => (
                                    <div key={b.txnid} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        {/* Row header */}
                                        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                            {/* Flight info */}
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {b.flight?.airline?.substring(0, 2).toUpperCase() || 'FL'}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-gray-900 text-sm">{b.flight?.airline}</span>
                                                        <span className="text-xs text-gray-400">{b.flight?.flightNum}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                                                            {b.status || 'PENDING'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">
                                                        <strong>{b.flight?.from}</strong> → <strong>{b.flight?.to}</strong>
                                                        <span className="text-gray-400 ml-2">{b.flight?.dep} – {b.flight?.arr}</span>
                                                        <span className="text-gray-400 ml-2">·</span>
                                                        <span className="text-gray-500 ml-2">{b.flight?.date}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Passenger + contact */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div>
                                                    <p className="font-medium text-gray-900">{b.passengers?.[0]?.title} {b.passengers?.[0]?.firstName} {b.passengers?.[0]?.lastName}</p>
                                                    <p className="text-xs text-gray-400">{b.passengers?.length} pax</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs">{b.contact?.email}</p>
                                                    <p className="text-xs text-gray-400">{b.contact?.phone}</p>
                                                </div>
                                            </div>

                                            {/* Price + actions */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">₹{fmt(b.flight?.price || 0)}</p>
                                                    <p className="text-xs text-gray-400">{fmtDate(b.savedAt)}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => setExpandedId(expandedId === b.txnid ? null : b.txnid)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="View Details">
                                                        <Eye size={15} />
                                                    </button>
                                                    <button onClick={() => sendTicket(b)}
                                                        disabled={updatingStatus === b.txnid}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                                        title="Send E-Ticket">
                                                        <Mail size={12} /> Send Ticket
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        {expandedId === b.txnid && (
                                            <div className="border-t border-gray-100 p-4 bg-gray-50">
                                                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="font-semibold text-gray-700 mb-2">Booking Reference</p>
                                                        <p className="font-mono text-xs bg-white border border-gray-200 px-3 py-2 rounded-lg">{b.txnid}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-700 mb-2">Passengers ({b.passengers?.length})</p>
                                                        {b.passengers?.map((p, i) => (
                                                            <p key={i} className="text-xs text-gray-600">{p.title} {p.firstName} {p.lastName} · {p.gender} · DOB: {p.dob}</p>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-700 mb-2">Update Status</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {['PENDING', 'CONFIRMED', 'TICKET_SENT', 'COMPLETED', 'CANCELLED'].map(s => (
                                                                <button key={s} onClick={() => updateFlightStatus(b.txnid, s)}
                                                                    className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${b.status === s ? 'bg-amber-500 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-amber-400'}`}>
                                                                    {s.replace('_', ' ')}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                    <a href={`https://wa.me/${b.contact?.phone?.replace(/\D/g, '')}?text=Hi%20${b.passengers?.[0]?.firstName}!%20Your%20flight%20${b.flight?.flightNum}%20on%20${b.flight?.date}%20is%20confirmed.%20Your%20e-ticket%20is%20attached.%20Booking%20Ref:%20${b.txnid}`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-lg">
                                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                                        WhatsApp Customer
                                                    </a>
                                                    <a href={`mailto:${b.contact?.email}?subject=Your Flight Ticket - ${b.txnid}&body=Dear ${b.passengers?.[0]?.firstName},%0A%0APlease find your flight ticket attached.%0A%0ABooking Ref: ${b.txnid}%0AFlight: ${b.flight?.airline} ${b.flight?.flightNum}%0ARoute: ${b.flight?.from} to ${b.flight?.to}%0ADate: ${b.flight?.date} | ${b.flight?.dep} - ${b.flight?.arr}%0A%0AThank you for choosing YlooTrips!`}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white text-xs font-bold rounded-lg">
                                                        <Mail size={13} /> Email Customer
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── TRIP BOOKINGS ── */}
                        {activeTab === 'trips' && (
                            <div className="space-y-3">
                                {filteredTrips.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                        <Luggage size={40} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No trip bookings found</p>
                                    </div>
                                ) : filteredTrips.map((b: Record<string, unknown>, idx: number) => {
                                    const paymentStatus = String(b.paymentStatus || b.payment_status || b.status || 'PENDING');
                                    const bookingStatus = String(b.status || 'PENDING');
                                    const isPaid = ['CONFIRMED', 'COMPLETED', 'PAID', 'SUCCESS', 'CAPTURED'].includes(paymentStatus.toUpperCase()) ||
                                        ['CONFIRMED', 'COMPLETED', 'PAID', 'SUCCESS'].includes(bookingStatus.toUpperCase());
                                    const isPending = ['PENDING', 'INITIATED', 'PROCESSING'].includes(paymentStatus.toUpperCase()) ||
                                        ['PENDING', 'INITIATED'].includes(bookingStatus.toUpperCase());
                                    const isFailed = ['FAILED', 'CANCELLED', 'REFUNDED'].includes(paymentStatus.toUpperCase()) ||
                                        ['FAILED', 'CANCELLED'].includes(bookingStatus.toUpperCase());

                                    return (
                                        <div key={String(b.id || idx)}
                                            className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${isPaid ? 'border-l-green-500 border border-gray-200' : isPending ? 'border-l-amber-400 border border-amber-100' : 'border-l-red-400 border border-red-100'}`}>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-gray-900 text-sm">{String(b.customerName || '—')}</span>
                                                        {/* Booking status */}
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[bookingStatus] || 'bg-gray-100 text-gray-600'}`}>
                                                            {bookingStatus}
                                                        </span>
                                                        {/* Payment status pill */}
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isPaid ? 'bg-green-50 text-green-700 border-green-200' : isPending ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                            💳 {isPaid ? 'Payment Received' : isPending ? 'Payment Pending' : 'Payment Failed'}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-1 font-medium">
                                                        {String((b.trip as Record<string, unknown>)?.title || b.tripTitle || b.packageName || 'Trip')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Travel: {String(b.travelDate || b.travel_date || '—')} · {String(b.numberOfGuests || b.guests || 1)} guests
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {String(b.customerEmail || '')} · {String(b.customerPhone || '')}
                                                    </p>
                                                    {/* Show all relevant IDs */}
                                                    <div className="flex gap-3 mt-1 flex-wrap">
                                                        {!!b.bookingReference && <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Ref: {String(b.bookingReference)}</span>}
                                                        {!!b.txnid && <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">TxnID: {String(b.txnid)}</span>}
                                                        {!!b.easepayid && <span className="text-[10px] font-mono bg-green-100 px-1.5 py-0.5 rounded text-green-700">PG: {String(b.easepayid)}</span>}
                                                        {!!b.id && <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">ID: {String(b.id)}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900 text-lg">₹{fmt(Number(b.finalAmount || b.totalAmount || b.amount || 0))}</p>
                                                        {!!(b.totalAmount && b.finalAmount && Number(b.totalAmount) !== Number(b.finalAmount)) && (
                                                            <p className="text-xs text-gray-400 line-through">₹{fmt(Number(b.totalAmount))}</p>
                                                        )}
                                                        <p className="text-[10px] text-gray-400">{b.createdAt ? fmtDate(String(b.createdAt)) : ''}</p>
                                                    </div>
                                                    <a href={`mailto:${String(b.customerEmail || '')}?subject=Your Trip Booking - ${String(b.bookingReference || '')}`}
                                                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Email customer">
                                                        <Mail size={16} />
                                                    </a>
                                                    <a href={`https://wa.me/${String(b.customerPhone || '').replace(/\D/g, '')}?text=Hi%20${String(b.customerName || '')}!%20Regarding%20your%20trip%20booking%20${String(b.bookingReference || '')}.`}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className="p-2 rounded-lg hover:bg-green-50 text-green-500 transition-colors" title="WhatsApp">
                                                        <Phone size={16} />
                                                    </a>
                                                </div>
                                            </div>
                                            {b.specialRequests ? (
                                                <p className="mt-2 text-xs text-gray-500 bg-amber-50 rounded-lg px-3 py-2">
                                                    📝 {String(b.specialRequests)}
                                                </p>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── EVENT BOOKINGS ── */}
                        {activeTab === 'events' && (
                            <div className="space-y-3">
                                {filteredEvents.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                        <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No event bookings found</p>
                                    </div>
                                ) : filteredEvents.map((b: Record<string, unknown>, idx: number) => (
                                    <div key={String(b.id || idx)} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-gray-900 text-sm">{String(b.customerName || '')}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[String(b.status || '')] || 'bg-gray-100 text-gray-600'}`}>
                                                        {String(b.status || 'PENDING')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-0.5">
                                                    {String((b.event as Record<string, unknown>)?.title || 'Event')} · {String(b.eventDate || '')}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {String(b.customerEmail || '')} · {String(b.customerPhone || '')} · {String(b.numberOfTickets || 1)} tickets
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">₹{fmt(Number(b.finalAmount || b.totalAmount || 0))}</p>
                                                    <p className="text-xs text-gray-400 font-mono">{String(b.bookingReference || '')}</p>
                                                </div>
                                                <a href={`mailto:${String(b.customerEmail || '')}?subject=Your Event Booking Confirmed - ${String(b.bookingReference || '')}`}
                                                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                                                    <Mail size={16} />
                                                </a>
                                                <a href={`https://wa.me/${String(b.customerPhone || '').replace(/\D/g, '')}?text=Hi%20${String(b.customerName || '')}!%20Your%20event%20booking%20${String(b.bookingReference || '')}%20is%20confirmed.`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-green-50 text-green-500 transition-colors">
                                                    <Phone size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ── PG COLLECTED vs SALE DASHBOARD ── */}
                        {activeTab === 'pg-dashboard' && (
                            <div className="space-y-4">
                                {/* Summary cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Total Sale Amount</p>
                                        <p className="text-2xl font-bold text-gray-900">₹{fmt(totalSale)}</p>
                                        <p className="text-xs text-gray-400 mt-1">Booking value across all trips</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-green-200 p-5 shadow-sm">
                                        <p className="text-xs text-gray-500 font-medium mb-1">PG Collected (Easebuzz)</p>
                                        <p className="text-2xl font-bold text-green-700">₹{fmt(totalPGCollected)}</p>
                                        <p className="text-xs text-gray-400 mt-1">Amount received via payment gateway</p>
                                    </div>
                                    <div className={`bg-white rounded-xl border p-5 shadow-sm ${totalSale - totalPGCollected > 0 ? 'border-red-200' : 'border-blue-200'}`}>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Gap (Sale − PG)</p>
                                        <p className={`text-2xl font-bold ${totalSale - totalPGCollected > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                            ₹{fmt(Math.abs(totalSale - totalPGCollected))}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{totalSale - totalPGCollected > 0 ? 'Pending collection' : 'Overpaid / adjustment needed'}</p>
                                    </div>
                                </div>

                                {/* Per-user table */}
                                {pgRows.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                        <BarChart3 size={40} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No trip bookings to analyse</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                                            <CreditCard size={16} className="text-amber-500" />
                                            <span className="font-semibold text-gray-800 text-sm">User-wise PG Collected vs Sale</span>
                                            <span className="ml-auto text-xs text-gray-400">{pgRows.length} customers</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b border-gray-100">
                                                    <tr>
                                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings</th>
                                                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale Amount</th>
                                                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">PG Collected</th>
                                                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gap</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {pgRows.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-5 py-4">
                                                                <p className="font-semibold text-gray-900">{row.customerName || '—'}</p>
                                                                <p className="text-xs text-gray-400">{row.customerEmail}</p>
                                                                <p className="text-xs text-gray-400">{row.customerPhone}</p>
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                <div className="space-y-1">
                                                                    {row.bookings.map((b, bi) => (
                                                                        <div key={bi} className="text-xs">
                                                                            <span className="font-mono text-gray-500">{String(b.bookingReference || `#${bi+1}`)}</span>
                                                                            <span className="ml-2 text-gray-400">{String((b.trip as Record<string, unknown>)?.title || 'Trip')}</span>
                                                                            <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[String(b.status || '')] || 'bg-gray-100 text-gray-600'}`}>
                                                                                {String(b.status || 'PENDING')}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-right font-semibold text-gray-900">₹{fmt(row.totalSale)}</td>
                                                            <td className="px-4 py-4 text-right font-semibold text-green-700">₹{fmt(row.totalPGCollected)}</td>
                                                            <td className="px-5 py-4 text-right">
                                                                <span className={`font-bold ${row.gap > 0 ? 'text-red-600' : row.gap < 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                                    {row.gap === 0 ? '✓ Settled' : `${row.gap > 0 ? '-' : '+'}₹${fmt(Math.abs(row.gap))}`}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-amber-50 border-t-2 border-amber-200">
                                                    <tr>
                                                        <td className="px-5 py-3 font-bold text-gray-800 text-sm" colSpan={2}>Totals</td>
                                                        <td className="px-4 py-3 text-right font-bold text-gray-900">₹{fmt(totalSale)}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-green-700">₹{fmt(totalPGCollected)}</td>
                                                        <td className={`px-5 py-3 text-right font-bold ${totalSale - totalPGCollected > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {totalSale === totalPGCollected ? '✓ Settled' : `${totalSale - totalPGCollected > 0 ? '-' : '+'}₹${fmt(Math.abs(totalSale - totalPGCollected))}`}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
