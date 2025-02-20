// models/userSchema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date }
}, { collection: 'credentials' });

export const User = mongoose.models.User || mongoose.model('User', userSchema);