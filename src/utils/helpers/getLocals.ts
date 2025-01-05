// middleware.ts
import { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { Locale, i18n } from '../../../i18n.config';

export function getLocale(request: NextRequest): string | undefined {
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
