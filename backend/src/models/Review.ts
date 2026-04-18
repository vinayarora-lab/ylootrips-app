import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email: string;
  country: string;
  destination: string;
  rating: number;
  title: string;
  body: string;
  photoUrl?: string;
  approved: boolean;
  featured: boolean;
  bookingReference?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name:             { type: String, required: true },
    email:            { type: String, required: true, lowercase: true },
    country:          { type: String, default: 'India' },
    destination:      { type: String, required: true },
    rating:           { type: Number, required: true, min: 1, max: 5 },
    title:            { type: String, required: true },
    body:             { type: String, required: true },
    photoUrl:         { type: String },
    approved:         { type: Boolean, default: false },
    featured:         { type: Boolean, default: false },
    bookingReference: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
