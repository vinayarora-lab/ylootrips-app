'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Activity, Zap, Clock, ExternalLink, Shield, Server,
  CreditCard, Mail, Plane, Brain, Globe, Radio
} from 'lucide-react';

interface ApiStatus {
  name: string;
  purpose: string;
  configured: boolean;
  status: 'ok' | 'missing' | 'error' | 'rate_limited';
  latencyMs?: number;
  message?: string;
  docsUrl: string;
  usageLabel?: string;
  usagePercent?: number;
  limitLabel?: string;
  planLabel?: string;
}

interface HealthData {
  checkedAt: string;
  allOk: boolean;
  hasIssues: boolean;
  apis: ApiStatus[];
}

const API_ICONS: Record<string, React.ElementType> = {
  'Groq AI': Brain,
  'OpenAI': Brain,
  'Google Gemini': Brain,
  'SerpAPI': Plane,
  'Amadeus': Plane,
  'Easebuzz': CreditCard,
  'Resend Email': Mail,
  'Backend API': Server,
};

const STATUS_CFG = {
  ok:           { cls: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle2, label: 'Operational' },
  missing:      { cls: 'bg-red-100 text-red-700 border-red-200',        icon: XCircle,      label: 'Not Configured' },
  error:        { cls: 'bg-red-100 text-red-700 border-red-200',        icon: XCircle,      label: 'Error' },
  rate_limited: { cls: 'bg-amber-100 text-amber-700 border-amber-200',  icon: AlertTriangle,label: 'Limit Reached' },
};

