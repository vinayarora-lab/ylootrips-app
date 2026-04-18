import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const getResend = () => new Resend(process.env.RESEND_API_KEY ?? "");

// Simple in-memory cooldown — prevent spam (1 alert per IP per 60s)
const cooldown = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    // Cooldown check
    const lastAlert = cooldown.get(ip) || 0;
    if (Date.now() - lastAlert < 60_000) {
      return NextResponse.json({ ok: true }); // silently ignore duplicates
    }
    cooldown.set(ip, Date.now());

    const body = await req.json();
    const { type, page, ua } = body as { type: string; page: string; ua: string };

    const typeLabels: Record<string, string> = {
      devtools: '🔍 DevTools Opened',
      rightclick: '🖱️ Right-Click Attempt',
      keybind: '⌨️ Keyboard Shortcut Hack Attempt',
      copy: '📋 Page Copy Attempt',
      scrape: '🤖 Suspicious Scraping Pattern',
    };

    const label = typeLabels[type] || `⚠️ Unknown Threat: ${type}`;
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    await getResend().emails.send({
      from: 'security@ylootrips.com',
      to: 'hello@ylootrips.com',
      subject: `🚨 Security Alert — ${label}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:auto;background:#0f0f0f;color:#eee;border-radius:12px;overflow:hidden">
          <div style="background:linear-gradient(135deg,#dc2626,#7f1d1d);padding:24px 28px">
            <h1 style="margin:0;font-size:22px;color:#fff">🚨 Security Alert</h1>
            <p style="margin:6px 0 0;color:#fca5a5;font-size:14px">${label}</p>
          </div>
          <div style="padding:24px 28px;space-y:12px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;width:140px">Type</td><td style="padding:10px 0;border-bottom:1px solid #222;font-weight:600;color:#fff">${label}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888">IP Address</td><td style="padding:10px 0;border-bottom:1px solid #222;font-weight:600;color:#f87171">${ip}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888">Page</td><td style="padding:10px 0;border-bottom:1px solid #222;color:#60a5fa">${page}</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888">Time (IST)</td><td style="padding:10px 0;border-bottom:1px solid #222;color:#fff">${now}</td></tr>
              <tr><td style="padding:10px 0;color:#888;vertical-align:top">Browser</td><td style="padding:10px 0;color:#9ca3af;font-size:12px;word-break:break-all">${ua}</td></tr>
            </table>
          </div>
          <div style="padding:16px 28px;background:#1a1a1a;font-size:12px;color:#555;text-align:center">
            YlooTrips Security System · Auto-generated alert
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // always return 200 — don't reveal errors
  }
}
