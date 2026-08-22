import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in (sign-in page)
     * - / (root path)
     * - posts/* (posts paths)
     * - resources/* (resources paths)
     * - codeofconduct (code of conduct page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|posts|resources|codeofconduct).*)|^/$'
  ]
};