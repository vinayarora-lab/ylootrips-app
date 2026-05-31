import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Require admin secret — this endpoint reveals which services are configured
  const adminSecret = process.env.ADMIN_SECRET;
  const token = req.headers.get('x-admin-secret') || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!adminSecret || token !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keys = [
    'RESEND_API_KEY', 'GROQ_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY',
    'SERPAPI_KEY', 'AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET',
    'EASEBUZZ_KEY', 'EASEBUZZ_SALT', 'ADMIN_SECRET', 'CRON_SECRET',
    'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN',
    'NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SITE_URL',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN',
    'EMAIL_FROM', 'ADMIN_EMAIL', 'GCS_CREDENTIALS', 'GCS_BUCKET',
  ];
  const result: Record<string, unknown> = {};
  for (const k of keys) result[k] = !!process.env[k];
  const gcsCreds = process.env.GCS_CREDENTIALS || '';
  result['GCS_CREDENTIALS_len'] = gcsCreds.length;
  result['GCS_CREDENTIALS_first10'] = gcsCreds.slice(0, 10);
  return NextResponse.json({ env: result, nodeEnv: process.env.NODE_ENV });
}
