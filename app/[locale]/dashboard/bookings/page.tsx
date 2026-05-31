'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { SectionLabel } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function BookingsLog() {
  const bookings = [
    {
      id: 'B01',
      name: 'Sophia Lorenz',
      email: 'sophia@lorenz.de',
      workshop: 'Trải Nghiệm Xoay Gốm Cơ Bản',
      date: '2026-05-29',
      time: '14:00 - 16:00',
      quantity: 2,
      status: 'Đã xác nhận / Confirmed',
    },
    {
      id: 'B02',
      name: 'Lê Hoàng Nam',
      email: 'hoangnam@kts.vn',
      workshop: 'Vẽ Tay Hoa Văn Trên Gốm Sứ',
      date: '2026-05-30',
      time: '09:00 - 12:00',
      quantity: 4,
      status: 'Chờ duyệt / Pending',
    },
    {
      id: 'B03',
      name: 'Kenji Takahashi',
      email: 'kenji@takahashi.jp',
      workshop: 'Trải Nghiệm Xoay Gốm Cơ Bản',
      date: '2026-06-01',
      time: '14:00 - 16:00',
      quantity: 1,
      status: 'Đã xác nhận / Confirmed',
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
          <SectionLabel label="Lịch truyền nghề / Reservations" />
          <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
            Lịch Hẹn Trải Nghiệm Làng Nghề
          </h2>
        </motion.div>

        {/* Reservations table */}
        <motion.div variants={fadeUp} className="overflow-x-auto border border-stone bg-cream rounded-sm shadow-sm select-none">
          <table className="w-full text-left font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone/40 bg-parchment/60 font-semibold uppercase tracking-wider text-ash/80">
                <th className="p-4">Mã lịch / ID</th>
                <th className="p-4">Khách du lịch / Tourist</th>
                <th className="p-4">Khóa học / Workshop</th>
                <th className="p-4">Thời gian / Time slot</th>
                <th className="p-4">Số khách / Guests</th>
                <th className="p-4">Trạng thái / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/20 font-light text-ash">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-parchment/30 transition-colors">
                  <td className="p-4 font-semibold text-charcoal">{b.id}</td>
                  <td className="p-4">
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-charcoal">{b.name}</span>
                      <span className="text-[10px] text-ash flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {b.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{b.workshop}</td>
                  <td className="p-4 font-medium text-charcoal">
                    <span className="block">{b.date}</span>
                    <span className="text-[10px] text-ash block mt-0.5">{b.time}</span>
                  </td>
                  <td className="p-4 font-semibold text-charcoal">{b.quantity} người</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-xs text-[9px] font-semibold uppercase tracking-wider ${
                      b.status.includes('Confirmed')
                        ? 'border border-accent/40 bg-accent/15 text-gold'
                        : 'border border-primary/40 bg-primary/10 text-primary animate-pulse'
                    }`}>
                      {b.status.split('/')[0]}
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
