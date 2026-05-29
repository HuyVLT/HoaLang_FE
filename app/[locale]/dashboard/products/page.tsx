'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Trash2, Tag, Box, Info } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'P01',
    name: 'Bình Hút Lộc Gốm Chu Đậu Vẽ Vàng',
    price: 1850000,
    stock: 12,
    category: 'Gốm sứ / Ceramics',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop&q=80',
  },
  {
    id: 'P02',
    name: 'Bộ Ấm Trà Men Rạn Cổ Bọc Đồng',
    price: 950000,
    stock: 5,
    category: 'Ấm chén / Tea Set',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=300&fit=crop&q=80',
  },
  {
    id: 'P03',
    name: 'Bình Hoa Thạch Sa Vẽ Cổ Điển',
    price: 640000,
    stock: 8,
    category: 'Gốm trang trí / Decor',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=300&fit=crop&q=80',
  },
];

export default function ProductsManager() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Gốm sứ / Ceramics');
  const [image, setImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const newProd: ProductItem = {
      id: `P0${products.length + 1}`,
      name,
      price: parseInt(price),
      stock: parseInt(stock),
      category,
      image: image || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop&q=80',
    };

    setProducts([newProd, ...products]);
    setName('');
    setPrice('');
    setStock('');
    setImage('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 flex flex-col text-left select-none relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-[1200px] w-full mx-auto space-y-6 relative z-10"
      >
        {/* Header Toolbar */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone/30 pb-6">
          <div className="space-y-2">
            <SectionLabel label="Quản lý kho mỹ nghệ / Inventory" />
            <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
              Danh Mục Tác Phẩm Nghệ Thuật
            </h2>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Thêm sản phẩm / Add</span>
          </button>
        </motion.div>

        {/* Adding form dialog collapsible */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAddProduct}
              className="bg-cream border border-stone rounded-sm p-6 space-y-4 overflow-hidden shadow-sm"
            >
              <h4 className="font-heading italic text-lg text-charcoal font-semibold border-b border-stone/30 pb-2">
                Đăng ký tác phẩm mới
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Tên tác phẩm / Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bình hút lộc"
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Giá bán (VND) / Price
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1200000"
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Số lượng trong kho / Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="15"
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Phân loại / Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Ảnh sản phẩm URL / Image URL
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-stone/50 hover:border-bronze rounded-sm font-sans text-[10px] font-semibold uppercase tracking-wider text-ash"
                >
                  Hủy / Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-6 py-2 rounded-sm hover:brightness-110 shadow-sm"
                >
                  Xác nhận thêm / Save Product
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Products Grid list */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {products.map((prod) => (
            <motion.div
              key={prod.id}
              variants={fadeUp}
              className="bg-cream border border-stone rounded-sm overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-hover"
            >
              {/* Product Cover image */}
              <div className="relative aspect-square w-full bg-stone/20 overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                
                {/* Inventory Badge */}
                {prod.stock === 0 ? (
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-xs select-none">
                    Hết hàng / Out of Stock
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[8px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-xs select-none flex items-center gap-1.5">
                    <Box className="w-2.5 h-2.5 text-ink" />
                    <span>Kho: {prod.stock} chiếc</span>
                  </span>
                )}
              </div>

              {/* Product Meta details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-ash flex items-center gap-1">
                    <Tag className="w-3 h-3 text-accent" />
                    {prod.category}
                  </span>
                  <h4 className="font-heading font-semibold text-charcoal italic text-base leading-snug line-clamp-2">
                    {prod.name}
                  </h4>
                </div>

                <div className="pt-3 border-t border-stone/30 flex items-center justify-between">
                  <span className="font-sans font-semibold text-primary text-base tracking-wide">
                    {prod.price.toLocaleString('vi-VN')} VND
                  </span>

                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-2 hover:bg-primary/10 text-ash hover:text-primary rounded-full transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
export { ProductsManager };
