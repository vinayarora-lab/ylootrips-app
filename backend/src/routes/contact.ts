import { Router, Request, Response } from 'express';
import { connectDB } from '../lib/mongodb';
import { sendEmail } from '../lib/email';
import mongoose, { Schema } from 'mongoose';

const router = Router();

// Inline Lead model (simple — full CRM is in Google Sheets)
const LeadSchema = new Schema({
  ticket:      { type: String, required: true },
  type:        { type: String, default: 'Contact Form' },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, default: '' },
  destination: { type: String, default: '' },
  message:     { type: String, default: '' },
  status:      { type: String, default: 'New' },
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@ylootrips.com';

// POST /api/contact — save contact inquiry
router.post('/', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { name, email, phone, destination, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const ticket = `YLO-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;

    await Lead.create({ ticket, name, email, phone: phone || '', destination: destination || '', message: message || '' });

    // Notify admin
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[${ticket}] New Inquiry: ${destination || 'General'} — ${name}`,
      text: `Ticket: ${ticket}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nDestination: ${destination || 'N/A'}\n\n${message || ''}`,
    }).catch(console.error);

    return res.json({ success: true, ticket });
  } catch (err) {
    console.error('[contact] error:', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  }
});

export default router;
