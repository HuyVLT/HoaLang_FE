'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';

export default function SSOHandler() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const ssoToken = searchParams.get('sso_token');
    const ssoRefresh = searchParams.get('sso_refresh');
    const ssoUserStr = searchParams.get('sso_user');
    const ssoCartStr = searchParams.get('sso_cart');

    let synced = false;

    if (ssoToken && ssoRefresh && ssoUserStr) {
      try {
        const user = JSON.parse(decodeURIComponent(ssoUserStr));
        
        // Save to Zustand auth store (which also writes the accessToken cookie)
        useAuthStore.getState().login(user, ssoToken, ssoRefresh);
        
        console.log('[SSOHandler] Session synced successfully for user:', user.email);
        synced = true;
      } catch (err) {
        console.error('[SSOHandler] Failed to sync session:', err);
      }
    }

    if (ssoCartStr) {
      try {
        const cartItems = JSON.parse(decodeURIComponent(ssoCartStr));
        
        // Save to Zustand cart store
        useCartStore.setState({ items: cartItems });
        
        console.log('[SSOHandler] Cart synced successfully, items count:', cartItems.length);
        synced = true;
      } catch (err) {
        console.error('[SSOHandler] Failed to sync cart items:', err);
      }
    }

    if (synced) {
      // Remove SSO query parameters from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete('sso_token');
      params.delete('sso_refresh');
      params.delete('sso_user');
      params.delete('sso_cart');
      
      const newSearch = params.toString();
      const cleanUrl = pathname + (newSearch ? `?${newSearch}` : '');
      
      // Replace current history entry to clean URL without triggering a route transition
      window.history.replaceState(null, '', cleanUrl);
    }
  }, [searchParams, pathname]);

  return null;
}



