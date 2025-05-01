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

        // nodemailer constructor
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const users = await Profile.find({ promotions: true });

        // send message to all users subscribed to emails
        for (const user of users) {
            const message = {
                from: process.env.EMAIL_ADDRESS,
                to: user.email,
                subject: `New Promotion Code: ${newPromotion.code}`,
                text: `Hi ${user.firstName.trim()},\n\nTry new promotion code ${newPromotion.code} for ${newPromotion.percentage}% off at checkout. This offer ends ${new Date(newPromotion.expDate).toLocaleDateString()}!`,
            };

            try {
                await transporter.sendMail(message);
                console.log(`Email sent to ${user.email}`);
            } catch (error) {
                console.error(`Error sending email to ${user.email}:`, error);
            }
        }

        await newPromotion.save();
        return NextResponse.json({ success: true, promotion: newPromotion }, { status: 201 });
    } catch (error) {
        console.error("Error adding promotion:", error);
        return NextResponse.json({ success: false, message: "Failed to add promotion" }, { status: 500 });
    }
}
