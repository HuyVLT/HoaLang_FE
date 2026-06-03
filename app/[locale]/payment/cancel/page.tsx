'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { getTenantUrl } from '@/lib/tenant-url';
import api from '@/lib/api';

function PaymentCancelContent() {
  const t = useTranslations('payment');
  const locale = useLocale();
  const searchParams = useSearchParams();

  const orderCode = searchParams.get('orderCode');
  const tenantSlug = searchParams.get('tenant') || 'bat-trang';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const triggerCancel = async () => {
      if (!orderCode) {
        setLoading(false);
        return;
      }
      try {
        await api.post(`/payment/payos/cancel/${orderCode}`);
      } catch (err) {
        console.error('Failed to cancel order payment:', err);
      } finally {
        setLoading(false);
      }
    };

    triggerCancel();
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
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
            VietQR PayOS Payment
          </span>
          <h2 className="font-heading text-3xl italic text-charcoal font-semibold">
            {t('cancelTitle')}
          </h2>
          <p className="font-sans text-xs text-ash leading-relaxed font-light">
            {t('cancelSubtitle')}
          </p>
        </div>

        <div className="border-t border-b border-stone/20 py-4 font-sans text-xs space-y-3">
          <div className="flex justify-between items-center text-left">
            <span className="text-ash font-light uppercase tracking-wider text-[10px]">{t('orderCode')}</span>
            <span className="font-mono font-semibold text-charcoal">{orderCode || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center text-left">
            <span className="text-ash font-light uppercase tracking-wider text-[10px]">{t('status')}</span>
            <span className="px-2.5 py-0.5 rounded-xs text-[10px] uppercase font-bold tracking-wider bg-amber-50 border border-amber-100 text-amber-800">
              {loading ? t('checking') : t('cancelled')}
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
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-screen bg-parchment flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
