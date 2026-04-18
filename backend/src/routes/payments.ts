import { Router, Request, Response } from 'express';
import Booking from '../models/Booking';
import Wallet from '../models/Wallet';
import { connectDB } from '../lib/mongodb';
import { initiatePayment, verifyWebhookHash, EASEBUZZ_BASE } from '../lib/easebuzz';
import { sendBookingConfirmation } from '../lib/email';

const router = Router();
const SITE_URL = process.env.SITE_URL || 'https://www.ylootrips.com';

// POST /api/payment/initiate/:ref — initiate Easebuzz payment for a booking
router.post('/initiate/:ref', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const booking = await Booking.findOne({ bookingReference: req.params.ref });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const { amount: overrideAmount } = req.body;
    const chargeNow = overrideAmount ?? (booking.totalAmount - booking.paidAmount);
    if (chargeNow <= 0) return res.status(400).json({ error: 'No outstanding balance' });

    const txnid = `TRP-${booking.bookingReference}-${Date.now()}`;
    const phone = booking.customerPhone.replace(/\D/g, '').slice(-10).padStart(10, '0');

    const { paymentUrl } = await initiatePayment({
      txnid,
      amount: Number(chargeNow).toFixed(2),
      productinfo: `${booking.tripTitle.substring(0, 100)} (Advance)`,
      firstname: booking.customerName.split(' ')[0],
      email: booking.customerEmail,
      phone,
      udf1: booking.bookingReference,
      udf2: String(booking.totalAmount),
      surl: `${SITE_URL}/payment/success?ref=${booking.bookingReference}`,
      furl: `${SITE_URL}/payment/failure?ref=${booking.bookingReference}`,
    });

    await Booking.findOneAndUpdate(
      { bookingReference: booking.bookingReference },
      { $set: { txnid } }
    );

    return res.json({ paymentUrl, txnid, chargeNow, totalAmount: booking.totalAmount });
  } catch (err) {
    console.error('[payments] initiate error:', err);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// POST /api/payment/verify — Easebuzz success webhook
router.post('/verify', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { txnid, amount, productinfo, firstname, email, status, udf1, udf2, hash } = req.body;

    // Verify hash
    const isValid = verifyWebhookHash(hash, { txnid, amount, productinfo, firstname, email, status, udf1, udf2 });
    if (!isValid) {
      console.warn('[payments] invalid webhook hash for txnid:', txnid);
      return res.status(400).json({ error: 'Invalid hash' });
    }

    const bookingRef = udf1;
    const booking = await Booking.findOne({ bookingReference: bookingRef });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (status === 'success') {
      const paidNow = parseFloat(amount);
      const newPaid = booking.paidAmount + paidNow;
      const paymentStatus = newPaid >= booking.totalAmount ? 'paid' : 'partial';

      await Booking.findOneAndUpdate(
        { bookingReference: bookingRef },
        {
          $set: {
            paidAmount: newPaid,
            paymentStatus,
            txnid,
            status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
          },
        }
      );

      // Credit WanderLoot cashback (10% of paid amount)
      const cashback = Math.round(paidNow * 0.1);
      if (cashback > 0) {
        await Wallet.findOneAndUpdate(
          { email: booking.customerEmail },
          {
            $inc: { balance: cashback, totalEarned: cashback },
            $push: {
              transactions: {
                type: 'credit',
                amount: cashback,
                reason: `WanderLoot cashback — ${bookingRef}`,
                bookingReference: bookingRef,
                createdAt: new Date(),
              },
            },
          },
          { upsert: true, new: true }
        );
      }

      // Send confirmation email
      sendBookingConfirmation({
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        bookingReference: bookingRef,
        tripTitle: booking.tripTitle,
        travelDate: booking.travelDate.toISOString().slice(0, 10),
        guests: booking.guests,
        totalAmount: booking.totalAmount,
        paidAmount: newPaid,
      }).catch(console.error);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[payments] verify error:', err);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// GET /api/payment/status/:txnid — check payment status
router.get('/status/:txnid', async (req: Request, res: Response) => {
  try {
    const KEY = process.env.EASEBUZZ_KEY;
    if (!KEY) return res.status(503).json({ error: 'Payment not configured' });

    const res2 = await fetch(`${EASEBUZZ_BASE}/transaction/v2/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key: KEY, txnid: req.params.txnid }),
    });
    const data = await res2.json();
    return res.json(data);
  } catch (err) {
    console.error('[payments] status error:', err);
    return res.status(500).json({ error: 'Failed to get payment status' });
  }
});

export default router;
