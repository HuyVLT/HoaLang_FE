import {createNavigation} from 'next-intl/navigation';

export const locales = ['vi', 'en', 'ja', 'ko', 'zh'] as const;
export const defaultLocale = 'vi' as const;

export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales});
