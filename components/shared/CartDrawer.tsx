'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { useLocale, useTranslations } from 'next-intl';
import {
  X,
  ShoppingBag,
  CheckCircle,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Trash2,
  Minus,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Voucher } from '@/lib/services/voucherService';
import { useCartStore } from '@/lib/store/cartStore';

interface CartDrawerStore {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartDrawerStore = create<CartDrawerStore>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

export default function CartDrawer() {
  const locale = useLocale() as 'vi' | 'en';
  const t = useTranslations('checkout');
  const { isOpen, closeCart } = useCartDrawerStore();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  const [step, setStep] = useState<'cart' | 'form' | 'processing' | 'success'>('cart');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'COD',
  });

  // Voucher validation states
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [applying, setApplying] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState<{ cod: boolean; payos: boolean }>({
    cod: true,
    payos: false,
  });
  const [fetchingMethods, setFetchingMethods] = useState(false);

  // Fetch dynamic payment methods when opening checkout step
  useEffect(() => {
    if (isOpen && step === 'form') {
      const fetchConfigAndMethods = async () => {
        try {
          setFetchingMethods(true);
          const resMethods = await api.get('/tenant/payment-methods');
          if (resMethods.data && resMethods.data.success) {
            setPaymentMethods(resMethods.data.data);
            setFormData(prev => ({
              ...prev,
              paymentMethod: resMethods.data.data.payos ? 'PAYOS' : 'COD',
            }));
          }
        } catch (err) {
          console.error('Failed to fetch payment methods:', err);
          setPaymentMethods({ cod: true, payos: false });
          setFormData(prev => ({ ...prev, paymentMethod: 'COD' }));
        } finally {
          setFetchingMethods(false);
        }
      };
      fetchConfigAndMethods();
    }
  }, [isOpen, step]);

  // Reset steps and values on open/close
  useEffect(() => {
    if (isOpen) {
      setStep('cart');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: 'COD',
      });
      setVoucherInput('');
      setAppliedVoucher(null);
      setDiscountAmount(0);
      setVoucherError('');
      setApplying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = getTotalPrice();
  const shippingFee = (subtotal > 0 && subtotal < 500000) ? 30000 : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setApplying(true);
    setVoucherError('');
    try {
      const res = await api.get('/vouchers');
      if (res.data && res.data.success) {
        const list = res.data.data;
        const code = voucherInput.trim().toUpperCase();
        const found = list.find((v: Voucher) => v.code === code);
        if (!found) {
          setVoucherError(locale === 'vi' ? 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' : 'Invalid or expired voucher code.');
          setAppliedVoucher(null);
          setDiscountAmount(0);
        } else if (subtotal < found.minOrderValue) {
          setVoucherError(
            locale === 'vi'
              ? `Đơn hàng tối thiểu phải từ ${found.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này.`
              : `Minimum order of ${found.minOrderValue.toLocaleString('vi-VN')}đ required.`
          );
          setAppliedVoucher(null);
          setDiscountAmount(0);
        } else {
          let discount = 0;
          if (found.discountType === 'PERCENTAGE') {
            discount = subtotal * (found.discountValue / 100);
            if (found.maxDiscountValue) {
              discount = Math.min(discount, found.maxDiscountValue);
            }
          } else if (found.discountType === 'FIXED') {
            discount = found.discountValue;
          }
          setAppliedVoucher(found);
          setDiscountAmount(discount);
          setVoucherError('');
          toast.success(locale === 'vi' ? 'Áp dụng mã giảm giá thành công!' : 'Voucher applied successfully!');
        }
      } else {
        setVoucherError(locale === 'vi' ? 'Không thể tải danh sách mã giảm giá.' : 'Failed to retrieve vouchers.');
      }
    } catch (err) {
      console.error('Failed to validate voucher:', err);
      setVoucherError(locale === 'vi' ? 'Đã xảy ra lỗi khi kiểm tra mã.' : 'An error occurred during verification.');
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherInput('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error(t('errorRequired'));
      return;
    }

    setStep('processing');

    try {
      const itemsPayload = items.map(item => ({
        productId: item.product.id,
        qty: item.quantity
      }));

      // Submit multi-item order to tenant backend
      const res = await api.post('/orders', {
        items: itemsPayload,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          addressOrDate: formData.address
        },
        paymentMethod: formData.paymentMethod,
        voucherCode: appliedVoucher ? appliedVoucher.code : undefined
      });

      if (res.data && res.data.success) {
        const orderData = res.data.data;
        
        // If PayOS, redirect immediately to checkout
        if (formData.paymentMethod === 'PAYOS' && orderData.checkoutUrl) {
          toast.success(locale === 'vi' ? 'Đang chuyển hướng thanh toán trực tuyến...' : 'Redirecting to payment portal...');
          setTimeout(() => {
            window.location.href = orderData.checkoutUrl;
          }, 1200);
        } else {
          // If COD, show receipt
          setStep('success');
          clearCart(); // Success purchase clears the active cart
        }
      }
    } catch (err: unknown) {
      console.error('Cart checkout failed:', err);
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(t('errorTx'), {
        description: axiosError.response?.data?.message || axiosError.message || t('errorTxDesc')
      });
      setStep('form');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Dark backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-ink-70/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md h-full bg-parchment border-l border-stone shadow-2xl flex flex-col justify-between overflow-hidden text-left font-sans animate-ease-out"
        >
          {/* Organic grain texture overlay */}
          <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-0" />

          {/* Upper Header Row */}
          <div className="relative z-10 p-5 border-b border-stone/30 flex items-center justify-between bg-cream">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              {locale === 'vi' ? 'Giỏ hàng di sản' : 'Heritage Cart'}
            </span>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full border border-stone/30 flex items-center justify-center text-ash hover:text-ink hover:border-stone transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Content Stages */}
          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Step 1: Cart listing */}
            {step === 'cart' && (
              <div className="space-y-6 h-full flex flex-col justify-between">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-cream border border-stone/60 flex items-center justify-center text-ash">
                      <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading italic text-lg text-charcoal font-semibold">
                        {locale === 'vi' ? 'Giỏ hàng của bạn đang trống' : 'Your cart is empty'}
                      </h4>
                      <p className="text-xs text-ash max-w-xs leading-relaxed">
                        {locale === 'vi' 
                          ? 'Hãy ghé qua Cửa hàng để thêm những tác phẩm thủ công di sản độc đáo.' 
                          : 'Explore our Shop page to discover unique handcrafted heritage masterworks.'}
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="bg-lacquer text-cream hover:brightness-110 font-sans text-[11px] font-semibold uppercase tracking-widest px-6 py-3 rounded-sm transition-all active:scale-[0.98]"
                    >
                      {locale === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
                      {items.map((item) => (
                        <div 
                          key={item.product.id}
                          className="bg-cream border border-stone/80 p-3.5 rounded-sm flex gap-3.5 transition-all hover:shadow-hover hover:border-bronze"
                        >
                          {item.product.image && (
                            <div className="w-16 h-16 rounded-xs overflow-hidden border border-stone/50 bg-stone/20 shrink-0">
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-grow flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <h4 className="font-heading text-sm font-bold italic text-charcoal leading-tight truncate flex-grow">
                                  {item.product.name}
                                </h4>
                                <button
                                  onClick={() => removeItem(item.product.id)}
                                  className="text-ash hover:text-lacquer p-0.5"
                                  title={locale === 'vi' ? 'Xóa sản phẩm' : 'Remove item'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {item.product.villageName && (
                                <span className="text-[9px] font-semibold uppercase tracking-wider text-gold block mt-0.5">
                                  Làng {item.product.villageName}
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-semibold text-lacquer font-sans">
                                {item.product.price.toLocaleString('vi-VN')}đ
                              </span>
                              
                              {/* Quantity select */}
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-5 h-5 rounded-xs border border-stone/80 flex items-center justify-center text-charcoal hover:border-bronze active:scale-95"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-4 text-center text-xs font-bold font-sans">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-5 h-5 rounded-xs border border-stone/80 flex items-center justify-center text-charcoal hover:border-bronze active:scale-95"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone/30 pt-4 mt-6 space-y-4">
                      <div className="flex justify-between items-center text-xs font-semibold font-sans">
                        <span className="text-ash">{locale === 'vi' ? 'Tổng tiền hàng' : 'Subtotal'}</span>
                        <span className="text-md font-bold text-charcoal">{subtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <button
                        onClick={() => setStep('form')}
                        className="w-full flex items-center justify-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[11px] py-4 rounded-sm hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                      >
                        <span>{locale === 'vi' ? 'Đặt hàng ngay' : 'Checkout Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Customer checkout form */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Checkout summary header */}
                <div className="bg-cream border border-stone/80 p-4 rounded-sm space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ash block">
                    {locale === 'vi' ? 'Thông tin tóm tắt đơn đặt hàng' : 'Order Summary'}
                  </span>
                  <div className="text-xs text-charcoal font-sans space-y-1.5">
                    {items.map(item => (
                      <div key={item.product.id} className="flex justify-between truncate">
                        <span className="truncate max-w-[280px] font-light text-ash">
                          {item.product.name} <span className="font-semibold text-charcoal text-[10px]">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold">{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Information Fields */}
                <div className="space-y-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold block">
                    {locale === 'vi' ? 'Thông tin khách hàng' : 'Customer Info'}
                  </span>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block">
                      {t('fullName')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleFormChange}
                        placeholder={t('placeholderFullName')}
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block">
                      {t('phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="0901234567"
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block">
                      {t('email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="customer@domain.com"
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>

                  {/* Context Address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block font-sans">
                      {t('deliveryAddress')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleFormChange}
                        placeholder={t('placeholderAddress')}
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Voucher / Promo code input section */}
                <div className="space-y-2 border-y border-stone/30 py-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold block">
                    {locale === 'vi' ? 'Mã giảm giá' : 'Discount Code'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      placeholder={locale === 'vi' ? 'Nhập mã (Ví dụ: HOALANG10)' : 'Enter code (e.g. HOALANG10)'}
                      disabled={!!appliedVoucher}
                      className="flex-grow bg-cream border border-stone rounded-sm px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans uppercase placeholder:normal-case disabled:opacity-60 animate-ease-out"
                    />
                    {appliedVoucher ? (
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="bg-transparent border border-lacquer text-lacquer hover:bg-lacquer/5 font-sans text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-sm transition-all active:scale-[0.98]"
                      >
                        {locale === 'vi' ? 'Hủy' : 'Remove'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={!voucherInput.trim() || applying}
                        className="bg-lacquer text-cream hover:brightness-110 font-sans text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-sm transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {applying ? (
                          <span className="animate-pulse">{locale === 'vi' ? 'Đang áp dụng...' : 'Applying...'}</span>
                        ) : (
                          locale === 'vi' ? 'Áp dụng' : 'Apply'
                        )}
                      </button>
                    )}
                  </div>
                  
                  {voucherError && (
                    <p className="text-[10px] text-lacquer font-semibold mt-1">
                      {voucherError}
                    </p>
                  )}
                  {appliedVoucher && (
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1 animate-pulse">
                      ✓ {locale === 'vi' 
                        ? `Đã áp dụng mã ${appliedVoucher.code} (Giảm ${discountAmount.toLocaleString('vi-VN')}đ)` 
                        : `Applied code ${appliedVoucher.code} (-${discountAmount.toLocaleString('vi-VN')}đ)`}
                    </p>
                  )}
                </div>

                {/* Dynamic Payment Selector */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold block">
                    {t('paymentMethod')}
                  </span>
                  
                  {fetchingMethods ? (
                    <div className="py-4 text-center text-xs text-ash">
                      {t('loadingMethods')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {/* COD Option */}
                      <label className={`p-3.5 border rounded-sm flex items-start justify-between cursor-pointer transition-all ${
                        formData.paymentMethod === 'COD'
                          ? 'border-lacquer bg-lacquer/5 text-ink'
                          : 'border-stone hover:border-bronze bg-transparent'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="COD"
                            checked={formData.paymentMethod === 'COD'}
                            onChange={handleFormChange}
                            className="accent-lacquer mt-0.5"
                          />
                          <div className="space-y-0.5 text-left">
                            <span className="text-xs font-semibold font-sans block">{t('payCod')}</span>
                            <span className="text-[10px] text-ash font-light block leading-normal">
                              {t('payCodDesc')}
                            </span>
                          </div>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      </label>

                      {/* PayOS Option */}
                      {paymentMethods.payos ? (
                        <label className={`p-3.5 border rounded-sm flex items-start justify-between cursor-pointer transition-all ${
                          formData.paymentMethod === 'PAYOS'
                            ? 'border-lacquer bg-lacquer/5 text-ink'
                            : 'border-stone hover:border-bronze bg-transparent'
                        }`}>
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="PAYOS"
                              checked={formData.paymentMethod === 'PAYOS'}
                              onChange={handleFormChange}
                              className="accent-lacquer mt-0.5"
                            />
                            <div className="space-y-0.5 text-left">
                              <span className="text-xs font-semibold font-sans block">{t('payPayos')}</span>
                              <span className="text-[10px] text-ash font-light block leading-normal">
                                {t('payPayosDesc')}
                              </span>
                            </div>
                          </div>
                          <CreditCard className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        </label>
                      ) : (
                        <div className="p-3.5 border border-dashed border-stone/50 bg-stone/5 text-ash rounded-sm flex items-start justify-between select-none relative group">
                          <div className="flex items-start gap-3 opacity-60">
                            <input
                              type="radio"
                              disabled
                              className="accent-lacquer mt-0.5"
                            />
                            <div className="space-y-0.5 text-left">
                              <span className="text-xs font-semibold font-sans block flex items-center gap-1.5 text-ash">
                                {t('payPayosDisabled')}
                              </span>
                              <span className="text-[10px] text-ash font-light block leading-normal">
                                {t('payPayosDisabledDesc')}
                              </span>
                            </div>
                          </div>
                          <HelpCircle className="w-4 h-4 text-ash/60 shrink-0 mt-0.5 cursor-help" />
                          <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-64 bg-charcoal text-cream text-[10px] p-2 rounded-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-md leading-normal text-center z-20">
                            {t('payPayosTooltip')}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom billing computation and button */}
                <div className="border-t border-stone/30 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs font-sans text-charcoal">
                    <span className="text-ash">{locale === 'vi' ? 'Tạm tính' : 'Subtotal'}</span>
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-sans text-charcoal">
                    <span className="text-ash">{locale === 'vi' ? 'Phí vận chuyển' : 'Shipping'}</span>
                    <span>{shippingFee > 0 ? '30.000đ' : (locale === 'vi' ? 'Miễn phí' : 'Free')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-xs font-sans text-emerald-700 font-semibold">
                      <span>{locale === 'vi' ? 'Giảm giá' : 'Discount'}</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs font-semibold font-sans border-t border-stone/20 pt-2">
                    <span className="text-ash">{t('grandTotal')}</span>
                    <span className="text-lg font-bold text-lacquer">{grandTotal.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="w-1/3 flex items-center justify-center bg-transparent border border-stone text-charcoal font-sans font-semibold uppercase tracking-widest text-[11px] py-4 rounded-sm hover:border-bronze hover:text-bronze transition-all active:scale-[0.98]"
                    >
                      {locale === 'vi' ? 'Giỏ hàng' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      className="flex-grow flex items-center justify-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[11px] py-4 rounded-sm hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                    >
                      <span>{t('btnConfirm')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Step 3: Animated secure validation */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-lacquer/20 border-t-lacquer animate-spin flex items-center justify-center" />
                <span className="text-xs font-semibold text-charcoal font-sans animate-pulse">
                  {t('processing')}
                </span>
                <span className="text-[10px] text-ash font-light">
                  TLS 1.3 Secure • RSA 2048 Sandbox Encryption
                </span>
              </motion.div>
            )}

            {/* Step 4: Heritage Receipt invoice */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold italic text-charcoal">
                    {t('successTitle')}
                  </h3>
                  <p className="font-sans text-[11px] text-ash font-light leading-relaxed">
                    {t('successSub')}
                  </p>
                </div>

                {/* Traditional Editorial Receipt Card */}
                <div className="bg-cream border border-stone/80 rounded-sm p-5 relative overflow-hidden space-y-4 font-sans text-xs">
                  {/* Gold border accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/30" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/30" />
                  
                  <div className="text-center border-b border-stone/30 pb-3">
                    <span className="font-heading text-md font-bold italic text-charcoal tracking-widest block">
                      {t('invoiceTitle')}
                    </span>
                    <span className="text-[9px] text-ash uppercase tracking-wider block mt-0.5">
                      {t('txId')}: HL-CART-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-left border-b border-stone/30 pb-4">
                    <div className="flex justify-between">
                      <span className="text-ash">{locale === 'vi' ? 'Sản phẩm mua' : 'Items'}</span>
                      <span className="font-semibold text-charcoal max-w-[200px] text-right truncate">
                        {locale === 'vi' ? `${items.length} tác phẩm` : `${items.length} items`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{t('purchaser')}</span>
                      <span className="font-semibold text-charcoal">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{t('contact')}</span>
                      <span className="font-semibold text-charcoal">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{t('deliveryAddress')}</span>
                      <span className="font-semibold text-charcoal max-w-[180px] text-right truncate">{formData.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{t('method')}</span>
                      <span className="font-semibold text-charcoal">{t('payCod')}</span>
                    </div>
                  </div>

                  <div className="bg-parchment/60 border border-stone/40 p-4 rounded-xs text-center space-y-2.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-lacquer block">
                      {t('instructionsTitle')}
                    </span>
                    <p className="text-[10px] text-ash leading-normal text-left">
                      {t('instructionsDesc')}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold font-sans pt-1">
                    <span className="text-ash">{t('paymentAmount')}</span>
                    <span className="text-md font-bold text-lacquer">{grandTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-charcoal text-cream font-sans font-semibold uppercase tracking-widest text-[11px] py-4 rounded-sm hover:brightness-115 shadow-sm transition-all"
                >
                  <span>{t('completed')}</span>
                </button>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
