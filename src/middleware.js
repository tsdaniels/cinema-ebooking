import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  console.log("Received Token:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/adminLogin", request.url));
  }

  try {
    // decode and load jwt into variable
    const { payload } = await jwtVerify(token, secret);

    // if user.role == user, deny access to admin pages and redirect to admin login
    if (payload.role === "user") {
      return NextResponse.redirect(new URL("/adminLogin", request.url));
    }

    return NextResponse.next();

  // if token is invalid
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/adminLogin", request.url));
  }
}

export const config = {
  matcher: ["/adminPortal", "/manageUsers", "/managePromotions", "/manageMovies"], // middleware works for these pages
};

