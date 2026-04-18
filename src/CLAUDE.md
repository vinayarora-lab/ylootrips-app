# Frontend Agent — CLAUDE.md

## Role
This agent owns the **Next.js 16 App Router frontend**. It handles page routes, layouts, data fetching, SEO metadata, and coordinates with the Components agent for UI.

## Route Map (src/app/)

### Core Pages
| Route | File | Purpose |
|-------|------|---------|
| `/` | `page.tsx` | Homepage — hero, packages, cashback, trending |
| `/about` | `about/page.tsx` | Company story, team, certifications |
| `/contact` | `contact/page.tsx` | Inquiry form → `/api/contact` |
| `/blogs` | `blogs/page.tsx` | Travel blog/journal |
| `/reviews` | `reviews/page.tsx` | Verified traveler reviews |
| `/stories` | `stories/page.tsx` | User travel stories (Google OAuth required) |
| `/search` | `search/page.tsx` | Search packages + market inquiry |
| `/trips` | `trips/page.tsx` | All tour packages listing |
| `/destinations` | `destinations/page.tsx` | Destination explorer |
| `/hidden-spots` | `hidden-spots/page.tsx` | Hidden gems collection |
| `/offbeat` | `offbeat/page.tsx` | Offbeat destinations |
| `/events` | `events/page.tsx` | Travel events |
| `/daycations` | `daycations/page.tsx` | Day-trip packages |

### Booking Flow
| Route | Purpose |
|-------|---------|
| `/checkout` | Main checkout — price calc, promo codes, WanderLoot wallet |
| `/payment` | Payment initiation |
| `/payment/success` | Post-payment success (reads `?ref=`) |
| `/payment/failure` | Payment failure handler |
| `/market/booking-success` | Booking confirmation page |
| `/my-booking` | User's booking history |

### Destination Package Pages (SEO-optimized)
- `/goa-tour-package`
- `/manali-tour-package`
- `/kashmir-tour-package`
- `/kerala-tour-package`
- `/bali-honeymoon-package`
- `/dubai-tour-package-from-delhi`
- `/maldives-luxury-package`
- `/singapore-tour-package`
- `/thailand-budget-trip`
- `/india-travel-guide`

### Features
- `/trip-planner` — AI itinerary generator (Groq→OpenAI→Gemini)
- `/flights` — Flight search (SerpAPI→Amadeus→demo)
- `/hotels` — Hotel search and booking
- `/cashback` — WanderLoot loyalty program
- `/reel-to-trip` — Video-to-trip conversion feature
- `/partnerships` — Partner program
- `/careers` — Jobs page

### Auth & Admin
- `/admin` — Admin dashboard (flight, hotel, trip, market bookings)
- `(auth via Google OAuth — /api/auth/[...nextauth])`

### Legal
- `/privacy-policy`, `/privacy`, `/terms`

## Data Fetching Patterns
- Homepage packages: fetch from `NEXT_PUBLIC_API_URL/packages` or use static fallback data in `src/data/`
- Reviews: `/api/reviews/approved` (MongoDB)
- Stories: `/api/stories` (MongoDB + Cloudinary for images)
- Flights: `/api/flights/search?origin=&destination=&date=&adults=`
- Hotels: `/api/hotels/search`
- Trip plan: POST `/api/trip-planner` with `{ message: string }`

## SEO Rules
- Every destination page MUST have `generateMetadata()` with title, description, openGraph, canonical
- Schema.org structured data via `JsonLd` component
- Robots: index all pages except `/admin/*`, `/api/*`
- Use `robots.ts` and `sitemap.ts` for automated SEO feeds
- Hreflang: en-US, en-GB, en-AU, en-CA, en-IE set in root layout

## Routing Notes
- `proxy.ts` (not middleware) is used in Next.js 16 for request interception
- Suspense boundaries required around any component using `useSearchParams()`
- Root layout wraps: Providers → ActiveUserPing → SecurityShield → ExitIntentPopup → Header → main → Footer → WhatsAppButton → MobileStickyCTA

## Luxury Design Principles
- Background: `bg-[#F5F1EB]` or `bg-cream`
- Headings: `font-playfair` (Playfair Display)
- Body: `font-inter` (Inter)
- CTAs: rich amber/gold — `bg-amber-600 hover:bg-amber-700`
- Cards: `rounded-2xl shadow-lg` with warm hover transitions
- Sections: generous `py-20 md:py-32` padding
- Images: Next.js `<Image>` with Unsplash for destinations
- Animations: subtle `transition-all duration-300` — no jarring movement

## Context Available (from Providers)
```tsx
import { useCurrency } from '@/context/CurrencyContext';   // { currency, setCurrency, convertPrice }
import { useVisitor } from '@/context/VisitorContext';     // { isIndia, country, region }
import { useWallet } from '@/context/WalletContext';       // { balance, addCashback, deductWallet }
```

## Important Files
- `src/app/globals.css` — global styles, CSS variables for design tokens
- `src/app/layout.tsx` — root layout with metadata, fonts, GA4
- `src/app/robots.ts` — robots.txt generation
- `src/app/sitemap.ts` — sitemap.xml generation
- `src/lib/api.ts` — typed fetch wrappers for backend calls
- `src/lib/currency.ts` — INR/USD/GBP/EUR conversion
- `src/lib/promoCodes.ts` — promo code validation (YLOO15, FIRST10, GROUP20)
