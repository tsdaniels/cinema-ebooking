import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// Middleware to verify JWT and get user ID
async function authenticate(request) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

// **GET** - Fetch user profile
export async function GET(request) {
    try {
        await connectMongoDB();
        const userId = await authenticate(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ success: false, error: "Error fetching user profile" }, { status: 500 });
    }
}

// **POST** - Update user profile
export async function POST(request) {
    try {
        await connectMongoDB();
        const userId = await authenticate(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { firstName, lastName, billingAddress, password, paymentCards, promotions } = await request.json();

        // Restrict modifications
        if (billingAddress && billingAddress.length > 0) {
            await User.findByIdAndUpdate(userId, { billingAddress });
        }

        if (paymentCards && paymentCards.length <= 4) {
            await User.findByIdAndUpdate(userId, { paymentCards });
        } else if (paymentCards?.length > 4) {
            return NextResponse.json({ success: false, message: "Cannot store more than 4 payment cards" }, { status: 400 });
        }

        const updatedFields = { firstName, lastName, promotions };

        if (password && password.length >= 6) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        } else if (password) {
            return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
        }

        await User.findByIdAndUpdate(userId, updatedFields);

        return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ success: false, error: "Error updating profile" }, { status: 500 });
    }
}
