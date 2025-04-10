import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { Promotion } from '@/models/promotionSchema';
import { Profile } from '@/models/profileSchema';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { code, expDate, percentage } = await req.json();

        if (!code || !expDate) {
            return NextResponse.json({ success: false, message: "Code and expiration date required" }, { status: 400 });
        }

        const newPromotion = new Promotion({
            code,
            expDate,
            percentage,
        });

        await newPromotion.save();
        return NextResponse.json({ success: true, promotion: newPromotion }, { status: 201 });
    } catch (error) {
        console.error("Error adding promotion:", error);
        return NextResponse.json({ success: false, message: "Failed to add promotion" }, { status: 500 });
    }
}
