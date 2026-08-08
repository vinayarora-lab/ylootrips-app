import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone')?.replace(/\D/g, '').slice(-10);
  if (!phone || phone.length < 10) {
    return NextResponse.json({ error: 'Valid 10-digit phone number required' }, { status: 400 });
  }

  try {
    await connectDB();
    // Match any stored format that ends with the same 10 digits
    const bookings = await Booking.find({
      customerPhone: { $regex: phone + '$' },
    })
      .sort({ createdAt: -1 })
      .select('bookingReference tripTitle destination travelDate guests totalAmount paidAmount status paymentStatus createdAt')
      .lean();

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error('[bookings/history]', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
