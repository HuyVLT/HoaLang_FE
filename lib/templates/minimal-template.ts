import { PageConfig } from '@/types/tenant';

export const minimalTemplate: PageConfig = {
  tenantId: 'minimal-tenant',
  templateId: 'minimal-template',
  theme: {
    primaryColor: '#2E2318', // Deep Charcoal Ink
    accentColor: '#7A5C2E', // Bronze Earthy Brown
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Be Vietnam Pro',
    logo: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=100&h=100&fit=crop&q=80',
    favicon: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=32&h=32&fit=crop&q=80',
  },
  sections: [
    {
      id: 'min-hero',
      type: 'hero',
      title: {
        vi: 'Nghệ Thuật Tranh Đông Hồ - Điệp Giấy Dó',
        en: 'The Poetics of Dong Ho Woodblock Printing',
      },
      subtitle: {
        vi: 'Sự tinh giản mộc mạc lưu hồn cội nguồn văn hóa Việt trên chất điệp sò điệp lấp lánh óng ánh dưới nắng vàng.',
        en: 'Preserving rustic and traditional folklore woodblock prints painted on organic shells-crushed Dó papers.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1800&q=80',
      primaryCta: {
        label: { vi: 'Xem Bản Khắc', en: 'View Woodblocks' },
        link: '#products',
      },
    },
    {
      id: 'min-story',
      type: 'story',
      heading: {
        vi: 'Khắc Họa Linh Hồn Việt Trên Điệp Dó',
        en: 'Engraving Vietnamese Soul onto Shell-Dusted Dó Paper',
      },
      storyText: {
        vi: 'Mỗi bản khắc gỗ tranh Đông Hồ không phô trương sắc màu sặc sỡ mà tự hào chắt chiu năm màu tự nhiên mộc mạc: màu đen óng của than lá tre, đỏ ấm gạch nung của sỏi đồi, vàng rơm hạt dành dành, màu xanh lục lá chàm và màu trắng điệp vỏ sò lấp lánh nghiền mịn quét chổi lá thông.',
        en: 'Every Dong Ho folk woodblock print avoids bright chemical inks, honoring five organic colors: black charcoal of burnt bamboo leaves, warm rust of hillside clay, straw yellow of gardenia seeds, green of indigo plants, and glowing pearl dust crushed from scallop shells swept by pine needle brushes.',
      },
      artisanName: {
        vi: 'Nghệ nhân ưu tú Nguyễn Hữu Quả',
        en: 'Master Artisan Nguyen Huu Qua',
      },
      artisanTitle: {
        vi: 'Dòng dõi lâu đời lưu truyền bí pháp giã điệp quét hồ',
        en: 'Noble lineage preserving shell-dusting paper glaze secrets',
      },
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'min-products',
      type: 'products',
      heading: {
        vi: 'Tranh Dân Gian Độc Bản',
        en: 'Original Folkart Woodblocks',
      },
      subheading: {
        vi: 'Những ấn phẩm rước rồng, đàn lợn chăn tằm, cá chép trông trăng dập vẽ tay.',
        en: 'Poetic prints featuring pig families, dragon dances, and carps contemplating the full moon.',
      },
    },
    {
      id: 'min-gallery',
      type: 'gallery',
      heading: {
        vi: 'Bảo Tồn Bản Thảo Cổ',
        en: 'Preserving the Archaic Sketches',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80',
          caption: { vi: 'Bộ mộc bản gõ cổ lâu đời được chạm trổ tinh tế', en: 'Centuries-old wooden blocks carved with extreme precision' },
        },
      ],
    },
    {
      id: 'min-cta',
      type: 'cta',
      heading: {
        vi: 'Gìn Giữ Hồn Tranh Điệp Việt Nam',
        en: 'Preserve the Polish of Vietnamese Folk Art',
      },
      description: {
        vi: 'Đồng hành cùng di sản làng nghề, nhận thông tin các buổi triển lãm mộc bản quốc tế hàng tháng.',
        en: 'Walk side-by-side with our heritage. Get invitations to monthly international woodblock exhibitions.',
      },
      buttonText: { vi: 'Đồng hành cùng di sản', en: 'Partner with Heritage' },
      buttonLink: '#',
    },
  ],
};
