'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, ShieldCheck, Mail, Globe, Phone, Save } from 'lucide-react';
import { toast } from 'sonner';
import { SectionLabel, OrnamentDivider } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function SettingsPanel() {
  const [tenantSlug, setTenantSlug] = useState('bat-trang');
  const [tenantName, setTenantName] = useState('Làng Gốm Bát Tràng');
  const [customDomain, setCustomDomain] = useState('');
  const [hotline, setHotline] = useState('+84 24 3874 0123');
  const [email, setEmail] = useState('contact@battrang.hoalang.vn');

  useEffect(() => {
    const savedSlug = sessionStorage.getItem('hoalang_tenant_slug');
    const savedName = sessionStorage.getItem('hoalang_tenant_name');
    if (savedSlug) {
      setTenantSlug(savedSlug);
      setCustomDomain(`${savedSlug}.hoalang.vn`);
      setEmail(`contact@${savedSlug}.hoalang.vn`);
    }
    if (savedName) setTenantName(savedName);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cấu hình thiết lập thành công!', {
      description: 'Thông tin liên hệ của làng nghề đã được đồng bộ.',
    });
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 flex flex-col text-left select-none relative">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-2xl w-full mx-auto space-y-6 relative z-10 text-left"
      >
        {/* Header toolbar */}
        <motion.div variants={fadeUp} className="border-b border-stone/30 pb-6 mb-4">
          <SectionLabel label="Cấu hình hệ thống / Config" />
          <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
            Thiết Lập Không Gian Di Sản
          </h2>
        </motion.div>

        {/* Form controls */}
        <motion.form onSubmit={handleSaveSettings} variants={fadeUp} className="bg-cream border border-stone rounded-sm p-8 space-y-6 shadow-sm">
          <h4 className="font-heading italic text-lg text-charcoal font-semibold border-b border-stone/30 pb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent animate-spin duration-3000" />
            <span>Thông tin cơ bản của Làng</span>
          </h4>

          <div className="space-y-4">
            {/* Village name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                Tên làng nghề / Village Name
              </label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-primary font-medium"
              />
            </div>

            {/* Custom domain subdomain link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-accent" />
                <span>Địa chỉ Website phụ / Subdomain</span>
              </label>
              <input
                type="text"
                disabled
                value={customDomain}
                className="w-full bg-stone/10 border-b border-stone text-sm text-ash py-2 focus:outline-none cursor-not-allowed font-semibold"
              />
              <p className="text-[10px] text-ash/80 italic">
                * Địa chỉ subdomain được khóa cứng sau khi hoàn tất onboarding. Liên hệ Super Admin để yêu cầu tùy chỉnh DNS tên miền riêng.
              </p>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>Điện thoại Hotline / Tel</span>
                </label>
                <input
                  type="text"
                  required
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>Email liên hệ / Contact Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone/30 flex justify-end gap-3 select-none">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-8 py-3 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4 text-accent" />
              <span>Lưu cấu hình / Save Settings</span>
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
export { SettingsPanel };
