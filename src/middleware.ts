// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { i18n } from '../i18n.config';
import { getLocale } from './utils/helpers/getLocals';
import { protectedRoutes } from './routes';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Check for locale first
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Handle locale redirect while preserving query parameters
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const url = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url
    );

    // Add back all original query parameters
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    const response = NextResponse.redirect(url);
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    return response;
  }

  // Check if the current path (without locale) matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    i18n.locales.some(
      (locale) =>
        pathname === `/${locale}${route}` || pathname === `/${locale}${route}/`
    )
  );

  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    const sessionToken =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!sessionToken) {
      const locale = pathname.split('/')[1];
      const response = NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );

      // Add cache control headers
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      return response;
    }

    // Add cache headers for authenticated requests
    const response = NextResponse.next();
    response.headers.set(
      'Cache-Control',
      'private, no-cache, no-store, must-revalidate'
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
