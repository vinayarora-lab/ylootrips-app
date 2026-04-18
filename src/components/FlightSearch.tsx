'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Plane, ArrowUpDown, Search, Clock,
  MessageCircle, AlertCircle, X, ChevronDown, Zap,
  SlidersHorizontal, RotateCcw, Check, CalendarDays, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ── City data ──────────────────────────────────────────────────────────────────
const CITIES = [
  { name: 'New Delhi',             code: 'DEL', intl: false },
  { name: 'Mumbai',                code: 'BOM', intl: false },
  { name: 'Bangalore',             code: 'BLR', intl: false },
  { name: 'Chennai',               code: 'MAA', intl: false },
  { name: 'Hyderabad',             code: 'HYD', intl: false },
  { name: 'Kolkata',               code: 'CCU', intl: false },
  { name: 'Jaipur',                code: 'JAI', intl: false },
  { name: 'Goa (Dabolim)',         code: 'GOI', intl: false },
  { name: 'Kochi',                 code: 'COK', intl: false },
  { name: 'Pune',                  code: 'PNQ', intl: false },
  { name: 'Ahmedabad',             code: 'AMD', intl: false },
  { name: 'Varanasi',              code: 'VNS', intl: false },
  { name: 'Amritsar',              code: 'ATQ', intl: false },
  { name: 'Leh',                   code: 'IXL', intl: false },
  { name: 'Srinagar',              code: 'SXR', intl: false },
  { name: 'Port Blair (Andaman)',  code: 'IXZ', intl: false },
  { name: 'Udaipur',               code: 'UDR', intl: false },
  { name: 'Jodhpur',               code: 'JDH', intl: false },
  { name: 'Bagdogra (Darjeeling)', code: 'IXB', intl: false },
  { name: 'Chandigarh',            code: 'IXC', intl: false },
  { name: 'Dehradun',              code: 'DED', intl: false },
  { name: 'Indore',                code: 'IDR', intl: false },
  { name: 'Nagpur',                code: 'NAG', intl: false },
  { name: 'Guwahati',              code: 'GAU', intl: false },
  { name: 'Thiruvananthapuram',    code: 'TRV', intl: false },
  { name: 'Coimbatore',            code: 'CJB', intl: false },
  { name: 'Dubai (UAE)',           code: 'DXB', intl: true },
  { name: 'Abu Dhabi (UAE)',       code: 'AUH', intl: true },
  { name: 'Bangkok, Thailand',     code: 'BKK', intl: true },
  { name: 'Phuket, Thailand',      code: 'HKT', intl: true },
  { name: 'Bali (Denpasar)',       code: 'DPS', intl: true },
  { name: 'Singapore',             code: 'SIN', intl: true },
  { name: 'Kuala Lumpur',          code: 'KUL', intl: true },
  { name: 'Male (Maldives)',       code: 'MLE', intl: true },
  { name: 'Colombo (Sri Lanka)',   code: 'CMB', intl: true },
  { name: 'Kathmandu (Nepal)',     code: 'KTM', intl: true },
  { name: 'Istanbul (Turkey)',     code: 'IST', intl: true },
  { name: 'London (Heathrow)',     code: 'LHR', intl: true },
  { name: 'Paris (CDG)',           code: 'CDG', intl: true },
  { name: 'Frankfurt (Germany)',   code: 'FRA', intl: true },
  { name: 'Amsterdam',             code: 'AMS', intl: true },
  { name: 'Tokyo (Japan)',         code: 'NRT', intl: true },
  { name: 'Seoul (South Korea)',   code: 'ICN', intl: true },
  { name: 'Hong Kong',             code: 'HKG', intl: true },
  { name: 'Sydney (Australia)',    code: 'SYD', intl: true },
  { name: 'New York (JFK)',        code: 'JFK', intl: true },
  { name: 'San Francisco',         code: 'SFO', intl: true },
  { name: 'Toronto (Canada)',      code: 'YYZ', intl: true },
  { name: 'Doha (Qatar)',          code: 'DOH', intl: true },
  { name: 'Riyadh (Saudi Arabia)', code: 'RUH', intl: true },
  { name: 'Nairobi (Kenya)',       code: 'NBO', intl: true },
];

interface FlightResult {
  id: string; isDemo: boolean; airline: string; airlineCode: string;
  airlineColor: string; flightNumber: string;
  departure: { airport: string; terminal: string; time: string };
  arrival:   { airport: string; terminal: string; time: string };
  durationFormatted: string; durationMinutes: number;
  stops: number; stopInfo: string;
  pricePerPerson: number; totalPrice: number; currency: string;
  seatsLeft: number | null;
}

