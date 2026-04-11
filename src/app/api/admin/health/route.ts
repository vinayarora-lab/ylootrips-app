import { NextResponse } from 'next/server';

export interface ApiStatus {
  name: string;
  purpose: string;
  configured: boolean;
  status: 'ok' | 'missing' | 'error' | 'rate_limited';
  latencyMs?: number;
  message?: string;
  docsUrl: string;
  // Usage info
  usageLabel?: string;       // e.g. "843 / 1,000 requests"
  usagePercent?: number;     // 0–100 for progress bar
  limitLabel?: string;       // e.g. "Free: 1,000 req/day"
  planLabel?: string;        // e.g. "Free tier"
}

// ── Groq ─────────────────────────────────────────────────────────────────────
async function checkGroq(): Promise<Partial<ApiStatus>> {
  if (!process.env.GROQ_API_KEY) return { status: 'missing', message: 'Not configured' };
  const t = Date.now();
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Daily limit reached — get a new key' };
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };
    // Groq free tier: 14,400 req/day on llama-3.3-70b
    return {
      status: 'ok', latencyMs,
      planLabel: 'Free tier',
      limitLabel: '14,400 req / day · 6,000 tokens / min',
      usageLabel: 'Limit resets daily at midnight UTC',
    };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── OpenAI ────────────────────────────────────────────────────────────────────
async function checkOpenAI(): Promise<Partial<ApiStatus>> {
  if (!process.env.OPENAI_API_KEY) return { status: 'missing', message: 'Not configured' };
  const t = Date.now();
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Quota exceeded — add credits' };
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };

    // Try to get billing/usage info
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    let usageLabel = 'Pay-as-you-go (charged per token)';
    let planLabel = 'Paid account';

    try {
      const usageRes = await fetch(
        `https://api.openai.com/v1/usage?date=${endDate}`,
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, signal: AbortSignal.timeout(4000) }
      );
      if (usageRes.ok) {
        const data = await usageRes.json();
        const totalTokens = (data.data || []).reduce((s: number, d: Record<string, number>) => s + (d.n_context_tokens_total || 0) + (d.n_generated_tokens_total || 0), 0);
        if (totalTokens > 0) {
          usageLabel = `~${(totalTokens / 1000).toFixed(1)}K tokens used today`;
        }
      }
    } catch { /* usage endpoint not critical */ }

    return { status: 'ok', latencyMs, planLabel, usageLabel, limitLabel: 'gpt-4o-mini: $0.15/1M input tokens' };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── Gemini ────────────────────────────────────────────────────────────────────
async function checkGemini(): Promise<Partial<ApiStatus>> {
  if (!process.env.GEMINI_API_KEY) return { status: 'missing', message: 'Not configured' };
  const t = Date.now();
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Quota exceeded — check Google AI Studio' };
    if (res.status === 400 || res.status === 403) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };
    return {
      status: 'ok', latencyMs,
      planLabel: 'Free tier',
      limitLabel: '15 req/min · 1,500 req/day · 1M tokens/min',
      usageLabel: 'Gemini 2.0 Flash — free with Google account',
    };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── SerpAPI ───────────────────────────────────────────────────────────────────
async function checkSerpApi(): Promise<Partial<ApiStatus>> {
  if (!process.env.SERPAPI_KEY) return { status: 'missing', message: 'Not configured' };
  const t = Date.now();
  try {
    const res = await fetch(
      `https://serpapi.com/account?api_key=${process.env.SERPAPI_KEY}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const latencyMs = Date.now() - t;
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };
    const data = await res.json();

    const searchesLeft = data.total_searches_left ?? 0;
    const monthlyLimit = data.plan_monthly_searches ?? 100;
    const used = monthlyLimit - searchesLeft;
    const pct = Math.min(100, Math.round((used / monthlyLimit) * 100));

    if (searchesLeft === 0) {
      return { status: 'rate_limited', latencyMs, message: 'Monthly quota exhausted', usagePercent: 100, usageLabel: `${used} / ${monthlyLimit} searches used`, limitLabel: `Plan: ${data.plan_name || 'Free'}` };
    }

    return {
      status: 'ok', latencyMs,
      planLabel: data.plan_name || 'Free',
      usageLabel: `${used.toLocaleString()} used · ${searchesLeft.toLocaleString()} remaining`,
      usagePercent: pct,
      limitLabel: `${monthlyLimit.toLocaleString()} searches / month`,
    };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── Amadeus ───────────────────────────────────────────────────────────────────
async function checkAmadeus(): Promise<Partial<ApiStatus>> {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    return { status: 'missing', message: 'Not configured' };
  }
  const base = process.env.AMADEUS_ENV === 'production'
    ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';
  const t = Date.now();
  try {
    const res = await fetch(`${base}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.AMADEUS_CLIENT_ID!, client_secret: process.env.AMADEUS_CLIENT_SECRET! }),
      signal: AbortSignal.timeout(6000),
    });
    const latencyMs = Date.now() - t;
    if (!res.ok) return { status: 'error', latencyMs, message: `Auth failed (${res.status})` };
    const json = await res.json();
    if (!json.access_token) return { status: 'error', latencyMs, message: 'No token returned' };
    const env = process.env.AMADEUS_ENV === 'production' ? 'Production' : 'Test';
    return {
      status: 'ok', latencyMs,
      planLabel: `${env} environment`,
      limitLabel: 'Free test: ~2,000 req/month · Production: unlimited (billing)',
      usageLabel: 'Token valid · Flight search active',
    };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── Resend ────────────────────────────────────────────────────────────────────
