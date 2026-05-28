import { potteryTemplate } from './pottery-template';
import { silkTemplate } from './silk-template';
import { minimalTemplate } from './minimal-template';
import { PageConfig } from '@/types/tenant';

export { potteryTemplate, silkTemplate, minimalTemplate };

export const STARTER_TEMPLATES: Record<string, PageConfig> = {
  'pottery-template': potteryTemplate,
  'silk-template': silkTemplate,
  'minimal-template': minimalTemplate,
};

export const getTemplateById = (templateId: string): PageConfig | undefined => {
  return STARTER_TEMPLATES[templateId];
};
