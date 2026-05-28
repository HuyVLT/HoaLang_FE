'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Compass, ShieldAlert, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
          <span className="font-sans text-xs tracking-wider text-ash uppercase font-semibold">
            Đang tải hệ thống...
          </span>
        </div>
      </div>
    );
  }

  // Check super_admin/admin role. Allow 'ADMIN' as well in case of backend schema compatibility.
  const isSuperAdmin =
    isAuthenticated &&
    user &&
    (user.role === 'super_admin' || user.role === 'admin' || (user.role as string).toUpperCase() === 'ADMIN');

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center p-6 select-none relative">
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
        
        <div className="max-w-[480px] w-full bg-cream border border-stone p-8 text-center space-y-6 shadow-md relative z-10 rounded-sm">
          <div className="w-16 h-16 rounded-full bg-lacquer/10 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-lacquer" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
              Truy cập hạn chế / Access Restricted
            </span>
            <h2 className="font-heading text-2xl font-bold italic text-charcoal">
              Không Có Quyền Truy Cập
            </h2>
            <p className="font-sans text-xs text-ash font-light leading-relaxed">
              Bạn không có quyền quản trị tối cao của hệ thống HoaLang. Vui lòng đăng nhập bằng tài khoản Super Admin hoặc trở về Trang chủ.
            </p>
          </div>

          <div className="h-px bg-stone/50 w-full" />

          <div className="flex flex-col gap-2.5">
            <Link
              href="/auth/login"
              className="w-full bg-lacquer text-cream font-sans text-[11px] font-semibold uppercase tracking-widest py-3 rounded-xs hover:brightness-110 shadow-sm transition-all text-center block"
            >
              Đăng nhập Admin
            </Link>
            <Link
              href="/"
              className="w-full bg-transparent border border-stone text-charcoal hover:border-bronze font-sans text-[11px] font-semibold uppercase tracking-widest py-3 rounded-xs transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về Trang Chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-parchment text-ink select-none font-sans relative">
      {/* Organic background grain layer */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-0" />

      {/* ── SUPER ADMIN DESKTOP SIDEBAR ── */}
      <aside className="w-[260px] border-r border-stone bg-cream flex flex-col justify-between hidden md:flex shrink-0 relative z-10">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="px-6 py-6 border-b border-stone/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-lacquer flex items-center justify-center shadow-sm shrink-0">
              <Compass className="w-5 h-5 text-accent animate-spin duration-3000" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-semibold text-lg italic text-charcoal leading-snug">
                HoaLang Admin
              </h3>
              <span className="text-[9px] text-lacquer font-bold uppercase tracking-widest block">
                Super Operations
              </span>
            </div>
          </div>

          {/* Super Admin Info */}
          <div className="px-6 py-4 bg-stone/10 border-b border-stone/20 flex flex-col gap-1 text-left">
            <span className="text-[10px] text-ash font-medium uppercase tracking-wider">
              Tài Khoản Admin
            </span>
            <span className="text-xs font-semibold text-charcoal truncate">
              {user.name || user.email}
            </span>
            <span className="text-[9px] text-gold font-semibold uppercase tracking-widest">
              Root Level
            </span>
          </div>

          {/* Quick Menu Info */}
          <div className="p-6 space-y-4 text-left">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
              Bảng Điều Khiển
            </span>
            <p className="text-[11px] text-ash leading-relaxed font-light">
              Chào mừng bạn đến với trung tâm vận hành HoaLang SaaS. Hãy dùng các tab ở giao diện bên phải để kiểm soát toàn diện nền tảng.
            </p>
          </div>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-stone/30">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-transparent border border-lacquer/30 hover:bg-lacquer/10 rounded-xs font-sans text-[10px] font-semibold uppercase tracking-wider text-lacquer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất / Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN DISPLAY AREA ── */}
      <div className="flex-grow overflow-hidden flex flex-col relative z-10 bg-parchment">
        {children}
      </div>
    </div>
  );
}
