import mongoose, { Schema, Document } from 'mongoose';

interface WalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  bookingReference?: string;
  createdAt: Date;
}

export interface IWallet extends Document {
  email: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: WalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, index: true },
    balance:      { type: Number, default: 0, min: 0 },
    totalEarned:  { type: Number, default: 0 },
    totalSpent:   { type: Number, default: 0 },
    transactions: [
      {
        type:             { type: String, enum: ['credit', 'debit'], required: true },
        amount:           { type: Number, required: true },
        reason:           { type: String, required: true },
        bookingReference: { type: String },
        createdAt:        { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
