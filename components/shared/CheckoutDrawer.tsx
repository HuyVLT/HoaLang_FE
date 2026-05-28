'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { useLocale } from 'next-intl';
import {
  X,
  ShoppingBag,
  Calendar,
  CheckCircle,
  CreditCard,
  Truck,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export interface CheckoutItem {
  name: string;
  price: number;
  type: 'product' | 'workshop';
  image?: string;
  villageName?: string;
}

interface CheckoutStore {
  isOpen: boolean;
  item: CheckoutItem | null;
  openCheckout: (item: CheckoutItem) => void;
  closeCheckout: () => void;
}

// Globally exportable store so any component can invoke checkout
export const useCheckoutStore = create<CheckoutStore>((set) => ({
  isOpen: false,
  item: null,
  openCheckout: (item) => set({ isOpen: true, item }),
  closeCheckout: () => set({ isOpen: false, item: null }),
}));

export default function CheckoutDrawer() {
  const locale = useLocale() as 'vi' | 'en';
  const { isOpen, item, closeCheckout } = useCheckoutStore();

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressOrDate: '',
    quantity: 1,
    paymentMethod: 'bank_transfer',
  });

  // Reset steps on open
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        addressOrDate: '',
        quantity: 1,
        paymentMethod: 'bank_transfer',
      });
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const resolvedPrice = item.price;
  const totalPrice = resolvedPrice * formData.quantity;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const adjustQuantity = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + amount),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressOrDate) {
      alert(locale === 'vi' ? 'Vui lòng điền đầy đủ thông tin bắt buộc.' : 'Please fill in all required fields.');
      return;
    }

    setStep('processing');
    
    // Simulate transaction validation sequence
    setTimeout(() => {
      setStep('success');
    }, 1800);
  };

  const t = {
    titleProduct: locale === 'vi' ? 'Đơn Đặt Hàng Di Sản' : 'Heritage Craft Order',
    titleWorkshop: locale === 'vi' ? 'Đặt Lịch Trải Nghiệm' : 'Workshop Reservation',
    summary: locale === 'vi' ? 'Tóm tắt đơn hàng' : 'Order Summary',
    quantity: locale === 'vi' ? 'Số lượng' : 'Quantity',
    guests: locale === 'vi' ? 'Số khách tham gia' : 'Number of Guests',
    fullName: locale === 'vi' ? 'Họ và tên khách hàng *' : 'Full Name *',
    phone: locale === 'vi' ? 'Số điện thoại liên hệ *' : 'Phone Number *',
    email: locale === 'vi' ? 'Địa chỉ Email' : 'Email Address',
    deliveryAddress: locale === 'vi' ? 'Địa chỉ nhận hàng *' : 'Delivery Address *',
    workshopDate: locale === 'vi' ? 'Ngày tham gia dự kiến *' : 'Scheduled Experience Date *',
    paymentMethod: locale === 'vi' ? 'Phương thức thanh toán' : 'Payment Method',
    payBank: locale === 'vi' ? 'Chuyển khoản Ngân hàng (Simulated QR)' : 'Simulated Bank QR Transfer',
    payCard: locale === 'vi' ? 'Thanh toán qua thẻ (Sandbox)' : 'Mock Credit Card Sandbox',
    btnConfirm: locale === 'vi' ? 'Xác Nhận Đơn Đặt & Thanh Toán' : 'Confirm Order & Checkout',
    processing: locale === 'vi' ? 'Đang mã hóa giao dịch an toàn...' : 'Securing transaction gateway...',
    successTitle: locale === 'vi' ? 'Giao Dịch Thành Công!' : 'Transaction Approved!',
    successSub: locale === 'vi' ? '🎉 Cảm ơn bạn đã đồng hành cùng di sản thủ công Việt Nam!' : '🎉 Thank you for supporting traditional Vietnamese heritage!',
    txId: locale === 'vi' ? 'Mã giao dịch' : 'Transaction ID',
    completed: locale === 'vi' ? 'Hoàn Tất & Đóng' : 'Complete & Close',
    invoiceTitle: locale === 'vi' ? 'HÓA ĐƠN DI SẢN / HERITAGE RECEIPT' : 'HERITAGE RECEIPT',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Dark backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCheckout}
          className="absolute inset-0 bg-ink-70/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md h-full bg-parchment border-l border-stone shadow-2xl flex flex-col justify-between overflow-hidden text-left font-sans"
        >
          {/* Organic grain texture overlay */}
          <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-0" />

          {/* Upper Header Row */}
          <div className="relative z-10 p-5 border-b border-stone/30 flex items-center justify-between bg-cream">
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
              {item.type === 'product' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              {item.type === 'product' ? t.titleProduct : t.titleWorkshop}
            </span>
            <button
              onClick={closeCheckout}
              className="w-8 h-8 rounded-full border border-stone/30 flex items-center justify-center text-ash hover:text-ink hover:border-stone transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Content Stages */}
          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
            
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Simple Item Summary Display */}
                <div className="bg-cream border border-stone/80 p-4 rounded-sm flex gap-4">
                  {item.image && (
                    <div className="w-16 h-16 rounded-xs overflow-hidden border border-stone/50 bg-stone/20 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1 text-left flex-grow">
                    {item.villageName && (
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-ash block">
                        {item.villageName}
                      </span>
                    )}
                    <h4 className="font-heading text-md font-bold italic text-charcoal leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-sm font-semibold text-lacquer font-sans block">
                      {resolvedPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Quantity or Guest Selectors */}
                <div className="flex items-center justify-between border-y border-stone/30 py-3">
                  <span className="text-xs font-semibold text-charcoal font-sans">
                    {item.type === 'product' ? t.quantity : t.guests}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adjustQuantity(-1)}
                      className="w-7 h-7 rounded-sm border border-stone/80 flex items-center justify-center text-charcoal hover:border-bronze select-none"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold font-sans">
                      {formData.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustQuantity(1)}
                      className="w-7 h-7 rounded-sm border border-stone/80 flex items-center justify-center text-charcoal hover:border-bronze select-none"
                    >
                      +
                    </button>
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
                      {t.fullName}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleFormChange}
                        placeholder={locale === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block">
                      {t.phone}
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
                      {t.email}
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

                  {/* Context Address or Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block font-sans">
                      {item.type === 'product' ? t.deliveryAddress : t.workshopDate}
                    </label>
                    <div className="relative">
                      {item.type === 'product' ? (
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      ) : (
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ash/60" />
                      )}
                      <input
                        type="text"
                        name="addressOrDate"
                        required
                        value={formData.addressOrDate}
                        onChange={handleFormChange}
                        placeholder={
                          item.type === 'product'
                            ? (locale === 'vi' ? 'Số 123 Đường Trần Hưng Đạo, Quận 1, TP. HCM' : '123 Wall St, NY')
                            : (locale === 'vi' ? 'Ngày 29/05/2026 lúc 14:00' : 'May 29, 2026 at 2 PM')
                        }
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Mock Payment Selector */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gold block">
                    {t.paymentMethod}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    <label className={`p-3.5 border rounded-sm flex items-center justify-between cursor-pointer transition-all ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-lacquer bg-lacquer/5 text-ink'
                        : 'border-stone hover:border-bronze bg-transparent'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === 'bank_transfer'}
                          onChange={handleFormChange}
                          className="accent-lacquer"
                        />
                        <span className="text-xs font-semibold font-sans">{t.payBank}</span>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-gold" />
                    </label>

                    <label className={`p-3.5 border rounded-sm flex items-center justify-between cursor-pointer transition-all ${
                      formData.paymentMethod === 'credit_card'
                        ? 'border-lacquer bg-lacquer/5 text-ink'
                        : 'border-stone hover:border-bronze bg-transparent'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleFormChange}
                          className="accent-lacquer"
                        />
                        <span className="text-xs font-semibold font-sans">{t.payCard}</span>
                      </div>
                      <CreditCard className="w-4 h-4 text-ash/80" />
                    </label>
                  </div>
                </div>

                {/* Bottom billing computation and button */}
                <div className="border-t border-stone/30 pt-4 space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold font-sans">
                    <span className="text-ash">{locale === 'vi' ? 'Tổng thanh toán' : 'Grand Total'}</span>
                    <span className="text-lg font-bold text-lacquer">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[12px] py-4 rounded-sm hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>{t.btnConfirm}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Animated secure validation */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-lacquer/20 border-t-lacquer animate-spin flex items-center justify-center" />
                <span className="text-xs font-semibold text-charcoal font-sans">
                  {t.processing}
                </span>
                <span className="text-[10px] text-ash font-light">
                  TLS 1.3 Secure • RSA 2048 Sandbox Encryption
                </span>
              </motion.div>
            )}

            {/* Step 3: Heritage Receipt invoice */}
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
                    {t.successTitle}
                  </h3>
                  <p className="font-sans text-[11px] text-ash font-light leading-relaxed">
                    {t.successSub}
                  </p>
                </div>

                {/* Traditional Editorial Receipt Card */}
                <div className="bg-cream border border-stone/80 rounded-sm p-5 relative overflow-hidden space-y-4 font-sans text-xs">
                  {/* Gold border accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/30" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/30" />
                  
                  <div className="text-center border-b border-stone/30 pb-3">
                    <span className="font-heading text-md font-bold italic text-charcoal tracking-widest block">
                      {t.invoiceTitle}
                    </span>
                    <span className="text-[9px] text-ash uppercase tracking-wider block mt-0.5">
                      {t.txId}: HL-TX-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-left border-b border-stone/30 pb-4">
                    <div className="flex justify-between">
                      <span className="text-ash">{locale === 'vi' ? 'Sản phẩm/Khóa học' : 'Item Name'}</span>
                      <span className="font-semibold text-charcoal max-w-[200px] text-right truncate">{item.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{locale === 'vi' ? 'Khách hàng' : 'Purchaser'}</span>
                      <span className="font-semibold text-charcoal">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{locale === 'vi' ? 'Liên hệ' : 'Contact'}</span>
                      <span className="font-semibold text-charcoal">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{item.type === 'product' ? t.deliveryAddress : t.workshopDate}</span>
                      <span className="font-semibold text-charcoal max-w-[180px] text-right truncate">{formData.addressOrDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{locale === 'vi' ? 'Số lượng' : 'Quantity/Guests'}</span>
                      <span className="font-semibold text-charcoal">{formData.quantity}</span>
                    </div>
                  </div>

                  {/* QR code mock or bank transfer placeholder */}
                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="bg-parchment/60 border border-stone/40 p-4 rounded-xs text-center space-y-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-lacquer block">
                        {locale === 'vi' ? 'Chuyển Khoản Trực Tiếp Cho Hộ Tác Nghệ Nhân' : 'Direct Payment to Master Artisan'}
                      </span>
                      
                      {/* Simple Mock QR graphic representation */}
                      <div className="w-32 h-32 border border-stone bg-cream flex items-center justify-center mx-auto relative p-2 shadow-xs">
                        <div className="w-full h-full bg-charcoal opacity-15" style={{ backgroundImage: 'radial-gradient(var(--color-ink) 20%, transparent 20%)', backgroundSize: '6px 6px' }} />
                        <div className="absolute inset-4 bg-cream border border-stone flex items-center justify-center">
                          <Compass className="w-10 h-10 text-gold animate-spin duration-[4000ms]" />
                        </div>
                      </div>
                      
                      <div className="text-[10px] space-y-1 text-ash leading-normal">
                        <div>{locale === 'vi' ? 'Ngân hàng: BIDV • Số tài khoản: 12010000xxxxx' : 'Bank: BIDV • Acc Num: 12010000xxxxx'}</div>
                        <div>{locale === 'vi' ? 'Chủ tài khoản: BAN QUAN LY DI SAN HOALANG' : 'Acc Holder: HOALANG HERITAGE BOARD'}</div>
                        <div className="font-bold text-lacquer text-[11px] mt-1">
                          {locale === 'vi' ? `Nội dung: HL_${formData.phone}` : `Memo: HL_${formData.phone}`}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs font-semibold font-sans pt-1">
                    <span className="text-ash">{locale === 'vi' ? 'Số tiền thanh toán' : 'Payment Amount'}</span>
                    <span className="text-md font-bold text-lacquer">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <button
                  onClick={closeCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-charcoal text-cream font-sans font-semibold uppercase tracking-widest text-[11px] py-4 rounded-sm hover:brightness-115 shadow-sm transition-all"
                >
                  <span>{t.completed}</span>
                </button>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
