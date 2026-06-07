'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Compass, Sparkles, AlertCircle, ShoppingBag, LogOut } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageConfig } from '@/types/tenant';
import { getMockTenantConfig } from '@/lib/mockTenants';
import TenantThemeProvider, { useTenantTheme } from '@/components/tenant/TenantThemeProvider';
import SectionRenderer from '@/components/tenant/SectionRenderer';
import { getTenantUrl, getMainUrl } from '@/lib/tenant-url';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useCartDrawerStore } from '@/components/shared/CartDrawer';

// Local client-side fetch helper
const fetchPageConfig = async (slug: string): Promise<PageConfig | null> => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await axios.get(`${backendUrl}/tenant/${slug}/page-config`, {
      timeout: 3000, // 3s timeout
    });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    return null;
  } catch (error) {
    console.warn(`[PageConfigFetch] Backend connection failed or 404, resolving offline mock templates:`, error);
    return null;
  }
};

/* ─────────────────── Custom Tenant Header ─────────────────── */
function TenantHeader() {
  const { theme } = useTenantTheme();
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const { slug } = useParams() as { slug: string };

  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getMainAuthUrl = (type: 'login' | 'register') => {
    const path = `/auth/${type}?redirect=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`;
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:3000${path}`;
    }
    return `https://hoalang.site${path}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 select-none ${
        scrolled
          ? 'bg-parchment/92 backdrop-blur-md border-b border-stone text-ink py-4 shadow-sm'
          : 'bg-transparent text-cream py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-[var(--page-padding-x,clamp(20px,5vw,80px))] flex items-center justify-between">
        {/* Brand Logo in Cormorant Garamond */}
        <a href={`/${locale}`} className="font-heading text-2xl font-semibold tracking-wide flex items-center gap-2.5">
          {theme.logo ? (
            <img
              src={theme.logo}
              alt="Tenant Logo"
              className="w-9 h-9 object-cover rounded-xs border border-stone/50 bg-cream"
              onError={(e) => {
                // If remote logo fails, hide image and render fallback letter
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <span>HoaLang</span>
        </a>

        {/* Dynamic Section Anchor Links in Be Vietnam Pro */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.12em] font-sans">
          <a href="#products" className="hover:text-primary transition-colors">Sản phẩm / Products</a>
          <a href="#experiences" className="hover:text-primary transition-colors">Xưởng / Workshops</a>
          <a href="#testimonials" className="hover:text-primary transition-colors">Cảm nhận / Reviews</a>
          <a href="#map-location" className="hover:text-primary transition-colors">Bản đồ / Contact</a>
        </nav>

        {/* RIGHT SIDE: Visual Builder + Cart + User Auth */}
        <div className="flex items-center gap-4">
          {/* Visual Builder Shortcut */}
          <a
            href={`/${locale}/tenant/${slug}/builder`}
            className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-4 py-2 rounded-sm border border-primary hover:brightness-110 shadow-sm transition-all animate-ease-out"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Visual Builder</span>
          </a>

          {/* Cart Icon */}
          <button
            onClick={() => useCartDrawerStore.getState().openCart()}
            className="relative flex items-center justify-center w-8 h-8 transition-colors duration-300 focus:outline-none"
            style={{ color: scrolled ? '#1A1208' : '#FAF7F2' }}
            aria-label={locale === 'vi' ? 'Mở giỏ hàng' : 'Open Cart'}
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {mounted && totalCartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none animate-pulse"
                style={{ background: theme.primaryColor || '#8B1A1A', color: '#FAF7F2' }}
              >
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Auth */}
          <div className="flex items-center gap-3">
            {mounted && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-sm object-cover border border-stone/60 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center font-sans text-[11px] font-semibold text-cream bg-primary border border-stone/40 transition-transform duration-300 group-hover:scale-105" style={{ background: theme.primaryColor || '#8B1A1A' }}>
                      {(user?.name || user?.email || 'H').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span
                    className="hidden lg:inline-block font-sans text-[12px] font-semibold uppercase tracking-[0.10em] max-w-[100px] truncate transition-colors duration-300"
                    style={{ color: scrolled ? '#1A1208' : '#FAF7F2' }}
                  >
                    {user?.name || user?.email}
                  </span>
                  <svg
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300"
                    style={{
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    <path d="M1 1L4 4L7 1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" stroke={scrolled ? '#1A1208' : '#FAF7F2'} />
                  </svg>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30 animate-fade-in" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2.5 w-48 bg-cream border border-stone/80 rounded-sm shadow-md py-1.5 z-40 text-left"
                      >
                        {/* Trở về trang chủ */}
                        <a
                          href={getMainUrl(locale)}
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full px-4 py-2.5 border-b border-stone/40 font-sans text-[11px] font-bold uppercase tracking-wider text-lacquer hover:bg-parchment hover:text-lacquer transition-colors cursor-pointer"
                          style={{ color: theme.primaryColor || '#8B1A1A' }}
                        >
                          {locale === 'vi' ? 'Trở về trang chủ' : 'Return to Home'}
                        </a>

                        <div className="px-4 py-2 border-b border-stone/40">
                          <p className="font-heading text-[13px] italic font-semibold text-charcoal truncate">
                            {user?.name || 'Tài khoản'}
                          </p>
                          <p className="font-sans text-[9px] text-ash truncate">
                            {user?.email}
                          </p>
                        </div>

                        {user?.role && (
                          <div className="border-b border-stone/40 py-1">
                            {user.role === 'admin' ? (
                              <a
                                href={getMainAuthUrl('login').replace('/auth/login', '/admin')}
                                onClick={() => setDropdownOpen(false)}
                                className="flex w-full px-4 py-2 text-left font-sans text-[10px] font-semibold uppercase tracking-wider text-charcoal hover:bg-parchment hover:text-lacquer transition-colors"
                              >
                                Quản trị hệ thống
                              </a>
                            ) : user.role === 'village_owner' ? (
                              <a
                                href={getMainAuthUrl('login').replace('/auth/login', '/dashboard')}
                                onClick={() => setDropdownOpen(false)}
                                className="flex w-full px-4 py-2 text-left font-sans text-[10px] font-semibold uppercase tracking-wider text-charcoal hover:bg-parchment hover:text-lacquer transition-colors"
                              >
                                Bảng quản trị
                              </a>
                            ) : null}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left font-sans text-[10px] font-semibold uppercase tracking-wider text-ash hover:bg-parchment hover:text-lacquer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{locale === 'vi' ? 'Đăng xuất' : 'Logout'}</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href={getMainAuthUrl('login')}
                  className="font-sans text-[11px] font-semibold uppercase tracking-[0.10em] hover:opacity-75 transition-opacity"
                  style={{ color: scrolled ? '#1A1208' : '#FAF7F2' }}
                >
                  {locale === 'vi' ? 'Đăng nhập' : 'Login'}
                </a>
                <a
                  href={getMainAuthUrl('register')}
                  className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-1.5 rounded-[2px] hover:opacity-90 transition-opacity"
                  style={{ background: theme.primaryColor || '#8B1A1A', color: '#FAF7F2' }}
                >
                  {locale === 'vi' ? 'Đăng ký' : 'Register'}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────── Stunning Staggered Skeleton ─────────────────── */
function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-8 space-y-8 animate-pulse select-none">
      <div className="flex flex-col items-center gap-3">
        <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
        <span className="font-heading italic text-xl text-charcoal">Khởi tạo không gian mỹ nghệ...</span>
      </div>
      <div className="w-full max-w-2xl space-y-4">
        <div className="h-6 bg-stone/40 rounded-sm w-3/4 mx-auto" />
        <div className="h-4 bg-stone/30 rounded-sm w-1/2 mx-auto" />
        <div className="h-4 bg-stone/20 rounded-sm w-5/6 mx-auto" />
      </div>
    </div>
  );
}

/* ─────────────────── Dynamic Landing Page ─────────────────── */
interface PageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default function TenantLandingPage({ params }: PageProps) {
  const { slug } = params;
  const [config, setConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    let active = true;

    const resolveConfig = async () => {
      setLoading(true);
      const remoteConfig = await fetchPageConfig(slug);
      
      if (!active) return;

      if (remoteConfig) {
        setConfig(remoteConfig);
      } else {
        // Fallback gracefully to high-fidelity offline mockups
        const mockConfig = getMockTenantConfig(slug);
        if (mockConfig) {
          setConfig(mockConfig);
          setFallbackMode(true);
        }
      }
      setLoading(false);
    };

    resolveConfig();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-primary" />
        <h2 className="font-heading text-2xl italic text-charcoal">Không tìm thấy làng nghề</h2>
        <p className="font-sans text-sm text-ash max-w-sm">
          Đường dẫn không hợp lệ hoặc cấu hình di sản chưa được thiết lập cho phân hệ slug này.
        </p>
      </div>
    );
  }

  return (
    <TenantThemeProvider theme={config.theme}>
      <link rel="canonical" href={getTenantUrl(slug)} />
      {/* Fallback alert ribbon if backend is down */}
      {fallbackMode && (
        <div className="bg-accent/15 border-b border-accent/30 py-2.5 text-center text-[10px] uppercase font-semibold tracking-wider text-bronze font-sans relative z-50">
          ⚠ Đang hiển thị bản thảo offline. Khởi chạy backend server để tải dữ liệu trực tiếp.
        </div>
      )}
      <TenantHeader />
      <main className="flex flex-col min-h-screen w-full pt-0">
        <SectionRenderer sections={config.sections} />
      </main>
    </TenantThemeProvider>
  );
}
