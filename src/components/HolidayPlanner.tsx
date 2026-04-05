'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, ArrowUpRight, MapPin, Clock, Zap } from 'lucide-react';

interface Holiday {
  name: string;
  date: string;
  emoji: string;
  isLongWeekend: boolean;
  longWeekendNote: string;
  tags: string[];
  tripLink: string;
}

interface WeekendTrip {
  from: string;
  dest: string;
  duration: string;
  emoji: string;
  type: string;
  href: string;
  km: string;
}

const HOLIDAYS: Holiday[] = [
  { name: 'Ram Navami', date: '2026-04-06', emoji: '🪔', isLongWeekend: true, longWeekendNote: 'Mon — 3-day weekend', tags: ['Heritage', 'Spiritual'], tripLink: '/trips?category=Tour' },
  { name: 'Dr Ambedkar Jayanti', date: '2026-04-14', emoji: '🇮🇳', isLongWeekend: false, longWeekendNote: 'Tuesday', tags: ['City Break'], tripLink: '/trips?category=Tour' },
  { name: 'Good Friday', date: '2026-04-18', emoji: '✝️', isLongWeekend: false, longWeekendNote: 'Saturday', tags: ['Beach', 'Relaxation'], tripLink: '/trips?category=Beach' },
  { name: 'Buddha Purnima', date: '2026-05-12', emoji: '☸️', isLongWeekend: false, longWeekendNote: 'Tuesday', tags: ['Spiritual', 'Heritage'], tripLink: '/trips?category=Tour' },
  { name: 'Eid ul-Adha', date: '2026-06-07', emoji: '🌙', isLongWeekend: true, longWeekendNote: 'Sun — extended weekend', tags: ['Heritage', 'Culture'], tripLink: '/trips?category=Tour' },
  { name: 'Independence Day', date: '2026-08-15', emoji: '🇮🇳', isLongWeekend: false, longWeekendNote: 'Saturday', tags: ['Hills', 'Trekking'], tripLink: '/trips?category=Trekking' },
  { name: 'Janmashtami', date: '2026-08-16', emoji: '🪷', isLongWeekend: true, longWeekendNote: 'Sun — extended weekend', tags: ['Spiritual', 'Heritage'], tripLink: '/trips?category=Tour' },
  { name: 'Ganesh Chaturthi', date: '2026-08-27', emoji: '🐘', isLongWeekend: true, longWeekendNote: 'Thu — 4-day break possible', tags: ['Beach', 'Cultural'], tripLink: '/trips?category=Tour' },
  { name: 'Gandhi Jayanti', date: '2026-10-02', emoji: '🇮🇳', isLongWeekend: true, longWeekendNote: 'Fri — 3-day weekend', tags: ['Heritage', 'Nature'], tripLink: '/trips?category=Tour' },
  { name: 'Dussehra', date: '2026-10-11', emoji: '🏹', isLongWeekend: false, longWeekendNote: 'Sunday', tags: ['Cultural', 'Heritage'], tripLink: '/trips?category=Tour' },
  { name: 'Diwali', date: '2026-10-20', emoji: '🪔', isLongWeekend: true, longWeekendNote: 'Tue — extended break', tags: ['Heritage', 'Festive'], tripLink: '/trips?category=Tour' },
  { name: 'Christmas & New Year', date: '2026-12-25', emoji: '🎄', isLongWeekend: true, longWeekendNote: 'Fri — 4-day weekend', tags: ['Beach', 'Hills', 'International'], tripLink: '/trips?category=Beach' },
];

