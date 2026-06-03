'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { getTenantUrl } from '@/lib/tenant-url';
import api from '@/lib/api';

function PaymentSuccessContent() {
  const t = useTranslations('payment');
  const locale = useLocale();
  const searchParams = useSearchParams();

  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status') || 'PAID';
  const tenantSlug = searchParams.get('tenant') || 'bat-trang';

  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState(status);

  useEffect(() => {
    const checkStatus = async () => {
      if (!orderCode) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/payment/status/${orderCode}`);
        if (res.data && res.data.success) {
          setRealtimeStatus(res.data.data.status);
        }
      } catch (err) {
        console.error('Failed to verify payment status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [orderCode]);

  const handleGoHome = () => {
    window.location.href = getTenantUrl(tenantSlug, `/${locale}`);
  };

  return (
    <div className="min-h-screen w-full bg-parchment flex items-center justify-center p-6 select-none relative font-sans">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-stone/40 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-stone/40 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-stone/40 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-stone/40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[480px] w-full bg-cream border border-stone rounded-sm p-8 md:p-10 shadow-sm relative z-10 text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            VietQR PayOS Payment
          </span>
          <h2 className="font-heading text-3xl italic text-charcoal font-semibold">
            {t('successTitle')}
          </h2>
          <p className="font-sans text-xs text-ash leading-relaxed font-light">
            {t('successSubtitle')}
          </p>
        </div>

        <div className="border-t border-b border-stone/20 py-4 font-sans text-xs space-y-3">
          <div className="flex justify-between items-center text-left">
            <span className="text-ash font-light uppercase tracking-wider text-[10px]">{t('orderCode')}</span>
            <span className="font-mono font-semibold text-charcoal">{orderCode || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-left">
            <span className="text-ash font-light uppercase tracking-wider text-[10px]">{t('status')}</span>
            <span className="px-2.5 py-0.5 rounded-xs text-[10px] uppercase font-bold tracking-wider bg-emerald-50 border border-emerald-100 text-emerald-800">
              {loading ? t('checking') : realtimeStatus === 'PAID' ? t('verified') : realtimeStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 select-none">
          <button
            onClick={handleGoHome}
            className="w-full inline-flex items-center justify-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-wider text-[10px] py-3.5 rounded-sm hover:brightness-110 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('btnBack')}</span>
          </button>
          
          <button
            onClick={() => window.location.href = `/${locale}/profile`}
            className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-stone text-charcoal hover:border-bronze hover:text-bronze font-sans font-semibold uppercase tracking-wider text-[10px] py-3.5 rounded-sm transition-all"
          >
            <span>{t('btnDashboard')}</span>
            <ChevronRight className="w-4 h-4 text-gold" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
