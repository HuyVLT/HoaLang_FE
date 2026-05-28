'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { PageConfig } from '@/types/tenant';
import { getMockTenantConfig } from '@/lib/mockTenants';
import TenantThemeProvider, { useTenantTheme } from '@/components/tenant/TenantThemeProvider';
import SectionRenderer from '@/components/tenant/SectionRenderer';

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

  useEffect(() => {
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
        <a href="#" className="font-heading text-2xl font-semibold tracking-wide flex items-center gap-2.5">
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

        {/* Visual Builder Shortcut */}
        <a
          href={`./${theme.logo?.includes('van-phuc') || theme.primaryColor === '#8B1A1A' ? 'van-phuc' : 'bat-trang'}/builder`}
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-4 py-2 rounded-sm border border-primary hover:brightness-110 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Visual Builder</span>
        </a>
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
