'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { OrnamentDivider } from './OrnamentDivider';

export default function OnboardingStatusCheck() {
  const { user, isAuthenticated } = useAuthStore();
  const t = useTranslations('onboardingCheck');
  const locale = useLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [tenantData, setTenantData] = useState<{
    name: string;
    slug: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const localStorageEmail = localStorage.getItem('hoalang_onboarding_email');
    if (!localStorageEmail) return;

    // Security Check: If user is logged in, only check if their logged-in email matches the onboarding email.
    // This prevents showing someone else's onboarding status popup to another logged-in user.
    if (isAuthenticated && user?.email && user.email.toLowerCase() !== localStorageEmail.toLowerCase()) {
      return;
    }

    const email = localStorageEmail;
    let active = true;
    let intervalId: NodeJS.Timeout | null = null;

    const checkStatus = async () => {
      try {
        const response = await api.get(`/tenant/requests/check?email=${encodeURIComponent(email)}`);
        if (!active) return;

        if (response.data && response.data.success) {
          const request = response.data.data;
          if (request.status === 'APPROVED') {
            setTenantData({
              name: request.name,
              slug: request.slug,
              email: request.email,
            });
            setStatus('APPROVED');
            setModalOpen(true);
            if (intervalId) clearInterval(intervalId);
          } else if (request.status === 'REJECTED') {
            setTenantData({
              name: request.name,
              slug: request.slug,
              email: request.email,
            });
            setStatus('REJECTED');
            setModalOpen(true);
            if (intervalId) clearInterval(intervalId);
          }
        }
      } catch (err) {
        console.warn('[OnboardingStatusCheck] Error checking onboarding status:', err);
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          // Request not found in database (e.g. DB reset/deleted). Clear localStorage to stop infinite polling.
          localStorage.removeItem('hoalang_onboarding_email');
          localStorage.removeItem('hoalang_onboarding_slug');
          localStorage.removeItem('hoalang_onboarding_name');
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      }
    };

    // Check on mount
    checkStatus();

    // Poll status every 5 seconds for real-time notifications
    intervalId = setInterval(checkStatus, 5000);

    return () => {
      active = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, isAuthenticated]);

  const handleClose = () => {
    localStorage.removeItem('hoalang_onboarding_email');
    localStorage.removeItem('hoalang_onboarding_slug');
    localStorage.removeItem('hoalang_onboarding_name');
    setModalOpen(false);
  };

  const handleLogin = () => {
    if (!tenantData) return;
    
    // Auth login is always served from the main domain
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
    const mainBase = isLocalhost ? 'http://localhost:3000' : 'https://hoalang.site';
    const loginUrl = `${mainBase}/${locale}/auth/login?email=${encodeURIComponent(tenantData.email)}`;
    
    handleClose();
    window.open(loginUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-parchment border border-stone rounded-md max-w-md w-full overflow-hidden shadow-lg p-6 relative z-10 flex flex-col gap-5 text-left select-none"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-stone/20 rounded-full transition-colors text-ash hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Organic texture layer */}
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

            <div className="relative z-10 space-y-4">
              {status === 'APPROVED' ? (
                <>
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                      {t('approvedLabel')}
                    </span>
                    <h3 className="font-heading text-2xl font-bold italic text-charcoal flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-accent shrink-0" />
                      <span>{t('approvedTitle')}</span>
                    </h3>
                  </div>

                  <OrnamentDivider className="py-1" />

                  <p className="text-xs text-ash leading-relaxed font-light font-sans">
                    {t('approvedDesc')}
                  </p>

                  <div className="bg-cream border border-stone p-4 rounded-sm space-y-2.5 font-sans text-xs">
                    <div className="flex justify-between items-center border-b border-stone/20 pb-1.5">
                      <span className="text-ash font-light">{t('villageName')}:</span>
                      <strong className="text-charcoal font-medium">{tenantData?.name}</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone/20 pb-1.5">
                      <span className="text-ash font-light">{t('contactEmail')}:</span>
                      <span className="text-charcoal font-medium font-mono">{tenantData?.email}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone/20 pb-1.5">
                      <span className="text-ash font-light">{t('subdomain')}:</span>
                      <span className="text-bronze font-bold font-mono">{tenantData?.slug}.hoalang.site</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-ash font-light">{t('status')}:</span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded-xs">
                        {t('statusActive')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-lacquer/10 border border-lacquer/20 p-4 rounded-sm text-[11px] leading-relaxed text-lacquer font-sans font-light">
                    <span className="font-semibold block mb-0.5">⚠️ {t('credentialsAlert')}</span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-grow py-3 border border-stone hover:border-bronze bg-transparent text-charcoal font-sans text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all active:scale-[0.98]"
                    >
                      {t('btnClose')}
                    </button>
                    <button
                      onClick={handleLogin}
                      className="flex-grow inline-flex items-center justify-center gap-1.5 bg-lacquer text-cream font-sans text-[10px] font-bold uppercase tracking-wider py-3.5 rounded-xs hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      <span>{t('btnLogin')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary font-sans block">
                      {t('rejectedLabel')}
                    </span>
                    <h3 className="font-heading text-2xl font-bold italic text-charcoal flex items-center gap-2">
                      <XCircle className="w-6 h-6 text-primary shrink-0" />
                      <span>{t('rejectedTitle')}</span>
                    </h3>
                  </div>

                  <OrnamentDivider className="py-1" />

                  <p className="text-xs text-ash leading-relaxed font-light font-sans">
                    {t('rejectedDesc')}
                  </p>

                  <div className="bg-cream border border-stone p-4 rounded-sm space-y-2 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-ash font-light">{t('villageName')}:</span>
                      <strong className="text-charcoal font-medium">{tenantData?.name}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-ash italic leading-relaxed pt-2">
                    {t('rejectedContact')}
                  </p>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleClose}
                      className="w-full inline-flex items-center justify-center bg-lacquer text-cream font-sans text-[10px] font-bold uppercase tracking-wider py-3 rounded-xs hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                    >
                      {t('btnClose')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
