'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';

export default function LanguageSwitcher() {
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

  return (
    <select
      value={locale}
      onChange={(e) => handleLanguageChange(e.target.value as 'vi' | 'en' | 'ja' | 'ko' | 'zh')}
      className="bg-transparent text-sm border border-border rounded-lg px-2.5 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 font-sans cursor-pointer hover:bg-muted/50 transition-colors"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className="text-black bg-white">
          {lang.label}
        </option>
      ))}
    </select>
  );
}
