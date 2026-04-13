import mongoose from 'mongoose';
import { readFileSync } from 'fs';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('Set MONGODB_URI'); process.exit(1); }

const ReviewSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String },
  country: { type: String, required: true },
  trip:    { type: String, required: true },
  rating:  { type: Number, required: true },
  text:    { type: String, required: true },
  avatarUrl:    { type: String },
  tripPhotoUrl: { type: String },
  platform: { type: String, default: 'YlooTrips' },
  status:  { type: String, default: 'pending' },
}, { timestamps: true });

const Review = mongoose.models.Review ?? mongoose.model('Review', ReviewSchema);

await mongoose.connect(MONGODB_URI);

// Read trip photo if provided
let tripPhotoUrl;
try {
  const imgBuf = readFileSync(process.argv[2]);
  tripPhotoUrl = 'data:image/jpeg;base64,' + imgBuf.toString('base64');
  console.log('Photo loaded, size:', Math.round(tripPhotoUrl.length/1024), 'KB');
} catch {
  console.log('No photo file provided, using Unsplash Lakshadweep photo');
  tripPhotoUrl = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80';
}

const review = await Review.create({
  name:    'Rahul & Priya Sharma',
  email:   'rahul.sharma@gmail.com',
  phone:   '',
  country: 'Gurugram, Haryana',
  trip:    'Lakshadweep Island Package',
  rating:  5,
  text:    'Recently visited Lakshadweep through Ylootrips.com and it was an incredible experience! The itinerary was well-planned, accommodations were comfortable, and the entire trip was smooth from start to finish. The team was supportive and always available for assistance. Lakshadweep itself is breathtaking, and Ylootrips made the journey even more memorable. Highly recommend booking with them!',
  tripPhotoUrl,
  platform: 'Google',
  status:  'approved',
});

console.log('Review inserted:', review._id);
await mongoose.disconnect();
