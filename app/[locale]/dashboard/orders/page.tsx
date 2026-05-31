'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function OrdersLog() {
  const orders = [
    {
      id: 'ORD-9823',
      customer: 'Trần Thị Mai',
      product: 'Bình Hút Lộc Gốm Chu Đậu Vẽ Vàng',
      amount: 1850000,
      date: '2026-05-27',
      status: 'Đang chuẩn bị / Preparing',
    },
    {
      id: 'ORD-9751',
      customer: 'Du khách Sophia Lorenz',
      product: 'Bộ Ấm Trà Men Rạn Cổ Bọc Đồng x2',
      amount: 1900000,
      date: '2026-05-26',
      status: 'Đã hoàn tất / Completed',
    },
    {
      id: 'ORD-9610',
      customer: 'KTS. Lê Hoàng Nam',
      product: 'Bình Hoa Thạch Sa Vẽ Cổ Điển',
      amount: 640000,
      date: '2026-05-24',
      status: 'Đã giao hàng / Shipped',
    },
  ];

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
        <motion.div variants={fadeUp} className="border-b border-stone/30 pb-6 mb-4">
          <SectionLabel label="Doanh thu bán lẻ / Sales log" />
          <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
            Đơn Hàng Gốm Sứ & Mỹ Nghệ
          </h2>
        </motion.div>

        {/* Transaction log table */}
        <motion.div variants={fadeUp} className="overflow-x-auto border border-stone bg-cream rounded-sm shadow-sm select-none">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone/40 bg-parchment/60 font-semibold uppercase tracking-wider text-ash/80">
                <th className="p-4">Mã đơn / Order ID</th>
                <th className="p-4">Khách hàng / Customer</th>
                <th className="p-4">Tác phẩm / Masterwork</th>
                <th className="p-4">Doanh thu / Amount</th>
                <th className="p-4">Ngày đặt / Date</th>
                <th className="p-4">Trạng thái / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20 font-light text-ash">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-parchment/30 transition-colors">
                  <td className="p-4 font-semibold text-charcoal">{ord.id}</td>
                  <td className="p-4 font-medium text-charcoal">{ord.customer}</td>
                  <td className="p-4">{ord.product}</td>
                  <td className="p-4 font-semibold text-primary">
                    {ord.amount.toLocaleString('vi-VN')} VND
                  </td>
                  <td className="p-4">{ord.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-xs text-[9px] font-semibold uppercase tracking-wider ${
                      ord.status.includes('Completed')
                        ? 'border border-accent/40 bg-accent/15 text-gold'
                        : 'border border-stone bg-transparent text-ash'
                    }`}>
                      {ord.status.split('/')[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}
