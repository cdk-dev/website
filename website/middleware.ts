import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return (
          session.tokens?.accessToken !== undefined &&
          session.tokens?.idToken !== undefined
        );
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  });

  if (authenticated) {
    return response;
  }

  return NextResponse.redirect(new URL('/sign-in', request.url));
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