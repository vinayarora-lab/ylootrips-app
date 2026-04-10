'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Trash2, Clock, Star, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-sm">{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
  );
}

const STATUS_COLORS = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ICONS = {
  pending:  <Clock size={13} />,
  approved: <CheckCircle size={13} />,
  rejected: <XCircle size={13} />,
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews?status=${filter}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  const act = async (id: string, status: 'approved' | 'rejected') => {
    setActing(id);
    await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, adminNote: noteMap[id] || '' }),
    });
    await load();
    setActing(null);
  };

  const del = async (id: string) => {
    if (!confirm('Permanently delete this review?')) return;
    setActing(id);
    await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await load();
    setActing(null);
  };

  const counts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client Reviews</h1>
            <p className="text-sm text-gray-500 mt-0.5">Approve submissions before they go live on the website</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-white">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                filter === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {s}
              {s === 'pending' && counts.pending > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {counts.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No {filter} reviews.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="p-4 flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{r.name}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status]}`}>
                        {STATUS_ICONS[r.status]} {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{r.email} · {r.phone || 'No phone'} · {r.country}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Trip: <span className="font-medium text-gray-700">{r.trip}</span></p>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars n={r.rating} />
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <button onClick={() => setExpanded(expanded === r._id ? null : r._id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                    {expanded === r._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Review text (always visible, truncated) */}
                <div className="px-4 pb-3">
                  <p className={`text-sm text-gray-700 leading-relaxed ${expanded !== r._id ? 'line-clamp-2' : ''}`}>
                    "{r.text}"
                  </p>
                </div>

                {/* Expanded: admin note + actions */}
                {expanded === r._id && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
                    {r.adminNote && (
                      <p className="text-xs text-gray-500 italic">Admin note: {r.adminNote}</p>
                    )}
                    <textarea
                      placeholder="Optional: add an admin note..."
                      rows={2}
                      value={noteMap[r._id] || ''}
                      onChange={(e) => setNoteMap({ ...noteMap, [r._id]: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg resize-none outline-none focus:border-amber-400"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {r.status !== 'approved' && (
                        <button
                          onClick={() => act(r._id, 'approved')}
                          disabled={acting === r._id}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
                        >
                          <CheckCircle size={13} />
                          {acting === r._id ? 'Saving…' : 'Approve & Publish'}
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          onClick={() => act(r._id, 'rejected')}
                          disabled={acting === r._id}
                          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => del(r._id)}
                        disabled={acting === r._id}
                        className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors ml-auto"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
