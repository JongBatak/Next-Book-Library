import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get user from cookie (we'll implement this properly later)
  // For now, we'll skip middleware check since we use localStorage
  // In production, use httpOnly cookies and validate here
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/profile/:path*']
};
