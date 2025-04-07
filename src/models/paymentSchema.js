// models/paymentSchema.js
import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    email: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expirationDate: { type: String, required: true },
    cvv: { type: String, required: true },
    streetNumber: {type: String, required: true},
    streetName: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: {type: String, required: true},
}, { collection: 'cards' });

export const Card = mongoose.models.Card || mongoose.model('Card', cardSchema);