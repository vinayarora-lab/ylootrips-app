import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { to, booking } = body;

    if (!to || !booking) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isEvent = !!booking.event;
    const title = isEvent ? booking.event?.title : booking.trip?.title;
    const destination = isEvent ? booking.event?.location : booking.trip?.destination;
    const travelDate = booking.travelDate || booking.eventDate
      ? new Date(booking.travelDate || booking.eventDate).toLocaleDateString('en-IN', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        })
      : null;
    const amount = booking.finalAmount || booking.totalAmount;
    const formattedAmount = amount
      ? `₹${Number(amount).toLocaleString('en-IN')}`
      : 'See details';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmed — YlooTrips</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EA;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1714;padding:36px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:bold;color:#F4F1EA;letter-spacing:-1px;">LocalHi.</p>
              <p style="margin:6px 0 0;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;">by YlooTrips</p>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td style="background:#c8a97e;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#1a1714;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">✓ Booking Confirmed</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;padding:48px 40px;">
              <p style="margin:0 0 8px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;">Dear Traveler,</p>
              <h1 style="margin:0 0 24px;font-size:28px;color:#1a1714;font-weight:normal;line-height:1.3;">
                Your ${isEvent ? 'event' : 'trip'} is confirmed!
              </h1>
              <p style="margin:0 0 32px;font-size:16px;color:#555;line-height:1.7;font-family:Arial,sans-serif;">
                Thank you for booking with YlooTrips. We're thrilled to be part of your journey. Below are your booking details — please save this email for your records.
              </p>

              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;border-left:4px solid #c8a97e;margin-bottom:32px;">
                <tr>
                  <td style="padding:28px 24px;">
                    <p style="margin:0 0 20px;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">Booking Summary</p>

                    ${booking.bookingReference ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">Reference</td>
                        <td align="right" style="font-size:13px;font-weight:bold;color:#1a1714;font-family:Arial,sans-serif;">${booking.bookingReference}</td>
                      </tr>
                    </table>` : ''}

                    ${title ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">${isEvent ? 'Event' : 'Trip'}</td>
                        <td align="right" style="font-size:13px;color:#1a1714;font-family:Arial,sans-serif;">${title}</td>
                      </tr>
                    </table>` : ''}

                    ${destination ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">Destination</td>
                        <td align="right" style="font-size:13px;color:#1a1714;font-family:Arial,sans-serif;">${destination}</td>
                      </tr>
                    </table>` : ''}

                    ${travelDate ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">${isEvent ? 'Event Date' : 'Travel Date'}</td>
                        <td align="right" style="font-size:13px;color:#1a1714;font-family:Arial,sans-serif;">${travelDate}</td>
                      </tr>
                    </table>` : ''}

                    ${booking.numberOfGuests ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">Guests</td>
                        <td align="right" style="font-size:13px;color:#1a1714;font-family:Arial,sans-serif;">${booking.numberOfGuests}</td>
                      </tr>
                    </table>` : ''}

                    ${booking.numberOfTickets ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="font-size:13px;color:#888;font-family:Arial,sans-serif;">Tickets</td>
                        <td align="right" style="font-size:13px;color:#1a1714;font-family:Arial,sans-serif;">${booking.numberOfTickets}</td>
                      </tr>
                    </table>` : ''}

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ddd;padding-top:16px;margin-top:8px;">
                      <tr>
                        <td style="font-size:15px;color:#1a1714;font-family:Arial,sans-serif;font-weight:bold;">Amount Paid</td>
                        <td align="right" style="font-size:20px;color:#1a1714;font-family:Georgia,serif;font-weight:bold;">${formattedAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What's Next -->
              <p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#1a1714;">What happens next?</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ['1', 'Our team will review your booking and reach out within 1 hour to confirm all details.'],
                  ['2', 'You\'ll receive a detailed day-by-day itinerary and hotel confirmations.'],
                  ['3', 'We\'ll be available on WhatsApp throughout your trip for any support.'],
                ].map(([num, text]) => `
                <tr>
                  <td width="32" style="padding-bottom:12px;vertical-align:top;">
                    <span style="display:inline-block;width:24px;height:24px;background:#c8a97e;color:#1a1714;font-size:11px;font-weight:bold;text-align:center;line-height:24px;font-family:Arial,sans-serif;">${num}</span>
                  </td>
                  <td style="padding-bottom:12px;font-size:14px;color:#555;line-height:1.6;font-family:Arial,sans-serif;">${text}</td>
                </tr>`).join('')}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center" style="padding:8px 0;">
                    <a href="https://wa.me/918427831127?text=Hi!%20I%20just%20booked%20${booking.bookingReference ? booking.bookingReference : 'a%20trip'}%20and%20want%20to%20confirm%20details."
                       style="display:inline-block;background:#1a1714;color:#F4F1EA;text-decoration:none;padding:14px 36px;font-size:12px;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">
                      WhatsApp Our Team
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#888;line-height:1.7;font-family:Arial,sans-serif;">
                Questions? Reply to this email or WhatsApp us at <strong style="color:#1a1714;">+91 84278 31127</strong> — we respond within 1 hour.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1714;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">YlooTrips · LocalHi</p>
              <p style="margin:0;font-size:12px;color:#666;font-family:Arial,sans-serif;">
                <a href="https://www.ylootrips.com" style="color:#c8a97e;text-decoration:none;">www.ylootrips.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: `✓ Booking Confirmed — ${title || 'Your Trip'} | YlooTrips`,
      html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Also notify admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && adminEmail !== to) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: [adminEmail],
          subject: `🔔 New Booking: ${title || 'Trip'} — ${booking.bookingReference || ''} | YlooTrips`,
          html,
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
