import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';

// GET — list all reviews (admin)
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') || 'all';
  await connectDB();
  const filter = status === 'all' ? {} : { status };
  const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ reviews });
}

// PATCH — approve or reject a review
export async function PATCH(req: NextRequest) {
  try {
    const { id, status, adminNote } = await req.json();
    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    await connectDB();
    const review = await Review.findByIdAndUpdate(
      id,
      { status, adminNote: adminNote || '' },
      { new: true }
    );
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error('[admin/reviews PATCH]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — permanently remove
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await connectDB();
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
