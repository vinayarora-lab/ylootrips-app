import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import bookingsRouter from './routes/bookings';
import paymentsRouter from './routes/payments';
import walletRouter from './routes/wallet';
import reviewsRouter from './routes/reviews';
import contactRouter from './routes/contact';
import packagesRouter from './routes/packages';

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
const defaultLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
const strictLimiter  = rateLimit({ windowMs: 15 * 60 * 1000, max: 10,  standardHeaders: true, legacyHeaders: false });

app.use('/api/', defaultLimiter);
app.use('/api/contact', strictLimiter);
app.use('/api/bookings', strictLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ylootrips-backend', ts: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/bookings',  bookingsRouter);
app.use('/api/payment',   paymentsRouter);
app.use('/api/wallet',    walletRouter);
app.use('/api/reviews',   reviewsRouter);
app.use('/api/contact',   contactRouter);
app.use('/api/packages',  packagesRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] YlooTrips backend running on port ${PORT}`);
});

export default app;
