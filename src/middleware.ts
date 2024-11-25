'use client';
import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { Locale, i18n } from '../i18n.config';

function getLocale(request: NextRequest): string | undefined {
  // Check for a preferred-language cookie
  const preferredLanguage = request.cookies.get('preferred-language')
    ?.value as Locale;

  if (preferredLanguage && i18n.locales.includes(preferredLanguage)) {
    return preferredLanguage;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

// Protected routes that require authentication
const protectedRoutes = [
  '/customer/dashboard',
  '/customer/categories',
  '/customer/rules',
  '/customer/expenses',
  '/customer/write-off',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for locale first
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Handle locale redirect
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
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
    const sessionToken = request.cookies.get('next-auth.session-token')?.value;
    if (!sessionToken) {
      // Get the current locale from the pathname
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
