'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Link } from '@/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import api from '@/lib/api';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already logged in, redirect to home
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data && response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Map backend user response properties to the store structure
        const mappedUser = {
          id: user._id || user.id,
          email: user.email,
          name: user.fullName || user.name,
          role: user.role.toLowerCase(), // Store roles in lowercase for consistency
          avatar: user.avatar,
        };

        login(mappedUser, accessToken, refreshToken);
        toast.success('Đăng nhập hệ thống thành công!');

        // Dynamic redirect based on role
        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else if (user.role === 'VILLAGE_OWNER') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        toast.error(response.data?.message || 'Đăng nhập thất bại.');
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Login error:', err);
      
      let errorMessage = 'Email hoặc mật khẩu không chính xác.';
      
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          if (err.response.data.includes('<!DOCTYPE html>') || err.response.data.includes('<html')) {
            errorMessage = 'Lỗi kết nối: Không thể kết nối tới máy chủ Back-End (404 Not Found).';
          } else {
            errorMessage = err.response.data;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-parchment select-none overflow-hidden relative">
      {/* Organic grain background layer */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      {/* ── LEFT COLUMN: Luxury Editorial Presentation (Desktop only) ── */}
      <div className="hidden md:flex md:w-1/2 bg-charcoal text-cream flex-col justify-between p-12 relative overflow-hidden shrink-0 border-r border-stone/20">
        {/* Gorgeous generated pottery background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 z-0" 
          style={{ backgroundImage: "url('/images/login_pottery_bg.png')" }}
        />
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />
        
        {/* Decorative corner borders */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/40" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-gold/40" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-gold/40" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/40" />

        {/* Header brand logo */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10 self-start">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="2" width="16.97" height="16.97" rx="1.5" transform="rotate(45 14 2)" stroke="#C4952A" strokeWidth="1.8" fill="none" />
            <rect x="14" y="8" width="8.49" height="8.49" transform="rotate(45 14 8)" fill="#C4952A" opacity="0.9" />
            <circle cx="14" cy="14" r="1.5" fill="#FAF7F2" />
          </svg>
          <span className="font-heading font-semibold text-2xl tracking-wide text-cream group-hover:text-gold transition-colors">
            HoaLang
          </span>
        </Link>

        {/* Centerpiece Quote block */}
        <div className="space-y-6 relative z-10 my-auto text-left max-w-lg mx-auto">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gold block">
            Di sản truyền thống / Vietnamese Craft Heritage
          </span>
          <h1 className="font-heading text-4xl lg:text-5xl font-light italic text-cream leading-tight">
            Giữ gìn hồn cốt,<br />
            nâng niu bàn tay Việt.
          </h1>
          <p className="font-sans text-xs text-cream/70 leading-relaxed font-light">
            Mỗi sợi tơ tằm Hàng Kênh, mỗi bình gốm đỏ Bát Tràng là tinh hoa trầm tích ngàn năm của giọt nước sông Hồng và phù sa đất mẹ. Đăng nhập để kiến thiết và giới thiệu di sản của bạn tới thế giới.
          </p>

          <OrnamentDivider className="text-gold/30 !justify-start" />

          {/* Core analytical attributes */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <span className="text-xl font-heading font-bold italic text-gold block">100%</span>
              <span className="text-[9px] uppercase tracking-wider text-cream/60 block">Sản phẩm chính gốc / Heritage Origin</span>
            </div>
            <div className="space-y-1">
              <span className="text-xl font-heading font-bold italic text-gold block">SaaS M-T</span>
              <span className="text-[9px] uppercase tracking-wider text-cream/60 block">Cơ sở dữ liệu biệt lập / Isolated Tenant DB</span>
            </div>
          </div>
        </div>

        {/* Footer brand info */}
        <div className="flex items-center justify-between text-[10px] text-cream/45 relative z-10 font-sans tracking-wide">
          <span>&copy; {new Date().getFullYear()} HoaLang Platform</span>
          <span>Tinh hoa Làng nghề Việt / Artisanal Heritage</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Splendid Auth Form Panel ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-6 left-6 flex items-center gap-2 md:hidden">
          <Compass className="w-5 h-5 text-lacquer" />
          <span className="font-heading font-semibold text-xl text-charcoal">
            HoaLang
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[420px] w-full bg-cream border border-stone/80 rounded-sm p-8 shadow-sm hover:shadow-hover transition-all duration-500"
        >
          {/* Form Header */}
          <div className="space-y-2 text-left mb-8">
            <SectionLabel label="Cửa ngõ quản trị / Credentials Gateway" />
            <h2 className="font-heading text-3xl font-bold italic text-charcoal leading-none">
              {t('auth.loginTitle')}
            </h2>
            <p className="font-sans text-xs text-ash font-light leading-relaxed">
              Truy cập bảng điều khiển vận hành Làng nghề hoặc cổng Quản lý Hệ thống.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input field: Email */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>{t('auth.emailLabel')}</span>
              </label>
              
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@hoalang.vn hoặc email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
                />
              </div>
            </div>

            {/* Input field: Password */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span>{t('auth.passwordLabel')}</span>
                </label>
                <Link href="/auth/forgot-password" className="text-[10px] font-semibold uppercase tracking-wider text-bronze hover:text-lacquer transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
                />
              </div>
            </div>

            {/* Default credentials alert box */}
            <div className="bg-parchment border border-stone rounded-xs p-4 text-left space-y-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tài khoản thử nghiệm hệ thống</span>
              </span>
              
              <div className="font-mono text-[10px] text-ash space-y-1 leading-normal">
                <div>
                  • Super Admin: <span className="font-semibold text-charcoal">admin@hoalang.vn</span> / <span className="font-semibold text-charcoal">Admin@123</span>
                </div>
                <div>
                  • Bát Tràng Owner: <span className="font-semibold text-charcoal">owner@battrang.vn</span> / <span className="font-semibold text-charcoal">TruongHuy888!</span>
                </div>
                <div>
                  • Traveler Demo: <span className="font-semibold text-charcoal">traveler@gmail.com</span> / <span className="font-semibold text-charcoal">TruongHuy888!</span>
                </div>
              </div>
            </div>

            {/* Form action submission */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Nhập Hệ Thống</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Breathtaking luxury editorial divider */}
              <div className="relative flex items-center justify-center py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone/50"></div>
                </div>
                <span className="relative px-3 bg-cream font-heading text-xs italic text-ash">
                  hoặc / or
                </span>
              </div>

              {/* Premium Google OAuth SSO Button */}
              <button
                type="button"
                onClick={() => {
                  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
                  window.location.href = `${backendUrl}/auth/google`;
                }}
                className="w-full bg-transparent border border-stone text-charcoal font-sans text-[11px] font-semibold uppercase tracking-widest py-3.5 rounded-xs hover:border-bronze hover:text-bronze shadow-sm transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Đăng Nhập Bằng Google</span>
              </button>

              <div className="text-center text-xs text-ash leading-relaxed font-light">
                {t('auth.noAccount')}{' '}
                <Link href="/auth/register" className="text-bronze hover:text-lacquer font-semibold underline transition-colors">
                  {t('auth.submitRegister')}
                </Link>
              </div>
            </div>

          </form>

        </motion.div>

      </div>
    </div>
  );
}
