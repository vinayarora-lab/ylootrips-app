# Backend Agent — CLAUDE.md

## Role
This agent owns the **Node.js/Express backend** that runs on port 8080. It handles all business logic, database operations, booking management, and serves the frontend's `NEXT_PUBLIC_API_URL`.

## Production URL
```
https://trip-backend-65232427280.asia-south1.run.app/api
```
Deployed on Google Cloud Run (asia-south1). Do not change the deployment URL — it is hardcoded in the frontend.

## Local Development
```bash
cd backend
npm install
cp .env.example .env.local   # fill in your values
npm run dev                  # starts on http://localhost:8080
```

## Directory Structure
```
backend/
├── src/
│   ├── index.ts             # Express server entry point
│   ├── routes/
│   │   ├── bookings.ts      # Trip booking CRUD
│   │   ├── payments.ts      # Payment initiation & verification
│   │   ├── flights.ts       # Flight booking storage
│   │   ├── hotels.ts        # Hotel booking storage
│   │   ├── contact.ts       # Contact/inquiry storage
│   │   ├── reviews.ts       # Review submission & approval
│   │   ├── packages.ts      # Package listing & CMS
│   │   ├── wallet.ts        # WanderLoot cashback wallet
│   │   └── admin.ts         # Admin dashboard data
│   ├── models/
│   │   ├── Booking.ts       # Trip booking schema
│   │   ├── FlightBooking.ts # Flight booking schema
│   │   ├── HotelBooking.ts  # Hotel booking schema
│   │   ├── Package.ts       # Tour package schema
│   │   ├── Review.ts        # Customer review schema
│   │   ├── Story.ts         # Travel story schema
│   │   ├── Lead.ts          # CRM lead schema
│   │   └── Wallet.ts        # WanderLoot wallet schema
│   ├── middleware/
│   │   ├── auth.ts          # Admin authentication
│   │   ├── cors.ts          # CORS configuration
│   │   ├── errorHandler.ts  # Global error handler
│   │   └── rateLimit.ts     # Request rate limiting
│   └── lib/
│       ├── mongodb.ts       # MongoDB connection
│       ├── easebuzz.ts      # Easebuzz payment helpers
│       └── email.ts         # Resend email helpers
├── package.json
├── tsconfig.json
└── .env.example
```

## API Endpoints

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |

### Bookings
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/bookings` | Create trip booking |
| GET | `/api/bookings/:ref` | Get booking by reference |
| PATCH | `/api/bookings/:ref/status` | Update booking status |
| GET | `/api/admin/bookings` | All bookings (admin) |

### Payments
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payment/initiate/:ref` | Initiate Easebuzz payment |
| POST | `/api/payment/verify` | Verify payment webhook |
| GET | `/api/payment/status/:txnid` | Check payment status |

### Flights
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/flights/book` | Save flight booking |
| GET | `/api/flights/:id` | Get flight booking |
| GET | `/api/admin/flight-bookings` | All flight bookings (admin) |

### Hotels
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/hotels/search` | Search hotels |
| POST | `/api/hotels/book` | Save hotel booking |
| GET | `/api/admin/hotel-bookings` | All hotel bookings (admin) |

### Packages
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/packages` | List all packages |
| GET | `/api/packages/:slug` | Get package by slug |
| POST | `/api/packages` | Create package (admin) |
| PATCH | `/api/packages/:id` | Update package (admin) |

### Reviews
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reviews` | Submit review |
| GET | `/api/reviews/approved` | Get approved reviews |
| PATCH | `/api/reviews/:id/approve` | Approve review (admin) |

### Wallet (WanderLoot)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wallet/:email` | Get wallet balance |
| POST | `/api/wallet/credit` | Credit cashback |
| POST | `/api/wallet/debit` | Debit from wallet |
| POST | `/api/wallet/referral` | Apply referral reward |

### Contact / CRM
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/contact` | Save contact inquiry |
| GET | `/api/admin/leads` | All leads (admin) |

## Environment Variables
```bash
# Database
MONGODB_URI=mongodb+srv://...

# Payment
EASEBUZZ_KEY=
EASEBUZZ_SALT=
EASEBUZZ_ENV=production

# Email
RESEND_API_KEY=
ADMIN_EMAIL=hello@ylootrips.com

# Auth
ADMIN_SECRET=       # Secret for admin API routes
JWT_SECRET=         # For JWT tokens if needed

# Site
SITE_URL=https://www.ylootrips.com
PORT=8080

# Google
GOOGLE_SERVICE_ACCOUNT_JSON=
```

## Database Models Summary

### Booking
```typescript
{
  bookingReference: string;    // YLO-YYYYMMDD-XXXX
  tripTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: Date;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  txnid: string;
  specialRequests?: string;
  walletDeduction: number;
  promoCode?: string;
  cashbackEarned: number;
  createdAt: Date;
}
```

### Package
```typescript
{
  slug: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;              // base price in INR
  originalPrice?: number;
  images: string[];           // Cloudinary URLs
  highlights: string[];
  itinerary: DayPlan[];
  inclusions: string[];
  exclusions: string[];
  category: 'domestic' | 'international' | 'honeymoon' | 'adventure';
  featured: boolean;
  active: boolean;
  createdAt: Date;
}
```

## Coding Rules

### Route Handler Pattern
```typescript
import { Router, Request, Response } from 'express';
const router = Router();

router.post('/endpoint', async (req: Request, res: Response) => {
  try {
    const { field } = req.body;
    if (!field) return res.status(400).json({ error: 'field is required' });

    const result = await SomeModel.create({ field });
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('[route] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### MongoDB Connection (src/lib/mongodb.ts)
Always use the singleton pattern — one connection per process.

### CORS Policy
Allow origins: `https://www.ylootrips.com`, `https://trip-frontend-six.vercel.app`, `http://localhost:3000`

### Rate Limiting
- Public routes: 100 req/15min per IP
- Contact/booking: 10 req/15min per IP
- Admin routes: 50 req/15min per IP (with auth)

## Deployment (Google Cloud Run)
```bash
# Build Docker image
docker build -t ylootrips-backend .

# Deploy to Cloud Run
gcloud run deploy ylootrips-backend \
  --image ylootrips-backend \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=...,EASEBUZZ_KEY=...
```
