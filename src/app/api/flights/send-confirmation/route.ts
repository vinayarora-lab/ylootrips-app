import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }

interface FlightBooking {
    txnid: string;
    createdAt?: string;
    status?: string;
    flight: {
        airline: string; flightNum: string; from: string; to: string;
        dep: string; arr: string; date: string; dur: string; stops: number; price: number;
    };
    passengers: Array<{
        title: string; firstName: string; lastName: string;
        dob: string; gender: string; nationality: string;
        passportNo?: string; passportExpiry?: string;
    }>;
    contact: { email: string; phone: string };
    gst?: { gstin: string; company: string } | null;
}

function buildEmailHtml(booking: FlightBooking, isAdmin: boolean) {
    const { flight, passengers, contact, txnid } = booking;
    const lead = passengers[0];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Flight Booking ${isAdmin ? 'Notification' : 'Confirmation'} — YlooTrips</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a1714;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:26px;font-weight:bold;color:#f4f1ea;">YlooTrips</p>
            <p style="margin:6px 0 0;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;">Flight Booking ${isAdmin ? 'Notification' : 'Confirmation'}</p>
          </td>
        </tr>

        <!-- Status Banner -->
        <tr>
          <td style="background:${isAdmin ? '#1d4ed8' : '#16a34a'};padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#ffffff;text-transform:uppercase;letter-spacing:3px;font-weight:bold;">
              ${isAdmin ? '🔔 New Flight Booking — Action Required' : '✅ Booking Confirmed — E-Ticket Incoming'}
            </p>
          </td>
        </tr>

        <!-- Main -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="margin:0 0 24px;font-size:16px;color:#555;line-height:1.7;">
              ${isAdmin
                ? `A new flight booking has been received. Please arrange the flight ticket and share with the customer.`
                : `Dear ${lead.title} ${lead.firstName},<br/>Your flight booking is confirmed! We will send your e-ticket within 30 minutes.`
              }
            </p>

            <!-- Booking Reference -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;border-left:4px solid #c8a97e;margin-bottom:28px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;">Booking Reference</p>
                <p style="margin:0;font-size:22px;font-weight:bold;color:#1a1714;letter-spacing:1px;">${txnid}</p>
              </td></tr>
            </table>

            <!-- Flight Details -->
            <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#1a1714;text-transform:uppercase;letter-spacing:1px;">Flight Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:8px;margin-bottom:24px;">
              <tr><td style="padding:24px;">

                <!-- Route visual -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="text-align:center;width:80px;">
                      <p style="margin:0;font-size:28px;font-weight:bold;color:#1a1714;">${flight.dep}</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#888;font-weight:bold;">${flight.from}</p>
                    </td>
                    <td style="text-align:center;">
                      <p style="margin:0;font-size:11px;color:#888;">✈️ ${flight.dur}</p>
                      <hr style="border:none;border-top:2px solid #ddd;margin:6px 0;"/>
                      <p style="margin:0;font-size:11px;color:${flight.stops === 0 ? '#16a34a' : '#d97706'};">${flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                    </td>
                    <td style="text-align:center;width:80px;">
                      <p style="margin:0;font-size:28px;font-weight:bold;color:#1a1714;">${flight.arr}</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#888;font-weight:bold;">${flight.to}</p>
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                      ['Airline', `${flight.airline} · ${flight.flightNum}`],
                      ['Date', flight.date],
                      ['Passengers', String(passengers.length)],
                  ].map(([k, v]) => `
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#888;">${k}</td>
                    <td style="padding:6px 0;font-size:13px;color:#1a1714;font-weight:500;text-align:right;">${v}</td>
                  </tr>`).join('')}
                  <tr>
                    <td colspan="2" style="border-top:1px solid #ddd;padding-top:12px;margin-top:8px;"></td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:15px;font-weight:bold;color:#1a1714;">Total Amount</td>
                    <td style="padding:6px 0;font-size:20px;font-weight:bold;color:#d97706;text-align:right;">₹${fmt(flight.price)}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Passenger Details -->
            <p style="margin:0 0 12px;font-size:13px;font-weight:bold;color:#1a1714;text-transform:uppercase;letter-spacing:1px;">Passenger Details</p>
            ${passengers.map((p, i) => `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:8px;margin-bottom:12px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:11px;color:#c8a97e;font-weight:bold;text-transform:uppercase;">Traveller ${i + 1}</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#888;padding:3px 0;">Name</td>
                    <td style="font-size:13px;color:#1a1714;font-weight:500;text-align:right;">${p.title} ${p.firstName} ${p.lastName}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#888;padding:3px 0;">DOB</td>
                    <td style="font-size:13px;color:#1a1714;text-align:right;">${p.dob}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#888;padding:3px 0;">Gender / Nationality</td>
                    <td style="font-size:13px;color:#1a1714;text-align:right;">${p.gender} · ${p.nationality}</td>
                  </tr>
                  ${p.passportNo ? `
                  <tr>
                    <td style="font-size:13px;color:#888;padding:3px 0;">Passport</td>
                    <td style="font-size:13px;color:#1a1714;text-align:right;">${p.passportNo} (Exp: ${p.passportExpiry})</td>
                  </tr>` : ''}
                </table>
              </td></tr>
            </table>`).join('')}

            <!-- Contact -->
            <p style="margin:16px 0 12px;font-size:13px;font-weight:bold;color:#1a1714;text-transform:uppercase;letter-spacing:1px;">Contact Information</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:8px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <table width="100%">
                  <tr>
                    <td style="font-size:13px;color:#888;padding:3px 0;">Email</td>
                    <td style="font-size:13px;color:#1a1714;font-weight:500;text-align:right;">${contact.email}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#888;padding:3px 0;">Phone</td>
                    <td style="font-size:13px;color:#1a1714;text-align:right;">${contact.phone}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            ${isAdmin ? `
            <!-- Action Required for Admin -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#856404;">⚡ Action Required</p>
                <p style="margin:0;font-size:13px;color:#856404;line-height:1.6;">
                  1. Book the flight ticket with the airline<br/>
                  2. Send e-ticket to customer: <strong>${contact.email}</strong><br/>
                  3. Update booking status in the admin panel<br/>
                  4. WhatsApp customer: ${contact.phone}
                </p>
              </td></tr>
            </table>
            ` : `
            <!-- Customer next steps -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0 6px 32px;font-size:14px;color:#555;line-height:1.6;position:relative;">
                  <span style="position:absolute;left:0;top:6px;display:inline-block;width:22px;height:22px;background:#c8a97e;color:#1a1714;font-size:11px;font-weight:bold;text-align:center;line-height:22px;">1</span>
                  Our team will book your ticket and send it within 30 minutes.
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0 6px 32px;font-size:14px;color:#555;line-height:1.6;position:relative;">
                  <span style="position:absolute;left:0;top:6px;display:inline-block;width:22px;height:22px;background:#c8a97e;color:#1a1714;font-size:11px;font-weight:bold;text-align:center;line-height:22px;">2</span>
                  You'll receive your e-ticket at ${contact.email}
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0 6px 32px;font-size:14px;color:#555;line-height:1.6;position:relative;">
                  <span style="position:absolute;left:0;top:6px;display:inline-block;width:22px;height:22px;background:#c8a97e;color:#1a1714;font-size:11px;font-weight:bold;text-align:center;line-height:22px;">3</span>
                  For any help, WhatsApp us at +91 84278 31127
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <a href="https://wa.me/918427831127?text=Hi!%20I%20booked%20flight%20${encodeURIComponent(txnid)}.%20Please%20confirm."
                     style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 36px;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:bold;border-radius:4px;">
                    WhatsApp Our Team
                  </a>
                </td>
              </tr>
            </table>
            `}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a1714;padding:28px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;">YlooTrips · India Travel Experts</p>
            <p style="margin:0;font-size:12px;color:#666;">
              <a href="https://www.ylootrips.com" style="color:#c8a97e;text-decoration:none;">www.ylootrips.com</a> · +91 84278 31127
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ylootrips.com';
    const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    try {
        const body = await req.json();
        const { type, booking, to } = body as {
            type: 'client_confirmation' | 'admin_notification';
            booking: FlightBooking;
            to: string;
        };

        if (!booking || !to) {
            return NextResponse.json({ error: 'Missing booking or to' }, { status: 400 });
        }

        const isAdmin = type === 'admin_notification';
        const subject = isAdmin
            ? `🔔 New Flight Booking: ${booking.flight.from}→${booking.flight.to} — ${booking.txnid}`
            : `✅ Flight Booking Confirmed: ${booking.flight.airline} ${booking.flight.flightNum} | ${booking.txnid}`;

        const html = buildEmailHtml(booking, isAdmin);

        const { data, error } = await resend.emails.send({
            from: FROM,
            to: [to],
            subject,
            html,
        });

        if (error) return NextResponse.json({ error }, { status: 500 });

        // If this is the client confirmation, ALSO send to admin
        if (!isAdmin) {
            try {
                await resend.emails.send({
                    from: FROM,
                    to: [ADMIN_EMAIL],
                    subject: `🔔 New Flight Booking: ${booking.flight.from}→${booking.flight.to} | ${booking.txnid}`,
                    html: buildEmailHtml(booking, true),
                });
            } catch { /* non-fatal */ }
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
