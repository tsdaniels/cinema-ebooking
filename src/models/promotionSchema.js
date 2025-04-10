// models/promotionSchema.js
import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, trim: true},
    expDate: { type: Date, required: true },
    percentage: {type: Number, default: '0'}
}, { collection: 'promotions' });

export const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', promoSchema);