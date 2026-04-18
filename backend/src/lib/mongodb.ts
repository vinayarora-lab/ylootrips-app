import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  isConnected = true;
  console.log('[mongodb] Connected');

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[mongodb] Disconnected');
  });
}
