'use client';

interface VillageDetailPageProps {
  params: {
    slug: string;
  };
}

export default function VillageDetailPage({ params }: VillageDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center font-sans">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4 text-primary capitalize">
        Lang nghe: {params.slug.replace('-', ' ')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Chi tiet lich su, van hoa nghe truyen thong va danh sach nghe nhan cua lang nghe dang duoc dong bo.
      </p>
    </div>
  );
}
