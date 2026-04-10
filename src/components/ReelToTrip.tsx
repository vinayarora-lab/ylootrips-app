'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Instagram, Sparkles, MapPin, Clock, IndianRupee, Camera,
  Share2, Copy, Check, CalendarDays, Backpack, MessageCircle,
  ChevronDown, ChevronUp, Loader2, ArrowRight, Zap, Star,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Activity {
  time: string;
  activity: string;
  details: string;
  cost: string;
  tip?: string;
}

interface Day {
  day: number;
  title: string;
  mood: string;
  activities: Activity[];
}

interface BudgetTier {
  budget: string;
  midRange: string;
  luxury: string;
}

interface Itinerary {
  destination: string;
  matchedFrom: string;
  vibe: string;
  activitiesSpotted: string[];
  estimatedBudget: BudgetTier;
  bestTime: string;
  days: Day[];
  packingEssentials: string[];
  instagramSpots: string[];
  localPhrases: { phrase: string; meaning: string }[];
  bookingNote: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXAMPLES = [
  'A blue-city reel with narrow lanes, white and blue architecture, and desert vibes at golden hour',
  'Couple on a houseboat gliding through misty backwaters with coconut palms on both sides',
  'Solo traveller in a high-altitude monastery with prayer flags, snow peaks, and no crowds',
  'Sunrise timelapse of a white-sand beach with clear turquoise water and no tourists in sight',
  'Street food reel — chaat stalls, old bazaars, Mughal architecture in the background',
];

const TIME_PILL: Record<string, string> = {
  Morning:   'bg-amber-50 text-amber-700 border-amber-200',
  Afternoon: 'bg-orange-50 text-orange-700 border-orange-200',
  Evening:   'bg-violet-50 text-violet-700 border-violet-200',
  Night:     'bg-slate-100 text-slate-700 border-slate-200',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-cream-dark rounded-lg ${className}`} />;
}

function LoadingSkeleton({ streamText }: { streamText: string }) {
  return (
    <div className="space-y-6 mt-8">
      {/* Streaming text preview */}
      {streamText && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 font-mono text-xs text-secondary leading-relaxed max-h-40 overflow-hidden relative">
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
          {streamText}
          <span className="inline-block w-1.5 h-4 bg-accent ml-0.5 animate-pulse align-middle" />
        </div>
      )}

      {/* Card skeleton */}
      <div className="bg-white rounded-2xl border border-cream-dark p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────────────────

function DayCard({ day, index }: { day: Day; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border border-cream-dark rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-cream-light transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {day.day}
          </span>
          <div>
            <p className="font-semibold text-primary text-sm sm:text-base">{day.title}</p>
            <p className="text-xs text-secondary mt-0.5 capitalize">{day.mood}</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-secondary flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-cream-dark divide-y divide-cream-dark">
          {day.activities.map((act, i) => (
            <div key={i} className="px-5 py-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${TIME_PILL[act.time] ?? 'bg-cream text-secondary border-cream-dark'}`}>
                  {act.time}
                </span>
                {act.cost && (
                  <span className="text-xs text-secondary flex items-center gap-0.5">
                    <IndianRupee className="w-3 h-3" />{act.cost.replace('₹', '')}
                  </span>
                )}
              </div>
              <p className="font-medium text-primary text-sm">{act.activity}</p>
              <p className="text-sm text-secondary leading-relaxed">{act.details}</p>
              {act.tip && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">{act.tip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Itinerary Card ───────────────────────────────────────────────────────────

function ItineraryCard({
  itinerary, description, onShare, copied,
}: {
  itinerary: Itinerary;
  description: string;
  onShare: () => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-5 animate-fade-up" id="itinerary-card">
      {/* Header */}
      <div className="bg-primary rounded-2xl p-5 sm:p-6">
        {/* AI match note */}
        <div className="flex items-start gap-2 bg-accent/15 border border-accent/20 rounded-xl px-3 py-2.5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-cream/80 leading-relaxed">{itinerary.matchedFrom}</p>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-cream font-semibold leading-tight">{itinerary.destination}</h2>
            <p className="text-cream-dark text-sm mt-0.5">{itinerary.vibe}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-primary-light rounded-xl p-3 text-center">
            <CalendarDays className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-[10px] text-cream-dark">Duration</p>
            <p className="text-cream text-xs font-semibold">5 Days</p>
          </div>
          <div className="bg-primary-light rounded-xl p-3 text-center">
            <Clock className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-[10px] text-cream-dark">Best Time</p>
            <p className="text-cream text-xs font-semibold">{itinerary.bestTime}</p>
          </div>
          <div className="bg-primary-light rounded-xl p-3 text-center">
            <IndianRupee className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-[10px] text-cream-dark">Budget</p>
            <p className="text-cream text-xs font-semibold">From ₹5k</p>
          </div>
        </div>
      </div>

      {/* Activities spotted */}
      {itinerary.activitiesSpotted?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2.5 px-1">Spotted in the Reel</p>
          <div className="flex flex-wrap gap-2">
            {itinerary.activitiesSpotted.map(a => (
              <span key={a} className="bg-cream border border-cream-dark text-secondary text-xs px-3 py-1.5 rounded-full">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Budget tiers */}
      <div className="bg-white border border-cream-dark rounded-2xl p-4 space-y-2">
        <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Estimated Budget (per person)</p>
        {[
          { label: 'Budget', value: itinerary.estimatedBudget?.budget, dot: 'bg-emerald-400' },
          { label: 'Mid-range', value: itinerary.estimatedBudget?.midRange, dot: 'bg-amber-400' },
          { label: 'Luxury', value: itinerary.estimatedBudget?.luxury, dot: 'bg-purple-400' },
        ].map(({ label, value, dot }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
              <span className="text-secondary">{label}</span>
            </div>
            <span className="font-medium text-primary">{value}</span>
          </div>
        ))}
      </div>

      {/* Day-by-day */}
      <div>
        <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3 px-1">5-Day Itinerary</p>
        <div className="space-y-3">
          {itinerary.days?.map((day, i) => <DayCard key={i} day={day} index={i} />)}
        </div>
      </div>

      {/* Instagram spots */}
      {itinerary.instagramSpots?.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-pink-500" />
            <p className="text-sm font-semibold text-primary">Top Instagram Spots</p>
          </div>
          <div className="space-y-2">
            {itinerary.instagramSpots.map((spot, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-secondary">
                <Star className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                {spot}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packing + local phrases — two columns */}
      <div className="grid sm:grid-cols-2 gap-4">
        {itinerary.packingEssentials?.length > 0 && (
          <div className="bg-white border border-cream-dark rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Backpack className="w-4 h-4 text-secondary" />
              <p className="text-sm font-semibold text-primary">Pack This</p>
            </div>
            <ul className="space-y-1.5">
              {itinerary.packingEssentials.map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-secondary">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {itinerary.localPhrases?.length > 0 && (
          <div className="bg-white border border-cream-dark rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-secondary" />
              <p className="text-sm font-semibold text-primary">Say It Local</p>
            </div>
            <ul className="space-y-2">
              {itinerary.localPhrases.map(({ phrase, meaning }) => (
                <li key={phrase} className="text-xs">
                  <span className="font-semibold text-primary">"{phrase}"</span>
                  <span className="text-secondary"> — {meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Share row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-cream-dark text-primary text-sm font-medium py-3 rounded-xl hover:bg-cream transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Link copied!' : 'Copy shareable link'}
          <Share2 className="w-4 h-4 text-secondary" />
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Instagram className="w-4 h-4" />
          Share on Instagram
        </button>
      </div>

      {/* Book CTA */}
      <div className="bg-gradient-warm rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg text-white font-semibold">Book this exact trip with YlooTrips</h3>
            <p className="text-white/75 text-sm mt-0.5">{itinerary.bookingNote}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/trip-planner?q=5 day trip to ${itinerary.destination}, ${itinerary.vibe} style`}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-primary font-semibold text-sm py-3 rounded-xl hover:bg-cream transition-colors"
          >
            Customise with Yloo AI
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/918427831127?text=${encodeURIComponent(`Hi! I saw a reel about ${itinerary.destination} and want to book a ${itinerary.vibe} trip there. Can you help?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Book on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReelToTrip() {
  const [input, setInput] = useState('');
  const [streamText, setStreamText] = useState('');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async (desc?: string) => {
    const description = (desc ?? input).trim();
    if (!description || loading) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setItinerary(null);
    setStreamText('');
    setHasGenerated(true);

    try {
      const res = await fetch('/api/reel-to-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        const d = await res.json();
        setError(d.error ?? 'Failed to generate itinerary');
        return;
      }

      // Read the stream token by token
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamText(accumulated);
      }

      // Parse when stream is complete
      try {
        const cleaned = accumulated.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
        setItinerary(JSON.parse(cleaned));
        setStreamText('');
      } catch {
        setError('Got a response but couldn\'t parse it. Please try again.');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/reel-to-trip?desc=${encodeURIComponent(input)}`;
    if (navigator.share && /Mobi/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `${itinerary?.destination} Itinerary — YlooTrips`,
          text: `Check out this ${itinerary?.vibe} trip to ${itinerary?.destination} I found on YlooTrips!`,
          url,
        });
        return;
      } catch { /* fallback to copy */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-cream-light">

      {/* Hero */}
      <div className="bg-primary pt-14 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-pink-400/30 text-pink-300 text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
          <Instagram className="w-3.5 h-3.5" />
          Reel → Real Trip
        </div>
        <h1 className="font-display text-display-lg text-cream mb-3 leading-tight">
          Turn any travel reel<br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">into your next trip</span>
        </h1>
        <p className="text-cream-dark text-sm sm:text-base max-w-md mx-auto">
          Paste an Instagram URL or describe what you saw — our AI extracts the destination, vibe, and builds a full 5-day itinerary.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-5 pb-16">

        {/* Input card */}
        <div className="bg-white rounded-2xl shadow-lg border border-cream-dark p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Instagram className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Paste URL or describe the reel</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
            placeholder="e.g. 'A reel of blue-painted streets, white architecture, camels at sunset, Indian desert vibes...' or paste an Instagram URL"
            rows={3}
            className="w-full resize-none text-sm md:text-sm text-primary placeholder-secondary/40 bg-transparent outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-dark">
            <p className="text-xs text-secondary/50 hidden sm:block">Enter ↵ to generate · Shift+Enter for new line</p>
            <button
              onClick={() => handleGenerate()}
              disabled={!input.trim() || loading}
              className="ml-auto flex items-center gap-2 bg-primary hover:bg-primary-light text-cream text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
                : <><Sparkles className="w-4 h-4" />Generate Itinerary</>}
            </button>
          </div>
        </div>

        {/* Example prompts */}
        {!hasGenerated && (
          <div className="mt-5">
            <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-2.5 px-1">Try an example</p>
            <div className="space-y-2">
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => { setInput(ex); handleGenerate(ex); }}
                  className="w-full text-left text-sm text-primary bg-white border border-cream-dark rounded-xl px-4 py-3 hover:border-accent hover:bg-cream transition-all"
                >
                  <span className="text-pink-400 mr-2">▶</span>{ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton streamText={streamText} />}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-red-500 text-lg">⚠</span>
            <div>
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError(null)} className="text-xs text-red-400 mt-1 hover:underline">Dismiss</button>
            </div>
          </div>
        )}

        {/* Result */}
        {itinerary && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs text-secondary">Your itinerary is ready ✨</p>
              <button
                onClick={() => { setItinerary(null); setHasGenerated(false); setInput(''); }}
                className="text-xs text-accent hover:underline"
              >
                Try another reel
              </button>
            </div>
            <ItineraryCard
              itinerary={itinerary}
              description={input}
              onShare={handleShare}
              copied={copied}
            />
          </div>
        )}
      </div>
    </div>
  );
}
