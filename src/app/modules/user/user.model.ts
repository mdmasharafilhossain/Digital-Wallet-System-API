import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number']
  },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  isAgentApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);