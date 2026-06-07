'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';
import api from '@/lib/api';

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('auth');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const hasRequested = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setErrorMessage(t('activationFailedDesc'));
      return;
    }

    if (hasRequested.current) return;
    hasRequested.current = true;

    const verify = async () => {
      try {
        console.log('[VerifyAccount] Verifying activation token...', token);
        const response = await api.get(`/auth/verify-account?token=${token}`);
        
        if (response.data && response.data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(response.data?.message || t('activationFailedDesc'));
        }
      } catch (err: unknown) {
        console.error('[VerifyAccount] Verification API error:', err);
        const axiosError = err as { response?: { data?: { message?: string } } };
        setStatus('error');
        setErrorMessage(
          axiosError.response?.data?.message || t('activationFailedDesc')
        );
      }
    };

    verify();
  }, [searchParams, t]);

  // Countdown timer for automatic redirection on success
  useEffect(() => {
    if (status !== 'success') return;

    if (countdown === 0) {
      router.replace('/auth/login?verified=true');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-parchment relative overflow-hidden px-6 select-none">
      {/* Background grain layer */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
      
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-stone/40" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-stone/40" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-stone/40" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-stone/40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[460px] w-full bg-cream border border-stone/80 rounded-sm p-8 text-center shadow-sm hover:shadow-hover transition-all duration-500 relative z-10 space-y-6"
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6 space-y-4"
            >
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-lacquer animate-spin" />
              </div>
              <div className="space-y-1">
                <SectionLabel label={t('securityGateway')} />
                <h2 className="font-heading text-2xl font-light italic text-charcoal">
                  {t('activating')}
                </h2>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-2 space-y-6"
            >
              <div className="flex justify-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-lacquer/10 rounded-full flex items-center justify-center border border-lacquer/30"
                >
                  <CheckCircle2 className="w-8 h-8 text-lacquer" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <SectionLabel label={t('accountActivated')} />
                <h2 className="font-heading text-3xl font-light italic text-charcoal leading-tight">
                  {t('activationSuccess')}
                </h2>
                <p className="font-sans text-xs text-ash leading-relaxed font-light">
                  {t('activationSuccessDesc')}
                </p>
              </div>

              <div className="bg-parchment border border-stone rounded-xs p-4 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="font-sans text-[11px] font-medium tracking-wide text-charcoal uppercase">
                  {t('redirectingIn', { count: countdown })}
                </span>
              </div>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-lacquer text-cream font-sans text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{t('loginNow')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-2 space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center border border-gold/30"
                >
                  <XCircle className="w-8 h-8 text-gold" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <SectionLabel label={t('verificationFailed')} />
                <h2 className="font-heading text-3xl font-light italic text-charcoal leading-tight">
                  {t('activationFailed')}
                </h2>
                <p className="font-sans text-xs text-ash leading-relaxed font-light">
                  {errorMessage}
                </p>
              </div>

              <OrnamentDivider className="text-stone/60" />

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-transparent border border-stone text-charcoal font-sans text-xs font-semibold uppercase tracking-widest py-3.5 rounded-xs hover:border-bronze shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{t('goToLogin')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-12 h-[1px] bg-stone/60 mx-auto" />

        <div className="flex items-center justify-center gap-2 text-[10px] text-ash tracking-wider uppercase">
          <span>HoaLang Platform</span>
          <span>•</span>
          <span>{t('artisanalHeritage')}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    }>
      <VerifyAccountContent />
    </Suspense>
  );
}
