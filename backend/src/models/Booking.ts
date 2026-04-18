import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingReference: string;
  tripTitle: string;
  destination: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: Date;
  guests: number;
  totalAmount: number;
  paidAmount: number;
  walletDeduction: number;
  cashbackEarned: number;
  promoCode?: string;
  promoDiscount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  txnid?: string;
  paymentMethod?: string;
  specialRequests?: string;
  source: 'website' | 'whatsapp' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    tripTitle:        { type: String, required: true },
    destination:      { type: String, default: '' },
    customerName:     { type: String, required: true },
    customerEmail:    { type: String, required: true, lowercase: true },
    customerPhone:    { type: String, required: true },
    travelDate:       { type: Date, required: true },
    guests:           { type: Number, required: true, min: 1 },
    totalAmount:      { type: Number, required: true, min: 0 },
    paidAmount:       { type: Number, default: 0, min: 0 },
    walletDeduction:  { type: Number, default: 0 },
    cashbackEarned:   { type: Number, default: 0 },
    promoCode:        { type: String },
    promoDiscount:    { type: Number, default: 0 },
    status:           { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    paymentStatus:    { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
    txnid:            { type: String },
    paymentMethod:    { type: String },
    specialRequests:  { type: String },
    source:           { type: String, enum: ['website', 'whatsapp', 'admin'], default: 'website' },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
