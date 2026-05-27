'use client';

import { useTranslations } from 'next-intl';

export default function ExperiencePage() {
  const t = useTranslations('nav');

  return (
    <div className="container mx-auto px-4 py-16 text-center font-sans">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-primary">
        {t('experience')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Kham pha va dang ky cac buoi hoc thuc te nhap vai lam nghe nhan goms, det, tranh dong gian dang duoc tai ban.
      </p>
    </div>
  );
}
