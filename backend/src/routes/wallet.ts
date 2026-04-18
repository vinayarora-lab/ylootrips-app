import { Router, Request, Response } from 'express';
import Wallet from '../models/Wallet';
import { connectDB } from '../lib/mongodb';

const router = Router();

// GET /api/wallet/:email
router.get('/:email', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const email = req.params.email.toLowerCase();
    const wallet = await Wallet.findOne({ email });
    return res.json({ balance: wallet?.balance ?? 0, totalEarned: wallet?.totalEarned ?? 0, transactions: wallet?.transactions ?? [] });
  } catch (err) {
    console.error('[wallet] get error:', err);
    return res.status(500).json({ error: 'Failed to get wallet' });
  }
});

// POST /api/wallet/credit
router.post('/credit', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { email, amount, reason, bookingReference } = req.body;
    if (!email || !amount || amount <= 0) return res.status(400).json({ error: 'email and positive amount required' });

    const wallet = await Wallet.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $inc: { balance: amount, totalEarned: amount },
        $push: { transactions: { type: 'credit', amount, reason: reason || 'Cashback credit', bookingReference, createdAt: new Date() } },
      },
      { upsert: true, new: true }
    );
    return res.json({ success: true, balance: wallet.balance });
  } catch (err) {
    console.error('[wallet] credit error:', err);
    return res.status(500).json({ error: 'Failed to credit wallet' });
  }
});

// POST /api/wallet/debit
router.post('/debit', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { email, amount, reason, bookingReference } = req.body;
    if (!email || !amount || amount <= 0) return res.status(400).json({ error: 'email and positive amount required' });

    const wallet = await Wallet.findOne({ email: email.toLowerCase() });
    if (!wallet || wallet.balance < amount) return res.status(400).json({ error: 'Insufficient wallet balance' });

    wallet.balance -= amount;
    wallet.totalSpent += amount;
    wallet.transactions.push({ type: 'debit', amount, reason: reason || 'Wallet deduction', bookingReference, createdAt: new Date() });
    await wallet.save();

    return res.json({ success: true, balance: wallet.balance });
  } catch (err) {
    console.error('[wallet] debit error:', err);
    return res.status(500).json({ error: 'Failed to debit wallet' });
  }
});

// POST /api/wallet/referral — credit referral reward (₹1,000)
router.post('/referral', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { referrerEmail, referredEmail } = req.body;
    if (!referrerEmail || !referredEmail) return res.status(400).json({ error: 'Both emails required' });

    const REFERRAL_AMOUNT = 1000;
    await Wallet.findOneAndUpdate(
      { email: referrerEmail.toLowerCase() },
      {
        $inc: { balance: REFERRAL_AMOUNT, totalEarned: REFERRAL_AMOUNT },
        $push: { transactions: { type: 'credit', amount: REFERRAL_AMOUNT, reason: `Referral reward — ${referredEmail}`, createdAt: new Date() } },
      },
      { upsert: true }
    );
    return res.json({ success: true, credited: REFERRAL_AMOUNT });
  } catch (err) {
    console.error('[wallet] referral error:', err);
    return res.status(500).json({ error: 'Failed to apply referral' });
  }
});

export default router;
