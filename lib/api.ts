import axios from 'axios';
import { useAuthStore } from './store/authStore';

// Get initial base URL based on current environment (Server vs Client)
// Client-side requests always use relative paths to allow reverse proxy subdomain routing
const getInitialBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use internal Docker/localhost URL
    return process.env.INTERNAL_API_URL || 'http://localhost:5000/api/v1';
  }

  // In local development on localhost:3000, 127.0.0.1, or local subdomains (e.g., battrang.localhost),
  // use absolute backend URL to prevent 404 HTML page returns
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) {
    return 'http://localhost:5000/api/v1';
  }

  // Client-side: Use absolute backend API URL from environment variables to connect directly
  return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
};

const api = axios.create({
  baseURL: getInitialBaseUrl(),
  timeout: 30000, // 30 seconds timeout, matching RestX
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*',
  },
});

// Update baseURL on client-side after hydration
if (typeof window !== 'undefined') {
  api.defaults.baseURL = getInitialBaseUrl();
}

// Add a request interceptor to attach JWT token, handle FormData, and auto-inject x-tenant-slug
api.interceptors.request.use(
  (config) => {
    // 1. Attach Authorization JWT token if available
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Strip Content-Type for FormData to let browser set boundary (crucial for uploads!)
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
        config.headers.delete('content-type');
      } else {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    // 3. Dynamically inject the x-tenant-slug based on the client subdomain
    // This allows local dev and direct subdomain lookups to work without reverse proxy headers
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      let subdomain = '';
      
      if (host.includes('localhost')) {
        subdomain = host.split('.localhost')[0];
        if (subdomain === 'localhost') subdomain = '';
      } else {
        const parts = host.split('.');
        if (parts.length > 2) {
          subdomain = parts[0];
          if (subdomain === 'www') subdomain = '';
        }
      }

      let slug = '';
      if (subdomain) {
        const map: Record<string, string> = {
          'battrang': 'bat-trang',
          'vanphuc': 'van-phuc',
          'nonnuoc': 'non-nuoc',
        };
        slug = map[subdomain] || subdomain;
      } else {
        // Fallback 1: Parse tenant slug from URL pathname (e.g. /tenant/bat-trang or /vi/tenant/bat-trang)
        const pathParts = window.location.pathname.split('/');
        const tenantIndex = pathParts.indexOf('tenant');
        if (tenantIndex !== -1 && pathParts[tenantIndex + 1]) {
          slug = pathParts[tenantIndex + 1];
        }

        // Fallback 2: Parse tenant slug from URL query parameters (e.g. ?slug=bat-trang or ?tenant=bat-trang)
        if (!slug) {
          const urlParams = new URLSearchParams(window.location.search);
          slug = urlParams.get('slug') || urlParams.get('tenant') || '';
        }

        // Fallback 3: Retrieve from sessionStorage (saved during onboarding/login)
        if (!slug) {
          slug = sessionStorage.getItem('hoalang_tenant_slug') || '';
        }
      }

      if (slug) {
        config.headers['x-tenant-slug'] = slug;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle concurrent 401 token refreshes and retries
interface FailedRequest {
  resolve: (value: string | null) => void;
  reject: (reason: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (exclude refresh or login requests themselves)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        // Call standard refresh token endpoint on backend
        const baseURL = api.defaults.baseURL || '/api/v1';
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.data && refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          
          // Update Zustand store + cookies
          useAuthStore.getState().setToken(newAccessToken);

          // Retry the original failed request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh response structure');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Log out user on refresh failure and redirect
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

