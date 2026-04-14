import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const ReviewSchema = new mongoose.Schema({ name: String, email: String, country: String, trip: String, rating: Number, text: String, avatarUrl: String, tripPhotoUrl: String, platform: String, status: String }, { timestamps: true });
const Review = mongoose.models.Review ?? mongoose.model('Review', ReviewSchema);

await mongoose.connect(MONGODB_URI);
const r = await Review.findById('69dc8fdcf597a09c7f3c2f64');
console.log('Name:', r?.name);
console.log('Status:', r?.status);
console.log('tripPhotoUrl:', r?.tripPhotoUrl);
console.log('avatarUrl:', r?.avatarUrl);
const all = await Review.find({ status: 'approved' }).select('name status');
console.log('\nAll approved reviews:', all.map(x => x.name));
await mongoose.disconnect();
