import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  balance: { type: Number, default: 50, min: 0 },
  isBlocked: { type: Boolean, default: false }
});

export default mongoose.model('Wallet', walletSchema);