import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './navigation';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,
  
  // Keep prefix in URL
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', 
    '/(vi|en|ja|ko|zh)/:path*', 
    '/((?!_next|api|assets|.*\\..*).*)'
  ]
};
