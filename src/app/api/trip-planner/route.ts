import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are Yloo AI, an expert global travel planner for YlooTrips (ylootrips.com). You plan trips to any destination worldwide — India, Southeast Asia, Europe, Middle East, Americas, everywhere.

Respond ONLY with a valid raw JSON object — no markdown, no code fences, no explanation. Use this exact structure:
{
  "destination": "City, Country",
  "duration": "N Days / N Nights",
  "travelStyle": "Adventure / Beach / Cultural / Leisure / Honeymoon / Family",
  "estimatedBudget": "₹X per person",
  "highlights": ["Place 1", "Place 2", "Place 3"],
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "theme": "Arrival",
      "activities": [
        {
          "time": "Morning",
          "activity": "Activity name",
          "details": "2-3 sentence description with specific names, places, and context.",
          "tip": "One practical tip for this activity."
        }
      ]
    }
  ],
  "packingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "bestTimeToVisit": "Month range",
  "localInsights": "One authentic cultural or practical insight about the destination."
}

Rules:
- Raw JSON only — absolutely nothing before or after
- 3–4 activities per day spread across Morning, Afternoon, Evening
- For Indian destinations: budget in ₹ (Indian Rupees). For international: convert to ₹ equivalent (e.g. "₹85,000 (~$1,000) per person")
- Include specific restaurant names, local dishes, must-see landmarks, hidden gems
- For international trips: include visa tips, currency, local transport info in packingTips
- Make assumptions if details are missing — always produce a complete itinerary`;

function parseItinerary(text: string) {
  // Strip markdown fences if any provider adds them
  const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
  return JSON.parse(cleaned);
}

// ── Provider 1: Groq (llama-3.3-70b) ─────────────────────────────────────────
async function tryGroq(message: string) {
  if (!process.env.GROQ_API_KEY) throw new Error('no_key');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  });
  return parseItinerary(completion.choices[0]?.message?.content ?? '');
}

// ── Provider 2: OpenAI (gpt-4o-mini) ─────────────────────────────────────────
async function tryOpenAI(message: string) {
  if (!process.env.OPENAI_API_KEY) throw new Error('no_key');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`openai_${res.status}: ${err}`);
  }
  const data = await res.json();
  return parseItinerary(data.choices[0]?.message?.content ?? '');
}

// ── Provider 3: Gemini (gemini-2.0-flash) ────────────────────────────────────
async function tryGemini(message: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error('no_key');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser request: ${message}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    const status = data?.error?.status || String(res.status);
    throw new Error(`gemini_${status}: ${data?.error?.message || res.status}`);
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return parseItinerary(text);
}

function isRateLimit(err: unknown) {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return msg.includes('429') || msg.includes('rate_limit') || msg.includes('quota') || msg.includes('resource_exhausted');
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Try each provider in order — skip on rate-limit or missing key, fail fast on others
  const providers = [
    { name: 'Groq', fn: () => tryGroq(message) },
    { name: 'OpenAI', fn: () => tryOpenAI(message) },
    { name: 'Gemini', fn: () => tryGemini(message) },
  ];

  let lastErr: unknown;

  for (const { name, fn } of providers) {
    try {
      const itinerary = await fn();
      console.log(`[trip-planner] Served by ${name}`);
      return NextResponse.json({ itinerary, provider: name });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'no_key') {
        continue; // provider not configured, skip silently
      }
      if (isRateLimit(err)) {
        console.warn(`[trip-planner] ${name} rate-limited, trying next provider`);
        lastErr = err;
        continue; // try next provider
      }
      // Non-rate-limit error — log and try next anyway
      console.error(`[trip-planner] ${name} error:`, msg);
      lastErr = err;
      continue;
    }
  }

  // All providers failed
  console.error('[trip-planner] All providers failed:', lastErr);
  return NextResponse.json({ error: 'All AI providers busy. Please try again in a moment.' }, { status: 503 });
}
