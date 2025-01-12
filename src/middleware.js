// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const email = url.searchParams.get("email");

  // Redirect to login if email is missing or invalid
  if (!email) {
    url.pathname = "/login";
    url.searchParams.delete("email"); // Clear invalid query
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Protect specific routes
export const config = {
  matcher: ["/verification-page"], // Add any additional protected routes here
};
