# Components Agent — CLAUDE.md

## Role
This agent owns all **68 shared UI components** in `src/components/`. It builds, maintains, and refactors reusable React components following the YlooTrips luxury design system.

## Design System

### Colors (Tailwind custom classes via globals.css)
| Token | Value | Usage |
|-------|-------|-------|
| `bg-cream` / `#F5F1EB` | Warm cream | Page backgrounds |
| `text-charcoal` / `#1A1A1A` | Near-black | Primary text |
| `bg-amber-600` | Gold amber | Primary CTAs |
| `text-amber-600` | Gold amber | Accent links, icons |
| `bg-stone-100` | Light warm gray | Card backgrounds |

### Typography
- `font-playfair` — Headings, display text, luxury copy
- `font-inter` — Body text, UI labels, buttons

### Spacing & Borders
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-full` for CTAs, `rounded-xl` for secondary
- Shadows: `shadow-md` for cards, `shadow-xl` for modals
- Transitions: `transition-all duration-300 ease-in-out`

## Component Catalog

### Layout & Navigation
| Component | Purpose |
|-----------|---------|
| `Navbar.tsx` | Top navigation with links, currency switcher, auth |
| `Header.tsx` | Full header (wraps Navbar + flash banner) |
| `Footer.tsx` | Site footer with links, contact, trust badges |
| `MobileCategories.tsx` | Bottom nav categories on mobile |
| `MobileStickyCTA.tsx` | Sticky "Book Now" bar on mobile |
| `MobileStickyBookingBar.tsx` | Enhanced mobile booking bar with price |

### Hero & Landing
| Component | Purpose |
|-----------|---------|
| `Hero.tsx` | Homepage hero with search bar, destination tags |
| `PageHero.tsx` | Reusable page hero (title, breadcrumb, bg image) |
| `PaintSplashBg.tsx` | Decorative background element |
| `FlashSaleBanner.tsx` | Top promotional banner strip |
| `LimitedOffersBanner.tsx` | Time-sensitive offer cards |

### Package & Trip Display
| Component | Purpose |
|-----------|---------|
| `TripCard.tsx` | Package card (image, title, price, nights, CTA) |
| `TrendingPackages.tsx` | Horizontal scroll of trending packages |
| `CuratedJourneys.tsx` | Editorial curated trip showcase |
| `PackagePageLayout.tsx` | Shared layout for destination package pages |
| `DestinationCard.tsx` | Compact destination tile |
| `BoutiqueStays.tsx` | Boutique hotel showcase |
| `HiddenSpots.tsx` | Hidden gems display grid |
| `OffbeatLanding.tsx` | Offbeat destinations landing |
| `AdCarousel.tsx` | Promotional carousel/slideshow |

### Booking & Checkout
| Component | Purpose |
|-----------|---------|
| `CheckoutStepper.tsx` | Multi-step checkout progress indicator |
| `HolidayPlanner.tsx` | Quick holiday planning widget |
| `VisitorSelector.tsx` | Guest count picker (adults/children) |
| `VisitorSwitcher.tsx` | Toggle between visitor types |
| `PromoCodeInput.tsx` | Promo code field with validation |
| `PaymentMethods.tsx` | UPI / card / net banking selector |
| `PaymentOptions.tsx` | Full / half / EMI payment mode |
| `WishlistButton.tsx` | Save trip to wishlist |

### Search
| Component | Purpose |
|-----------|---------|
| `FlightSearch.tsx` | Origin/destination/date flight search form |
| `FlightBookingSection.tsx` | Full flight booking section with results |
| `HotelSearch.tsx` | Hotel search form with filters |
| `SearchFilter.tsx` | Package search/filter sidebar |

### AI & Voice
| Component | Purpose |
|-----------|---------|
| `TripPlannerChat.tsx` | AI itinerary chat interface (Groq/OpenAI/Gemini) |
| `TripPlannerPromo.tsx` | Promotional section for AI planner |
| `ReelToTrip.tsx` | Upload video → AI generates trip plan |
| `ReelToTripTeaser.tsx` | Teaser section for Reel to Trip feature |

### Trust & Social Proof
| Component | Purpose |
|-----------|---------|
| `TrustBadges.tsx` | MSME, SSL, PCI-DSS badges |
| `TrustBanner.tsx` | "Why book with us" horizontal banner |
| `TrustHub.tsx` | Full trust section with stats |
| `Testimonials.tsx` | Domestic traveler review carousel |
| `InternationalTestimonials.tsx` | International traveler reviews |
| `GuaranteeSection.tsx` | 4-point guarantee display |
| `WhyChooseUs.tsx` | USP grid (local guides, inspected hotels, etc.) |
| `MediaPress.tsx` | Press mentions / media logos |
| `TrustedHotels.tsx` | Taj, Oberoi, Marriott partner carousel |
| `SocialProofToast.tsx` | "X just booked Y" live notification toast |
| `ActiveUserPing.tsx` | Broadcasts active user presence (WebSocket/poll) |

### Loyalty & Referral
| Component | Purpose |
|-----------|---------|
| `ReferAndEarn.tsx` | Referral program section (₹1,000 per referral) |
| `PlanningHub.tsx` | WanderLoot wallet + cashback overview |

### Content & Stories
| Component | Purpose |
|-----------|---------|
| `StoryFeed.tsx` | Traveler story feed (Google OAuth gated) |
| `StoryDetail.tsx` | Individual story view |
| `TravelStoryCard.tsx` | Story card thumbnail |
| `WriteStory.tsx` | Story editor with Tiptap + Cloudinary images |
| `WriteStoryLoader.tsx` | Loading skeleton for story editor |
| `InlineImageUploader.tsx` | Drag-and-drop image upload to Cloudinary |
| `ImagePreview.tsx` | Image preview with remove button |
| `EditableList.tsx` | Reusable editable list component |

### Services & Info
| Component | Purpose |
|-----------|---------|
| `Services.tsx` | 4-column services overview (Tours, Flights, Hotels, Planner) |
| `HowItWorks.tsx` | 3-step booking process explainer |

### Utility & Overlays
| Component | Purpose |
|-----------|---------|
| `WhatsAppButton.tsx` | Floating WhatsApp CTA button |
| `CallbackWidget.tsx` | "Request a callback" floating widget |
| `ExitIntentPopup.tsx` | Exit-intent discount popup |
| `SecurityShield.tsx` | Anti-scraping / security monitor |
| `EmptyStateCustomPlan.tsx` | Empty state for custom plan request |
| `Providers.tsx` | Wraps all React context providers |
| `JsonLd.tsx` | Schema.org JSON-LD structured data |
| `AdminLoginModal.tsx` | Admin authentication modal |

## Component Rules
1. All components are `'use client'` if they use hooks, event handlers, or browser APIs
2. Server Components where possible (no interactivity, just display)
3. Props typed with TypeScript interfaces — no `any`
4. Use `next/image` for ALL images — never `<img>` tags
5. Use `lucide-react` for icons — consistent icon library
6. Mobile-first: default classes for mobile, `md:` prefix for desktop
7. Never hardcode phone numbers or emails — use constants from `src/lib/utils.ts`
8. Loading states via `skeleton` classes or Suspense boundaries

## Key Constants
```tsx
// From src/lib/utils.ts
export const WHATSAPP_NUMBER = '918427831127';
export const CONTACT_EMAIL = 'hello@ylootrips.com';
export const SITE_URL = 'https://www.ylootrips.com';
```

## Promo Codes (from src/lib/promoCodes.ts)
- `YLOO15` — 15% off
- `FIRST10` — 10% off first booking
- `GROUP20` — 20% off group bookings (4+ people)
- WanderLoot wallet: max 10% deduction per booking

## Adding a New Component
```tsx
// Template: src/components/MyComponent.tsx
'use client'; // only if needed

import { type FC } from 'react';

interface MyComponentProps {
  title: string;
  // ...
}

const MyComponent: FC<MyComponentProps> = ({ title }) => {
  return (
    <section className="py-20 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-playfair text-4xl text-charcoal">{title}</h2>
      </div>
    </section>
  );
};

export default MyComponent;
```
