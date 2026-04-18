import cors from 'cors';

const ALLOWED_ORIGINS = [
  'https://www.ylootrips.com',
  'https://ylootrips.com',
  'https://trip-frontend-six.vercel.app',
  'https://trip-frontend-ecru.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret'],
});
