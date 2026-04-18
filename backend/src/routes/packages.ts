import { Router, Request, Response } from 'express';
import Package from '../models/Package';
import { connectDB } from '../lib/mongodb';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// GET /api/packages — list active packages
router.get('/', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { category, featured, limit = '20' } = req.query;
    const filter: Record<string, unknown> = { active: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const packages = await Package.find(filter)
      .select('-itinerary') // exclude heavy itinerary from list view
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(String(limit)));

    return res.json(packages);
  } catch (err) {
    console.error('[packages] list error:', err);
    return res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// GET /api/packages/:slug — single package with full itinerary
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const pkg = await Package.findOne({ slug: req.params.slug, active: true });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    return res.json(pkg);
  } catch (err) {
    console.error('[packages] get error:', err);
    return res.status(500).json({ error: 'Failed to fetch package' });
  }
});

// POST /api/packages — create package (admin)
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    await connectDB();
    const pkg = await Package.create(req.body);
    return res.status(201).json({ success: true, package: pkg });
  } catch (err) {
    console.error('[packages] create error:', err);
    return res.status(500).json({ error: 'Failed to create package' });
  }
});

// PATCH /api/packages/:id — update package (admin)
router.patch('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    await connectDB();
    const pkg = await Package.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    return res.json({ success: true, package: pkg });
  } catch (err) {
    console.error('[packages] update error:', err);
    return res.status(500).json({ error: 'Failed to update package' });
  }
});

export default router;
