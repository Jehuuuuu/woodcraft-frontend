import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('[Middleware] Triggered for path:', request.nextUrl.pathname);
  
  const allCookies = request.cookies.getAll();
  console.log('[Middleware] All cookies:', allCookies);

  const sessionCookie = request.cookies.get('sessionid');
  console.log('[Middleware] sessionid cookie object:', sessionCookie); 

  if (sessionCookie) {
    console.log('[Middleware] sessionid cookie value:', sessionCookie.value);
  } else {
    console.log('[Middleware] sessionid cookie not found.');
  }

  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/profile') || 
      request.nextUrl.pathname.startsWith('/cart')) {
    
    if (!sessionCookie) {
      console.log('[Middleware] No sessionid cookie, redirecting to /login for path:', request.nextUrl.pathname);
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('[Middleware] Sessionid cookie found, allowing access to:', request.nextUrl.pathname);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/cart/:path*'],
};