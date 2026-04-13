import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('Set MONGODB_URI'); process.exit(1); }

const ReviewSchema = new mongoose.Schema({
  name: String, email: String, phone: String, country: String,
  trip: String, rating: Number, text: String,
  avatarUrl: String, tripPhotoUrl: String,
  platform: String, status: String,
}, { timestamps: true });

const Review = mongoose.models.Review ?? mongoose.model('Review', ReviewSchema);

await mongoose.connect(MONGODB_URI);

// Update the review with the real couple photo as BOTH tripPhoto and avatar
const photoUrl = '/reviews/lakshadweep-couple.jpg';

const result = await Review.findByIdAndUpdate(
  '69dc8fdcf597a09c7f3c2f64',
  {
    tripPhotoUrl: photoUrl,
    avatarUrl: photoUrl,
  },
  { new: true }
);

console.log('Updated:', result?.name, '| tripPhoto:', result?.tripPhotoUrl);
await mongoose.disconnect();