interface RecentSearch { from: string; to: string; date: string; tripType: string; }

const todayStr = new Date().toISOString().split('T')[0];
function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }
function airlineInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const DOMESTIC = CITIES.filter(c => !c.intl);
const INTERNATIONAL = CITIES.filter(c => c.intl);

function formatDate(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }), year: d.getFullYear(),
  };
}

function getPriceTrend(price: number, prices: number[]) {
  if (prices.length < 3) return null;
  const s = [...prices].sort((a, b) => a - b);
  const low  = s[Math.floor(s.length * 0.33)];
  const high = s[Math.floor(s.length * 0.67)];
  if (price <= low)  return { label: 'Cheap',  cls: 'bg-green-50 text-green-700 border-green-200' };
  if (price >= high) return { label: 'Pricey', cls: 'bg-red-50 text-red-500 border-red-200' };
  return { label: 'Fair', cls: 'bg-amber-50 text-amber-600 border-amber-200' };
}

type CabinClass = 'Economy' | 'Premium Economy' | 'Business' | 'First Class';
type StopFilter = 'all' | 'direct' | '1stop';
type TimeFilter = 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
type SortBy = 'price' | 'duration' | 'departure' | 'arrival';

const CABIN_CLASSES: CabinClass[] = ['Economy', 'Premium Economy', 'Business', 'First Class'];
const SPECIAL_FARES = [
  { id: 'regular', label: 'Regular' },
  { id: 'student', label: 'Student' },
  { id: 'senior', label: 'Senior Citizen' },
  { id: 'armed', label: 'Armed Forces' },
  { id: 'doctor', label: 'Doctors' },
];
const TIME_SLOTS = [
  { id: 'morning',   label: 'Morning',   sub: '6am – 12pm', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', sub: '12pm – 6pm',  icon: '☀️' },
  { id: 'evening',   label: 'Evening',   sub: '6pm – 9pm',   icon: '🌆' },
  { id: 'night',     label: 'Night',     sub: '9pm – 6am',   icon: '🌙' },
];
const RECENT_KEY = 'yloo_flight_searches';

// ── City picker ────────────────────────────────────────────────────────────────
function CityPickerModal({ value, onChange, onClose, label }: {
  value: string; onChange: (code: string) => void; onClose: () => void; label: string;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  const filter = (list: typeof CITIES) =>
    query.trim()
      ? list.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase()))
      : list;

  const domestic = filter(DOMESTIC);
  const international = filter(INTERNATIONAL);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col" style={{ maxHeight: '88dvh' }}>
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="px-4 pb-3 border-b border-gray-100 shrink-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B3A6B] mb-2">{label}</p>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="City or airport code…"
              className="flex-1 text-sm text-gray-900 outline-none bg-transparent placeholder:text-gray-400" />
            {query && <button onClick={() => setQuery('')}><X size={14} className="text-gray-400" /></button>}
          </div>
        </div>
        <div className="overflow-y-auto flex-1 pb-6">
          {domestic.length > 0 && <>
            <div className="sticky top-0 bg-amber-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-700">🇮🇳 India</div>
            {domestic.map(c => (
              <button key={c.code} type="button" onClick={() => { onChange(c.code); onClose(); }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${value === c.code ? 'bg-blue-50' : ''}`}>
                <div>
                  <p className={`text-sm font-semibold ${value === c.code ? 'text-[#1B3A6B]' : 'text-gray-800'}`}>{c.name}</p>
                  <p className="text-[10px] text-gray-400">India</p>
                </div>
                <span className={`text-xs font-mono font-bold ${value === c.code ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>{c.code}</span>
              </button>
            ))}
          </>}
          {international.length > 0 && <>
            <div className="sticky top-0 bg-blue-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-blue-700">✈️ International</div>
            {international.map(c => (
              <button key={c.code} type="button" onClick={() => { onChange(c.code); onClose(); }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${value === c.code ? 'bg-blue-50' : ''}`}>
                <div>
                  <p className={`text-sm font-semibold ${value === c.code ? 'text-[#1B3A6B]' : 'text-gray-800'}`}>{c.name}</p>
                  <p className="text-[10px] text-gray-400">International</p>
                </div>
                <span className={`text-xs font-mono font-bold ${value === c.code ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>{c.code}</span>
              </button>
            ))}
          </>}
          {domestic.length === 0 && international.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-10">No cities found</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pax + Class modal ──────────────────────────────────────────────────────────
function PaxClassModal({ passengers, setPass, cabinClass, setCabinClass, onClose }: {
  passengers: number; setPass: (n: number) => void;
  cabinClass: CabinClass; setCabinClass: (c: CabinClass) => void; onClose: () => void;
}) {
  const [lp, setLp] = useState(passengers);
  const [lc, setLc] = useState<CabinClass>(cabinClass);
  const apply = () => { setPass(lp); setCabinClass(lc); onClose(); };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl shadow-2xl px-5 pt-4 pb-6">
        <div className="flex justify-center mb-4"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
        <h3 className="text-base font-extrabold text-gray-900 mb-5">Travellers &amp; Class</h3>
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
          <div><p className="text-sm font-bold text-gray-800">Adults</p><p className="text-xs text-gray-400">12+ years</p></div>
          <div className="flex items-center gap-5">
            <button onClick={() => setLp(Math.max(1, lp - 1))} disabled={lp <= 1}
              className="w-9 h-9 rounded-full border-2 border-[#1B3A6B] text-[#1B3A6B] font-extrabold flex items-center justify-center text-lg disabled:opacity-30">−</button>
            <span className="text-xl font-extrabold text-gray-900 w-5 text-center">{lp}</span>
            <button onClick={() => setLp(Math.min(9, lp + 1))} disabled={lp >= 9}
              className="w-9 h-9 rounded-full bg-[#1B3A6B] text-white font-extrabold flex items-center justify-center text-lg disabled:opacity-30">+</button>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-800 mb-3">Cabin Class</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {CABIN_CLASSES.map(cls => (
            <button key={cls} onClick={() => setLc(cls)}
              className={`px-3 py-3 rounded-xl text-sm font-bold border-2 text-left transition-all ${
                lc === cls ? 'border-[#1B3A6B] bg-[#1B3A6B]/5 text-[#1B3A6B]' : 'border-gray-200 text-gray-500'
              }`}>{cls}</button>
          ))}
        </div>
        <button onClick={apply}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl text-sm shadow-lg">
          Apply
        </button>
      </div>
    </div>
  );
}

// ── Advanced filter sheet ──────────────────────────────────────────────────────
function FilterSheet({ stopFilter, setStop, timeFilter, setTime, airlineFilter, setAirlines,
  airlines, onClose, onReset }: {
  stopFilter: StopFilter; setStop: (v: StopFilter) => void;
  timeFilter: TimeFilter; setTime: (v: TimeFilter) => void;
  airlineFilter: string[]; setAirlines: (v: string[]) => void;
  airlines: string[]; onClose: () => void; onReset: () => void;
}) {
  const toggleAirline = (a: string) =>
    setAirlines(airlineFilter.includes(a) ? airlineFilter.filter(x => x !== a) : [...airlineFilter, a]);

  const activeCount = (stopFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0) + airlineFilter.length;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col" style={{ maxHeight: '88dvh' }}>
        <div className="flex justify-center pt-3 pb-2 shrink-0"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 shrink-0">
          <h3 className="text-base font-extrabold text-gray-900">Filters</h3>
          <button onClick={onReset} className="flex items-center gap-1 text-xs font-bold text-[#1B3A6B]">
            <RotateCcw size={13} /> Reset all
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6 pb-6">
          {/* Stops */}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Stops</p>
            <div className="grid grid-cols-3 gap-2">
              {(['all', 'direct', '1stop'] as StopFilter[]).map(s => (
                <button key={s} onClick={() => setStop(s)}
                  className={`py-3 rounded-xl text-sm font-bold border-2 flex flex-col items-center gap-1 transition-all ${
                    stopFilter === s ? 'border-[#1B3A6B] bg-[#1B3A6B]/5 text-[#1B3A6B]' : 'border-gray-200 text-gray-500'
                  }`}>
                  <span className="text-lg">{s === 'all' ? '✈️' : s === 'direct' ? '🎯' : '⏱️'}</span>
                  <span>{s === 'all' ? 'Any' : s === 'direct' ? 'Direct' : '1 Stop'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Departure time */}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Departure Time</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: 'all' as TimeFilter, icon: '🕐', label: 'Any time', sub: '' }, ...TIME_SLOTS.map(t => ({ ...t, id: t.id as TimeFilter }))].map(t => (
                <button key={t.id} onClick={() => setTime(t.id)}
                  className={`py-3 px-3 rounded-xl text-sm font-bold border-2 flex items-center gap-2 transition-all ${
                    timeFilter === t.id ? 'border-[#1B3A6B] bg-[#1B3A6B]/5 text-[#1B3A6B]' : 'border-gray-200 text-gray-500'
                  }`}>
                  <span className="text-base">{t.icon}</span>
                  <div className="text-left">
                    <p className="text-xs font-extrabold leading-none">{t.label}</p>
                    {t.sub && <p className="text-[10px] text-gray-400 mt-0.5">{t.sub}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Airlines */}
          {airlines.length > 0 && (
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-3">Airlines</p>
              <div className="space-y-2">
                {airlines.map(a => (
                  <button key={a} onClick={() => toggleAirline(a)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                      airlineFilter.includes(a) ? 'border-[#1B3A6B] bg-[#1B3A6B]/5' : 'border-gray-200'
                    }`}>
                    <span className={`text-sm font-bold ${airlineFilter.includes(a) ? 'text-[#1B3A6B]' : 'text-gray-700'}`}>{a}</span>
                    {airlineFilter.includes(a) && <Check size={16} className="text-[#1B3A6B]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
          <button onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl text-sm shadow-lg">
            {activeCount > 0 ? `Apply ${activeCount} Filter${activeCount > 1 ? 's' : ''}` : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Date Picker Modal ──────────────────────────────────────────────────────────
function DatePickerModal({ value, minDate, onChange, onClose, label }: {
  value: string; minDate: string; onChange: (d: string) => void;
  onClose: () => void; label: string;
}) {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Build list of dates from minDate + 365 days
  const dates = useMemo(() => {
    const list: string[] = [];
    const start = new Date(minDate + 'T00:00:00');
    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      list.push(d.toISOString().split('T')[0]);
    }
    return list;
  }, [minDate]);

  // Group by "Month Year"
  const grouped = useMemo(() => {
    const map: Record<string, string[]> = {};
    dates.forEach(d => {
      const dt = new Date(d + 'T00:00:00');
      const key = `${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
      if (!map[key]) map[key] = [];
      map[key].push(d);
    });
    return Object.entries(map);
  }, [dates]); // eslint-disable-line react-hooks/exhaustive-deps

  const [selected, setSelected] = useState(value);

  const apply = () => { if (selected) { onChange(selected); onClose(); } };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col" style={{ maxHeight: '80dvh' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[#1B3A6B]" />
            <h3 className="text-base font-extrabold text-gray-900">{label}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable calendar */}
        <div className="overflow-y-auto flex-1 px-4 py-2">
          {grouped.map(([month, days]) => (
            <div key={month} className="mb-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#1B3A6B] mb-2 sticky top-0 bg-white py-1">{month}</p>
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[9px] font-bold text-gray-400 pb-1">{d}</div>
                ))}
                {/* Empty cells for first day offset */}
                {(() => {
                  const firstDay = new Date(days[0] + 'T00:00:00').getDay();
                  return Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />);
                })()}
                {/* Date cells */}
                {days.map(d => {
                  const dt    = new Date(d + 'T00:00:00');
                  const isSelected = d === selected;
                  const isToday    = d === todayStr;
                  return (
                    <button key={d} onClick={() => setSelected(d)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all active:scale-90 ${
                        isSelected
                          ? 'bg-[#1B3A6B] text-white'
                          : isToday
                            ? 'border-2 border-[#1B3A6B] text-[#1B3A6B]'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                      <span className="text-sm font-extrabold leading-none">{dt.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Apply */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0">
          {selected && (
            <p className="text-center text-xs text-gray-500 mb-2 font-medium">
              Selected: {new Date(selected + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          <button onClick={apply} disabled={!selected}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl text-sm shadow-lg disabled:opacity-40">
            Confirm Date
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FlightSearch() {
  // Search state
  const [tripType, setTripType] = useState<'oneway' | 'return'>('return');
  const [from, setFrom]         = useState('DEL');
  const [to, setTo]             = useState('GOI');
  const [date, setDate]         = useState('');
  const [returnDate, setReturn] = useState('');
  const [passengers, setPass]   = useState(2);
  const [cabinClass, setCabin]  = useState<CabinClass>('Economy');
  const [specialFare, setFare]  = useState('regular');
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState<FlightResult[] | null>(null);
  const [isDemo, setIsDemo]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Sort + filter state
  const [sortBy, setSortBy]             = useState<SortBy>('price');
  const [stopFilter, setStop]           = useState<StopFilter>('all');
  const [timeFilter, setTime]           = useState<TimeFilter>('all');
  const [airlineFilter, setAirlines]    = useState<string[]>([]);
  const [showFilterSheet, setFilterSheet] = useState(false);

  // Modal state
  const [fromOpen, setFromOpen]       = useState(false);
  const [toOpen, setToOpen]           = useState(false);
  const [paxOpen, setPaxOpen]         = useState(false);
  const [depDateOpen, setDepDateOpen] = useState(false);
  const [retDateOpen, setRetDateOpen] = useState(false);

  // Recent searches
  const [recentSearches, setRecent] = useState<RecentSearch[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const saveSearch = (f: string, t: string, d: string, tt: string) => {
    try {
      const entry: RecentSearch = { from: f, to: t, date: d, tripType: tt };
      const updated = [entry, ...recentSearches.filter(r => !(r.from === f && r.to === t))].slice(0, 3);
      setRecent(updated);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const swap = () => { setFrom(to); setTo(from); setResults(null); };
  const cityObj  = (code: string) => CITIES.find(c => c.code === code);
  const cityName = (code: string) => {
    const c = cityObj(code);
    return c ? c.name.replace(/\s*\(.*?\)/, '').trim() : code;
  };

  const depDate = formatDate(date);
  const retDate = formatDate(returnDate);

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true); setError(null); setResults(null);
    setStop('all'); setTime('all'); setAirlines([]);
    try {
      const params = new URLSearchParams({ origin: from, destination: to, date, adults: String(passengers) });
      const res  = await fetch(`/api/flights/search?${params}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResults(json.data ?? []);
      setIsDemo(json.isDemo ?? false);
      saveSearch(from, to, date, tripType);
    } catch {
      setError('Could not load flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sort results
  const sorted = useMemo(() => {
    if (!results) return null;
    return [...results]
      .filter(f => f.totalPrice > 0 && f.pricePerPerson > 0)
      .sort((a, b) => {
        if (sortBy === 'price')     return a.totalPrice - b.totalPrice;
        if (sortBy === 'duration')  return a.durationMinutes - b.durationMinutes;
        if (sortBy === 'departure') return a.departure.time.localeCompare(b.departure.time);
        if (sortBy === 'arrival')   return a.arrival.time.localeCompare(b.arrival.time);
        return 0;
      });
  }, [results, sortBy]);

  // Apply client-side filters
  const filtered = useMemo(() => {
    if (!sorted) return null;
    return sorted.filter(f => {
      if (stopFilter === 'direct' && f.stops !== 0) return false;
      if (stopFilter === '1stop'  && f.stops !== 1) return false;
      if (timeFilter !== 'all') {
        const h = parseInt(f.departure.time.split(':')[0]);
        if (timeFilter === 'morning'   && (h < 6 || h >= 12)) return false;
        if (timeFilter === 'afternoon' && (h < 12 || h >= 18)) return false;
        if (timeFilter === 'evening'   && (h < 18 || h >= 21)) return false;
        if (timeFilter === 'night'     && (h >= 6 && h < 21))  return false;
      }
      if (airlineFilter.length > 0 && !airlineFilter.includes(f.airline)) return false;
      return true;
    });
  }, [sorted, stopFilter, timeFilter, airlineFilter]);

  // Derived helpers
  const allPrices    = sorted?.map(f => f.totalPrice) ?? [];
  const allAirlines  = useMemo(() => [...new Set(sorted?.map(f => f.airline) ?? [])], [sorted]);
  const activeFilters = (stopFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0) + airlineFilter.length;

  const resetFilters = () => { setStop('all'); setTime('all'); setAirlines([]); };

  const waText = (f: FlightResult) =>
    encodeURIComponent(
      `Hi, I'd like to book a flight:\nRoute: ${f.departure.airport} → ${f.arrival.airport}\nDate: ${date}\nFlight: ${f.airline} ${f.flightNumber}\nDep: ${f.departure.time}  Arr: ${f.arrival.time}\nPassengers: ${passengers}\nPrice: ₹${fmt(f.totalPrice)} total`
    );

  const SORT_OPTS: { id: SortBy; label: string }[] = [
    { id: 'price',     label: 'Cheapest' },
    { id: 'duration',  label: 'Fastest' },
    { id: 'departure', label: 'Earliest Dep' },
    { id: 'arrival',   label: 'Earliest Arr' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Header + Search card inside gradient ─────────────────── */}
      <div className="bg-gradient-to-b from-[#1B3A6B] to-[#2D60AA] px-4 pt-4 pb-5">
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">YlooTrips</p>
        <h1 className="font-playfair text-xl text-white font-bold mb-3">Search Flights</h1>

        {/* Trip type tabs */}
        <div className="flex gap-1 rounded-xl p-1 mb-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
          {(['oneway', 'return'] as const).map(t => (
            <button key={t} onClick={() => { setTripType(t); setResults(null); }}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-lg transition-all ${
                tripType === t
                  ? 'bg-white text-[#1B3A6B] shadow-sm'
                  : 'text-white border border-white/20 bg-white/10'
              }`}>
              {t === 'oneway' ? 'One Way' : 'Round Trip'}
            </button>
          ))}
        </div>

        {/* ── Search card ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-2xl">

          {/* FROM + Swap + TO — wrapped in relative container so swap stays inside card */}
          <div className="relative">
            {/* FROM */}
            <button onClick={() => setFromOpen(true)}
              className="w-full px-4 pt-4 pb-3 text-left border-b border-dashed border-gray-200 active:bg-gray-50 transition-colors rounded-t-2xl">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">From</p>
              <p className="text-[1.6rem] font-extrabold text-gray-900 leading-tight truncate">{cityName(from)}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-extrabold text-[#1B3A6B] bg-[#1B3A6B]/10 px-2 py-0.5 rounded-md">{from}</span>
                <span className="text-[10px] text-gray-400">{cityObj(from)?.intl ? 'International' : 'India'}</span>
              </div>
            </button>

            {/* TO */}
            <button onClick={() => setToOpen(true)}
              className="w-full px-4 pt-3 pb-4 text-left border-b border-gray-100 active:bg-gray-50 transition-colors pr-16">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">To</p>
              <p className="text-[1.6rem] font-extrabold text-gray-900 leading-tight truncate">{cityName(to)}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-extrabold text-[#1B3A6B] bg-[#1B3A6B]/10 px-2 py-0.5 rounded-md">{to}</span>
                <span className="text-[10px] text-gray-400">{cityObj(to)?.intl ? 'International' : 'India'}</span>
              </div>
            </button>

            {/* Swap — centered at FROM/TO boundary, always inside card bounds */}
            <button onClick={swap}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-[#1B3A6B] rounded-full shadow-lg border-2 border-white flex items-center justify-center active:scale-90 transition-transform">
              <ArrowUpDown className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Dates */}
          <div className={`grid ${tripType === 'return' ? 'grid-cols-2 divide-x' : 'grid-cols-1'} divide-gray-100 border-b border-gray-100`}>
            {/* Departure */}
            <button onClick={() => setDepDateOpen(true)}
              className="px-4 py-3 text-left active:bg-gray-50 transition-colors">
              <div className="flex items-center gap-1.5 mb-0.5">
                <CalendarDays size={11} className="text-gray-400" />
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Departure</p>
              </div>
              {depDate ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-gray-900">{depDate.day}</span>
                    <span className="text-sm font-bold text-gray-600">{depDate.month} &apos;{String(depDate.year).slice(2)}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{depDate.weekday}</p>
                </>
              ) : (
                <p className="text-sm font-semibold text-[#1B3A6B] mt-1">Tap to select →</p>
              )}
            </button>

            {/* Return */}
            {tripType === 'return' && (
              <button onClick={() => setRetDateOpen(true)}
                className="px-4 py-3 text-left active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <CalendarDays size={11} className="text-gray-400" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Return</p>
                </div>
                {retDate ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-gray-900">{retDate.day}</span>
                      <span className="text-sm font-bold text-gray-600">{retDate.month} &apos;{String(retDate.year).slice(2)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{retDate.weekday}</p>
                  </>
                ) : (
                  <p className="text-sm font-semibold text-[#1B3A6B] mt-1">Tap to select →</p>
                )}
              </button>
            )}
          </div>

          {/* Pax + Class */}
          <button onClick={() => setPaxOpen(true)}
            className="w-full px-4 py-3 text-left border-b border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Travellers &amp; Class</p>
              <p className="text-sm font-extrabold text-gray-900">{passengers} Traveller{passengers > 1 ? 's' : ''}, {cabinClass}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Special Fares */}
          <div className="py-3 border-b border-gray-100">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2.5 px-4">Special Fares</p>
            <div className="flex gap-2 overflow-x-auto px-4" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '2px' }}>
              {SPECIAL_FARES.map(sf => (
                <button key={sf.id} onClick={() => setFare(sf.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-extrabold border-2 transition-all ${
                    specialFare === sf.id ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-gray-600 border-gray-300'
                  }`}>{sf.label}</button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="p-4 rounded-b-2xl overflow-hidden">
            <button onClick={handleSearch} disabled={!date || loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold py-4 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-amber-200/60 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Searching Flights…</>
                : <><Search className="w-4 h-4" />Search Flights</>}
            </button>
          </div>
        </div>
      </div>{/* ── end gradient header ── */}

      {/* ── Below-fold: recent searches, results, loading ── */}
      <div className="px-4 pb-6">

        {/* ── Recent searches ───────────────────────────────────────── */}
        {!results && !loading && recentSearches.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2.5">Recent Searches</p>
            <div className="space-y-2">
              {recentSearches.map((r, i) => (
                <button key={i}
                  onClick={() => { setFrom(r.from); setTo(r.to); setDate(r.date); }}
                  className="w-full bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
                  <div className="w-8 h-8 bg-[#1B3A6B]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Plane className="w-4 h-4 text-[#1B3A6B]" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-extrabold text-gray-900">{cityName(r.from)} → {cityName(r.to)}</p>
                    <p className="text-[10px] text-gray-400">{r.date} · {r.tripType === 'return' ? 'Round Trip' : 'One Way'}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#1B3A6B] bg-[#1B3A6B]/10 px-2 py-0.5 rounded-md">{r.from}→{r.to}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {/* Demo notice */}
        {filtered && isDemo && (
          <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 text-xs rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Sample prices shown — add API keys for live fares
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────── */}
        {filtered && (
          <div className="mt-4 space-y-3">

            {/* Results count + filter button */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-gray-700">
                {filtered.length} flight{filtered.length !== 1 ? 's' : ''} found
                {activeFilters > 0 && <span className="text-[#1B3A6B] ml-1">({activeFilters} filter{activeFilters > 1 ? 's' : ''})</span>}
              </p>
              <button onClick={() => setFilterSheet(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border-2 transition-all ${
                  activeFilters > 0 ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-gray-600 border-gray-200'
                }`}>
                <SlidersHorizontal size={13} />
                Filters
                {activeFilters > 0 && <span className="bg-white text-[#1B3A6B] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-extrabold">{activeFilters}</span>}
              </button>
            </div>

            {/* Sort row */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
              {SORT_OPTS.map(s => (
                <button key={s.id} onClick={() => setSortBy(s.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition-all ${
                    sortBy === s.id ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]' : 'bg-white text-gray-500 border-gray-200'
                  }`}>{s.label}</button>
              ))}
            </div>

            {/* Applied filter chips */}
            {activeFilters > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {stopFilter !== 'all' && (
                  <button onClick={() => setStop('all')}
                    className="flex items-center gap-1 bg-[#1B3A6B]/10 text-[#1B3A6B] px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {stopFilter === 'direct' ? 'Direct' : '1 Stop'} <X size={11} />
                  </button>
                )}
                {timeFilter !== 'all' && (
                  <button onClick={() => setTime('all')}
                    className="flex items-center gap-1 bg-[#1B3A6B]/10 text-[#1B3A6B] px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {TIME_SLOTS.find(t => t.id === timeFilter)?.label} <X size={11} />
                  </button>
                )}
                {airlineFilter.map(a => (
                  <button key={a} onClick={() => setAirlines(airlineFilter.filter(x => x !== a))}
                    className="flex items-center gap-1 bg-[#1B3A6B]/10 text-[#1B3A6B] px-2.5 py-1 rounded-full text-[11px] font-bold">
                    {a} <X size={11} />
                  </button>
                ))}
                <button onClick={resetFilters} className="text-[11px] font-bold text-gray-400 px-2">Reset</button>
              </div>
            )}

            {/* No results after filter */}
            {filtered.length === 0 && (
              <div className="text-center py-8 bg-white rounded-2xl shadow-sm">
                <p className="text-3xl mb-2">🔍</p>
                <p className="font-extrabold text-gray-800 mb-1">No flights match your filters</p>
                <button onClick={resetFilters} className="text-sm font-bold text-[#1B3A6B] mt-1">Clear filters</button>
              </div>
            )}

            {/* Flight cards */}
            {filtered.map((f, i) => {
              const trend = getPriceTrend(f.totalPrice, allPrices);
              const isNonStop = f.stops === 0;
              return (
                <div key={f.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Best price banner */}
                  {i === 0 && sortBy === 'price' && (
                    <div className="bg-green-500 text-white text-[10px] font-extrabold px-4 py-1.5 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> BEST PRICE DEAL
                    </div>
                  )}

                  <div className="p-4">
                    {/* Airline row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shadow-sm"
                          style={{ backgroundColor: f.airlineColor }}>
                          {airlineInitials(f.airline)}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-gray-800">{f.airline}</p>
                          <p className="text-[10px] text-gray-400 uppercase">{f.flightNumber} · {cabinClass}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {trend && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${trend.cls}`}>
                            {trend.label}
                          </span>
                        )}
                        {isNonStop && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                            Non-stop
                          </span>
                        )}
                        {f.seatsLeft !== null && f.seatsLeft <= 5 && (
                          <span className="text-[10px] font-extrabold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                            {f.seatsLeft} left!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flight timeline */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="min-w-[52px]">
                        <p className="text-[1.4rem] font-extrabold text-gray-900 leading-none">{f.departure.time}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{f.departure.airport}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1 px-1">
                        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {f.durationFormatted}
                        </p>
                        <div className="w-full flex items-center">
                          <div className="w-2 h-2 rounded-full border-2 border-[#1B3A6B] bg-white shrink-0" />
                          <div className="flex-1 h-px bg-gray-200 relative">
                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1B3A6B]" />
                          </div>
                          <div className="w-2 h-2 rounded-full border-2 border-[#1B3A6B] bg-white shrink-0" />
                        </div>
                        <p className={`text-[10px] font-extrabold uppercase tracking-wider ${f.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                          {f.stopInfo}
                        </p>
                      </div>
                      <div className="min-w-[52px] text-right">
                        <p className="text-[1.4rem] font-extrabold text-gray-900 leading-none">{f.arrival.time}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{f.arrival.airport}</p>
                      </div>
                    </div>

                    {/* Baggage info row */}
                    <div className="flex items-center gap-3 mb-3 px-0.5">
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        🧳 7kg cabin
                      </span>
                      <span className="w-px h-3 bg-gray-200" />
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        📦 15kg check-in
                      </span>
                      <span className="w-px h-3 bg-gray-200" />
                      <span className="text-[10px] text-orange-500 font-bold">Non-refundable</span>
                    </div>

                    {/* Price + Book */}
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                      <div>
                        <p className="text-[1.3rem] font-extrabold text-[#1B3A6B]">₹{fmt(f.totalPrice)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">₹{fmt(f.pricePerPerson)}/person · {passengers} pax</p>
                      </div>
                      <a href={`https://wa.me/918427831127?text=${waText(f)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm shadow-green-200 active:scale-95 transition-transform">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length > 0 && (
              <p className="text-center text-gray-400 text-[10px] uppercase tracking-widest py-2">
                Prices indicative · Confirmed on booking
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse space-y-3">
                <div className="flex gap-2 items-center">
                  <div className="w-9 h-9 bg-gray-200 rounded-xl" />
                  <div className="space-y-1 flex-1"><div className="h-3 bg-gray-200 rounded w-24" /><div className="h-2.5 bg-gray-200 rounded w-16" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-14 bg-gray-200 rounded" />
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="h-7 w-14 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                  <div className="h-9 w-24 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>{/* ── end below-fold ── */}

      {/* Modals */}
      {fromOpen && <CityPickerModal value={from} label="Flying From"
        onChange={v => { setFrom(v); setResults(null); }} onClose={() => setFromOpen(false)} />}
      {toOpen && <CityPickerModal value={to} label="Flying To"
        onChange={v => { setTo(v); setResults(null); }} onClose={() => setToOpen(false)} />}
      {paxOpen && <PaxClassModal passengers={passengers} setPass={setPass}
        cabinClass={cabinClass} setCabinClass={setCabin} onClose={() => setPaxOpen(false)} />}
      {depDateOpen && (
        <DatePickerModal
          value={date} minDate={todayStr} label="Departure Date"
          onChange={v => { setDate(v); setResults(null); setDepDateOpen(false); }}
          onClose={() => setDepDateOpen(false)}
        />
      )}
      {retDateOpen && (
        <DatePickerModal
          value={returnDate} minDate={date || todayStr} label="Return Date"
          onChange={v => { setReturn(v); setRetDateOpen(false); }}
          onClose={() => setRetDateOpen(false)}
        />
      )}
      {showFilterSheet && (
        <FilterSheet
          stopFilter={stopFilter} setStop={setStop}
          timeFilter={timeFilter} setTime={setTime}
          airlineFilter={airlineFilter} setAirlines={setAirlines}
          airlines={allAirlines}
          onClose={() => setFilterSheet(false)}
          onReset={resetFilters}
        />
      )}
    </div>
  );
}
