# YlooTrips — Master Project CLAUDE.md

## What This Project Is
YlooTrips is a **luxury India travel booking platform** at https://www.ylootrips.com. It serves international travelers (USA, UK, Australia, Europe) with curated India tour packages, AI-powered itinerary planning, flight & hotel search, and a cashback loyalty program (WanderLoot).

## Monorepo Structure
```
ylootrips-app/
├── src/                    # Next.js 16 frontend (App Router, React 19, TS)
│   ├── app/                # 40 routes — see src/CLAUDE.md
│   ├── components/         # 68 shared components — see src/components/CLAUDE.md
│   ├── lib/                # Shared utilities (mongodb, leads, currency, etc.)
│   ├── context/            # React contexts (Currency, Visitor, Wallet)
│   ├── models/             # Mongoose models (Review, Story)
│   └── types/              # TypeScript types
├── backend/                # Node.js/Express API on port 8080 — see backend/CLAUDE.md
├── public/                 # Static assets
└── scripts/                # Build/maintenance scripts
```

## Tech Stack

### Frontend (Next.js 16)
- **Framework**: Next.js 16.0.8 + React 19.2.1 + TypeScript 5
- **Styling**: Tailwind CSS 4 — cream/beige design system (#F5F1EB base)
- **Fonts**: Inter (body) + Playfair Display (headings)
- **Auth**: NextAuth v4 with Google OAuth
- **State**: React Context (CurrencyContext, VisitorContext, WalletContext)
- **Rich text**: Tiptap editor
- **Voice**: VAPI AI web SDK

### Backend (Express on port 8080)
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB via Mongoose
- **Deployed on**: Google Cloud Run (`trip-backend-65232427280.asia-south1.run.app`)

## All API Integrations

| Service | Purpose | Env Var(s) |
|---------|---------|------------|
| **Easebuzz** | Payment gateway (UPI, cards, EMI) | `EASEBUZZ_KEY`, `EASEBUZZ_SALT`, `EASEBUZZ_ENV` |
| **Groq** (llama-3.3-70b) | AI trip planner — primary | `GROQ_API_KEY` |
| **OpenAI** (gpt-4o-mini) | AI trip planner — fallback 1 | `OPENAI_API_KEY` |
| **Gemini** (gemini-2.0-flash) | AI trip planner — fallback 2 | `GEMINI_API_KEY` |
| **Anthropic Claude** | Advanced AI features | `ANTHROPIC_API_KEY` |
| **VAPI** | Voice AI assistant | `VAPI_API_KEY` |
| **SerpAPI** | Live Google Flights data | `SERPAPI_KEY` |
| **Amadeus** | Flight search fallback | `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`, `AMADEUS_ENV` |
| **Google OAuth** | User authentication | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| **Google Sheets** | Lead/CRM logging | `GOOGLE_SERVICE_ACCOUNT_JSON` |
| **Resend** | Transactional email | `RESEND_API_KEY` |
| **Cloudinary** | Image/video uploads | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| **MongoDB** | Primary database | `MONGODB_URI` |
| **Google Analytics 4** | Analytics (GA-D70RVF66E1) | Hard-coded in layout.tsx |
| **IndexNow** | SEO ping on new content | `INDEXNOW_KEY` |

## Environment Variables (root .env.local)
```bash
# Site
NEXT_PUBLIC_SITE_URL=https://www.ylootrips.com
NEXT_PUBLIC_API_URL=https://trip-backend-65232427280.asia-south1.run.app/api

# Auth
NEXTAUTH_URL=https://www.ylootrips.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Payment
EASEBUZZ_KEY=
EASEBUZZ_SALT=
EASEBUZZ_ENV=production

# AI — cascade order: Groq → OpenAI → Gemini
GROQ_API_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
VAPI_API_KEY=

# Flights
SERPAPI_KEY=
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
AMADEUS_ENV=production

# Email
RESEND_API_KEY=
ADMIN_EMAIL=hello@ylootrips.com

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Database
MONGODB_URI=

# Google
GOOGLE_SERVICE_ACCOUNT_JSON=
```

## Key Design Rules
- **Brand color**: `#F5F1EB` (cream/beige) — always force light mode, never dark mode
- **Typography**: Playfair Display for headings (`font-playfair`), Inter for body (`font-inter`)
- **Luxury feel**: Subtle gold accents, generous whitespace, high-quality imagery from Unsplash
- **Phone**: +91-8427831127 (WhatsApp)
- **Email**: hello@ylootrips.com

## Payment Flow (Easebuzz)
1. POST `/api/payment/initiate-partial` → Easebuzz hash → redirect to payment URL
2. On success → `/payment/success?ref=<bookingRef>`
3. On failure → `/payment/failure?ref=<bookingRef>`
4. WanderLoot wallet deducts max 10% of booking value

## AI Trip Planner Cascade
`/api/trip-planner` tries providers in order: Groq → OpenAI → Gemini → proxy fallback.
Returns structured JSON itinerary (days, activities, budget, packing tips).

## Flight Search Cascade
`/api/flights/search` tries: SerpAPI → Amadeus → demo data fallback.

## Lead Tracking
Every inquiry/booking logs to Google Sheets (Sheet ID: `1GkBPp4YNjZYeTRRZN0ugVTZUNTaVAH2Mmfti9jr1PmE`, tab: `Leads`).
Ticket format: `YLO-YYYYMMDD-XXXX`.

## Agents in This Project
| Agent | CLAUDE.md | Responsibility |
|-------|-----------|----------------|
| Frontend | `src/CLAUDE.md` | Pages, routing, luxury UI |
| Components | `src/components/CLAUDE.md` | Shared UI components |
| API Routes | `src/app/api/CLAUDE.md` | Next.js API route handlers |
| Backend | `backend/CLAUDE.md` | Express server, DB models, business logic |

## Commands
```bash
# Frontend
npm run dev          # Start Next.js on port 3000
npm run build        # Production build
npm run lint         # ESLint

# Backend
cd backend
npm run dev          # Start Express on port 8080
npm run build        # Compile TypeScript
npm start            # Run compiled server
```

## Do Not Change
- Google Analytics ID: `G-D70RVF66E1`
- Google Sheets ID: `1GkBPp4YNjZYeTRRZN0ugVTZUNTaVAH2Mmfti9jr1PmE`
- External backend URL: `trip-backend-65232427280.asia-south1.run.app` (deployed, do not redeploy)
- Payment success/failure URL patterns — Easebuzz webhooks depend on them
