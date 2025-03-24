// models/profileSchema.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    email: { type: String, required: true},
    firstName: { type: String },
    lastName: { type: String },
    birthday: { type: Date },
    streetNumber: {type: String},
    streetName: {type: String},
    city: {type: String},
    state: {type: String},
    zipCode: {type: String},
    promotions: {type: Boolean, default: false },
}, { collection: 'profiles' });

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);