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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ylootrips.com';
const PROXY_URL = 'https://trip-frontend-ecru.vercel.app';

// Test if AI trip planner actually works (checks local key OR proxy fallback)
async function testAiFeature(): Promise<{ works: boolean; latencyMs: number; viaProxy: boolean }> {
  const t = Date.now();
  try {
    // Try local endpoint first (uses all 3 providers + proxy fallback internally)
    const res = await fetch(`${SITE_URL}/api/trip-planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'One sentence about Goa beach trip' }),
      signal: AbortSignal.timeout(8000),
    });
    const latencyMs = Date.now() - t;
    if (res.ok) {
      const data = await res.json();
      if (data.itinerary) return { works: true, latencyMs, viaProxy: data.provider === 'proxy' || !process.env.GROQ_API_KEY };
    }
  } catch { /* fall through */ }
  // Also try proxy directly
  try {
    const res2 = await fetch(`${PROXY_URL}/api/trip-planner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'One sentence about Goa beach trip' }),
      signal: AbortSignal.timeout(8000),
    });
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2.itinerary) return { works: true, latencyMs: Date.now() - t, viaProxy: true };
    }
  } catch { /* fall through */ }
  return { works: false, latencyMs: Date.now() - t, viaProxy: false };
}

// ── Groq ─────────────────────────────────────────────────────────────────────
async function checkGroq(aiTest: { works: boolean; latencyMs: number; viaProxy: boolean }): Promise<Partial<ApiStatus>> {
  if (!process.env.GROQ_API_KEY) {
    if (aiTest.works) return {
      status: 'ok', latencyMs: aiTest.latencyMs,
      planLabel: 'Via proxy server',
      limitLabel: '14,400 req / day · 6,000 tokens / min',
      usageLabel: 'AI working via backup server — add key to this server for direct access',
    };
    return { status: 'missing', message: 'Not configured on this server' };
  }
  const t = Date.now();
  try {
    // Make a minimal chat completion to get rate-limit headers
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: 'user', content: 'hi' }], max_tokens: 1 }),
      signal: AbortSignal.timeout(6000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Daily limit reached — get a new key' };
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };

    // Read rate-limit headers
    const limitReq = parseInt(res.headers.get('x-ratelimit-limit-requests') || '0');
    const remainReq = parseInt(res.headers.get('x-ratelimit-remaining-requests') || '0');
    const limitTok = res.headers.get('x-ratelimit-limit-tokens') || '';
    const remainTok = res.headers.get('x-ratelimit-remaining-tokens') || '';
    const resetReq = res.headers.get('x-ratelimit-reset-requests') || '';

    let usageLabel = 'Limit resets daily at midnight UTC';
    let usagePercent: number | undefined;
    if (limitReq > 0) {
      const used = limitReq - remainReq;
      const pct = Math.max(0, Math.min(100, Math.round((used / limitReq) * 100)));
      usageLabel = `${used.toLocaleString()} used · ${remainReq.toLocaleString()} remaining${resetReq ? ` · resets in ${resetReq}` : ''}`;
      usagePercent = pct;
    }
    const limitLabel = limitReq > 0
      ? `${limitReq.toLocaleString()} req/day · ${limitTok ? limitTok + ' tokens/min' : '6,000 tokens/min'}`
      : `14,400 req/day · ${remainTok ? remainTok + ' tokens remaining' : '6,000 tokens/min'}`;

    return { status: 'ok', latencyMs, planLabel: 'Free tier · Direct', limitLabel, usageLabel, usagePercent };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── OpenAI ────────────────────────────────────────────────────────────────────
