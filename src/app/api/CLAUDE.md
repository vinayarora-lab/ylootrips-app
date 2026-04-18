# API Routes Agent — CLAUDE.md

## Role
This agent owns all **Next.js Route Handlers** in `src/app/api/`. It handles request validation, API key management, provider cascades, and forwards complex business logic to the Express backend.

## Route Inventory

### Payment (`/api/payment/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/payment/initiate-partial` | POST | Initiate Easebuzz payment (partial or full) |
| `/api/payment/success` | POST | Easebuzz success webhook — update booking status |
| `/api/payment/failure` | POST | Easebuzz failure webhook — log failed attempt |

**Easebuzz hash formula** (CRITICAL — do not change):
```
sha512(KEY|txnid|amount|productinfo|firstname|email|udf1|udf2|...|udf5||||||SALT)
```
- `surl`: `${SITE_URL}/payment/success?ref=${bookingRef}`
- `furl`: `${SITE_URL}/payment/failure?ref=${bookingRef}`
- Production URL: `https://pay.easebuzz.in/payment/initiateLink`
- Test URL: `https://testpay.easebuzz.in/payment/initiateLink`

### AI Trip Planner (`/api/trip-planner`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/trip-planner` | POST | Generate AI itinerary — cascade: Groq → OpenAI → Gemini → proxy |

**Provider cascade** (never change the order):
1. Groq (`llama-3.3-70b-versatile`) — fastest, free tier
2. OpenAI (`gpt-4o-mini`) — reliable fallback
3. Gemini (`gemini-2.0-flash`) — Google fallback
4. Proxy to `trip-frontend-ecru.vercel.app` — last resort

Response shape: `{ itinerary: ItineraryJSON, provider: string }`

### Flights (`/api/flights/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/flights/search` | GET | Search flights: SerpAPI → Amadeus → demo data |
| `/api/flights/initiate-payment` | POST | Initiate Easebuzz payment for flight booking |
| `/api/flights/send-confirmation` | POST | Send flight booking confirmation email via Resend |

**Query params for flight search**: `origin`, `destination`, `date` (YYYY-MM-DD), `adults`
**Cache**: `Cache-Control: public, s-maxage=900, stale-while-revalidate=1800`

### Hotels (`/api/hotels/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/hotels/search` | GET | Search hotels (forwards to backend) |
| `/api/hotels/book` | POST | Create hotel booking → backend → Resend confirmation |

### Auth (`/api/auth/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth v4 — Google OAuth provider |

Google OAuth redirects to `/stories` on sign-in.
Required env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

### Market / Packages (`/api/market/` + `/api/search/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/market/book` | POST | Book a marketplace package → backend |
| `/api/search/market-packages` | GET | Search/list market packages |
| `/api/search/market-inquiry` | POST | Submit package inquiry |

### Reviews (`/api/reviews/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/reviews/approved` | GET | Fetch approved reviews from MongoDB |
| `/api/reviews/submit` | POST | Submit new review → pending approval |

MongoDB model: `src/models/Review.ts`

### Contact (`/api/contact`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/contact` | POST | Contact form → Resend emails + Google Sheets + backend |

Flow: validate → generate ticket (YLO-YYYYMMDD-XXXX) → email admin + customer → log to Sheets → forward to backend.

### Admin (`/api/admin/`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/trip-bookings` | GET | All trip bookings (admin only) |
| `/api/admin/flight-bookings` | GET | All flight bookings |
| `/api/admin/hotel-bookings` | GET | All hotel bookings |
| `/api/admin/market-bookings` | GET | All marketplace bookings |
| `/api/admin/reviews` | GET/PATCH | Manage reviews (approve/reject) |
| `/api/admin/active-users` | GET | Live active user count |
| `/api/admin/env-check` | GET | Verify all env vars are set |
| `/api/admin/health` | GET | Backend health check |

Admin routes must validate an `ADMIN_SECRET` header or session token.

### Other
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/reel-to-trip` | POST | Process video URL → AI trip plan |
| `/api/send-confirmation` | POST | Send booking confirmation email |
| `/api/security/alert` | POST | Log security events (scraping detection) |
| `/api/indexnow` | POST | Ping IndexNow for SEO on new content |

## Coding Rules for API Routes

### Standard Route Handler Pattern
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate inputs
    if (!body.required_field) {
      return NextResponse.json({ error: 'required_field is required' }, { status: 400 });
    }

    // 2. Business logic
    const result = await doSomething(body);

    // 3. Return response
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('[route-name] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Environment Variable Access
```typescript
const KEY = process.env.API_KEY || '';
if (!KEY) {
  // Either skip gracefully or return 503
  return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
}
```

### Backend Forwarding Pattern
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

const res = await fetch(`${BACKEND_URL}/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

if (!res.ok) {
  const text = await res.text().catch(() => '');
  console.error('[route] backend error:', res.status, text);
  return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
}

const data = await res.json();
return NextResponse.json(data);
```

### Google Sheets Lead Logging
```typescript
import { logLeadToSheet, generateTicket } from '@/lib/leads';

const ticket = generateTicket(); // YLO-20260418-4821
await logLeadToSheet({
  ticket,
  type: 'Contact Form', // | 'Hotel Booking' | 'Flight Booking' | etc.
  name, email, phone, destination,
  packageName: 'Package Name',
  price: '₹45,000',
  guests: '2',
  notes: 'Additional notes',
});
```

### Resend Email Sending
```typescript
const RESEND_API_KEY = process.env.RESEND_API_KEY;

await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${RESEND_API_KEY}`,
  },
  body: JSON.stringify({
    from: 'YlooTrips <onboarding@resend.dev>',
    to: [recipientEmail],
    subject: 'Subject here',
    text: 'Plain text body',
    // html: '<p>HTML body</p>', // optional
  }),
});
```

## Security Rules
- Never log full credit card numbers, API keys, or passwords
- Validate all input before processing — never trust client data
- Admin routes: check session or `ADMIN_SECRET` header
- Payment hash: always compute server-side, never expose EASEBUZZ_SALT to client
- Security alerts go to `/api/security/alert` for monitoring
