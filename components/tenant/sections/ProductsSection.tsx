'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ProductsSection as ProductsSectionType } from '@/types/tenant';
import { SectionLabel, LocaleText, CraftCard, useCheckoutStore } from '@/components/shared';
import { useTenantTheme } from '../TenantThemeProvider';
import { fadeUp, stagger } from './motion';

// Realistic mock products for Bát Tràng, Vạn Phúc, and general craft
const MOCK_PRODUCTS_MAP: Record<
  string,
  {
    name: { vi: string; en: string };
    price: number;
    coverImage: string;
    villageName: string;
    stock: number;
  }[]
> = {
  'bat-trang': [
    {
      name: { vi: 'Bình Hút Lộc Gốm Chu Đậu Vẽ Vàng', en: 'Gold-Painted Celadon Wealth Urn' },
      price: 1850000,
      coverImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Gốm Bát Tràng',
      stock: 12,
    },
    {
      name: { vi: 'Bộ Ấm Trà Men Rạn Cổ Bọc Đồng', en: 'Bronze-Accented Crackled Antique Tea Set' },
      price: 950000,
      coverImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Gốm Bát Tràng',
      stock: 5,
    },
    {
      name: { vi: 'Bình Hoa Thạch Sa Vẽ Cổ Điển', en: 'Hand-Carved Stone Sand Flower Vase' },
      price: 640000,
      coverImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Gốm Bát Tràng',
      stock: 8,
    },
    {
      name: { vi: 'Tượng Di Lặc Phù Điêu Đất Nung', en: 'Terracotta Maitreya Relief Statue' },
      price: 1200000,
      coverImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Gốm Bát Tràng',
      stock: 0,
    },
  ],
  'van-phuc': [
    {
      name: { vi: 'Khăn Lụa Hà Đông Thêu Sen Thủ Công', en: 'Hand-Embroidered Lotus Silk Scarf' },
      price: 450000,
      coverImage: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Lụa Vạn Phúc',
      stock: 25,
    },
    {
      name: { vi: 'Áo Dài Gấm Vạn Phúc Hoa Điệp Chìm', en: 'Traditional Brocade Ao Dai Gown' },
      price: 2800000,
      coverImage: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Lụa Vạn Phúc',
      stock: 4,
    },
    {
      name: { vi: 'Dải Lụa Thêu Tre Nghệ Thuật', en: 'Hand-Embroidered Bamboo Silk Runner' },
      price: 380000,
      coverImage: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=600&h=600&fit=crop&q=80',
      villageName: 'Làng Lụa Vạn Phúc',
      stock: 15,
    },
  ],
};

export default function ProductsSection({ section }: { section: ProductsSectionType }) {
  const { heading, subheading } = section;
  const { theme } = useTenantTheme();
  const locale = useLocale() as 'vi' | 'en';
  const openCheckout = useCheckoutStore(state => state.openCheckout);
  const tenantId = theme.logo ? (theme.logo.includes('van-phuc') || heading.vi.includes('Lụa') ? 'van-phuc' : 'bat-trang') : 'bat-trang';

  // Get matching mock products or fallback to bat-trang
  const products = MOCK_PRODUCTS_MAP[tenantId] || MOCK_PRODUCTS_MAP['bat-trang'];

  return (
    <section
      id="products"
      className="bg-parchment py-[var(--section-padding-y,80px)] px-[var(--page-padding-x,20px)] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <motion.div variants={fadeUp} className="mb-4">
              <SectionLabel label="Tuyệt tác làng nghề / Masterpieces" />
            </motion.div>
 
            <motion.h2
              variants={fadeUp}
              className="font-heading text-charcoal italic"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.15 }}
            >
              <LocaleText content={heading} />
            </motion.h2>
 
            {subheading && (
              <motion.p
                variants={fadeUp}
                className="font-sans text-ash text-sm tracking-wide mt-3 max-w-xl leading-relaxed"
              >
                <LocaleText content={subheading} />
              </motion.p>
            )}
          </div>
        </motion.div>
 
        {/* Products Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((prod, index) => (
            <motion.div key={index} variants={fadeUp} className="h-full">
              <CraftCard
                name={prod.name}
                price={prod.price}
                coverImage={prod.coverImage}
                villageName={prod.villageName}
                stock={prod.stock}
                onQuickView={() => openCheckout({
                  name: prod.name[locale] || prod.name.vi,
                  price: prod.price,
                  type: 'product',
                  image: prod.coverImage,
                  villageName: prod.villageName
                })}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
