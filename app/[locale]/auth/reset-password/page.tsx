'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Lock, ArrowRight, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import api from '@/lib/api';

function ResetPasswordContent() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      router.replace('/auth/login');
    }
  }, [success, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(t('resetPasswordInvalidTokenTitle'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('resetPasswordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || t('resetPasswordSuccess'));
        setSuccess(true);
      } else {
        toast.error(response.data?.message || t('resetPasswordError'));
      }
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      let errorMessage = t('resetPasswordError');
      
      const errorWithResponse = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      if (errorWithResponse.response?.data?.message) {
        const rawMsg = errorWithResponse.response.data.message;
        if (rawMsg.includes('password') && rawMsg.includes('Validation failed')) {
          errorMessage = t('validationPassword');
        } else {
          errorMessage = rawMsg;
        }
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
            {t('loginQuoteTitle')}
          </span>
          <h1 className="font-heading text-4xl lg:text-5xl font-light italic text-cream leading-tight whitespace-pre-line">
            {t('resetPasswordQuoteHeader')}
          </h1>
          <p className="font-sans text-xs text-cream/70 leading-relaxed font-light">
            {t('resetPasswordQuoteDesc')}
          </p>

          <OrnamentDivider className="text-gold/30 !justify-start" />
        </div>

        {/* Footer brand info */}
        <div className="flex items-center justify-between text-[10px] text-cream/45 relative z-10 font-sans tracking-wide">
          <span>&copy; {new Date().getFullYear()} HoaLang Platform</span>
          <span>{t('artisanalHeritage')}</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Splendid Reset Form Panel ── */}
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
            {!token ? (
              <motion.div
                key="invalid-token"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6 py-6"
              >
                <div className="flex justify-center">
                  <AlertTriangle className="w-16 h-16 text-primary animate-pulse" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gold block">
                    {t('resetPasswordErrorTitle')}
                  </span>
                  <h3 className="font-heading text-3xl font-light italic text-charcoal">
                    {t('resetPasswordErrorTitle')}
                  </h3>
                  <p className="font-sans text-xs text-ash leading-relaxed font-light px-2">
                    {t('resetPasswordErrorDesc')}
                  </p>
                </div>

                <div className="w-12 h-[1px] bg-stone/60 mx-auto" />

                <div className="pt-2">
                  <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all">
                    <span>{t('retry')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ) : !success ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Form Header */}
                <div className="space-y-2 text-left">
                  <SectionLabel label={t('resetPasswordTitle')} />
                  <h2 className="font-heading text-3xl font-bold italic text-charcoal leading-none">
                    {t('resetPasswordTitle')}
                  </h2>
                  <p className="font-sans text-xs text-ash font-light leading-relaxed">
                    {t('resetPasswordDesc')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Input field: Password */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-accent" />
                      <span>{t('newPasswordLabel')}</span>
                    </label>
                    
                    <input
                      type="password"
                      placeholder={t('newPasswordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-parchment border border-stone focus:border-bronze focus:outline-none rounded-xs px-4 py-3 font-sans text-xs text-charcoal placeholder-ash/50 transition-colors"
                    />
                  </div>

                  {/* Input field: Confirm Password */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-ash flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-accent" />
                      <span>{t('confirmPasswordLabel')}</span>
                    </label>
                    
                    <input
                      type="password"
                      placeholder={t('confirmPasswordPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                          <span>Đang đặt lại / Resetting...</span>
                        </>
                      ) : (
                        <>
                          <span>{t('submitResetPassword')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
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
                    {t('resetPasswordSuccess')}
                  </span>
                  <h3 className="font-heading text-3xl font-light italic text-charcoal">
                    {t('resetPasswordSuccess')}
                  </h3>
                  <p className="font-sans text-xs text-ash leading-relaxed font-light px-2">
                    {t('resetPasswordSuccessDesc', { count: countdown })}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
