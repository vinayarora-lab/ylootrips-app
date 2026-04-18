import { Request, Response, NextFunction } from 'express';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (!ADMIN_SECRET) {
    res.status(503).json({ error: 'Admin auth not configured' });
    return;
  }
  if (!secret || secret !== ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}
