import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email: string;
  phone?: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  platform: 'YlooTrips';
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name:    { type: String, required: true, trim: true, maxlength: 100 },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    country: { type: String, required: true, trim: true, maxlength: 100 },
    trip:    { type: String, required: true, trim: true, maxlength: 200 },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    text:    { type: String, required: true, trim: true, maxlength: 1000 },
    platform: { type: String, default: 'YlooTrips' },
    status:  { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

ReviewSchema.index({ status: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
