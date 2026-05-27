'use client';

import { useTranslations } from 'next-intl';

export default function ShopPage() {
  const t = useTranslations('nav');

  return (
    <div className="container mx-auto px-4 py-16 text-center font-sans">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-primary">
        {t('shop')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Cho giao thuong my nghe ban le truc tiep tu cac lang nghe truyen thong dang duoc ket noi cong thanh toan.
      </p>
    </div>
  );
}
