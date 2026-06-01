'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Link,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { SectionLabel } from '@/components/shared';
import api from '@/lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

interface PayOSConfig {
  isEnabled: boolean;
  clientId: string | null;
  hasApiKey: boolean;
  hasChecksumKey: boolean;
  tenantId: string | null;
}

export default function MerchantPaymentSettings() {
  const t = useTranslations('dashboardPayment');
  
  const [config, setConfig] = useState<PayOSConfig>({
    isEnabled: false,
    clientId: null,
    hasApiKey: false,
    hasChecksumKey: false,
    tenantId: null
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Form values
  const [clientIdInput, setClientIdInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [checksumKeyInput, setChecksumKeyInput] = useState('');
  
  // Show/hide password states
  const [showApiKey, setShowApiKey] = useState(false);
  const [showChecksumKey, setShowChecksumKey] = useState(false);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/payos/config');
      if (res.data && res.data.success) {
        setConfig(res.data.data);
        if (res.data.data.isEnabled) {
          setClientIdInput(res.data.data.clientId || '');
        }
      }
    } catch (err) {
      console.error('Failed to load merchant PayOS config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim() || !apiKeyInput.trim() || !checksumKeyInput.trim()) {
      toast.error(t('errorSave'), {
        description: 'Vui lòng nhập đầy đủ cả 3 tham số kết nối.'
      });
      return;
    }

    try {
      setSaving(true);
      const res = await api.post('/dashboard/payos/config', {
        clientId: clientIdInput.trim(),
        apiKey: apiKeyInput.trim(),
        checksumKey: checksumKeyInput.trim()
      });

      if (res.data && res.data.success) {
        toast.success(t('successSave'));
        setApiKeyInput('');
        setChecksumKeyInput('');
        fetchConfig();
      }
    } catch (err: unknown) {
      console.error('Failed to save PayOS config:', err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      toast.error(t('errorSave'), {
        description: axiosError.response?.data?.message || 'Có lỗi xảy ra khi xác thực khóa PayOS.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Bạn có chắc chắn muốn ngắt kết nối cổng thanh toán PayOS? Du khách sẽ không thể mua hàng online qua VietQR nữa.')) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.delete('/dashboard/payos/config');
      if (res.data && res.data.success) {
        toast.success('Đã ngắt kết nối PayOS thành công.');
        setClientIdInput('');
        setApiKeyInput('');
        setChecksumKeyInput('');
        fetchConfig();
      }
    } catch (err) {
      console.error('Failed to disconnect PayOS:', err);
      toast.error('Không thể ngắt kết nối PayOS. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    if (!config.tenantId) return;
    
    // Resolve dynamic full absolute webhook url
    const backendBase = api.defaults.baseURL?.startsWith('http') 
      ? api.defaults.baseURL 
      : typeof window !== 'undefined'
        ? window.location.origin + api.defaults.baseURL
        : '';
        
    const webhookUrl = `${backendBase}/payment/payos/webhook/${config.tenantId}`;
    
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success(t('copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate clean dynamic webhook display text
  const getWebhookUrlDisplay = (): string => {
    if (!config.tenantId) return '';
    const backendBase = api.defaults.baseURL?.startsWith('http') 
      ? api.defaults.baseURL 
      : typeof window !== 'undefined'
        ? window.location.origin + api.defaults.baseURL
        : '';
    return `${backendBase}/payment/payos/webhook/${config.tenantId}`;
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 flex flex-col text-left select-none relative font-sans">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-2xl w-full mx-auto space-y-6 relative z-10 text-left"
      >
        {/* Header Title toolbar */}
        <motion.div variants={fadeUp} className="border-b border-stone/30 pb-6 mb-4">
          <SectionLabel label="Cấu hình doanh thu / Finance" />
          <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
            {t('title')}
          </h2>
          <p className="text-xs text-ash mt-1">{t('subtitle')}</p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <span className="text-xs text-ash">Đang xử lý kết nối...</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Guide Section */}
            <motion.div variants={fadeUp} className="bg-cream border border-stone/60 rounded-sm p-6 space-y-4 shadow-xs">
              <h4 className="font-heading italic text-md text-charcoal font-semibold flex items-center gap-2 border-b border-stone/20 pb-2">
                <Link className="w-4 h-4 text-gold" />
                <span>{t('guideTitle')}</span>
              </h4>
              <ul className="text-xs text-ash space-y-2.5 leading-relaxed list-decimal pl-4">
                <li>
                  {t('guideStep1')}{' '}
                  <a href="https://payos.vn" target="_blank" rel="noopener noreferrer" className="text-lacquer hover:underline font-semibold">
                    payos.vn
                  </a>.
                </li>
                <li>{t('guideStep2')}</li>
                <li>{t('guideStep3')}</li>
              </ul>
              <div className="pt-2">
                <a
                  href="https://dashboard.payos.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-stone/20 text-charcoal font-semibold tracking-wider text-[9px] uppercase px-4 py-2 rounded-xs hover:bg-stone/30 transition-all font-sans"
                >
                  {t('guideLink')}
                </a>
              </div>
            </motion.div>

            {/* Connection Status Widget */}
            <motion.div variants={fadeUp} className="bg-cream border border-stone/60 rounded-sm p-6 space-y-4 shadow-xs">
              <h4 className="font-heading italic text-md text-charcoal font-semibold flex items-center gap-2 border-b border-stone/20 pb-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>{t('statusTitle')}</span>
              </h4>
              
              {config.isEnabled ? (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xs">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {t('statusConnected')}
                    </span>
                    <div className="text-[10px] text-emerald-700/80 font-mono">
                      Client ID: {config.clientId}
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center gap-1 bg-lacquer/10 text-lacquer hover:bg-lacquer hover:text-cream text-[9px] uppercase tracking-wider font-bold px-4 py-2 rounded-xs transition-all font-sans"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('btnDisconnect')}
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xs text-left">
                  <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
                    {t('statusNotConnected')}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Form Credentials Section */}
            {!config.isEnabled && (
              <motion.form onSubmit={handleSaveConfig} variants={fadeUp} className="bg-cream border border-stone rounded-sm p-6 sm:p-8 space-y-5 shadow-sm text-left">
                <h4 className="font-heading italic text-md text-charcoal font-semibold border-b border-stone/20 pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gold" />
                  <span>{t('formTitle')}</span>
                </h4>

                <div className="space-y-4">
                  {/* Client ID */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ash block">
                      {t('clientId')}
                    </label>
                    <input
                      type="text"
                      required
                      value={clientIdInput}
                      onChange={(e) => setClientIdInput(e.target.value)}
                      placeholder="e.g. 5937107f-e22d-..."
                      className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 focus:outline-none focus:border-bronze font-mono"
                    />
                  </div>

                  {/* API Key */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ash block">
                      {t('apiKey')}
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        required
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="e.g. b8f45a66-..."
                        className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 pr-10 focus:outline-none focus:border-bronze font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-ash hover:text-ink transition-all"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Checksum Key */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-ash block">
                      {t('checksumKey')}
                    </label>
                    <div className="relative">
                      <input
                        type={showChecksumKey ? 'text' : 'password'}
                        required
                        value={checksumKeyInput}
                        onChange={(e) => setChecksumKeyInput(e.target.value)}
                        placeholder="e.g. 9e6a978..."
                        className="w-full bg-transparent border-b border-stone text-xs text-ink py-2 pr-10 focus:outline-none focus:border-bronze font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowChecksumKey(!showChecksumKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-ash hover:text-ink transition-all"
                      >
                        {showChecksumKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone/20 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-lacquer text-cream font-sans font-semibold uppercase tracking-wider text-[10px] px-8 py-3 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border border-cream/20 border-t-cream animate-spin" />
                        <span>{t('btnSaving')}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('btnSave')}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Webhook Configuration Guide */}
            {config.isEnabled && (
              <motion.div variants={fadeUp} className="bg-cream border border-stone/60 rounded-sm p-6 space-y-4 shadow-xs text-left">
                <h4 className="font-heading italic text-md text-charcoal font-semibold flex items-center gap-2 border-b border-stone/20 pb-2">
                  <Link className="w-4 h-4 text-gold" />
                  <span>{t('webhookTitle')}</span>
                </h4>
                
                <p className="text-xs text-ash leading-relaxed">
                  {t('webhookHelp')}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 items-stretch select-all font-mono text-[10px] bg-parchment p-3 rounded-xs border border-stone/50 overflow-x-auto relative">
                  <span className="flex-1 py-1 text-charcoal break-all">
                    {getWebhookUrlDisplay()}
                  </span>
                  <button
                    onClick={copyWebhookUrl}
                    className="sm:self-center inline-flex items-center justify-center gap-1.5 bg-stone border border-stone text-charcoal uppercase tracking-wider text-[8px] font-bold py-1.5 px-3 rounded-xs hover:bg-stone/80 transition-all font-sans shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? t('copied') : t('btnCopy')}</span>
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </motion.div>
    </div>
  );
}
