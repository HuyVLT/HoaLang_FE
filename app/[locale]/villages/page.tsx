'use client';

import { useTranslations } from 'next-intl';

export default function VillagesPage() {
  const t = useTranslations('nav');

  return (
    <div className="container mx-auto px-4 py-16 text-center font-sans">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-primary">
        {t('villages')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Danh sach toan bo cac lang nghe truyen thong Viet Nam dang duoc xay dung va cap nhat.
      </p>
    </div>
  );
}
