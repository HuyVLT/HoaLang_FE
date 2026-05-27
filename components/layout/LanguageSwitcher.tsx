'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';

interface LanguageSwitcherProps {
  /** Controls text/border color — pass 'light' when on dark/transparent hero background */
  variant?: 'light' | 'dark';
}

export default function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: 'vi' | 'en' | 'ja' | 'ko' | 'zh') => {
    router.replace(pathname, { locale: newLocale });
  };

  const languages = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'zh', label: '简体中文' },
  ];

  const color      = variant === 'light' ? '#FAF7F2' : '#2E2318';
  const borderColor = variant === 'light' ? 'rgba(250,247,242,0.35)' : '#D4C9B5';

  return (
    <select
      value={locale}
      onChange={(e) => handleLanguageChange(e.target.value as 'vi' | 'en' | 'ja' | 'ko' | 'zh')}
      className="bg-transparent font-sans font-semibold uppercase tracking-[0.08em] text-[11px] cursor-pointer focus:outline-none transition-colors appearance-none pr-1"
      style={{ color, border: `1px solid ${borderColor}`, borderRadius: '3px', padding: '4px 8px' }}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} style={{ color: '#1A1208', background: '#FAF7F2' }}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
