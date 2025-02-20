// models/profileSchema.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    email: { type: String },
    firstName: { type: String },
    lastName: { type: Boolean, default: false },
    birthday: { type: Date },
}, { collection: 'credentials' });

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);