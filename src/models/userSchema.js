// models/userSchema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    promotions: {type: Boolean, default: false},
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    isAdmin: { type: Boolean, default: false }
}, { collection: 'credentials' });

export const User = mongoose.models.User || mongoose.model('User', userSchema);