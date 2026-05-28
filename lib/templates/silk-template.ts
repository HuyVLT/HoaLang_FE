import { PageConfig } from '@/types/tenant';

export const silkTemplate: PageConfig = {
  tenantId: 'van-phuc',
  templateId: 'silk-template',
  theme: {
    primaryColor: '#8B1A1A', // Cinnabar/Lacquer Red
    accentColor: '#C4952A', // Golden Yellow / Turmeric Gold
    fontHeading: 'Playfair Display',
    fontBody: 'Be Vietnam Pro',
    logo: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=100&h=100&fit=crop&q=80',
    favicon: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=32&h=32&fit=crop&q=80',
  },
  sections: [
    {
      id: 'silk-hero',
      type: 'hero',
      title: {
        vi: 'Mượt Mà Sợi Tơ Làng Lụa Vạn Phúc',
        en: 'The Fluid Elegance of Van Phuc Silk',
      },
      subtitle: {
        vi: 'Nghệ thuật dệt tơ tằm nguyên bản lưu truyền hơn một thiên niên kỷ, lấp lánh sắc hoa văn chìm tinh xảo quý phái.',
        en: 'Over a millennium of pure mulberry silk weaving heritage, shining with luxurious and subtle woven jacquard patterns.',
      },
      backgroundImage: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1800&q=80',
      primaryCta: {
        label: { vi: 'Bộ Sưu Tập Lụa Gấm', en: 'Brocade Collection' },
        link: '#products',
      },
      secondaryCta: {
        label: { vi: 'Hành Trình Tơ Tằm', en: 'Mulberry Workshops' },
        link: '#experiences',
      },
    },
    {
      id: 'silk-story',
      type: 'story',
      heading: {
        vi: 'Nghệ Thuật Dệt Hoa Vân Gấm Phố cổ',
        en: 'The Mastercraft of Antique Brocade Jacquard',
      },
      storyText: {
        vi: 'Lụa Vạn Phúc (lụa Hà Đông) nổi danh với hoa văn dệt chìm sang trọng — sờ ấm vào mùa đông, mát rượi vào mùa hè. Từng mét lụa gấm thêu tay đều trải qua hàng ngàn nhịp sợi con thoi vang lên giòn giã từ những khung gỗ dệt cổ xưa. Sợi tơ tằm tự nhiên được kén tằm vàng óng từ đôi bàn tay của các nghệ nhân Hà thành nâng niu.',
        en: 'Van Phuc Silk is globally renowned for its subtle woven jacquard patterns—warm to the touch in winter, breathably cool in summer. Every yard of hand-woven silk is born from thousands of shuttle strokes echoing rhythmically on ancient wooden looms. Organic golden silks are spun and dyed with natural botanicals by native Hanoi craftsmen.',
      },
      artisanName: {
        vi: 'Nghệ nhân Nhân dân Triệu Quốc Khương',
        en: 'People’s Artisan Trieu Quoc Khuong',
      },
      artisanTitle: {
        vi: 'Truyền nhân đời thứ 5 gìn giữ hoa văn khơi dòng sử sách',
        en: '5th generation master preserving imperial patterns',
      },
      image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
      quote: {
        vi: 'Sợi tơ mỏng manh như hơi thở, dệt thành lụa mịn màng như làn mây trời thu.',
        en: 'Each silk thread is as delicate as a gentle breath, woven into a drape as smooth as autumn clouds.',
      },
    },
    {
      id: 'silk-products',
      type: 'products',
      heading: {
        vi: 'Lụa Tơ Tằm Thượng Hạng',
        en: 'Elite Mulberry Silkwear',
      },
      subheading: {
        vi: 'Những chiếc áo dài gấm hoa chìm dệt truyền thống, khăn lụa tơ tằm thêu tay hoa sen độc bản quyến rũ.',
        en: 'Hand-tailored brocade Ao Dai gowns and hand-embroidered pure lotus silk scarves.',
      },
    },
    {
      id: 'silk-gallery',
      type: 'gallery',
      heading: {
        vi: 'Sắc Màu Trên Từng Sợi Dệt',
        en: 'Colors Spun Across the Looms',
      },
      subheading: {
        vi: 'Phơi nhuộm tơ lụa rực rỡ và những guồng quay cuộn kén tằm vàng óng.',
        en: 'Vibrant sun-dried silk strands and antique spinning wheels twisting raw cocoons.',
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80',
          caption: { vi: 'Hàng ngàn guồng tơ tằm vàng óng ả chờ se sợi dệt', en: 'Thousands of golden silk cocoon skeins awaiting twisting' },
        },
        {
          url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80',
          caption: { vi: 'Khung dệt gỗ cổ xưa ngân vang tiếng thoi đưa nhịp nhàng', en: 'Ancient wooden looms chiming rhythmically day and night' },
        },
      ],
    },
    {
      id: 'silk-experiences',
      type: 'experiences',
      heading: {
        vi: 'Trải Nghiệm Dệt Lụa Thủ Công',
        en: 'Artisanal Silk Workshops',
      },
      subheading: {
        vi: 'Tìm hiểu vòng đời con tằm ăn lá dâu, học luộc kén se sợi dệt lụa dệt sồi hoa.',
        en: 'Discover the lifecycle of silkworms, boil golden cocoons, and shuttle raw silk strands.',
      },
      items: [
        {
          title: {
            vi: 'Hành Trình Se Tơ & Uơm Kén',
            en: 'Cocoon Boiling & Silk Reeling',
          },
          description: {
            vi: 'Tìm hiểu nghệ thuật luộc kén tằm lấy sợi tơ nguyên bản siêu bền từ vỏ kén thô.',
            en: 'Extract ultra-fine silk filaments from fresh organic cocoons on traditional reeling pots.',
          },
          image: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=600&q=80',
          price: 300000,
          duration: '1.5 giờ (1.5 hours)',
        },
        {
          title: {
            vi: 'Học Dệt Lụa Trên Khung Gỗ Cổ',
            en: 'Shuttle Weaving on Antique Looms',
          },
          description: {
            vi: 'Đích thân điều khiển khung dệt, đạp chân thoi đưa dệt nên những dải băng màu lưu niệm.',
            en: 'Control a real wooden handloom. Thread and shuttle your own colorful bookmark band.',
          },
          image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=600&q=80',
          price: 500000,
          duration: '2 giờ (2 hours)',
        },
      ],
    },
    {
      id: 'silk-testimonials',
      type: 'testimonials',
      heading: {
        vi: 'Khách Hàng Nói Về Lụa Vạn Phúc',
        en: 'Voices Embracing Van Phuc Silk',
      },
      items: [
        {
          quote: {
            vi: 'Khoác lên mình tà áo dài lụa gấm Vạn Phúc dệt chìm hoa cúc phượng, tôi cảm thấy sự kiêu hãnh và vẻ quyến rũ khác biệt từ tà áo đậm hồn văn hiến Việt.',
            en: 'Wearing the jacquard silk Ao Dai patterned with royal chrysanthemums, I feel a rare pride and unique dignity woven from centuries of culture.',
          },
          author: 'Hoa hậu Hữu nghị Nguyễn Thu Thảo',
          role: 'Đại sứ văn hóa (Culture Ambassador)',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        },
      ],
    },
    {
      id: 'silk-cta',
      type: 'cta',
      heading: {
        vi: 'Sở Hữu Tấm Lụa Đi Cùng Thời Gian',
        en: 'Acquire Timeless Masterpieces in Silk',
      },
      description: {
        vi: 'Nhận thư mời ra mắt các thiết kế áo dài thiết kế riêng giới hạn và xem các phiên vẽ vẽ tay trên lụa duy nhất.',
        en: 'Get premium invites to private limited-edition custom tailors and unique hand-painted silk preview events.',
      },
      buttonText: { vi: 'Yêu cầu tư vấn riêng', en: 'Request Tailoring Consultation' },
      buttonLink: '#',
    },
    {
      id: 'silk-map',
      type: 'map',
      heading: {
        vi: 'Không Gian Trưng Bày Lụa Vạn Phúc',
        en: 'Our Exhibition space in Van Phuc',
      },
      coordinates: [105.7725, 20.9767],
      address: {
        vi: 'Cổng chào Làng Lụa Vạn Phúc, Vạn Phúc, Hà Đông, Hà Nội',
        en: 'Main Gate of Van Phuc Silk Village, Ha Dong District, Hanoi',
      },
      phone: '+84 24 3382 0456',
      hours: {
        vi: 'Thứ 2 - Chủ Nhật, 08:30 - 21:00',
        en: 'Mon - Sun, 08:30 AM - 09:00 PM',
      },
    },
  ],
};
