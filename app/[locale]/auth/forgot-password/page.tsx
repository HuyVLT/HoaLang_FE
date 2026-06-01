'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { Link } from '@/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Yêu cầu khôi phục mật khẩu đã được gửi!');
        setSuccess(true);
      } else {
        toast.error(response.data?.message || 'Yêu cầu khôi phục thất bại.');
      }
    } catch (err: unknown) {
      console.error('Forgot password error:', err);
      let errorMessage = 'Gửi yêu cầu khôi phục thất bại. Vui lòng thử lại sau.';
      
      const errorWithResponse = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      if (errorWithResponse.response?.data?.message) {
        errorMessage = errorWithResponse.response.data.message;
      } else if (errorWithResponse.message) {
        errorMessage = errorWithResponse.message;
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

      {/* ── LEFT COLUMN: Luxury Editorial Presentation (Pottery Theme) ── */}
      <div className="hidden md:flex md:w-1/2 bg-charcoal text-cream flex-col justify-between p-12 relative overflow-hidden shrink-0 border-r border-stone/20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 z-0" 
          style={{ backgroundImage: "url('/images/login_pottery_bg.png')" }}
        />
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
            Khôi phục lối vào,<br />
            tiếp tục dệt ước mơ.
          </h1>
          <p className="font-sans text-xs text-cream/70 leading-relaxed font-light">
            Đừng lo lắng nếu bạn tạm thời quên lối vào không gian di sản của mình. HoaLang luôn sẵn sàng hỗ trợ bạn thiết lập một chìa khóa mới để tiếp tục hành trình bảo tồn văn hóa Việt.
          </p>

          <OrnamentDivider className="text-gold/30 !justify-start" />
        </div>

        {/* Footer brand info */}
        <div className="flex items-center justify-between text-[10px] text-cream/45 relative z-10 font-sans tracking-wide">
          <span>&copy; {new Date().getFullYear()} HoaLang Platform</span>
          <span>Tinh hoa Làng nghề Việt / Artisanal Heritage</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Splendid Recovery Form Panel ── */}
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
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Form Header */}
                <div className="space-y-2 text-left">
                  <SectionLabel label="Quên mật khẩu / Password recovery" />
                  <h2 className="font-heading text-3xl font-bold italic text-charcoal leading-none">
                    {t('forgotPasswordTitle')}
                  </h2>
                  <p className="font-sans text-xs text-ash font-light leading-relaxed">
                    {t('forgotPasswordDesc')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Input field: Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-accent" />
                      <span>{t('emailLabel')}</span>
                    </label>
                    
                    <input
                      type="email"
                      placeholder="Nhập địa chỉ email của bạn..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
                    />
                  </div>

                  {/* Form action submission */}
                  <div className="space-y-4 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang gửi / Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>{t('submitForgotPassword')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <div className="text-center text-xs text-ash leading-relaxed font-light">
                      <Link href="/auth/login" className="text-bronze hover:text-lacquer font-semibold underline transition-colors">
                        {t('goToLogin')}
                      </Link>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6 py-6"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-accent animate-bounce" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold block">
                    Gửi thư thành công / Email Sent
                  </span>
                  <h3 className="font-heading text-3xl font-light italic text-charcoal">
                    {t('forgotPasswordSuccess')}
                  </h3>
                  <p className="font-sans text-xs text-ash leading-relaxed font-light px-2">
                    {t('forgotPasswordSuccessDesc')}
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-stone/60 mx-auto" />

                <div className="pt-2">
                  <Link href="/auth/login" className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all">
                    <span>{t('goToLogin')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
