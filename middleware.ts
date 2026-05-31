import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './navigation';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

const TENANT_SLUGS = ['bat-trang', 'van-phuc', 'non-nuoc'];
const MAIN_DOMAINS = ['hoalang.site', 'www.hoalang.site', 'localhost'];

function convertSubdomainToSlug(subdomain: string): string {
  const map: Record<string, string> = {
    'battrang': 'bat-trang',
    'vanphuc': 'van-phuc',
    'nonnuoc': 'non-nuoc',
  };
  return map[subdomain] || subdomain;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1. Skip assets, static files, and APIs
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Identify if it is localhost or main domain (strip port first!)
  const hostWithoutPort = hostname.includes(':') ? hostname.split(':')[0] : hostname;
  const isLocalhost = hostWithoutPort.includes('localhost');
  const isMainDomain = MAIN_DOMAINS.some(d => hostWithoutPort === d);

  // 3. Extract subdomain
  let subdomain = '';
  if (isLocalhost) {
    subdomain = hostWithoutPort.split('.localhost')[0];
    if (subdomain === 'localhost') subdomain = '';
  } else {
    const parts = hostWithoutPort.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
      // Skip 'www' as subdomain
      if (subdomain === 'www') subdomain = '';
    }
  }

  // 4. Run i18n routing first
  const response = handleI18nRouting(request);

  // If i18n middleware wants to redirect (e.g. adding locale prefix), let it redirect!
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  // 5. If it is a valid tenant subdomain, rewrite the request path
  if (subdomain && !isMainDomain) {
    const slug = convertSubdomainToSlug(subdomain);

    if (TENANT_SLUGS.includes(slug)) {
      // Find which locale prefix is in the current pathname
      // Since next-intl already ran, pathname should start with a locale (e.g. /vi/products or /vi)
      const pathnameParts = pathname.split('/');
      const firstSegment = pathnameParts[1];
      
      const isLocale = locales.includes(firstSegment as typeof locales[number]);
      const locale = isLocale ? firstSegment : defaultLocale;
      const pathAfterLocale = isLocale 
        ? '/' + pathnameParts.slice(2).join('/') 
        : pathname;

      // Rewrite URL internally to /[locale]/tenant/[slug]/[path]
      const newPathname = `/${locale}/tenant/${slug}${pathAfterLocale === '/' ? '' : pathAfterLocale}`;
      url.pathname = newPathname;

      console.log(`[Middleware Rewrite] ${hostname}${pathname} -> ${newPathname}`);

      // Create a rewrite response and propagate headers/cookies from the next-intl response
      const rewriteResponse = NextResponse.rewrite(url);
      
      // Copy cookies and headers set by next-intl to preserve locale state
      response.headers.forEach((value, key) => {
        rewriteResponse.headers.set(key, value);
      });

      return rewriteResponse;
    }

    // Invalid subdomain -> 404 rewrite
    const isLocale = locales.includes(pathname.split('/')[1] as typeof locales[number]);
    const locale = isLocale ? pathname.split('/')[1] : defaultLocale;
    url.pathname = `/${locale}/not-found`;
    return NextResponse.rewrite(url);
  }

  // 6. Main domain -> run normally with i18n headers
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except API, _next/static, _next/image, favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
