'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  ShoppingBag,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { SectionLabel, OrnamentDivider } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DashboardOverview() {
  const [tenantName, setTenantName] = useState('Làng Gốm Bát Tràng');
  const [tenantSlug, setTenantSlug] = useState('bat-trang');

  useEffect(() => {
    const savedName = sessionStorage.getItem('hoalang_tenant_name');
    const savedSlug = sessionStorage.getItem('hoalang_tenant_slug');
    if (savedName) setTenantName(savedName);
    if (savedSlug) setTenantSlug(savedSlug);
  }, []);

  const stats = [
    { label: 'Tổng lượt xem / Page Views', value: '4,820', icon: Eye, color: 'text-accent bg-accent/15' },
    { label: 'Doanh số / E-commerce Sales', value: '18,450,000đ', icon: DollarSign, color: 'text-primary bg-primary/10' },
    { label: 'Lịch trải nghiệm / Bookings', value: '38', icon: Calendar, color: 'text-bronze bg-bronze/15' },
    { label: 'Hài lòng / Avg Rating', value: '4.92 / 5.0', icon: TrendingUp, color: 'text-accent bg-accent/20' },
  ];

  const recentBookings = [
    {
      id: 'B01',
      touristName: 'Sophia Lorenz',
      workshop: 'Trải Nghiệm Xoay Gốm Cơ Bản',
      date: '2026-05-29',
      time: '14:00 - 16:00',
      quantity: 2,
      status: 'Đã xác nhận / Confirmed',
    },
    {
      id: 'B02',
      touristName: 'Lê Hoàng Nam',
      workshop: 'Vẽ Tay Hoa Văn Trên Gốm Sứ',
      date: '2026-05-30',
      time: '09:00 - 12:00',
      quantity: 4,
      status: 'Chờ duyệt / Pending',
    },
    {
      id: 'B03',
      touristName: 'Kenji Takahashi',
      workshop: 'Trải Nghiệm Xoay Gốm Cơ Bản',
      date: '2026-06-01',
      time: '14:00 - 16:00',
      quantity: 1,
      status: 'Đã xác nhận / Confirmed',
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 flex flex-col text-left select-none relative">
      {/* Decorative grain backdrop */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-[1200px] w-full mx-auto space-y-8 relative z-10"
      >
        {/* Welcome Banner */}
        <motion.div variants={fadeUp} className="space-y-2">
          <SectionLabel label="Hệ thống quản trị di sản / Overview" />
          <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
            Chào mừng trở lại, {tenantName}!
          </h2>
          <p className="font-sans text-xs text-ash font-light leading-relaxed">
            Xem tổng quan hoạt động kinh doanh trực tuyến, lịch đặt khóa học trải nghiệm nghệ thuật thủ công.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-cream border border-stone rounded-sm p-6 flex items-center justify-between shadow-sm hover:shadow-hover transition-all duration-300"
            >
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ash block">
                  {stat.label}
                </span>
                <span className="font-heading text-2xl font-bold italic text-charcoal block">
                  {stat.value}
                </span>
              </div>
              <div className={`p-3 rounded-xs shrink-0 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <OrnamentDivider className="text-stone/40 py-2" />

        {/* Dynamic Lists Section */}
        <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Recent Reservations bookings */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-heading text-2xl italic text-charcoal font-semibold border-b border-stone/30 pb-2">
              Khách du lịch đặt lịch mới / Recent Bookings
            </h3>
            
            <div className="space-y-3 pt-2">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-cream border border-stone rounded-sm p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-bronze transition-colors shadow-xs"
                >
                  <div className="text-left space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] bg-accent/20 text-bronze font-semibold uppercase px-2 py-0.5 rounded-xs select-none">
                        {b.id}
                      </span>
                      <h4 className="font-heading font-semibold text-charcoal italic text-[17px]">
                        {b.touristName}
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ash font-sans font-light">
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                        {b.workshop}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {b.date} ({b.time})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone/20">
                    <span className="text-xs font-semibold uppercase text-ash font-sans select-none">
                      {b.quantity} khách
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider font-sans select-none px-2.5 py-1 border rounded-xs ${
                      b.status.includes('Confirmed')
                        ? 'border-accent/40 bg-accent/15 text-gold'
                        : 'border-primary/40 bg-primary/10 text-primary animate-pulse'
                    }`}>
                      {b.status.split('/')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Active Platform Highlights / Tips */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-heading text-2xl italic text-charcoal font-semibold border-b border-stone/30 pb-2">
              Bản tin di sản / Highlights
            </h3>

            <div className="bg-cream border border-stone rounded-sm p-6 space-y-4 shadow-sm text-left">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold font-sans block">
                Truyền thông & Đào tạo / Tips
              </span>

              <div className="space-y-4 text-xs font-sans font-light text-ash leading-relaxed">
                <p>
                  💡 **Mẹo tùy biến**: Sử dụng phông tiêu đề **Playfair Display** khi dệt bản thiết kế gốm/lụa nếu bạn mong muốn truyền tải vẻ đẹp vương giả đương đại.
                </p>
                <p>
                  🏺 **Quản lý sản phẩm**: Đăng tải đầy đủ mô tả nguồn gốc đất sét/se sợi dệt và quá trình vẽ tay trên sản phẩm để nâng cao tỉ lệ chốt đơn từ du khách quốc tế.
                </p>
              </div>

              <div className="pt-4 border-t border-stone/30 flex justify-center">
                <a
                  href={`/vi/dashboard/website?slug=${tenantSlug}`}
                  className="inline-flex items-center gap-1 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-widest text-[9px] px-6 py-2.5 rounded-xs hover:brightness-110 shadow-sm transition-all"
                >
                  Tùy biến Website ngay
                </a>
              </div>
            </div>
          </div>

        </motion.div>

      </motion.div>
    </div>
  );
}
