'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { toast } from 'sonner';
import {
  Compass,
  LayoutGrid,
  FileText,
  ShoppingBag,
  Calendar,
  CreditCard,
  UserCheck,
  Settings,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getTenantUrl } from '@/lib/tenant-url';

interface SidebarItem {
  name: string;
  labelVi: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'overview', labelVi: 'Tổng Quan', labelEn: 'Overview', icon: LayoutGrid, path: '' },
  { name: 'website', labelVi: 'Thiết Kế Web', labelEn: 'Website', icon: FileText, path: '/website' },
  { name: 'products', labelVi: 'Sản Phẩm', labelEn: 'Products', icon: ShoppingBag, path: '/products' },
  { name: 'workshops', labelVi: 'Khóa Học', labelEn: 'Workshops', icon: Calendar, path: '/workshops' },
  { name: 'orders', labelVi: 'Đơn Hàng', labelEn: 'Orders', icon: CreditCard, path: '/orders' },
  { name: 'bookings', labelVi: 'Lịch Đặt', labelEn: 'Bookings', icon: UserCheck, path: '/bookings' },
  { name: 'settings', labelVi: 'Cấu Hình', labelEn: 'Settings', icon: Settings, path: '/settings' },
];

interface DashboardSidebarProps {
  children: React.ReactNode;
}

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tenantSlug, setTenantSlug] = useState('bat-trang');
  const [tenantName, setTenantName] = useState('Làng Gốm Bát Tràng');
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 1. Authentication and basic role check
    if (!isAuthenticated || !user) {
      toast.error('Vui lòng đăng nhập để truy cập Bảng quản trị.');
      router.replace('/auth/login');
      return;
    }

    if (user.role !== 'village_owner') {
      toast.error('Tài khoản của bạn không có quyền truy cập Bảng quản trị.');
      router.replace('/');
      return;
    }

    // 2. Resolve current subdomain slug
    const host = window.location.hostname;
    let subdomain = '';
    if (host.includes('localhost')) {
      const parts = host.split('.localhost');
      if (parts[0] !== 'localhost') {
        subdomain = parts[0];
      }
    } else {
      const parts = host.split('.');
      if (parts.length > 2) {
        subdomain = parts[0];
        if (subdomain === 'www') subdomain = '';
      }
    }

    const convertSubdomainToSlug = (sub: string): string => {
      const map: Record<string, string> = {
        'battrang': 'bat-trang',
        'vanphuc': 'van-phuc',
        'nonnuoc': 'non-nuoc',
      };
      return map[sub] || sub;
    };

    const currentSlug = convertSubdomainToSlug(subdomain);
    const userTenants = user.tenants || [];

    // 3. Subdomain and Authorization matching
    if (!currentSlug) {
      // Main domain check: redirect them to their specific subdomain
      if (userTenants.length > 0) {
        const userSlug = userTenants[0].slug;
        const userTenantName = userTenants[0].name;
        sessionStorage.setItem('hoalang_tenant_slug', userSlug);
        sessionStorage.setItem('hoalang_tenant_name', userTenantName || '');
        
        console.log(`[DashboardAuth] Main domain accessed, redirecting to tenant: ${userSlug}`);
        window.location.href = getTenantUrl(userSlug, 'vi/dashboard');
      } else {
        toast.error('Tài khoản của bạn chưa liên kết với làng nghề nào.');
        router.replace('/');
      }
    } else {
      // Subdomain check: verify user owns this subdomain slug
      const isOwnerOfCurrentTenant = userTenants.some(t => t.slug === currentSlug);

      if (!isOwnerOfCurrentTenant) {
        if (userTenants.length > 0) {
          toast.error('Bạn không có quyền quản lý cửa hàng này. Đang chuyển hướng về cửa hàng của bạn...');
          window.location.href = getTenantUrl(userTenants[0].slug, 'vi/dashboard');
        } else {
          toast.error('Tài khoản của bạn không có quyền truy cập cửa hàng này.');
          router.replace('/');
        }
      } else {
        // Owner matches: set current tenant slug and name state
        const matchingTenant = userTenants.find(t => t.slug === currentSlug);
        if (matchingTenant) {
          setTenantSlug(matchingTenant.slug);
          setTenantName(matchingTenant.name);
          sessionStorage.setItem('hoalang_tenant_slug', matchingTenant.slug);
          sessionStorage.setItem('hoalang_tenant_name', matchingTenant.name || '');
        }
        setIsAuthorized(true);
      }
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthorized) {
    return (
      <div className="h-screen w-screen bg-parchment flex flex-col items-center justify-center select-none relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Compass className="w-12 h-12 text-lacquer animate-spin duration-3000" />
          <span className="font-heading italic text-lg text-charcoal font-semibold">Đang xác thực quyền truy cập / Authenticating...</span>
        </div>
      </div>
    );
  }

  // Determine active item based on current sub-path
  const getActiveItemName = () => {
    const subpath = pathname.split('/dashboard')[1] || '';
    if (!subpath || subpath === '/') return 'overview';
    const cleanSub = subpath.replace('/', '');
    return cleanSub;
  };

  const activeName = getActiveItemName();

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    window.location.href = `/vi/dashboard${path}?slug=${tenantSlug}`;
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-parchment text-ink select-none font-sans relative">
      
      {/* 1. DESKTOP SIDEBAR PANEL */}
      <aside className="w-[260px] border-r border-stone bg-cream flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Header brand emblem */}
          <div className="px-6 py-6 border-b border-stone/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-primary flex items-center justify-center shadow-sm shrink-0">
              <Compass className="w-5 h-5 text-accent animate-spin duration-3000" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-semibold text-lg italic text-charcoal leading-snug">
                Quản Trị Làng Nghề
              </h3>
              <span className="text-[10px] text-ash font-medium uppercase tracking-wider block">
                {tenantName}
              </span>
            </div>
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 space-y-1.5 flex flex-col text-left">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = activeName === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-3 rounded-xs font-sans text-xs font-semibold uppercase tracking-wider select-none transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-ash/90 hover:text-charcoal hover:bg-stone/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-ash")} />
                    <span>{item.labelVi}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-accent" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer brand external reference */}
        <div className="p-4 border-t border-stone/30">
          <a
            href={getTenantUrl(tenantSlug, 'vi')}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-stone/50 hover:border-bronze rounded-xs font-sans text-[10px] font-semibold uppercase tracking-wider text-ash hover:text-charcoal transition-all"
          >
            <span>Xem Website / View Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </a>
        </div>
      </aside>

      {/* 2. MOBILE FLOATING COLLAPSIBLE NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-stone/30 bg-cream flex items-center justify-between px-4 z-40 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 hover:bg-stone/15 rounded-sm transition-colors text-charcoal"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-heading text-lg italic font-semibold text-charcoal">
          {tenantName}
        </span>

        <div className="w-9 h-9 shrink-0" /> {/* Balance spacer */}
      </header>

      {/* 3. MOBILE SLIDE OVER SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop black layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-ink-70 backdrop-blur-xs"
            />

            {/* Content drawer pane sliding from left */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[280px] bg-cream border-r border-stone flex flex-col justify-between h-full relative z-10 p-6 select-none"
            >
              <div className="flex flex-col">
                {/* Header Close button */}
                <div className="flex items-center justify-between border-b border-stone/30 pb-4 mb-6">
                  <h3 className="font-heading font-semibold text-lg italic text-charcoal">
                    Quản Trị Làng Nghề
                  </h3>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 hover:bg-stone/15 rounded-full text-ash hover:text-charcoal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Links Navigation */}
                <nav className="space-y-1.5 flex flex-col text-left">
                  {SIDEBAR_ITEMS.map((item) => {
                    const isActive = activeName === item.name;

                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.path)}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-3 rounded-xs font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-ash/90 hover:text-charcoal hover:bg-stone/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-ash")} />
                          <span>{item.labelVi}</span>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* View Site Footer */}
              <div className="border-t border-stone/30 pt-4">
                <a
                  href={getTenantUrl(tenantSlug, 'vi')}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-stone/50 rounded-xs font-sans text-[10px] font-semibold uppercase tracking-wider text-ash font-medium"
                >
                  <span>Xem Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-accent" />
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MAIN PAGE DISPLAY CONSOLE */}
      <div className="flex-grow overflow-hidden flex flex-col md:pt-0 pt-16 relative z-10 bg-parchment">
        {children}
      </div>

    </div>
  );
}
export { DashboardSidebar };
