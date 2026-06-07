'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
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

      {/* ── MAIN DISPLAY AREA ── */}
      <div className="flex-grow overflow-hidden flex flex-col relative z-10 bg-parchment">
        {children}
      </div>
    </div>
  );
}
