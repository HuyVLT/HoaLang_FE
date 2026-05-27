'use client';

import { useTranslations } from 'next-intl';

export default function MapPage() {
  const t = useTranslations('nav');

  return (
    <div className="container mx-auto px-4 py-16 text-center font-sans">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-primary">
        {t('map')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Chuc nang ban do tuong tac dang duoc khoi tao. Ban se som co the tra cuu vi tri va hanh trinh cac lang nghe Viet Nam tai day.
      </p>
    </div>
  );
}
