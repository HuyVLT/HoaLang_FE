import api from '../api';

export interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'VILLAGE_OWNER' | 'USER' | string;
  avatar?: string;
  phone?: string;
  walletBalance?: number;
  isVerified: boolean;
  status: string;
  createdAt: string;
}

export interface OrderHistoryItem {
  _id: string;
  type: 'product' | 'booking';
  createdAt: string;
  status: string;
  total: number;
  totalPrice: number;
  guests?: number;
  date?: string;
  tenant?: {
    name?: string;
  };
  items?: Array<{
    name: string;
    price: number;
    qty: number;
    productId?: {
      images?: string[];
    };
  }>;
  experienceId?: {
    coverImage?: string;
    title?: Record<string, string>;
  };
  payment?: {
    method?: string;
    status?: string;
  };
}

export const authService = {
  /**
   * Fetch full profile details of currently logged-in user
   */
  getMe: async (): Promise<UserProfile | null> => {
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      console.warn('[authService] Failed to fetch profile:', error);
      return null;
    }
  },

  updateProfile: async (formData: FormData): Promise<UserProfile | null> => {
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      console.warn('[authService] Failed to update profile:', error);
      return null;
    }
  },

  getOrders: async (): Promise<OrderHistoryItem[] | null> => {
    try {
      const res = await api.get('/auth/orders');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (error) {
      console.warn('[authService] Failed to fetch orders:', error);
      return null;
    }
  },
};

export default authService;