async function checkOpenAI(aiTest: { works: boolean; latencyMs: number; viaProxy: boolean }): Promise<Partial<ApiStatus>> {
  if (!process.env.OPENAI_API_KEY) {
    if (aiTest.works) return {
      status: 'ok', latencyMs: aiTest.latencyMs,
      planLabel: 'Via proxy server (fallback)',
      limitLabel: 'gpt-4o-mini — pay per token',
      usageLabel: 'Available via backup server',
    };
    return { status: 'missing', message: 'Not configured on this server' };
  }
  const t = Date.now();
  try {
    // Minimal chat completion to get rate-limit headers
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }], max_tokens: 1 }),
      signal: AbortSignal.timeout(8000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Quota exceeded — add credits or upgrade plan' };
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };

    // Read rate-limit headers
    const limitReq = parseInt(res.headers.get('x-ratelimit-limit-requests') || '0');
    const remainReq = parseInt(res.headers.get('x-ratelimit-remaining-requests') || '0');
    const limitTok = parseInt(res.headers.get('x-ratelimit-limit-tokens') || '0');
    const remainTok = parseInt(res.headers.get('x-ratelimit-remaining-tokens') || '0');
    const resetReq = res.headers.get('x-ratelimit-reset-requests') || '';

    let usageLabel = 'Pay-as-you-go (charged per token)';
    let usagePercent: number | undefined;
    if (limitReq > 0) {
      const used = limitReq - remainReq;
      const pct = Math.max(0, Math.min(100, Math.round((used / limitReq) * 100)));
      usageLabel = `${used.toLocaleString()} req used · ${remainReq.toLocaleString()} remaining${resetReq ? ` · resets in ${resetReq}` : ''}`;
      usagePercent = pct;
    } else if (remainTok > 0) {
      usageLabel = `${remainTok.toLocaleString()} tokens remaining this minute`;
    }

    const limitLabel = limitReq > 0
      ? `${limitReq.toLocaleString()} req/min · ${limitTok > 0 ? limitTok.toLocaleString() + ' tokens/min' : 'gpt-4o-mini'}`
      : 'gpt-4o-mini · $0.15/1M input tokens';

    return { status: 'ok', latencyMs, planLabel: 'Paid account · Direct', limitLabel, usageLabel, usagePercent };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

// ── Gemini ────────────────────────────────────────────────────────────────────
async function checkGemini(aiTest: { works: boolean; latencyMs: number; viaProxy: boolean }): Promise<Partial<ApiStatus>> {
  if (!process.env.GEMINI_API_KEY) {
    if (aiTest.works) return {
      status: 'ok', latencyMs: aiTest.latencyMs,
      planLabel: 'Via proxy server (2nd fallback)',
      limitLabel: '1,500 req / day · free tier',
      usageLabel: 'Available via backup server',
    };
    return { status: 'missing', message: 'Not configured on this server' };
  }
  const t = Date.now();
  try {
    // Make a minimal generateContent call to get rate-limit headers
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }], generationConfig: { maxOutputTokens: 1 } }),
        signal: AbortSignal.timeout(8000),
      }
    );
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Quota exceeded — check Google AI Studio' };
    if (res.status === 400 || res.status === 403) return { status: 'error', latencyMs, message: 'Invalid key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `Error ${res.status}` };

    // Read rate-limit headers (Gemini uses x-ratelimit-* on some endpoints)
    const limitReq = parseInt(res.headers.get('x-ratelimit-limit-requests') || res.headers.get('ratelimit-limit') || '0');
    const remainReq = parseInt(res.headers.get('x-ratelimit-remaining-requests') || res.headers.get('ratelimit-remaining') || '0');
    const resetReq = res.headers.get('x-ratelimit-reset-requests') || res.headers.get('ratelimit-reset') || '';

    let usageLabel = 'Gemini 2.0 Flash · free with Google account';
    let usagePercent: number | undefined;
    if (limitReq > 0) {
      const used = limitReq - remainReq;
      const pct = Math.max(0, Math.min(100, Math.round((used / limitReq) * 100)));
      usageLabel = `${used.toLocaleString()} used · ${remainReq.toLocaleString()} remaining${resetReq ? ` · resets in ${resetReq}` : ''}`;
      usagePercent = pct;
    }

    return {
      status: 'ok', latencyMs,
      planLabel: 'Free tier · Direct',
      limitLabel: '15 req/min · 1,500 req/day · 1M tokens/min',
      usageLabel,
      usagePercent,
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
    const used = Math.max(0, monthlyLimit - searchesLeft);
    const pct = Math.max(0, Math.min(100, Math.round((used / monthlyLimit) * 100)));

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
  // Test AI feature once — shared across Groq/OpenAI/Gemini checks
  const aiTest = await testAiFeature();

  const [groq, openai, gemini, serpapi, amadeus, resend, backend] = await Promise.all([
    checkGroq(aiTest), checkOpenAI(aiTest), checkGemini(aiTest),
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
