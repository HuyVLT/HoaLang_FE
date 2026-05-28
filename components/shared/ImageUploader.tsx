'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, RefreshCw, ImagePlus, Eye, Scissors, Check } from 'lucide-react';
import { useLocale } from 'next-intl';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: 'square' | 'video' | 'logo';
  placeholder?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = 'video',
  placeholder,
}: ImageUploaderProps) {
  const locale = useLocale() as 'vi' | 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Pan & Zoom Cropping States
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Track image dimensions for bounding constraints
  const [imgDimensions, setImgDimensions] = useState({ w: 1, h: 1 });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(locale === 'vi' ? 'Vui lòng chọn tệp tin hình ảnh.' : 'Please select a valid image file.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      // Simulate premium network delay
      setTimeout(() => {
        if (event.target?.result) {
          const imgBase64 = event.target.result as string;
          const img = new Image();
          img.src = imgBase64;
          img.onload = () => {
            setImgDimensions({ w: img.width, h: img.height });
            setOriginalImage(imgBase64);
            setZoom(1);
            setOffset({ x: 0, y: 0 });
            setShowCropModal(true);
          };
        }
        setUploading(false);
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setOriginalImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  // Drag boundaries constraint function to prevent white blank spaces
  const clampOffsets = (x: number, y: number, currentZoom: number) => {
    const container = cropContainerRef.current;
    if (!container || imgDimensions.w === 1) return { x, y };

    const W = container.clientWidth;
    const H = container.clientHeight;

    const targetAspect = W / H;
    const sourceAspect = imgDimensions.w / imgDimensions.h;

    let scaledWidth = 0;
    let scaledHeight = 0;

    if (sourceAspect > targetAspect) {
      scaledHeight = H;
      scaledWidth = H * sourceAspect;
    } else {
      scaledWidth = W;
      scaledHeight = W / sourceAspect;
    }

    const zoomedW = scaledWidth * currentZoom;
    const zoomedH = scaledHeight * currentZoom;

    // Allowed maximum offsets to prevent image from leaving crop frame
    const maxX = zoomedW > W ? (zoomedW - W) / 2 : 0;
    const minX = -maxX;
    const maxY = zoomedH > H ? (zoomedH - H) / 2 : 0;
    const minY = -maxY;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    };
  };

  // Mouse Drag Event Handlers for Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setOffset(clampOffsets(rawX, rawY, zoom));
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Event Handlers for Mobile Panning
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rawX = touch.clientX - dragStart.x;
    const rawY = touch.clientY - dragStart.y;
    setOffset(clampOffsets(rawX, rawY, zoom));
  };

  // Zoom scale adjustment handler with real-time constraint check
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    setOffset((prev) => clampOffsets(prev.x, prev.y, newZoom));
  };

  // HTML5 Canvas cropping execution
  const applyCrop = () => {
    const container = cropContainerRef.current;
    if (!container) return;
    const W = container.clientWidth;

    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Establish premium crop resolution targets
      let targetWidth = 600;
      let targetHeight = 600;
      if (aspectRatio === 'logo') {
        targetWidth = 600;
        targetHeight = 600; // Square
      } else if (aspectRatio === 'video') {
        targetWidth = 800;
        targetHeight = 450; // 16:9
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const targetAspect = targetWidth / targetHeight;
      const sourceAspect = img.width / img.height;

      let drawWidth = 0;
      let drawHeight = 0;

      if (sourceAspect > targetAspect) {
        drawHeight = targetHeight * zoom;
        drawWidth = drawHeight * sourceAspect;
      } else {
        drawWidth = targetWidth * zoom;
        drawHeight = drawWidth / sourceAspect;
      }

      const centeredX = (targetWidth - drawWidth) / 2;
      const centeredY = (targetHeight - drawHeight) / 2;

      // Map scale factor from DOM viewport to Canvas pixels
      const scaleRatio = targetWidth / W;
      const canvasOffsetX = offset.x * scaleRatio;
      const canvasOffsetY = offset.y * scaleRatio;

      ctx.fillStyle = '#FAF7F2'; // fill background with cream dó color in case of voids
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, centeredX + canvasOffsetX, centeredY + canvasOffsetY, drawWidth, drawHeight);

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.95);
      onChange(croppedBase64);
      setShowCropModal(false);
    };
  };

  const handleAdjustClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imgSrc = originalImage || value;
    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        setImgDimensions({ w: img.width, h: img.height });
        setOriginalImage(imgSrc);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setShowCropModal(true);
      };
    }
  };

  const t = {
    dragText: locale === 'vi' ? 'Kéo thả ảnh hoặc click để chọn' : 'Drag & drop image or click to select',
    formatText: locale === 'vi' ? 'Hỗ trợ JPG, PNG, WEBP tối đa 5MB' : 'Supports JPG, PNG, WEBP up to 5MB',
    uploadingText: locale === 'vi' ? 'Đang chuẩn bị di sản...' : 'Processing heritage asset...',
    removeText: locale === 'vi' ? 'Gỡ bỏ' : 'Remove',
    previewLabel: locale === 'vi' ? 'Xem trước ảnh' : 'Live Preview',
    cropTitle: locale === 'vi' ? 'Căn Chỉnh & Cắt Khung Hình' : 'Frame & Alignment Adjust',
    cropDesc: locale === 'vi' ? 'Kéo thả trực tiếp lên ảnh để di chuyển và trượt thanh thu phóng bên dưới để căn chỉnh góc di sản hoàn hảo.' : 'Drag directly on the image to pan, and slide the zoom bar below to frame your heritage asset perfectly.',
    zoomLabel: locale === 'vi' ? 'THU PHÓNG / ZOOM SCALE' : 'ZOOM SCALE CONTROL',
    btnCancel: locale === 'vi' ? 'Hủy' : 'Cancel',
    btnApply: locale === 'vi' ? 'Áp dụng' : 'Apply',
    btnAdjust: locale === 'vi' ? 'Căn chỉnh' : 'Adjust',
  };

  const aspectClass = 
    aspectRatio === 'square' 
      ? 'aspect-square h-14 w-14' 
      : aspectRatio === 'logo'
      ? 'aspect-square h-14 w-14' // logo is square
      : 'aspect-[16/9] h-14 w-24';

  const modalAspectClass = 
    aspectRatio === 'square' 
      ? 'aspect-square max-w-[280px] w-full mx-auto' 
      : aspectRatio === 'logo'
      ? 'aspect-square max-w-[280px] w-full mx-auto' // logo is square
      : 'aspect-[16/9] w-full max-w-[420px] mx-auto';

  return (
    <div className="space-y-2 text-left font-sans select-none w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
        <ImagePlus className="w-3.5 h-3.5 text-accent" />
        <span>{label}</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {!value && !uploading ? (
          /* Drag & Drop Area */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={triggerSelect}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border border-dashed p-4 rounded-sm flex flex-col items-center justify-center cursor-pointer transition-all duration-300 text-center relative overflow-hidden ${
              isDragActive 
                ? 'border-lacquer bg-lacquer-[0.03] scale-[1.01]' 
                : 'border-stone hover:border-bronze hover:bg-cream/40 bg-transparent'
            }`}
            style={{ minHeight: aspectRatio === 'logo' ? '80px' : '100px' }}
          >
            <UploadCloud className={`w-6 h-6 mb-2 transition-colors ${isDragActive ? 'text-lacquer' : 'text-ash/60'}`} />
            <span className="text-[11px] font-semibold text-charcoal block leading-tight">
              {t.dragText}
            </span>
            <span className="text-[9px] text-ash/80 block mt-1">
              {placeholder || t.formatText}
            </span>
          </motion.div>
        ) : uploading ? (
          /* Uploading simulated delay state */
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-stone bg-cream/40 p-4 rounded-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-[100px]"
          >
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-20" />
            <RefreshCw className="w-5 h-5 text-gold animate-spin mb-2" />
            <span className="text-[10px] font-semibold text-charcoal tracking-wide">
              {t.uploadingText}
            </span>
          </motion.div>
        ) : (
          /* Image Preview Thumbnail Card with Drag & Drop capability */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border p-3 bg-cream rounded-sm flex items-center justify-between gap-4 relative overflow-hidden group shadow-xs w-full transition-all duration-300 ${
              isDragActive ? 'border-lacquer scale-[1.01]' : 'border-stone'
            }`}
          >
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-30" />
            
            {/* Drag and Drop Active Overlay */}
            {isDragActive && (
              <div className="absolute inset-0 bg-cream/95 border border-dashed border-lacquer flex items-center justify-center gap-2 text-lacquer z-20 pointer-events-none">
                <UploadCloud className="w-4.5 h-4.5 animate-bounce shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {locale === 'vi' ? 'Thả để thay thế ảnh' : 'Drop to replace image'}
                </span>
              </div>
            )}
            
            {/* Left side: Visual preview + details */}
            <div className="flex items-center gap-3 min-w-0 flex-grow">
              <div className={`relative overflow-hidden border border-stone/50 bg-stone/20 rounded-xs shrink-0 ${aspectClass}`}>
                <img src={value} alt="Uploaded logo or cover preview" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 min-w-0 flex-grow">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gold flex items-center gap-1 leading-none">
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.previewLabel}</span>
                </span>
                <span className="text-[10px] text-ash block truncate w-full" title="di-san-tai-ban-dia.png">
                  di-san-tai-ban-dia.png
                </span>
              </div>
            </div>

            {/* Right side: Adjust & Remove buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleAdjustClick}
                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-semibold px-2 py-1.5 border border-stone/40 hover:border-bronze hover:text-bronze text-ash rounded-sm transition-all"
              >
                <Scissors className="w-3 h-3" />
                <span className="hidden sm:inline">{t.btnAdjust}</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="w-7 h-7 rounded-full border border-stone/30 hover:border-lacquer hover:bg-lacquer/5 hover:text-lacquer flex items-center justify-center text-ash/80 transition-all active:scale-95 shrink-0"
                title={t.removeText}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LUXURY PAN-AND-ZOOM CROP MODAL */}
      <AnimatePresence>
        {showCropModal && (
          <div className="fixed inset-0 bg-ink/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-parchment border border-stone max-w-md w-full p-6 shadow-2xl relative overflow-hidden flex flex-col gap-5 rounded-xs"
            >
              {/* Organic texture layer */}
              <div className="absolute inset-0 bg-grain pointer-events-none opacity-30 z-0" />

              {/* Modal Header */}
              <div className="relative z-10 space-y-1.5 border-b border-stone/30 pb-4 text-left">
                <h3 className="font-heading text-xl italic font-semibold text-charcoal flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-accent shrink-0" />
                  <span>{t.cropTitle}</span>
                </h3>
                <p className="text-[11px] text-ash font-light leading-relaxed">
                  {t.cropDesc}
                </p>
              </div>

              {/* Crop Viewer Frame */}
              <div className="relative z-10 w-full flex items-center justify-center py-2">
                <div
                  ref={cropContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUpOrLeave}
                  className={`relative overflow-hidden border border-stone/70 bg-stone/10 select-none cursor-grab rounded-xs ${modalAspectClass} ${
                    isDragging ? 'cursor-grabbing border-lacquer shadow-md' : 'shadow-sm'
                  }`}
                >
                  {/* Photo guidelines layer */}
                  <div 
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 grid grid-cols-3 grid-rows-3 z-20 ${
                      isDragging ? 'opacity-40' : 'opacity-0'
                    }`}
                  >
                    <div className="border-r border-b border-cream/35"></div>
                    <div className="border-r border-b border-cream/35"></div>
                    <div className="border-b border-cream/35"></div>
                    <div className="border-r border-b border-cream/35"></div>
                    <div className="border-r border-b border-cream/35"></div>
                    <div className="border-b border-cream/35"></div>
                    <div className="border-r border-cream/35"></div>
                    <div className="border-r border-cream/35"></div>
                    <div></div>
                  </div>

                  {/* Absolute Panned & Zoomed image element */}
                  <img
                    src={originalImage}
                    alt="Original raw uploaded asset"
                    draggable={false}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    }}
                    className="w-full h-full object-cover origin-center select-none pointer-events-none transition-transform duration-75"
                  />
                </div>
              </div>

              {/* Slider for scale factor */}
              <div className="relative z-10 space-y-2 text-left">
                <label className="text-[10px] font-bold tracking-wider text-ash block uppercase">
                  {t.zoomLabel}: {zoom.toFixed(2)}x
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => {
                      handleZoomChange(parseFloat(e.target.value));
                    }}
                    className="w-full h-1 bg-stone rounded-full appearance-none cursor-pointer accent-lacquer outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="relative z-10 flex justify-end gap-3 pt-3 border-t border-stone/30">
                <button
                  type="button"
                  onClick={() => setShowCropModal(false)}
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ash border border-stone/50 hover:border-charcoal hover:text-charcoal rounded-sm transition-all active:scale-95"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="button"
                  onClick={applyCrop}
                  className="px-6 py-2 text-xs font-semibold uppercase tracking-widest bg-lacquer text-cream hover:brightness-115 rounded-sm transition-all flex items-center gap-1.5 active:scale-[0.97]"
                >
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span>{t.btnApply}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
