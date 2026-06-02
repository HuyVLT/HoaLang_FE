import api from '../api';
import { Village } from '@/types/village';

export const villageService = {
  /**
   * Get all craft villages with optional filtering
   */
  getVillages: async (params?: {
    search?: string;
    province?: string;
    category?: string;
    isVerified?: boolean;
  }): Promise<Village[]> => {
    const res = await api.get('/villages', { params });
    if (res.data && res.data.success) {
      return res.data.data;
    }
    return [];
  },

  /**
   * Get details of a single craft village by its slug
   */
  getVillageBySlug: async (slug: string): Promise<Village | null> => {
    const res = await api.get(`/villages/${slug}`);
    if (res.data && res.data.success) {
      return res.data.data;
    }
    return null;
  },
};

export default villageService;
