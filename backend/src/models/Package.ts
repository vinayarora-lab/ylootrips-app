import mongoose, { Schema, Document } from 'mongoose';

interface DayActivity {
  time: string;
  activity: string;
  details: string;
}

interface DayPlan {
  day: number;
  title: string;
  activities: DayActivity[];
}

export interface IPackage extends Document {
  slug: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  price: number;
  originalPrice?: number;
  images: string[];
  coverImage: string;
  highlights: string[];
  itinerary: DayPlan[];
  inclusions: string[];
  exclusions: string[];
  category: 'domestic' | 'international' | 'honeymoon' | 'adventure' | 'budget';
  tags: string[];
  featured: boolean;
  active: boolean;
  rating: number;
  reviewCount: number;
  minGuests: number;
  maxGuests: number;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    slug:          { type: String, required: true, unique: true, index: true },
    title:         { type: String, required: true },
    destination:   { type: String, required: true },
    nights:        { type: Number, required: true },
    days:          { type: Number, required: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number },
    images:        [{ type: String }],
    coverImage:    { type: String, default: '' },
    highlights:    [{ type: String }],
    itinerary:     [
      {
        day:   Number,
        title: String,
        activities: [{ time: String, activity: String, details: String }],
      },
    ],
    inclusions:   [{ type: String }],
    exclusions:   [{ type: String }],
    category:     { type: String, enum: ['domestic', 'international', 'honeymoon', 'adventure', 'budget'], default: 'domestic' },
    tags:         [{ type: String }],
    featured:     { type: Boolean, default: false },
    active:       { type: Boolean, default: true },
    rating:       { type: Number, default: 4.8, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
    minGuests:    { type: Number, default: 1 },
    maxGuests:    { type: Number, default: 20 },
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
