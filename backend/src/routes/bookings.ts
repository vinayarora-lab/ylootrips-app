import { Router, Request, Response } from 'express';
import Booking from '../models/Booking';
import { connectDB } from '../lib/mongodb';
import { sendBookingConfirmation } from '../lib/email';
import { requireAdmin } from '../middleware/auth';

const router = Router();

function generateRef(): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `YLO-${ymd}-${rand}`;
}

// POST /api/bookings — create a new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const {
      tripTitle, destination, customerName, customerEmail, customerPhone,
      travelDate, guests, totalAmount, paidAmount = 0,
      walletDeduction = 0, cashbackEarned = 0,
      promoCode, promoDiscount = 0, specialRequests,
    } = req.body;

    if (!tripTitle || !customerName || !customerEmail || !customerPhone || !travelDate || !guests || !totalAmount) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const bookingReference = generateRef();
    const paymentStatus = paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid';
    const status = paymentStatus === 'paid' ? 'confirmed' : 'pending';

    const booking = await Booking.create({
      bookingReference, tripTitle, destination: destination || '',
      customerName, customerEmail, customerPhone,
      travelDate: new Date(travelDate), guests,
      totalAmount, paidAmount, walletDeduction, cashbackEarned,
      promoCode, promoDiscount, specialRequests,
      status, paymentStatus,
    });

    // Send confirmation email (non-fatal)
    if (paidAmount > 0) {
      sendBookingConfirmation({
        customerName, customerEmail, bookingReference,
        tripTitle, travelDate, guests, totalAmount, paidAmount,
      }).catch(console.error);
    }

    return res.status(201).json({ success: true, bookingReference, booking });
  } catch (err) {
    console.error('[bookings] create error:', err);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings/:ref — get booking by reference
router.get('/:ref', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const booking = await Booking.findOne({ bookingReference: req.params.ref });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json(booking);
  } catch (err) {
    console.error('[bookings] get error:', err);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:ref/status — update payment/booking status
router.patch('/:ref/status', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { status, paymentStatus, txnid, paymentMethod, paidAmount } = req.body;
    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (txnid) update.txnid = txnid;
    if (paymentMethod) update.paymentMethod = paymentMethod;
    if (paidAmount !== undefined) update.paidAmount = paidAmount;

    const booking = await Booking.findOneAndUpdate(
      { bookingReference: req.params.ref },
      { $set: update },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ success: true, booking });
  } catch (err) {
    console.error('[bookings] update error:', err);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
});

// GET /api/admin/bookings — all trip bookings (admin only)
router.get('/admin/all', requireAdmin, async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(500);
    return res.json(bookings);
  } catch (err) {
    console.error('[bookings] admin list error:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
