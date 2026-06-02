'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { voucherService, Voucher } from '@/lib/services/voucherService';
import { PageHeader, LocaleText, TagBadge } from '@/components/shared';
import { motion } from 'framer-motion';
import { Compass, Ticket, Copy, Check, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function VouchersPage() {
  const t = useTranslations('vouchers');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      const fetchVouchers = async () => {
        setLoading(true);
        const data = await voucherService.getActiveVouchers();
        setVouchers(data);
        setLoading(false);
      };
      fetchVouchers();
    }
  }, [mounted, isAuthenticated]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    
    // Localization interpolation or simple fallback
    const copyMessage = t('copied', { code }) || `Đã sao chép mã ${code}!`;
    toast.success(copyMessage);

    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const formatAmount = (value: number) => {
    try {
      if (locale === 'vi') {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(value);
      }
      
      // Formatted in USD using a simplified local conversion for international users
      const usdValue = value / 25000;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: usdValue % 1 === 0 ? 0 : 2,
      }).format(usdValue);
    } catch {
      return `${value.toLocaleString()} ₫`;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center selection:bg-lacquer/10 selection:text-lacquer">
        <Compass className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment pb-24 selection:bg-lacquer/10 selection:text-lacquer">
      {/* Light Variant Editorial Page Header */}
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[
          { label: tNav('home'), href: '/' },
          { label: t('breadcrumb'), href: '/profile/vouchers' }
        ]}
        variant="light"
      />

      <div className="max-w-[850px] mx-auto px-6 pt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
            <p className="font-sans text-xs uppercase tracking-widest text-ash">
              {t('loading') || 'Đang tải mã giảm giá...'}
            </p>
          </div>
        ) : vouchers.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full bg-cream border border-stone/80 rounded-sm p-12 text-center shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
              <Ticket className="w-12 h-12 text-stone/60" />
              <p className="font-sans text-sm text-ash">
                {t('noVouchers')}
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="bg-transparent border border-stone text-ash hover:text-charcoal hover:border-charcoal font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-sm shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('btnBackProfile')}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid gap-6"
            >
              {vouchers.map((voucher) => {
                const isCopied = copiedCode === voucher.code;
                const valueText = voucher.discountType === 'PERCENTAGE' 
                  ? t('percentageOff', { value: voucher.discountValue })
                  : t('fixedOff', { value: formatAmount(voucher.discountValue) });

                return (
                  <motion.div
                    key={voucher._id}
                    variants={fadeUp}
                    className="group relative bg-cream border border-stone/80 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-sm hover:translate-y-[-5px] hover:shadow-hover transition-all duration-300"
                  >
                    {/* Organic grain background layer */}
                    <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />

                    {/* Classic editorial corner borders */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/20 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/20 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/20 pointer-events-none" />

                    {/* Left block: Discount Type Badge styling */}
                    <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-8 bg-lacquer/5 border-b md:border-b-0 md:border-r border-stone/60 md:w-52 shrink-0 select-none">
                      <div className="absolute top-0 bottom-0 right-[-6px] hidden md:flex flex-col justify-between py-1 pointer-events-none">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-parchment border border-stone/80 -translate-x-1/2" />
                        ))}
                      </div>
                      <Ticket className="w-6 h-6 text-gold mb-2" />
                      <h3 className="font-heading text-3xl font-bold text-lacquer text-center leading-none">
                        {valueText}
                      </h3>
                      <div className="mt-2 text-center">
                        <TagBadge 
                          label={voucher.code} 
                          variant="lacquer" 
                        />
                      </div>
                    </div>

                    {/* Middle block: Details */}
                    <div className="relative z-10 p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-heading text-xl italic font-semibold text-charcoal leading-snug">
                          {voucher.code}
                        </h4>
                        <div className="font-sans text-sm text-ash leading-relaxed">
                          <LocaleText content={voucher.description} />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t border-stone/20 font-sans text-xs text-ash">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                          <span>
                            {t('minOrder', { amount: formatAmount(voucher.minOrderValue) })}
                          </span>
                        </div>
                        {voucher.maxDiscountValue && (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                            <span>
                              {t('maxDiscount', { amount: formatAmount(voucher.maxDiscountValue) })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone" />
                          <span>
                            {t('validUntil', { date: formatDate(voucher.endDate) })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right block: Action */}
                    <div className="relative z-10 p-6 md:p-8 flex items-center justify-center md:border-l border-stone/20 shrink-0">
                      <button
                        onClick={() => handleCopy(voucher.code)}
                        className={`w-full md:w-auto font-sans text-xs font-semibold uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.97] ${
                          isCopied 
                            ? 'bg-gold text-cream hover:bg-gold/90' 
                            : 'bg-lacquer text-cream hover:bg-lacquer/90'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('copied', { code: '' }).trim() || 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t('copyCode')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Back action */}
            <div className="flex justify-center pt-8">
              <button
                onClick={() => router.push('/profile')}
                className="bg-transparent border border-stone text-ash hover:text-charcoal hover:border-charcoal font-sans text-xs font-semibold uppercase tracking-widest px-10 py-3.5 rounded-sm shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('btnBackProfile')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
