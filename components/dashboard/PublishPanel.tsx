'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Globe, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PublishPanelProps {
  tenantSlug: string;
  isPublished: boolean;
  onStatusChange: (status: boolean) => void;
}

export default function PublishPanel({
  tenantSlug,
  isPublished,
  onStatusChange,
}: PublishPanelProps) {
  const [publishing, setPublishing] = useState(false);
  const liveUrl = `https://${tenantSlug}.hoalang.vn`;
  const previewUrl = `/vi/tenant/${tenantSlug}`;

  const handlePublishToggle = async () => {
    setPublishing(true);
    const newStatus = !isPublished;
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      // PUT updates PageConfig with new published state
      const res = await axios.put(`${backendUrl}/tenant/${tenantSlug}/page-config`, {
        published: newStatus,
      });

      if (res.data && res.data.success) {
        onStatusChange(newStatus);
        if (newStatus) {
          toast.success('Website của bạn đã được xuất bản trực tuyến!', {
            description: `Truy cập tại địa chỉ: ${liveUrl}`,
          });
        } else {
          toast.info('Đã gỡ website xuống bản thảo (Draft)!', {
            description: 'Khách truy cập sẽ không xem được website nữa.',
          });
        }
      } else {
        throw new Error('Publish API failed');
      }
    } catch (err) {
      console.warn('[PublishToggle] Backend save failed, simulating local status toggle:', err);
      // Standalone simulation fallback
      onStatusChange(newStatus);
      if (newStatus) {
        toast.success('Đã mô phỏng xuất bản website thành công!', {
          description: `Giao diện mô phỏng tại: ${liveUrl}`,
        });
      } else {
        toast.info('Đã mô phỏng gỡ website xuống bản thảo!');
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-cream border border-stone rounded-sm p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left select-none shadow-xs shrink-0">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className={`inline-flex items-center justify-center text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs select-none ${
            isPublished
              ? 'border border-accent/40 bg-accent/15 text-gold animate-pulse'
              : 'border border-stone bg-transparent text-ash'
          }`}>
            {isPublished ? 'Đang Hoạt Động / LIVE' : 'Bản Nháp / DRAFT'}
          </span>
          <h4 className="font-heading font-semibold text-charcoal italic text-[16px]">
            Xuất Bản Cửa Hàng Làng Nghề / Publishing
          </h4>
        </div>
        <p className="font-sans text-xs font-light text-ash leading-relaxed max-w-md">
          {isPublished
            ? `Website đang chạy trực tiếp trên tên miền chính thức của làng nghề.`
            : `Landing page hiện đang ở dạng nháp. Hãy xuất bản để du khách toàn cầu có thể truy cập.`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone/20">
        {/* Preview URL */}
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 bg-transparent border border-stone/50 hover:border-bronze text-ash hover:text-charcoal px-4 py-2 rounded-xs font-sans text-[10px] font-semibold uppercase tracking-wider transition-all"
        >
          <Eye className="w-3.5 h-3.5 text-accent" />
          <span>Xem thử / Preview</span>
        </a>

        {/* Publish Action Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePublishToggle}
          disabled={publishing}
          className={`inline-flex items-center gap-2 font-sans font-semibold uppercase tracking-wider text-[10px] px-6 py-2 rounded-xs border shadow-sm transition-all ${
            isPublished
              ? 'bg-transparent border-primary/50 text-primary hover:bg-primary/10'
              : 'bg-primary border-primary text-primary-foreground hover:brightness-110'
          }`}
        >
          {publishing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : isPublished ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : (
            <Globe className="w-3.5 h-3.5 text-accent" />
          )}
          <span>
            {publishing
              ? 'Đang lưu / Saving...'
              : isPublished
              ? 'Gỡ xuống / Unpublish'
              : 'Xuất bản / Publish'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
export { PublishPanel };
