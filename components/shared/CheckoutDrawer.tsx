'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { useLocale, useTranslations } from 'next-intl';
import {
  X,
  ShoppingBag,
  Calendar,
  CheckCircle,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  HelpCircle
} from 'lucide-react';

interface DBItem {
  _id: string;
  name?: { vi: string; en?: string };
  title?: { vi: string; en?: string };
}
import { toast } from 'sonner';
import api from '@/lib/api';

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
  const t = useTranslations('checkout');
  const { isOpen, item, closeCheckout } = useCheckoutStore();

  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressOrDate: '',
    quantity: 1,
    paymentMethod: 'COD',
  });

  const [paymentMethods, setPaymentMethods] = useState<{ cod: boolean; payos: boolean }>({
    cod: true,
    payos: false,
  });
  const [fetchingMethods, setFetchingMethods] = useState(false);
  const [dbItems, setDbItems] = useState<DBItem[]>([]);

  // Fetch dynamic payment methods and DB items when open
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        addressOrDate: '',
        quantity: 1,
        paymentMethod: 'COD',
      });

      const fetchConfigAndItems = async () => {
        try {
          setFetchingMethods(true);
          
          // 1. Fetch dynamic payment choices
          const resMethods = await api.get('/tenant/payment-methods');
          if (resMethods.data && resMethods.data.success) {
            setPaymentMethods(resMethods.data.data);
            setFormData(prev => ({
              ...prev,
              paymentMethod: resMethods.data.data.payos ? 'PAYOS' : 'COD',
            }));
          }

          // 2. Fetch DB items for ID resolving
          if (item) {
            if (item.type === 'product') {
              const resItems = await api.get('/products');
              if (resItems.data && resItems.data.success) {
                setDbItems(resItems.data.data);
              }
            } else {
              const resItems = await api.get('/experiences');
              if (resItems.data && resItems.data.success) {
                setDbItems(resItems.data.data);
              }
            }
          }
        } catch (err) {
          console.error('Failed to fetch tenant configuration or items:', err);
          // Muted fallback
          setPaymentMethods({ cod: true, payos: false });
          setFormData(prev => ({ ...prev, paymentMethod: 'COD' }));
        } finally {
          setFetchingMethods(false);
        }
      };

      fetchConfigAndItems();
    }
  }, [isOpen, item]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressOrDate) {
      toast.error(t('errorRequired'));
      return;
    }

    setStep('processing');

    try {
      // Find matching item ID in seeded DB collections
      let matchedId = '';
      if (item.type === 'product') {
        const matched = dbItems.find(p => 
          (p.name?.vi && p.name.vi.toLowerCase() === item.name.toLowerCase()) ||
          (p.name?.en && p.name.en.toLowerCase() === item.name.toLowerCase())
        );
        if (matched) {
          matchedId = matched._id;
        } else if (dbItems.length > 0) {
          matchedId = dbItems[0]._id;
        }
      } else {
        const matched = dbItems.find(e => 
          (e.title?.vi && e.title.vi.toLowerCase() === item.name.toLowerCase()) ||
          (e.title?.en && e.title.en.toLowerCase() === item.name.toLowerCase())
        );
        if (matched) {
          matchedId = matched._id;
        } else if (dbItems.length > 0) {
          matchedId = dbItems[0]._id;
        }
      }

      if (!matchedId) {
        throw new Error(t('errorDatabase'));
      }

      if (item.type === 'product') {
        // Create order
        const res = await api.post('/orders', {
          items: [{ productId: matchedId, qty: formData.quantity }],
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.addressOrDate,
            city: 'Hà Nội',
            province: 'Hà Nội'
          },
          paymentMethod: formData.paymentMethod
        });

        if (res.data && res.data.success) {
          if (formData.paymentMethod === 'PAYOS') {
            toast.success(t('initPayos'));
            setTimeout(() => {
              window.location.href = res.data.data.checkoutUrl;
            }, 1200);
          } else {
            setStep('success');
          }
        }
      } else {
        // Create booking
        let bookingDate = new Date(formData.addressOrDate);
        if (isNaN(bookingDate.getTime())) {
          bookingDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // default to 3 days later if input is organic string
        }

        const res = await api.post('/bookings', {
          experienceId: matchedId,
          date: bookingDate.toISOString(),
          guests: formData.quantity,
          notes: 'Đặt trải nghiệm di sản HoaLang',
          paymentMethod: formData.paymentMethod
        });

        if (res.data && res.data.success) {
          if (formData.paymentMethod === 'PAYOS') {
            toast.success(t('connectPayos'));
            setTimeout(() => {
              window.location.href = res.data.data.checkoutUrl;
            }, 1200);
          } else {
            setStep('success');
          }
        }
      }
    } catch (err: unknown) {
      console.error('Checkout failed:', err);
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
          onClick={closeCheckout}
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
            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1">
              {item.type === 'product' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              {item.type === 'product' ? t('titleProduct') : t('titleWorkshop')}
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
                    {item.type === 'product' ? t('quantity') : t('guests')}
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

                  {/* Context Address or Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-ash block font-sans">
                      {item.type === 'product' ? t('deliveryAddress') : t('workshopDate')}
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
                            ? t('placeholderAddress')
                            : t('placeholderDate')
                        }
                        className="w-full bg-cream border border-stone rounded-sm pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-bronze font-sans"
                      />
                    </div>
                  </div>
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
                <div className="border-t border-stone/30 pt-4 space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold font-sans">
                    <span className="text-ash">{t('grandTotal')}</span>
                    <span className="text-lg font-bold text-lacquer">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-widest text-[12px] py-4 rounded-sm hover:brightness-110 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>{t('btnConfirm')}</span>
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
                <span className="text-xs font-semibold text-charcoal font-sans animate-pulse">
                  {t('processing')}
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
                      {t('txId')}: HL-COD-{Math.floor(100000 + Math.random() * 900000)}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-left border-b border-stone/30 pb-4">
                    <div className="flex justify-between">
                      <span className="text-ash">{t('itemName')}</span>
                      <span className="font-semibold text-charcoal max-w-[200px] text-right truncate">{item.name}</span>
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
                      <span className="text-ash">{item.type === 'product' ? t('deliveryAddress') : t('workshopDate')}</span>
                      <span className="font-semibold text-charcoal max-w-[180px] text-right truncate">{formData.addressOrDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ash">{t('quantity')}</span>
                      <span className="font-semibold text-charcoal">{formData.quantity}</span>
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
                    <span className="text-md font-bold text-lacquer">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <button
                  onClick={closeCheckout}
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
