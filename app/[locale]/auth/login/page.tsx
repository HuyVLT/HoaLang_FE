'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Link } from '@/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, ShieldAlert, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock delay to simulate backend round-trip
    setTimeout(() => {
      if (email === 'admin@restx.food' && password === 'Admin@123') {
        login(
          {
            id: 'admin-id-1',
            email: 'admin@restx.food',
            name: 'Super Admin',
            role: 'super_admin',
          },
          'mock-jwt-token-123456'
        );
        toast.success('Đăng nhập hệ thống Super Admin thành công!');
        router.push('/admin');
      } else if (email && password) {
        // Log in as standard tenant_admin (VILLAGE_OWNER / artisan) if email & password entered
        login(
          {
            id: 'tenant-id-abc',
            email: email,
            name: email.split('@')[0],
            role: 'tenant_admin',
          },
          'mock-jwt-token-standard'
        );
        toast.success('Đăng nhập cổng quản trị Làng nghề thành công!');
        router.push('/dashboard');
      } else {
        toast.error(t('auth.errorAuth'));
      }
      setLoading(false);
    }, 1000);
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
                  placeholder="admin@restx.food hoặc email của bạn"
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
                <a href="#forgot" className="text-[10px] font-semibold uppercase tracking-wider text-bronze hover:text-lacquer transition-colors">
                  Quên mật khẩu?
                </a>
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
                <span>Tài khoản thử nghiệm mặc định</span>
              </span>
              
              <div className="font-mono text-[10px] text-ash space-y-1 leading-normal">
                <div>
                  • Super Admin: <span className="font-semibold text-charcoal">admin@restx.food</span> / <span className="font-semibold text-charcoal">Admin@123</span>
                </div>
                <div>
                  • Tenant Artisan: <span className="font-semibold text-charcoal">battrang@hoalang.vn</span> / <span className="font-semibold text-charcoal">battrang123</span> (hoặc email bất kỳ)
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
