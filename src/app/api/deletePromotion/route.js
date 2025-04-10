import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { Promotion } from '@/models/promotionSchema';

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Promotion ID is required" }, { status: 400 });
        }

        const deletedPromotion = await Promotion.findByIdAndDelete(id);
        if (!deletedPromotion) {
            return NextResponse.json({ success: false, message: "Promotion not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Promotion deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting promotion:", error);
        return NextResponse.json({ success: false, message: "Failed to delete promotion" }, { status: 500 });
    }
}