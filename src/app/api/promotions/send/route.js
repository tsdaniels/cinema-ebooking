import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export async function POST(req) {
  await dbConnect();

  const { promotionId } = await req.json();

  try {
    const promo = await Promotion.findById(promotionId).populate('movieId');

    if (!promo || promo.sent) {
      return new Response(
        JSON.stringify({ error: 'Promotion not found or already sent' }),
        { status: 400 }
      );
    }

    const subscribedUsers = await User.find({ subscribedToPromotions: true });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    for (const user of subscribedUsers) {
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: promo.title,
        text: `${promo.message}\n\nCheck out "${promo.movieId.title}" now on CineBook!`,
      });
    }

    promo.sent = true;
    await promo.save();

    return new Response(JSON.stringify({ message: 'Promotion sent!' }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