const WEEKEND_TRIPS: WeekendTrip[] = [
  { from: 'Delhi', dest: 'Jaipur', duration: '2D 1N', emoji: '🏯', type: 'Heritage', href: '/trips?q=Jaipur', km: '280 km' },
  { from: 'Delhi', dest: 'Rishikesh', duration: '2D 1N', emoji: '🏄', type: 'Adventure', href: '/trips?category=Adventure', km: '240 km' },
  { from: 'Mumbai', dest: 'Lonavala', duration: '2D 1N', emoji: '⛰', type: 'Nature', href: '/trips?q=Lonavala', km: '83 km' },
  { from: 'Mumbai', dest: 'Goa', duration: '3D 2N', emoji: '🏖', type: 'Beach', href: '/trips?category=Beach', km: '590 km' },
  { from: 'Bangalore', dest: 'Coorg', duration: '2D 1N', emoji: '☕', type: 'Nature', href: '/trips?q=Coorg', km: '270 km' },
  { from: 'Bangalore', dest: 'Ooty', duration: '2D 1N', emoji: '🌿', type: 'Hills', href: '/trips?q=Ooty', km: '265 km' },
  { from: 'Chennai', dest: 'Pondicherry', duration: '2D 1N', emoji: '🌊', type: 'Beach', href: '/trips?category=Beach', km: '150 km' },
  { from: 'Hyderabad', dest: 'Hampi', duration: '3D 2N', emoji: '🗿', type: 'Heritage', href: '/trips?q=Hampi', km: '370 km' },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

type Tab = 'holidays' | 'weekends';

export default function HolidayPlanner() {
  const [activeTab, setActiveTab] = useState<Tab>('holidays');
  const [filter, setFilter] = useState<'all' | 'long'>('all');

  const upcomingHolidays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return HOLIDAYS.filter((h) => new Date(h.date) >= today).slice(0, 8);
  }, []);

  const displayedHolidays = filter === 'long'
    ? upcomingHolidays.filter((h) => h.isLongWeekend)
    : upcomingHolidays;

  return (
    <section className="py-16 md:py-24 bg-cream-dark">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Plan Ahead</p>
            <h2 className="font-display text-display-lg text-primary">
              Holiday & weekend <span className="italic">planner</span>
            </h2>
            <p className="text-primary/55 text-body-sm max-w-lg mt-3">
              Never miss a long weekend. Plan your next escape around Indian public holidays and short breaks.
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-cream border border-primary/10 p-1 gap-1 self-start md:self-end">
            <button
              onClick={() => setActiveTab('holidays')}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                activeTab === 'holidays' ? 'bg-primary text-cream' : 'text-primary hover:bg-primary/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Holidays
            </button>
            <button
              onClick={() => setActiveTab('weekends')}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                activeTab === 'weekends' ? 'bg-primary text-cream' : 'text-primary hover:bg-primary/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Weekend Trips
            </button>
          </div>
        </div>

        {/* ── Holiday tab ── */}
        {activeTab === 'holidays' && (
          <>
            {/* Filter pills */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-colors rounded-sm ${
                  filter === 'all' ? 'bg-primary text-cream' : 'bg-cream text-primary hover:bg-primary/10'
                }`}
              >
                All Holidays
              </button>
              <button
                onClick={() => setFilter('long')}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs uppercase tracking-widest transition-colors rounded-sm ${
                  filter === 'long' ? 'bg-secondary text-cream' : 'bg-cream text-primary hover:bg-secondary/10'
                }`}
              >
                <Zap className="w-3 h-3" />
                Long Weekends Only
              </button>
            </div>

            {displayedHolidays.length === 0 ? (
              <div className="text-center py-12 text-primary/40 text-sm">
                No more long weekends this year — check back in January!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedHolidays.map((h) => {
                  const days = daysUntil(h.date);
                  const isNear = days <= 14;
                  return (
                    <div
                      key={h.name}
                      className={`bg-cream border p-5 hover:shadow-lg transition-all duration-300 group relative ${
                        h.isLongWeekend ? 'border-secondary/30' : 'border-primary/8'
                      }`}
                    >
                      {/* Long weekend badge */}
                      {h.isLongWeekend && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-secondary/15 text-secondary text-[9px] uppercase tracking-widest px-2 py-0.5 font-semibold">
                          <Zap className="w-2.5 h-2.5" />
                          Long Weekend
                        </div>
                      )}

                      <div className="text-3xl mb-3">{h.emoji}</div>
                      <h3 className="font-display text-lg text-primary mb-1 pr-20">{h.name}</h3>
                      <p className="text-xs text-primary/50 mb-1">{formatDate(h.date)}</p>
                      <p className="text-xs text-secondary/70 mb-3 font-medium">{h.longWeekendNote}</p>

                      {/* Days countdown */}
                      <div className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold mb-4 ${
                        isNear ? 'text-terracotta' : 'text-primary/40'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow!' : `${days} days away`}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {h.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-primary/5 text-primary/60 text-[10px] uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={h.tripLink}
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors font-semibold"
                      >
                        Plan Trip
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 border border-primary/15 text-primary hover:bg-primary hover:text-cream px-8 py-3.5 text-xs uppercase tracking-widest transition-all"
              >
                Browse All Trips
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}

        {/* ── Weekend Trips tab ── */}
        {activeTab === 'weekends' && (
          <>
            <p className="text-primary/50 text-sm mb-6">
              Quick getaways you can book for any upcoming weekend — curated by departure city.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WEEKEND_TRIPS.map((trip) => (
                <Link
                  key={`${trip.from}-${trip.dest}`}
                  href={trip.href}
                  className="bg-cream border border-primary/8 p-5 hover:shadow-lg hover:border-secondary/30 transition-all duration-300 group block"
                >
                  <div className="text-3xl mb-3">{trip.emoji}</div>
                  <div className="text-[10px] uppercase tracking-widest text-primary/40 mb-1">From {trip.from}</div>
                  <h3 className="font-display text-xl text-primary mb-1">{trip.dest}</h3>

                  <div className="flex items-center gap-3 mt-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-secondary/70 bg-secondary/10 px-2 py-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {trip.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-primary/50">
                      <MapPin className="w-2.5 h-2.5" />
                      {trip.km}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-primary/40 bg-primary/5 px-2 py-0.5">{trip.type}</span>
                    <ArrowUpRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 p-5 bg-cream border border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg text-primary">Can&apos;t find your city?</p>
                <p className="text-primary/55 text-sm">Tell us where you are — we&apos;ll suggest the best weekend escapes near you.</p>
              </div>
              <a
                href="https://wa.me/918427831127?text=Hi%2C+I'm+looking+for+a+weekend+trip+near+me.+I'm+based+in+"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 text-xs uppercase tracking-widest transition-colors font-semibold"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Ask on WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
