import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true, 
  },
  role: {
    type: String,
    required: true,
  },
  tempPassword: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);