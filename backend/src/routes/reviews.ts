import { Router, Request, Response } from 'express';
import Review from '../models/Review';
import { connectDB } from '../lib/mongodb';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/reviews/approved
router.get('/approved', async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(50);
    return res.json(reviews);
  } catch (err) {
    console.error('[reviews] get error:', err);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews — submit a review (pending approval)
router.post('/', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { name, email, country, destination, rating, title, body, bookingReference } = req.body;
    if (!name || !email || !destination || !rating || !title || !body) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const review = await Review.create({ name, email, country: country || 'India', destination, rating, title, body, bookingReference });
    return res.status(201).json({ success: true, message: 'Review submitted — pending approval', id: review._id });
  } catch (err) {
    console.error('[reviews] submit error:', err);
    return res.status(500).json({ error: 'Failed to submit review' });
  }
});

// PATCH /api/reviews/:id/approve (admin)
router.patch('/:id/approve', requireAdmin, async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { featured } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { approved: true, featured: featured ?? false } },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: 'Review not found' });
    return res.json({ success: true, review });
  } catch (err) {
    console.error('[reviews] approve error:', err);
    return res.status(500).json({ error: 'Failed to approve review' });
  }
});

// GET /api/reviews/admin/all (admin)
router.get('/admin/all', requireAdmin, async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;
