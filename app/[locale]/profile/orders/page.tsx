'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authService } from '@/lib/services/authService';
import { PageHeader, TagBadge } from '@/components/shared';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ShoppingBag, Calendar, ArrowLeft, ClipboardList, Users, ShieldAlert, CreditCard } from 'lucide-react';
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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

type FilterType = 'all' | 'product' | 'booking';

export default function OrdersHistoryPage() {
  const t = useTranslations('profile');
  const tNav = useTranslations('nav');
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

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
      const fetchOrders = async () => {
        setLoading(true);
        const data = await authService.getOrders();
        if (data) {
          setOrders(data);
        } else {
          toast.error(t('notAvailable') || 'Không thể đồng bộ lịch sử giao dịch.');
        }
        setLoading(false);
      };
      fetchOrders();
    }
  }, [mounted, isAuthenticated]);

  const formatAmount = (value: number) => {
    try {
      if (locale === 'vi') {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(value);
      }
      
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
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string, orderType: 'product' | 'booking') => {
    const s = status.toUpperCase();
    
    // Status translation keys mapping
    const statusMap: Record<string, string> = {
      PENDING: t('pending') || 'Chờ xử lý',
      PAID: t('paid') || 'Đã thanh toán',
      CONFIRMED: t('confirmed') || 'Đã xác nhận',
      COMPLETED: t('completed') || 'Hoàn thành',
      SHIPPED: t('shipped') || 'Đang giao',
      DELIVERED: t('delivered') || 'Đã giao',
      CANCELLED: t('cancelled') || 'Đã hủy',
      FAILED: t('failed') || 'Lỗi',
    };

    const label = statusMap[s] || status;

    if (['PAID', 'DELIVERED', 'CONFIRMED', 'COMPLETED'].includes(s)) {
      return <TagBadge label={label} variant="gold" />;
    } else if (['CANCELLED', 'FAILED'].includes(s)) {
      return <TagBadge label={label} variant="lacquer" />;
    }
    return <TagBadge label={label} variant="stone" />;
  };

  // Filtered orders list
  const filteredOrders = orders.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center selection:bg-lacquer/10 selection:text-lacquer">
        <Compass className="w-8 h-8 text-lacquer animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment pb-24 selection:bg-lacquer/10 selection:text-lacquer">
      {/* Premium light variant page header */}
      <PageHeader
        title={t('ordersTitle')}
        subtitle={t('ordersSubtitle')}
        breadcrumbs={[
          { label: tNav('home'), href: '/' },
          { label: t('ordersBreadcrumb'), href: '/profile/orders' }
        ]}
        variant="light"
      />

      <div className="max-w-[850px] mx-auto px-6 pt-8">
        
        {/* Navigation Tabs - Filter */}
        <div className="flex border-b border-stone/60 mb-8 font-sans text-xs font-semibold uppercase tracking-wider select-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-3 border-b-2 transition-all ${
              filter === 'all' 
                ? 'border-lacquer text-lacquer font-bold' 
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {locale === 'vi' ? 'Tất cả' : 'All'}
          </button>
          <button
            onClick={() => setFilter('product')}
            className={`px-4 py-3 border-b-2 transition-all ${
              filter === 'product' 
                ? 'border-lacquer text-lacquer font-bold' 
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {t('productOrder')}
          </button>
          <button
            onClick={() => setFilter('booking')}
            className={`px-4 py-3 border-b-2 transition-all ${
              filter === 'booking' 
                ? 'border-lacquer text-lacquer font-bold' 
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            {t('bookingOrder')}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
            <p className="font-sans text-xs uppercase tracking-widest text-ash">
              {t('loading') || 'Đang tải lịch sử giao dịch...'}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full bg-cream border border-stone/80 rounded-sm p-12 text-center shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
              <ClipboardList className="w-12 h-12 text-stone/60" />
              <p className="font-sans text-sm text-ash">
                {t('emptyOrders') || 'Bạn chưa thực hiện giao dịch nào.'}
              </p>
              <button
                onClick={() => router.push('/profile')}
                className="bg-transparent border border-stone text-ash hover:text-charcoal hover:border-charcoal font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-sm shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('btnCancel') || 'Quay lại'}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredOrders.map((item) => {
                  const isProduct = item.type === 'product';
                  const tenantName = item.tenant?.name || 'Làng nghề';

                  return (
                    <motion.div
                      key={item._id}
                      variants={fadeUp}
                      layout
                      className="group relative bg-cream border border-stone/80 rounded-sm overflow-hidden shadow-sm hover:translate-y-[-4px] hover:shadow-hover transition-all duration-300 flex flex-col"
                    >
                      {/* Organic grain background layer */}
                      <div className="absolute inset-0 bg-grain pointer-events-none opacity-20 z-0" />

                      {/* Editorial corner borders */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gold/20 pointer-events-none" />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gold/20 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gold/20 pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gold/20 pointer-events-none" />

                      {/* Card Top Header */}
                      <div className="relative z-10 p-5 md:p-6 border-b border-stone/30 flex flex-wrap justify-between items-center gap-3 bg-stone/5 select-none">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded-xs border border-gold/20">
                            {isProduct ? t('productOrder') : t('bookingOrder')}
                          </span>
                          <span className="font-heading text-lg font-semibold italic text-charcoal">
                            {tenantName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-ash text-xs font-sans">
                          <Calendar className="w-3.5 h-3.5 text-stone" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10 p-5 md:p-6 flex-grow">
                        {isProduct ? (
                          // Render Product Items List
                          <div className="space-y-4">
                            {item.items?.map((prodItem: any, idx: number) => {
                              const imgUrl = prodItem.productId?.images?.[0] || null;
                              return (
                                <div key={idx} className="flex gap-4 items-center">
                                  {/* Product image square wrapper */}
                                  <div className="w-12 h-12 rounded-sm overflow-hidden border border-stone bg-parchment shrink-0 flex items-center justify-center">
                                    {imgUrl ? (
                                      <img
                                        src={imgUrl}
                                        alt={prodItem.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <ShoppingBag className="w-5 h-5 text-stone/40" />
                                    )}
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <h5 className="font-heading text-md font-semibold text-charcoal truncate">
                                      {prodItem.name}
                                    </h5>
                                    <p className="font-sans text-xs text-ash">
                                      {formatAmount(prodItem.price)} x {prodItem.qty}
                                    </p>
                                  </div>
                                  <div className="font-sans text-xs font-semibold text-charcoal">
                                    {formatAmount(prodItem.price * prodItem.qty)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          // Render Workshop Booking Details
                          <div className="flex gap-4 items-center">
                            {/* Workshop cover image aspect wrapper */}
                            <div className="w-16 h-16 rounded-sm overflow-hidden border border-stone bg-parchment shrink-0 flex items-center justify-center">
                              {item.experienceId?.coverImage ? (
                                <img
                                  src={item.experienceId.coverImage}
                                  alt={item.experienceId.title?.[locale] || 'Workshop'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Compass className="w-6 h-6 text-stone/40" />
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h5 className="font-heading text-md font-semibold text-charcoal truncate">
                                {item.experienceId?.title?.[locale] || item.experienceId?.title?.vi || 'Workshop di sản'}
                              </h5>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-sans text-xs text-ash">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-stone" />
                                  {new Date(item.date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-stone" />
                                  {t('guestsCount', { count: item.guests })}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer - Statuses & Total */}
                      <div className="relative z-10 p-5 md:p-6 border-t border-stone/30 flex flex-wrap justify-between items-center gap-4 bg-stone/5 font-sans text-xs select-none">
                        
                        {/* Transaction and Payment Statuses */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-ash font-light uppercase tracking-wider text-[10px]">
                              {t('paymentStatus')}:
                            </span>
                            <span className="flex items-center gap-1 text-charcoal font-semibold">
                              <CreditCard className="w-3.5 h-3.5 text-gold" />
                              <span>{item.payment?.method || 'N/A'}</span>
                            </span>
                            {getStatusBadge(item.payment?.status || 'PENDING', item.type)}
                          </div>

                          <div className="flex items-center gap-1.5 border-l border-stone/40 pl-4">
                            <span className="text-ash font-light uppercase tracking-wider text-[10px]">
                              {t('orderStatus')}:
                            </span>
                            {getStatusBadge(item.status || 'PENDING', item.type)}
                          </div>
                        </div>

                        {/* Order Total Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-ash font-light uppercase tracking-wider text-[10px]">
                            {t('totalAmount')}:
                          </span>
                          <span className="font-heading text-xl font-bold text-lacquer">
                            {formatAmount(isProduct ? item.total : item.totalPrice)}
                          </span>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
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
