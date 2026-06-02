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
};

export default authService;
