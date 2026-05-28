'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Clock, Tag, User } from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

interface WorkshopItem {
  id: string;
  title: string;
  duration: string;
  price: number;
  image: string;
  description: string;
}

const DEFAULT_WORKSHOPS: WorkshopItem[] = [
  {
    id: 'W01',
    title: 'Trải nghiệm xoay gốm cơ bản',
    duration: '2 giờ (2 hours)',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1565192647048-f997ded879ab?w=400&h=300&fit=crop&q=80',
    description: 'Học cách định hình phôi gốm tròn trên bàn xoay chân gỗ mộc mạc, làm ly chén cơ bản.',
  },
  {
    id: 'W02',
    title: 'Vẽ tay hoa văn trên gốm sứ',
    duration: '3 giờ (3 hours)',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&h=300&fit=crop&q=80',
    description: 'Đích thân vẽ oxit coban màu lam cổ điển lên gốm thô, tráng men tro cổ truyền Bát Tràng.',
  },
];

export default function WorkshopsManager() {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(DEFAULT_WORKSHOPS);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('2 giờ (2 hours)');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !duration) return;

    const newWs: WorkshopItem = {
      id: `W0${workshops.length + 1}`,
      title,
      duration,
      price: parseInt(price),
      image: image || 'https://images.unsplash.com/photo-1565192647048-f997ded879ab?w=400&h=300&fit=crop&q=80',
      description,
    };

    setWorkshops([newWs, ...workshops]);
    setTitle('');
    setPrice('');
    setImage('');
    setDescription('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setWorkshops(workshops.filter((w) => w.id !== id));
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
        {/* Header toolbar */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone/30 pb-6">
          <div className="space-y-2">
            <SectionLabel label="Quản lý lịch truyền nghệ / Masterclasses" />
            <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
              Khóa Học Trải Nghiệm Làng Nghề
            </h2>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>Thêm khóa học / Add</span>
          </button>
        </motion.div>

        {/* Adding Form Dialog Collapsible */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAddWorkshop}
              className="bg-cream border border-stone rounded-sm p-6 space-y-4 overflow-hidden shadow-sm text-left"
            >
              <h4 className="font-heading italic text-lg text-charcoal font-semibold border-b border-stone/30 pb-2">
                Thiết lập khóa trải nghiệm mới
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Tên khóa học / Workshop Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Làm gốm nghệ thuật"
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Giá dịch vụ (VND / Khách)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="300000"
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                    Thời lượng khóa học / Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2 giờ (2 hours)"
                    className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                  Mô tả trải nghiệm nghệ thuật / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhào nặn đất sét, se tơ dệt gấm..."
                  className="w-full bg-transparent border border-stone p-3 text-xs text-ink rounded-sm focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-ash tracking-wider block">
                  Đường dẫn ảnh minh họa / Photo URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none"
                />
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
                  Thiết lập khóa học / Save Course
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Workshops list */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl"
        >
          {workshops.map((ws) => (
            <motion.div
              key={ws.id}
              variants={fadeUp}
              className="flex flex-col sm:flex-row bg-cream border border-stone rounded-sm overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-hover"
            >
              <div className="relative aspect-square sm:w-40 w-full overflow-hidden bg-stone/20 shrink-0">
                <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] bg-accent/20 text-bronze font-semibold uppercase px-2 py-0.5 rounded-xs select-none">
                      {ws.id}
                    </span>
                    <button
                      onClick={() => handleDelete(ws.id)}
                      className="p-1 hover:bg-primary/10 text-ash hover:text-primary rounded-full transition-colors"
                      title="Xóa khóa học"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-heading font-semibold text-charcoal italic text-[18px] leading-snug">
                    {ws.title}
                  </h3>
                  <p className="font-sans text-ash font-light text-[12px] leading-relaxed line-clamp-2">
                    {ws.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone/30 flex flex-col gap-1.5 mt-3">
                  <div className="flex items-center gap-2 text-xs text-ash font-sans">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Thời lượng: {ws.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-primary text-sm font-semibold font-sans">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span>{ws.price.toLocaleString('vi-VN')} VND / người</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
export { WorkshopsManager };
