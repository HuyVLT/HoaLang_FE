import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

export function getTenantUrl(slug: string, path = ''): string {
  const subdomain = slug.replace(/-/g, '');
  
  // Clean path format: ensure leading slash if path is provided and doesn't start with /
  let formattedPath = path;
  if (path && !path.startsWith('/')) {
    formattedPath = `/${path}`;
  }

  let baseUrl = '';
  // Development environment (local dev)
  if (process.env.NODE_ENV === 'development') {
    baseUrl = `http://${subdomain}.localhost:3000${formattedPath}`;
  } else {
    // Production environment
    baseUrl = `https://${subdomain}.hoalang.site${formattedPath}`;
  }

  // Client-side session and cart transfer: if authenticated or has cart items, append query parameters
  if (typeof window !== 'undefined') {
    try {
      const authState = useAuthStore.getState();
      const cartState = useCartStore.getState();
      const url = new URL(baseUrl);
      
      if (authState.token && authState.refreshToken && authState.user) {
        url.searchParams.set('sso_token', authState.token);
        url.searchParams.set('sso_refresh', authState.refreshToken);
        url.searchParams.set('sso_user', encodeURIComponent(JSON.stringify(authState.user)));
      }

      if (cartState.items) {
        url.searchParams.set('sso_cart', encodeURIComponent(JSON.stringify(cartState.items)));
      }

      return url.toString();
    } catch (err) {
      console.warn('[getTenantUrl] Failed to append auth or cart tokens:', err);
    }
  }

  return baseUrl;
}

export function getMainUrl(locale: string): string {
  let baseUrl = '';
  if (process.env.NODE_ENV === 'development') {
    baseUrl = `http://localhost:3000/${locale}`;
  } else {
    baseUrl = `https://hoalang.site/${locale}`;
  }

  if (typeof window !== 'undefined') {
    try {
      const authState = useAuthStore.getState();
      const cartState = useCartStore.getState();
      const url = new URL(baseUrl);

      if (authState.token && authState.refreshToken && authState.user) {
        url.searchParams.set('sso_token', authState.token);
        url.searchParams.set('sso_refresh', authState.refreshToken);
        url.searchParams.set('sso_user', encodeURIComponent(JSON.stringify(authState.user)));
      }

      if (cartState.items) {
        url.searchParams.set('sso_cart', encodeURIComponent(JSON.stringify(cartState.items)));
      }

      return url.toString();
    } catch (err) {
      console.warn('[getMainUrl] Failed to append auth or cart tokens:', err);
    }
  }

  return baseUrl;
}


