import { headers } from 'next/headers';

export function getTenantFromHost(host: string): string | null {
  const isLocalhost = host.includes('localhost');
  let subdomain = '';

  if (isLocalhost) {
    subdomain = host.split('.localhost')[0];
    if (subdomain === 'localhost') return null;
  } else {
    const parts = host.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
      if (subdomain === 'www') return null;
    } else {
      return null;
    }
  }

  const slugMap: Record<string, string> = {
    'battrang': 'bat-trang',
    'vanphuc': 'van-phuc',
    'nonnuoc': 'non-nuoc',
  };
  return slugMap[subdomain] || null;
}

export function useTenant() {
  const headersList = headers();
  const host = headersList.get('host') || '';
  return getTenantFromHost(host);
}
