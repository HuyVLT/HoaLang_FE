import api from '../api';

export interface Voucher {
  _id: string;
  code: string;
  description: {
    vi: string;
    en: string;
    ja?: string;
    ko?: string;
    zh?: string;
  };
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const voucherService = {
  /**
   * Fetch all active vouchers
   */
  getActiveVouchers: async (): Promise<Voucher[]> => {
    try {
      const res = await api.get('/vouchers');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return [];
    } catch (error) {
      console.warn('[voucherService] Failed to fetch vouchers:', error);
      return [];
    }
  },
};

export default voucherService;
