// models/userSchema.js
import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    email: { type: String },
    cardName: { type: String },
    cardNumber: { type: String },
    expirationDate: { type: Date },
    cvv: { type: String },
}, { collection: 'cards' });

export const User = mongoose.models.Card || mongoose.model('Card', cardSchema);