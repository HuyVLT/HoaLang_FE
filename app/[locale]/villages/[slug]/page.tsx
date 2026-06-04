'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Compass, MapPin, Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from '@/navigation';
import { SectionLabel, OrnamentDivider, TagBadge } from '@/components/shared';
import { villageService } from '@/lib/services/villageService';
import { Village } from '@/types/village';
import { getTenantUrl } from '@/lib/tenant-url';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// Rich editorial content maps for the core featured villages
const DETAILED_METADATA_MAP: Record<string, {
  quote: { vi: string; en: string };
  history: { vi: string; en: string };
  culture: { vi: string; en: string };
  originYear: string;
  activeWorkshops: { vi: string; en: string };
  gallery: string[];
  visitUrl?: string;
}> = {
  'bat-trang': {
    quote: {
      vi: "Gốm sứ Bát Tràng là cuộc hội thoại tinh tế giữa Đất, Nước, Lửa và tâm hồn nghệ nhân Việt qua hàng thế kỷ.",
      en: "Bat Trang ceramics represent an exquisite conversation between Earth, Water, Fire, and the Vietnamese artisan's soul across centuries."
    },
    history: {
      vi: "Khởi nguồn từ thời nhà Lý khi dời đô về Thăng Long, những dòng họ làm gốm từ Vĩnh Ninh (Thanh Hóa) đã di cư đến vùng đất sét trắng trù phú bên bờ sông Hồng. Hơn 700 năm qua, làng gốm Bát Tràng đã duy trì ngọn lửa lò nung liên tục, tạo ra những sản phẩm gốm men độc đáo cung tiến triều đình và xuất khẩu đi khắp năm châu.",
      en: "Originating during the Ly Dynasty's capital relocation to Thăng Long, pottery lineages migrated from Thanh Hoa to the clay-rich banks of the Red River. For over 700 years, Bat Trang has kept its kilns burning continuously, producing unique glazed ceramics exported worldwide."
    },
    culture: {
      vi: "Tinh hoa của gốm Bát Tràng nằm ở các loại men độc bản như men rạn cổ, men xanh chàm, men ngọc. Mỗi nét vẽ rồng, phượng hay hoa sen đều được người nghệ nhân phóng bút vẽ tay thủ công, mang đậm bản sắc văn hoá tâm linh của người Việt và tính độc bản cho từng tác phẩm.",
      en: "The essence of Bat Trang pottery lies in unique glazes such as cracked glaze, celadon, and indigo blue. Every stroke depicting dragons, phoenixes, or lotus flowers is hand-painted, ensuring individuality for every artwork."
    },
    originYear: "Thế kỷ XIV (14th Century)",
    activeWorkshops: {
      vi: "Hơn 600 lò gốm gia đình & nghệ nhân",
      en: "Over 600 family kilns & master artisans"
    },
    gallery: [
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780500279/langgom1_s4ab7a.jpg",
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780500738/gom1_fvl68m.jpg",
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780501470/gom3_pnxabe.jpg"
    ],
    visitUrl: "bat-trang"
  },
  'van-phuc': {
    quote: {
      vi: "Lụa Vạn Phúc mịn ấm như sương mai, óng ả như nắng thu, đại diện cho nét đài các, thanh tao kiêu sa của đất kinh kỳ.",
      en: "Van Phuc silk is soft as morning mist and lustrous as autumn sunlight, embodying the grace and elegance of ancient Thang Long."
    },
    history: {
      vi: "Làng lụa Vạn Phúc (Hà Đông) có lịch sử hơn 1100 năm, được sáng lập bởi bà A Lã Thị Nương - người đã truyền dạy nghề nuôi tằm dệt lụa cho dân làng từ thời Cao Biền. Từng là cống phẩm dâng lên các triều đại phong kiến, tơ lụa Vạn Phúc đã đi vào ca dao, huyền thoại như một biểu tượng của sự khéo léo Việt Nam.",
      en: "Van Phuc Silk Village has a history of over 1100 years, founded by Lady A La Thi Nuong who taught locals sericulture. Once a tribute for imperial courts, Van Phuc silk has become a timeless symbol of Vietnamese craftsmanship."
    },
    culture: {
      vi: "Sản phẩm nổi tiếng nhất của làng là Lụa Vân - loại lụa mỏng có hoa văn nổi chìm tinh xảo tựa như những áng mây bồng bềnh. Đặc trưng của lụa Vạn Phúc là mặc vào mùa hè thì mát mẻ, mùa đông thì ấm áp, sợi tơ dệt tự nhiên bóng bẩy bền màu qua thời gian.",
      en: "The village's most famous product is 'Van Silk' (Cloud Silk), featuring intricate patterns resembling floating clouds. Known for cooling in summer and warming in winter, it preserves natural luster for generations."
    },
    originYear: "Hơn 1100 năm lịch sử (Over 1100 years)",
    activeWorkshops: {
      vi: "Hơn 150 hộ dệt & nghệ nhân dệt lụa",
      en: "Over 150 active weaving looms & master weavers"
    },
    gallery: [
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780502590/langlua2_fupxng.jpg",
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780502548/langlua_jgljhj.jpg",
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780502216/langlua_osd4hr.jpg"
    ],
    visitUrl: "van-phuc"
  },
  'non-nuoc': {
    quote: {
      vi: "Mỗi tác phẩm điêu khắc cẩm thạch Non Nước là một linh hồn sống được giải thoát khỏi đá thô dưới chân núi Ngũ Hành.",
      en: "Every Non Nuoc marble sculpture is a living soul freed from raw stone at the foot of the Marble Mountains."
    },
    history: {
      vi: "Làng đá Non Nước nằm dưới chân danh thắng Ngũ Hành Sơn, được hình thành từ khoảng cuối thế kỷ XVII bởi nghệ nhân Huỳnh Bá Quát. Trải qua hơn 3 thế kỷ phát triển, từ các công cụ đá mài thô sơ, làng nghề đã vươn lên tầm cao nghệ thuật điêu khắc đá tinh xảo được công nhận là Di sản văn hóa phi vật thể quốc gia.",
      en: "Located at the foot of Marble Mountains, Non Nuoc Stone Carving Village was founded in the late 17th century by artisan Huynh Ba Quat. Over three centuries, it has evolved into a celebrated national intangible cultural heritage."
    },
    culture: {
      vi: "Các nghệ nhân Non Nước sử dụng đá cẩm thạch tự nhiên từ núi đá để điêu khắc ra các tác phẩm tượng Phật tâm linh, tượng nghệ thuật đương đại, và đồ mỹ nghệ trang trí. Sự khéo léo thể hiện qua nhịp búa đục tỉ mỉ, đánh bóng tự nhiên tạo nên bề mặt đá mịn như ngọc.",
      en: "Non Nuoc carvers transform natural marble into spiritual Buddhist statues, contemporary artworks, and home decorations. The precision of their hammering and polishing creates a smooth, jade-like stone finish."
    },
    originYear: "Thế kỷ XVII (Late 17th Century)",
    activeWorkshops: {
      vi: "Hơn 500 cơ sở điêu khắc & nghệ nhân điêu khắc",
      en: "Over 500 studios & master stone carvers"
    },
    gallery: [
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780539289/langDa3_xhez5r.jpg",
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780539289/tuong-da-lang-my-nghe-non-nuoc_v1mvme.jpg",
      "https://res.cloudinary.com/dpppe3usv/image/upload/v1780539289/lang-da-2_ymucno.jpg"
    ],
    visitUrl: "non-nuoc"
  },
  'dong-ho': {
    quote: {
      vi: "Hồn dân tộc sáng bừng trên giấy điệp - Tranh Đông Hồ gói trọn nếp sinh hoạt hồn hậu và văn hóa dân gian Việt.",
      en: "The national soul shines on Diep paper - Dong Ho paintings preserve the rustic lifestyle and folklore of Vietnam."
    },
    history: {
      vi: "Làng tranh Đông Hồ (Bắc Ninh) là dòng tranh dân gian khắc gỗ độc đáo nhất Việt Nam. Những bức tranh phản ánh cuộc sống nông nghiệp bình dị, mơ ước ấm no của người nông dân Việt cổ. Tranh sử dụng hoàn toàn màu sắc tự nhiên từ cây cỏ đất đá và được in thủ công bằng các ván khắc gỗ cổ xưa.",
      en: "Dong Ho Painting Village (Bac Ninh) produces the most unique woodblock prints in Vietnam. The paintings reflect rustic farming life and wishes for prosperity, using natural plant and mineral pigments printed by hand."
    },
    culture: {
      vi: "Đặc trưng lớn nhất của tranh Đông Hồ là giấy điệp - được làm từ vỏ cây dó và quét một lớp bột điệp giã từ vỏ sò điệp tự nhiên lấp lánh dưới ánh sáng. Các bức tranh tiêu biểu như Đám cưới chuột, Chăn trâu thổi sáo, Lợn âm dương đã đi sâu vào tâm thức của triệu người Việt.",
      en: "The defining feature of Dong Ho paintings is 'Diep paper' - made from Dzo bark coated with glistening crushed scallop shell paste. Iconic prints include Rat's Wedding, Buffalo Flute, and Yin-Yang Pig."
    },
    originYear: "Thế kỷ XVI (16th Century)",
    activeWorkshops: {
      vi: "Gia đình nghệ nhân ưu tú Nguyễn Đăng / Nguyễn Hữu",
      en: "Artisan lineages of Nguyen Dang & Nguyen Huu"
    },
    gallery: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80"
    ]
  }
};

