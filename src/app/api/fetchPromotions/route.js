import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { Promotion } from '@/models/promotionSchema';

export async function GET() {
    try {
        await connectMongoDB();
        
        const promotions = await Promotion.find({});
        return NextResponse.json({ success: true, promotions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching promotion code", error);
        return NextResponse.json({ success: false, message: "Failed to fetch promotion" }, { status: 500 });
    }
}