function StatusBadge({ status }: { status: ApiStatus['status'] }) {
  const c = STATUS_CFG[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.cls}`}>
      <Icon size={11} />{c.label}
    </span>
  );
}

function UsageBar({ percent, status }: { percent: number; status: ApiStatus['status'] }) {
  const color = status === 'rate_limited' ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
        <span>Usage</span>
        <span className={percent > 80 ? 'text-amber-600 font-bold' : ''}>{percent}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function LatencyPill({ ms }: { ms?: number }) {
  if (!ms) return null;
  const color = ms < 500 ? 'text-green-600 bg-green-50' : ms < 1500 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {ms}ms
    </span>
  );
}

export default function HealthDashboard() {
  const router = useRouter();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin'); return; }
    runChecks();
    fetchActiveUsers();
  }, [router]);

  useEffect(() => {
    const t = setInterval(fetchActiveUsers, 10_000);
    return () => clearInterval(t);
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const r = await fetch('/api/admin/active-users');
      if (r.ok) { const d = await r.json(); setActiveUsers(d.count ?? 0); }
    } catch { /* silent */ }
  };

  const runChecks = useCallback(async () => {
    setChecking(true);
    try {
      const r = await fetch('/api/admin/health');
      if (r.ok) { setHealth(await r.json()); setLastChecked(new Date()); }
    } finally { setChecking(false); setLoading(false); }
  }, []);

  const issueCount = health?.apis.filter(a => a.status !== 'ok').length ?? 0;
  const okCount = health?.apis.filter(a => a.status === 'ok').length ?? 0;
  const avgLatency = health
    ? (() => { const v = health.apis.map(a => a.latencyMs).filter(Boolean) as number[]; return v.length ? Math.round(v.reduce((a,b)=>a+b,0)/v.length) : null; })()
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={16} /> Admin
          </Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold flex items-center gap-2">
            <Activity size={16} className="text-green-400" /> Website Health
          </span>
        </div>
        <button onClick={runChecks} disabled={checking}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50">
          <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Checking…' : 'Re-check All'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Overall status banner */}
        {health && (
          <div className={`rounded-2xl p-5 flex items-center gap-4 border ${health.allOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${health.allOk ? 'bg-green-500' : 'bg-red-500'}`}>
              {health.allOk ? <CheckCircle2 size={24} className="text-white" /> : <XCircle size={24} className="text-white" />}
            </div>
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${health.allOk ? 'text-green-800' : 'text-red-800'}`}>
                {health.allOk ? 'All Systems Operational' : `${issueCount} Service${issueCount > 1 ? 's' : ''} Need Attention`}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Last checked: {lastChecked?.toLocaleTimeString('en-IN')}
              </p>
            </div>
            {!health.allOk && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200">
                {issueCount} issue{issueCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Live on Site</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Radio size={14} className="text-green-500" />
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
            <p className="text-xs text-gray-400 mt-1">active users now</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Services OK</span>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {okCount}<span className="text-sm text-gray-400 font-normal"> / {health?.apis.length ?? 8}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">all services</p>
          </div>

          <div className={`bg-white rounded-xl border p-5 shadow-sm ${issueCount > 0 ? 'border-red-200' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Issues</span>
              <AlertTriangle size={16} className={issueCount > 0 ? 'text-red-500' : 'text-gray-300'} />
            </div>
            <p className={`text-3xl font-bold ${issueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{issueCount}</p>
            <p className="text-xs text-gray-400 mt-1">need action</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Avg Response</span>
              <Clock size={16} className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgLatency ? `${avgLatency}ms` : '—'}</p>
            <p className="text-xs text-gray-400 mt-1">across all APIs</p>
          </div>
        </div>

        {/* Issues section */}
        {!loading && health && issueCount > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={13} /> Action Required
            </h2>
            {health.apis.filter(a => a.status !== 'ok').map(api => (
              <ApiCard key={api.name} api={api} highlight />
            ))}
          </div>
        )}

        {/* All APIs */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-44 bg-white rounded-xl border border-gray-200 animate-pulse" />)}
          </div>
        ) : health ? (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Shield size={13} /> All Services — Usage & Limits
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {health.apis.map(api => <ApiCard key={api.name} api={api} />)}
            </div>
          </div>
        ) : null}

        {/* How to fix */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
            <Zap size={15} className="text-amber-400" /> How to add / replace an API key
          </h3>
          <p className="text-gray-400 text-xs mb-4">Keys are stored as environment variables on Vercel — never shown here for security.</p>
          <ol className="space-y-2 text-xs text-gray-300">
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">1</span>
              Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">vercel.com</a> → your project → <strong>Settings → Environment Variables</strong></li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">2</span>
              Click the variable name shown on the card above → update the value → Save</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">3</span>
              Click <strong>Redeploy</strong> on latest deployment for the change to take effect</li>
            <li className="flex gap-3"><span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">4</span>
              Return here → <strong>Re-check All</strong> to confirm green status</li>
          </ol>
        </div>

      </div>
    </div>
  );
}

function ApiCard({ api, highlight = false }: { api: ApiStatus; highlight?: boolean }) {
  const Icon = API_ICONS[api.name] ?? Globe;
  const borderCls = highlight
    ? api.status === 'rate_limited' ? 'border-amber-300' : 'border-red-300'
    : 'border-gray-200';
  const iconBg = api.status === 'ok' ? 'bg-green-50' : api.status === 'rate_limited' ? 'bg-amber-50' : 'bg-red-50';
  const iconColor = api.status === 'ok' ? 'text-green-600' : api.status === 'rate_limited' ? 'text-amber-600' : 'text-red-500';

  return (
    <div className={`bg-white rounded-xl border ${borderCls} shadow-sm p-5`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} className={iconColor} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 text-sm">{api.name}</p>
              <LatencyPill ms={api.latencyMs} />
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{api.purpose}</p>
          </div>
        </div>
        <StatusBadge status={api.status} />
      </div>

      {/* Plan + usage info */}
      {api.status === 'ok' ? (
        <div className="space-y-2">
          {api.planLabel && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Plan</span>
              <span className="text-[11px] font-semibold text-gray-700">{api.planLabel}</span>
            </div>
          )}
          {api.limitLabel && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Limit</span>
              <span className="text-[11px] font-semibold text-gray-700">{api.limitLabel}</span>
            </div>
          )}
          {api.usageLabel && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Usage</span>
              <span className="text-[11px] font-semibold text-green-700">{api.usageLabel}</span>
            </div>
          )}
          {api.usagePercent !== undefined && <UsageBar percent={api.usagePercent} status={api.status} />}
        </div>
      ) : (
        <div className={`rounded-lg px-3 py-2.5 text-xs font-medium ${
          api.status === 'rate_limited' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700'
        }`}>
          {api.message || 'This service is unavailable'}
          {api.status === 'missing' && <span className="block mt-1 text-gray-500 font-normal">Configure this key on Vercel to enable this feature.</span>}
          {api.status === 'rate_limited' && <span className="block mt-1 text-gray-500 font-normal">Get a new key and update it on Vercel to restore service.</span>}
        </div>
      )}

      {/* Get key link */}
      {api.docsUrl !== '#' && (
        <a href={api.docsUrl} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700">
          {api.status === 'ok' ? 'View dashboard' : 'Get / replace key'}
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