interface VillageDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default function VillageDetailPage({ params }: VillageDetailPageProps) {
  const router = useRouter();
  const locale = useLocale() as 'vi' | 'en';
  const tNav = useTranslations('nav');
  const tList = useTranslations('villagesList');

  const [village, setVillage] = useState<Village | null>(null);
  const [loading, setLoading] = useState(true);

  const cleanSlug = params.slug.toLowerCase().trim();
  const detail = DETAILED_METADATA_MAP[cleanSlug] || null;

  useEffect(() => {
    const fetchVillage = async () => {
      setLoading(true);
      try {
        const data = await villageService.getVillageBySlug(params.slug);
        if (data) {
          setVillage(data);
        } else {
          // Empty state fallback using basic fields
          setVillage({
            slug: cleanSlug,
            name: { vi: cleanSlug.replace('-', ' '), en: cleanSlug.replace('-', ' ') },
            desc: { vi: '', en: '' },
            province: 'Việt Nam',
            location: { type: 'Point', coordinates: [105, 21] },
            categories: [],
            images: [],
            isVerified: false
          });
        }
      } catch (err) {
        console.warn('[VillageDetailPage] Failed to fetch village details:', err);
        // Offline default structure
        setVillage({
          slug: cleanSlug,
          name: { vi: cleanSlug.replace('-', ' '), en: cleanSlug.replace('-', ' ') },
          desc: { vi: '', en: '' },
          province: 'Việt Nam',
          location: { type: 'Point', coordinates: [105, 21] },
          categories: [],
          images: [],
          isVerified: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVillage();
  }, [params.slug, cleanSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center space-y-4">
        <Compass className="w-12 h-12 text-stone animate-spin duration-3000" />
        <span className="font-heading italic text-xl text-charcoal">Đang tái hiện không gian di sản...</span>
      </div>
    );
  }

  if (!village) {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center p-6 text-center select-none">
        <Compass className="w-16 h-16 text-ash mb-4" />
        <h2 className="font-heading text-3xl text-charcoal italic mb-2">Không tìm thấy làng nghề</h2>
        <p className="font-sans text-sm text-ash mb-6">Xin lỗi, dữ liệu về làng nghề này chưa được đồng bộ.</p>
        <button
          onClick={() => router.push('/villages')}
          className="border border-stone text-ash hover:text-charcoal px-6 py-2 rounded-xs font-sans text-xs uppercase tracking-wider transition-all"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Get active languages dynamically
  const villageName = village.name[locale] || village.name.vi || '';
  const villageDesc = village.desc[locale] || village.desc.vi || '';
  const heroImage = detail?.gallery?.[0] || village.images?.[0] || 'https://images.unsplash.com/photo-1565192647048-f997ded879ab?w=1600&auto=format&fit=crop&q=80';
  const visitUrl = detail?.visitUrl ? getTenantUrl(detail.visitUrl) : null;

  return (
    <div className="min-h-screen bg-parchment pb-24 selection:bg-lacquer/10 selection:text-lacquer">
      {/* 1. Hero Image Header (Parallax Banner Style) */}
      <div className="w-full h-[55vh] relative overflow-hidden bg-charcoal">
        <img
          src={heroImage}
          alt={villageName}
          className="w-full h-full object-cover opacity-75 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-transparent to-transparent pointer-events-none" />
        
        {/* Breadcrumbs and Basic Title Overlay */}
        <div className="absolute bottom-10 left-0 right-0 max-w-[1400px] mx-auto px-[clamp(20px,5vw,80px)] text-left select-none">
          <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-stone/80 uppercase font-sans mb-3">
            <span className="hover:text-cream cursor-pointer transition-colors" onClick={() => router.push('/')}>
              {tNav ? tNav('home') : 'Home'}
            </span>
            <span className="text-stone/40">/</span>
            <span className="hover:text-cream cursor-pointer transition-colors" onClick={() => router.push('/villages')}>
              {tList ? tList('breadcrumb') : 'Làng nghề'}
            </span>
            <span className="text-stone/40">/</span>
            <span className="text-cream truncate max-w-[200px] normal-case">{villageName}</span>
          </nav>
          
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-cream font-light italic leading-tight">
              {villageName}
            </h1>
            {village.isVerified && (
              <span className="flex items-center gap-1.5 bg-gold/20 text-gold border border-gold/40 rounded-xs text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 h-6">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Curation Description & Info Panel */}
      <div className="max-w-[1400px] mx-auto px-[clamp(20px,5vw,80px)] pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Left Column: Curation narrative (3/5 cols) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-3 space-y-8"
          >
            {/* Elegant Display Quote */}
            {detail && (
              <blockquote className="font-heading italic text-charcoal/90 border-l-2 border-gold pl-6 leading-relaxed" style={{ fontSize: 'clamp(20px, 2.5vw, 26px)' }}>
                &ldquo;{detail.quote[locale] || detail.quote.vi}&rdquo;
              </blockquote>
            )}

            <div className="space-y-6 text-charcoal font-body font-light text-base leading-relaxed text-justify">
              <SectionLabel label="Hành trình di sản / Curation Story" />
              <p>
                {villageDesc || 'Không gian văn hóa làng nghề truyền thống đang được số hóa chi tiết nhằm lưu trữ các tư liệu lịch sử, nghệ thuật và nghệ nhân của làng.'}
              </p>
              
              {detail && (
                <>
                  <div className="pt-4 space-y-4">
                    <h3 className="font-heading text-2xl italic text-lacquer">Nguồn gốc & Lịch sử</h3>
                    <p>{detail.history[locale] || detail.history.vi}</p>
                  </div>
                  <div className="pt-4 space-y-4">
                    <h3 className="font-heading text-2xl italic text-lacquer">Nét đặc sắc Nghệ thuật</h3>
                    <p>{detail.culture[locale] || detail.culture.vi}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Column: Info Panel Box (2/5 cols) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="lg:col-span-2 bg-cream border border-stone/80 rounded-sm p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-20" />
            <h4 className="font-heading text-2xl font-semibold italic text-charcoal mb-6 border-b border-stone pb-3 select-none">
              Thông tin Làng nghề
            </h4>
            
            <div className="space-y-6 font-sans select-none">
              {/* Location */}
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ash font-semibold">Tỉnh thành</span>
                  <span className="text-sm font-semibold text-charcoal">{village.province}</span>
                  {village.location?.coordinates && (
                    <span className="block text-xs text-ash mt-0.5">
                      Kinh độ: {village.location.coordinates[0]} | Vĩ độ: {village.location.coordinates[1]}
                    </span>
                  )}
                </div>
              </div>

              {/* Origin year */}
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ash font-semibold">Niên đại hình thành</span>
                  <span className="text-sm font-semibold text-charcoal">
                    {detail ? detail.originYear : 'Đang nghiên cứu'}
                  </span>
                </div>
              </div>

              {/* Scope scale */}
              <div className="flex items-start gap-4">
                <Users className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-ash font-semibold">Quy mô hoạt động</span>
                  <span className="text-sm font-semibold text-charcoal">
                    {detail ? (detail.activeWorkshops[locale] || detail.activeWorkshops.vi) : 'Đang thống kê'}
                  </span>
                </div>
              </div>

              {/* Categories */}
              {village.categories && village.categories.length > 0 && (
                <div className="pt-2">
                  <span className="block text-[10px] uppercase tracking-wider text-ash font-semibold mb-2">Ngành nghề chính</span>
                  <div className="flex flex-wrap gap-2">
                    {village.categories.map((cat, idx) => (
                      <TagBadge key={idx} label={cat} variant="stone" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Ornament Divider spacer */}
        <div className="py-16">
          <OrnamentDivider />
        </div>

        {/* 3. Living Gallery Section */}
        {detail && detail.gallery && detail.gallery.length > 0 && (
          <div className="space-y-8 select-none">
            <div className="text-center space-y-2">
              <SectionLabel label="Hình ảnh tác phẩm / Gallery" />
              <h3 className="font-heading text-3xl italic text-charcoal">Hồn Cốt Nghệ Thuật</h3>
            </div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {detail.gallery.map((img, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="aspect-square rounded-sm overflow-hidden border border-stone bg-cream relative group"
                >
                  <img
                    src={img}
                    alt={`${villageName} Gallery ${idx}`}
                    className="w-full h-full object-cover transition-transform duration-600 ease-out-expo group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* 4. Multi-Tenant Storefront Redirect CTA Banner */}
        {visitUrl && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 bg-lacquer text-cream p-8 md:p-12 rounded-sm shadow-md flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
          >
            {/* Grain texture overlay */}
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-10" />
            
            <div className="space-y-3 relative z-10 text-left max-w-xl">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-gold bg-cream/15 px-3 py-1 rounded-xs border border-cream/25">
                Không gian số của làng nghề / Digital Space
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl italic leading-tight">
                Khám phá Cửa hàng Số của {villageName}
              </h3>
              <p className="font-sans text-sm text-cream/80 font-light leading-relaxed">
                Nơi bạn có thể đặt mua trực tiếp các sản phẩm thủ công tinh xảo nhất được làm ra từ làng nghề, hoặc đặt lịch tham gia trải nghiệm trực tiếp các buổi workshop thú vị cùng nghệ nhân.
              </p>
            </div>

            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream hover:bg-parchment text-lacquer font-sans text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-xs shadow-md transition-all flex items-center gap-2 active:scale-97 shrink-0 relative z-10 hover:-translate-y-0.5"
            >
              <span>Ghé thăm ngay / Visit Now</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
