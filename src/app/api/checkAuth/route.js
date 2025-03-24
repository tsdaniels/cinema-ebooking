// app/api/checkAuth/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  // Get the auth cookie
  const authToken = request.cookies.get('auth_token')?.value;
  
  if (!authToken) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
  
  try {
    // Verify the JWT
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    
    return NextResponse.json({ 
      isLoggedIn: true,
      email: decoded.email 
    });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}