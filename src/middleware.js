import { NextResponse } from 'next/server';

export function middleware(request) {
  const sessionCookie = request.cookies.get('sessionid');
  
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/cart')) {
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/cart/:path*'],
};