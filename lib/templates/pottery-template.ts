import { PageConfig } from '@/types/tenant';

export const potteryTemplate: PageConfig = {
  tenantId: 'bat-trang',
  templateId: 'pottery-template',
  theme: {
    primaryColor: '#8B5A2B', // Terracotta Clay Brown
    accentColor: '#C4952A', // Turmeric Gold
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Be Vietnam Pro',
    logo: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=100&h=100&fit=crop&q=80',
    favicon: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=32&h=32&fit=crop&q=80',
  },
  sections: [
    {
      id: 'pottery-hero',
      type: 'hero',
      title: {
        vi: 'Hồn Đất Gia Lâm Gốm Sứ Bát Tràng',
        en: 'The Clay Soul of Bat Trang Ceramics',
      },
      subtitle: {
        vi: 'Nơi lưu giữ nét đẹp tinh xảo hơn 700 năm của nghệ thuật nhào nặn đất sét và lửa men rạn trứ danh.',
        en: 'Preserving over 700 years of exquisite hand-kneaded clay craftsmanship and iconic crackle glaze.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1800&q=80',
      primaryCta: {
        label: { vi: 'Khám phá sản phẩm', en: 'Browse Masterworks' },
        link: '#products',
      },
      secondaryCta: {
        label: { vi: 'Đặt Lịch Trải Nghiệm', en: 'Book Workshop' },
        link: '#experiences',
      },
    },
    {
      id: 'pottery-story',
      type: 'story',
      heading: {
        vi: 'Hành Trình Tinh Tế Của Đất & Lửa',
        en: 'The Delicate Journey of Clay & Fire',
      },
      storyText: {
        vi: 'Để làm nên một tác phẩm gốm Bát Tràng trứ danh, người nghệ nhân phải trải qua quy trình nghiêm ngặt từ chọn đất tràng sét, lắng lọc bùn mịn, xoay chuốt trên bàn xoay thủ công, vẽ tay tỉ mỉ và nung đun lò đạt tới 1200 độ C. Mỗi bình vẽ sen men lam hay hũ rạn cổ đều mang một nét tâm thức độc bản.',
        en: 'To sculpt a classic Bat Trang masterpiece, artisans undergo a rigorous process: selecting white clay, filtering fine silt, hand-turning on kick wheels, meticulous hand-painting, and firing up to 1200°C. Every hand-painted blue-and-white celadon or antique crackled vase tells a completely unique story.',
      },
      artisanName: {
        vi: 'Nghệ nhân ưu tú Nguyễn Văn Minh',
        en: 'Master Artisan Nguyen Van Minh',
      },
      artisanTitle: {
        vi: 'Bàn Tay Vàng 45 năm gìn giữ lò nung cổ',
        en: '45-year Golden Hands preserving historic kilns',
      },
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      quote: {
        vi: 'Đất là xương thịt, men là xiêm y, lửa là linh hồn thổi hồn cốt tế vi cho gốm.',
        en: 'Clay is the bone, glaze is the gown, and fire is the sacred soul that breathes life into pottery.',
      },
    },
    {
      id: 'pottery-products',
      type: 'products',
      heading: {
        vi: 'Kiệt Tác Gốm Men Rạn Cổ',
        en: 'Antique Crackled Masterworks',
      },
      subheading: {
        vi: 'Các bộ ấm trà, bình hút lộc phong thủy được phục dựng tỉ mỉ từ dáng gốm cổ Lý - Trần.',
        en: 'Collectable tea sets and spiritual wealth urns faithfully restored from the Ly-Tran Dynasty styles.',
      },
    },
    {
      id: 'pottery-experiences',
      type: 'experiences',
      heading: {
        vi: 'Khóa Học Làm Gốm Nghệ Thuật',
        en: 'Authentic Ceramic Classes',
      },
      subheading: {
        vi: 'Đích thân nhào nặn đất sét, vẽ họa tiết cổ dưới sự kèm cặp từ truyền nhân làng nghề Bát Tràng.',
        en: 'Squeeze the clay, guide the wheel, and glaze under the direct tutoring of traditional master lineage.',
      },
      items: [
        {
          title: {
            vi: 'Trải Nghiệm Xoay Gốm Cơ Bản',
            en: 'Kick-wheel Throwing Workshop',
          },
          description: {
            vi: 'Học cách định hình phôi gốm tròn trên bàn xoay, làm ly, chén hoặc đĩa mộc mạc.',
            en: 'Learn the core centering techniques on standard kick wheels. Make your own rustic cups or plates.',
          },
          image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
          price: 250000,
          duration: '2 giờ (2 hours)',
        },
        {
          title: {
            vi: 'Vẽ Tay Hoa Văn Trên Gốm Sứ',
            en: 'Delicate Hand-Painting masterclass',
          },
          description: {
            vi: 'Vẽ oxit coban màu lam cổ điển lên gốm đã mộc, được nghệ nhân tráng men tro cổ nung sấy.',
            en: 'Paint cobalt oxide blue pigments onto raw clay, coated in wood ash glaze and kiln fired for you.',
          },
          image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80',
          price: 450000,
          duration: '3 giờ (3 hours)',
        },
      ],
    },
    {
      id: 'pottery-gallery',
      type: 'gallery',
      heading: {
        vi: 'Góc Nhìn Lò Nung Cổ Kính',
        en: 'Moments by the Ancient Kilns',
      },
      subheading: {
        vi: 'Khoảnh khắc ghi dấu công việc thầm lặng đầy chất thơ của nghệ nhân Bát Tràng.',
        en: 'Visual records highlighting the poetic and quiet work of pottery artisans.',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
          caption: { vi: 'Hàng trăm phôi gốm phơi sấy dưới ánh nắng trời tự nhiên', en: 'Hundreds of greenware pieces drying under golden sunshine' },
        },
        {
          url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
          caption: { vi: 'Sơn trét và tỉ mỉ nặn dán đắp nổi hoa văn rồng nổi', en: 'Intricately detailing and carving 3D dragon patterns onto clay jars' },
        },
        {
          url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
          caption: { vi: 'Tráng lớp nước men ngọc trong trẻo trước khi đưa vào hầm nung', en: 'Coating celadon jade glaze layer before putting in high temperature kiln' },
        },
      ],
    },
    {
      id: 'pottery-testimonials',
      type: 'testimonials',
      heading: {
        vi: 'Tình Yêu Gốm Sứ Lan Tỏa',
        en: 'Admiration for Vietnamese Pottery',
      },
      items: [
        {
          quote: {
            vi: 'Lần đầu tiên tôi tự tay định hình đĩa gốm trên bàn xoay chân gỗ. Sự yên bình và tinh xảo của Bát Tràng làm tôi vô cùng xúc động.',
            en: 'My first time turning a plate on a wooden wheel. The serenity and meticulousness of Bat Trang deeply moved me.',
          },
          author: 'Sophia Lorenz',
          role: 'Du khách từ Đức (Traveler from Germany)',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        },
        {
          quote: {
            vi: 'Những chiếc bình men lam phục chế Lý Trần mua tại Bát Tràng mang nét sang trọng tuyệt đối khi đặt cạnh phong cách nội thất tối giản hiện đại.',
            en: 'The blue-and-white historical vases represent absolute luxury, contrasting perfectly in my minimalist modern living space.',
          },
          author: 'KTS. Lê Hoàng Nam',
          role: 'Nhà thiết kế nội thất (Interior Architect)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        },
      ],
    },
    {
      id: 'pottery-cta',
      type: 'cta',
      heading: {
        vi: 'Khám Phá Di Sản Gốm Việt Nam',
        en: 'Inherit the Legacy of Vietnamese Ceramics',
      },
      description: {
        vi: 'Đăng ký nhận cẩm nang di sản, danh mục sản phẩm phục chế giới hạn và các suất ưu đãi trải nghiệm lò bầu cổ cổ kính.',
        en: 'Subscribe for heritage guidebooks, limited-run restoration catalogs, and unique VIP access to ancient beehive kilns.',
      },
      buttonText: { vi: 'Đăng ký ngay', en: 'Subscribe Now' },
      buttonLink: '#',
    },
    {
      id: 'pottery-map',
      type: 'map',
      heading: {
        vi: 'Đến Với Làng Gốm Bát Tràng',
        en: 'Find Us in Bat Trang Village',
      },
      coordinates: [105.9327, 20.9733],
      address: {
        vi: 'Xóm 3, Làng Cổ Bát Tràng, Gia Lâm, Hà Nội',
        en: 'Xom 3, Bat Trang Ancient Village, Gia Lam, Hanoi',
      },
      phone: '+84 24 3874 0123',
      hours: {
        vi: 'Thứ 2 - Chủ Nhật, 08:00 - 18:00',
        en: 'Mon - Sun, 08:00 AM - 06:00 PM',
      },
    },
  ],
};
