import { PageConfig } from '@/types/tenant';
import { potteryTemplate } from './templates/pottery-template';
import { silkTemplate } from './templates/silk-template';

export const MOCK_TENANTS: Record<string, PageConfig> = {
  'bat-trang': {
    ...potteryTemplate,
    tenantId: 'bat-trang',
  },
  'van-phuc': {
    ...silkTemplate,
    tenantId: 'van-phuc',
  },
};

export const getMockTenantConfig = (slug: string): PageConfig | undefined => {
  return MOCK_TENANTS[slug] || MOCK_TENANTS['bat-trang'];
};
