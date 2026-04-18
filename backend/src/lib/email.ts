const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@ylootrips.com';

interface EmailPayload {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'YlooTrips <onboarding@resend.dev>',
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        text: payload.text,
        ...(payload.html ? { html: payload.html } : {}),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[email] Send failed:', err);
    return false;
  }
}

export async function sendBookingConfirmation(params: {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  tripTitle: string;
  travelDate: string;
  guests: number;
  totalAmount: number;
  paidAmount: number;
}): Promise<void> {
  const { customerName, customerEmail, bookingReference, tripTitle, travelDate, guests, totalAmount, paidAmount } = params;

  const customerText = `
Hi ${customerName},

Your booking is CONFIRMED! 🎉

BOOKING DETAILS
Reference:    ${bookingReference}
Trip:         ${tripTitle}
Travel Date:  ${travelDate}
Guests:       ${guests}
Total Amount: ₹${totalAmount.toLocaleString('en-IN')}
Paid:         ₹${paidAmount.toLocaleString('en-IN')}
Balance Due:  ₹${(totalAmount - paidAmount).toLocaleString('en-IN')}

Your travel expert will reach you within 1 hour to discuss your itinerary.

📱 WhatsApp: +91 84278 31127
📧 Email: hello@ylootrips.com

Happy Travels!
YlooTrips Team
  `.trim();

  const adminText = `
NEW BOOKING — ${bookingReference}

Customer: ${customerName} <${customerEmail}>
Trip:     ${tripTitle}
Date:     ${travelDate}
Guests:   ${guests}
Total:    ₹${totalAmount.toLocaleString('en-IN')}
Paid:     ₹${paidAmount.toLocaleString('en-IN')}
  `.trim();

  await Promise.allSettled([
    sendEmail({ to: customerEmail, subject: `[${bookingReference}] Booking Confirmed — ${tripTitle}`, text: customerText }),
    sendEmail({ to: ADMIN_EMAIL, subject: `[NEW BOOKING] ${bookingReference} — ${customerName}`, text: adminText }),
  ]);
}