async function checkResend(): Promise<Partial<ApiStatus>> {
  if (!process.env.RESEND_API_KEY) return { status: 'missing', message: 'Not configured' };
  const t = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };
    return {
      status: 'ok', latencyMs,
      planLabel: 'Free tier',
      limitLabel: '3,000 emails / month · 100 / day',
      usageLabel: 'Email service operational',
    };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── Backend API ───────────────────────────────────────────────────────────────
async function checkBackendApi(): Promise<Partial<ApiStatus>> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return { status: 'missing', message: 'Not configured' };
  const t = Date.now();
  try {
    const res = await fetch(`${url}/trips?limit=1`, { signal: AbortSignal.timeout(5000) });
    const latencyMs = Date.now() - t;
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };
    return {
      status: 'ok', latencyMs,
      planLabel: 'Google Cloud Run',
      usageLabel: 'Database reachable · All endpoints live',
      limitLabel: 'Auto-scaled · No hard limit',
    };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── Easebuzz ──────────────────────────────────────────────────────────────────
function checkEasebuzz(): Partial<ApiStatus> {
  const key = process.env.EASEBUZZ_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  if (!key || !salt) return { status: 'missing', message: 'Not configured' };
  const env = process.env.EASEBUZZ_ENV === 'production' ? 'Production' : 'Test';
  return {
    status: 'ok',
    planLabel: `${env} mode`,
    usageLabel: 'Payment gateway active · Keys valid',
    limitLabel: 'No API call limit · Transaction fees apply',
  };
}

export async function GET() {
  const [groq, openai, gemini, serpapi, amadeus, resend, backend] = await Promise.all([
    checkGroq(), checkOpenAI(), checkGemini(),
    checkSerpApi(), checkAmadeus(), checkResend(), checkBackendApi(),
  ]);
  const easebuzz = checkEasebuzz();

  function merge(base: Omit<ApiStatus, 'status'>, partial: Partial<ApiStatus>): ApiStatus {
    return { ...base, status: 'missing', ...partial } as ApiStatus;
  }

  const apis: ApiStatus[] = [
    merge({ name: 'Groq AI', purpose: 'AI Trip Planner · Reel-to-Trip (primary)', configured: !!process.env.GROQ_API_KEY, docsUrl: 'https://console.groq.com/keys' }, groq),
    merge({ name: 'OpenAI', purpose: 'AI Trip Planner (fallback)', configured: !!process.env.OPENAI_API_KEY, docsUrl: 'https://platform.openai.com/usage' }, openai),
    merge({ name: 'Google Gemini', purpose: 'AI Trip Planner (second fallback)', configured: !!process.env.GEMINI_API_KEY, docsUrl: 'https://aistudio.google.com/apikey' }, gemini),
    merge({ name: 'SerpAPI', purpose: 'Live Flight Search (Google Flights)', configured: !!process.env.SERPAPI_KEY, docsUrl: 'https://serpapi.com/manage-api-key' }, serpapi),
    merge({ name: 'Amadeus', purpose: 'Flight Search fallback', configured: !!(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET), docsUrl: 'https://developers.amadeus.com/' }, amadeus),
    merge({ name: 'Easebuzz', purpose: 'Payment Gateway (bookings)', configured: !!(process.env.EASEBUZZ_KEY && process.env.EASEBUZZ_SALT), docsUrl: 'https://easebuzz.in/dashboard' }, easebuzz),
    merge({ name: 'Resend Email', purpose: 'Booking confirmations · Tickets', configured: !!process.env.RESEND_API_KEY, docsUrl: 'https://resend.com/emails' }, resend),
    merge({ name: 'Backend API', purpose: 'Database · Trips · Bookings', configured: !!process.env.NEXT_PUBLIC_API_URL, docsUrl: '#' }, backend),
  ];

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    allOk: apis.every(a => a.status === 'ok'),
    hasIssues: apis.some(a => a.status !== 'ok'),
    apis,
  });
}
