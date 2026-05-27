'use client';

import { useTranslations } from 'next-intl';

export default function ItineraryPage() {
  const t = useTranslations('nav');

  return (
    <div className="container mx-auto px-4 py-16 text-center font-sans">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-primary">
        {t('itinerary')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Cong cu len lich trinh thong minh su dung Tri tue Nhan tao giup lap ke hoach chi tiet chuyen di cua ban dang duoc lien ket.
      </p>
    </div>
  );
}
