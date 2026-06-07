'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon,
  Database,
  Grid,
  CheckCircle,
  AlertCircle,
  Flame,
  Scissors,
  Paintbrush,
  Gem,
  Trees
} from 'lucide-react';
import { SectionLabel, ImageUploader, AddressAutocomplete, VnAddressSelect } from '@/components/shared';
import TemplatePicker from '@/components/onboarding/TemplatePicker';
import { useTranslations } from 'next-intl';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function OnboardingWizard() {
  const t = useTranslations('onboarding');
  
  const CATEGORIES = [
    { id: 'pottery', label: t('categoryPottery'), icon: Flame },
    { id: 'silk', label: t('categorySilk'), icon: Scissors },
    { id: 'painting', label: t('categoryPainting'), icon: ImageIcon },
    { id: 'lacquer', label: t('categoryLacquer'), icon: Paintbrush },
    { id: 'stone carving', label: t('categoryStone'), icon: Gem },
    { id: 'bamboo', label: t('categoryBamboo'), icon: Trees },
    { id: 'embroidery', label: t('categoryEmbroidery'), icon: Grid },
  ];

  const [step, setStep] = useState(1);
  
  // Step 1: Basic Info States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState('pottery');
  const [province, setProvince] = useState('Hà Nội');
  const [districtWard, setDistrictWard] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [artisanName, setArtisanName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  
  // Custom High-Fidelity Notification Toast state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  // Step 2: Template States
  const [templateId, setTemplateId] = useState('pottery-template');
  
  // Step 3: Provisioning Loading States
  const [provisioningStatus, setProvisioningStatus] = useState<
    'idle' | 'database' | 'collections' | 'template' | 'success' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Live Slug generation preview
  useEffect(() => {
    if (!isSlugManual) {
      if (!name) {
        setSlug('');
      } else {
        const generated = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        setSlug(generated);
      }
    }
  }, [name, isSlugManual]);
 
  // Automatic timeout to clear custom notification toast
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleNextStep = () => {
    if (step === 1) {
      if (
        !name.trim() ||
        !slug.trim() ||
        !email.trim() ||
        !category ||
        !artisanName.trim() ||
        !phone.trim() ||
        !address.trim() ||
        !province.trim() ||
        !districtWard.trim()
      ) {
        toastAlert(t('validationFieldsError'));
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        toastAlert(t('validationEmailError'));
        return;
      }
      const cleanPhone = phone.replace(/[\s.-]/g, '');
      if (!/^[0-9]{9,11}$/.test(cleanPhone)) {
        toastAlert(t('validationPhoneError'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      triggerProvisioning();
    }
  };

  const toastAlert = (msg: string) => {
    setNotification({ message: msg, type: 'error' });
  };

  // Triggers the real backend provisioning or simulates gracefully if offline
  const triggerProvisioning = async () => {
    setProvisioningStatus('database');
    setStatusMessage(t('statusConnecting'));

    try {
      // Step 1: Simulating DB spin up delay
      await new Promise((r) => setTimeout(r, 1200));
      
      setProvisioningStatus('collections');
      setStatusMessage(t('statusCreatingRequest'));
      await new Promise((r) => setTimeout(r, 1200));

      setProvisioningStatus('template');
      setStatusMessage(t('statusSubmitting'));

      // Make actual POST request to onboarding API using custom api client to pass auth token
      const response = await api.post('/tenant/onboarding', {
        name,
        slug,
        email,
        category,
        province,
        logo: logo || undefined,
        coverImage: coverImage || undefined,
        templateId,
        artisanName,
        phone,
        description,
      });

      if (response.data && response.data.success) {
        await new Promise((r) => setTimeout(r, 1000));
        setProvisioningStatus('success');
        setStatusMessage(t('successMessage', { email }));
        setNotification({
          message: t('successToast'),
          type: 'success',
        });
        
        // Save to localStorage for revisit status check
        localStorage.setItem('hoalang_onboarding_email', email);
        localStorage.setItem('hoalang_onboarding_slug', slug);
        localStorage.setItem('hoalang_onboarding_name', name);
      } else {
        throw new Error('Onboarding API failed');
      }
    } catch (error) {
      console.warn('[OnboardingProvision] Onboarding submit failed:', error);
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response) {
        // Backend actually responded with an error (e.g. 409 Conflict, 400 Bad Request, etc.)
        setProvisioningStatus('error');
        const errorMsg = err.response.data?.message || 'Có lỗi xảy ra khi nộp hồ sơ.';
        setStatusMessage(errorMsg);
        setNotification({
          message: errorMsg,
          type: 'error',
        });
        return;
      }

      // Standalone simulation fallback for local demo offline robustness (network down / no response)
      await new Promise((r) => setTimeout(r, 1000));
      setProvisioningStatus('success');
      setStatusMessage(t('offlineSuccessMessage'));
      setNotification({
        message: t('offlineSuccessToast'),
        type: 'success',
      });
      
      localStorage.setItem('hoalang_onboarding_email', email || 'demo@hoalang.site');
      localStorage.setItem('hoalang_onboarding_slug', slug);
      localStorage.setItem('hoalang_onboarding_name', name);
    }
  };

  const handleGoToDashboard = () => {
    // Redirect to home page instead of dashboard
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-parchment py-12 px-6 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-cream border border-stone rounded-sm p-8 md:p-12 shadow-sm select-none relative overflow-hidden flex flex-col justify-between min-h-[600px]">
        {/* Organic texture layer */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 z-0" />

        <div className="relative z-10 flex flex-col justify-between flex-grow">
          {/* Onboarding Wizard Header */}
          <div className="border-b border-stone/30 pb-6 mb-8 text-left">
            <div className="flex items-center justify-between">
              <div>
                <SectionLabel label={t('stepLabel', { step })} className="mb-2" />
                <h2 className="font-heading text-3xl font-semibold text-charcoal italic">
                  {step === 1 && t('titleStep1')}
                  {step === 2 && t('titleStep2')}
                  {step === 3 && t('titleStep3')}
                </h2>
              </div>
              <Compass className="w-8 h-8 text-accent animate-spin duration-3000 shrink-0 hidden sm:block" />
            </div>
            
            {/* Step visual indicator dots */}
            <div className="flex gap-2 mt-5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-xs transition-all duration-300 ${
                    s === step ? 'w-10 bg-primary' : 'w-4 bg-stone'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Onboarding Wizard Body */}
          <div className="flex-grow py-4">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASIC INFO ENTRY */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeUp}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
                >
                  {/* Left Column forms */}
                  <div className="md:col-span-7 space-y-5">
                    {/* Village Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('nameLabel')} <span className="text-lacquer">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('namePlaceholder')}
                        className="w-full bg-transparent border-b border-stone text-ink py-2 focus:outline-none focus:border-primary text-sm font-medium"
                      />
                    </div>

                    {/* Slug & domain preview */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('slugLabel')} <span className="text-lacquer">*</span>
                      </label>
                      <div className="flex items-center gap-1 border-b border-stone py-2">
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => {
                            setSlug(e.target.value);
                            setIsSlugManual(true);
                          }}
                          placeholder={t('slugPlaceholder')}
                          className="bg-transparent text-ink focus:outline-none text-sm font-semibold flex-grow max-w-[150px]"
                        />
                        <span className="text-xs text-ash/80 font-medium">.hoalang.site</span>
                      </div>
                      <p className="text-[10px] text-ash italic tracking-wide">
                        {t('slugHelp')}
                      </p>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('emailLabel')} <span className="text-lacquer">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailPlaceholder')}
                        className="w-full bg-transparent border-b border-stone text-ink py-2 focus:outline-none focus:border-primary text-sm font-medium"
                      />
                      <p className="text-[10px] text-ash italic tracking-wide">
                        {t('emailHelp')}
                      </p>
                    </div>

                    {/* Category Selection Carousel/Grid */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('categoryLabel')} <span className="text-lacquer">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategory(cat.id);
                              // Auto adapt template selection based on category
                              if (cat.id === 'pottery') setTemplateId('pottery-template');
                              else if (cat.id === 'silk') setTemplateId('silk-template');
                              else setTemplateId('minimal-template');
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-sm text-xs font-medium transition-all ${
                              category === cat.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-stone text-ash hover:border-bronze'
                            }`}
                          >
                            <cat.icon className="w-4 h-4 text-current shrink-0" />
                            <span>{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Artisan Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('artisanNameLabel')} <span className="text-lacquer">*</span>
                      </label>
                      <input
                        type="text"
                        value={artisanName}
                        onChange={(e) => setArtisanName(e.target.value)}
                        placeholder={t('artisanNamePlaceholder')}
                        className="w-full bg-transparent border-b border-stone text-ink py-2 focus:outline-none focus:border-primary text-sm font-medium"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('phoneLabel')} <span className="text-lacquer">*</span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('phonePlaceholder')}
                        className="w-full bg-transparent border-b border-stone text-ink py-2 focus:outline-none focus:border-primary text-sm font-medium"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                        {t('descriptionLabel')}
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('descriptionPlaceholder')}
                        rows={2}
                        className="w-full bg-transparent border-b border-stone text-ink py-2 focus:outline-none focus:border-primary text-sm font-medium resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Column details (Province, Logo, Cover uploads) */}
                  <div className="md:col-span-5 space-y-5">
                    {/* Dynamic Google Places Address Autocomplete */}
                    <AddressAutocomplete
                      value={address}
                      onChange={setAddress}
                      onProvinceSelect={setProvince}
                      onDistrictWardSelect={setDistrictWard}
                    />

                    {/* Vietnamese Administrative Divisions Sync */}
                    <VnAddressSelect
                      cityValue={province}
                      onCityChange={setProvince}
                      districtWardValue={districtWard}
                      onDistrictWardChange={setDistrictWard}
                    />

                    {/* Logo upload */}
                    <ImageUploader
                      label={t('logoLabel')}
                      value={logo}
                      onChange={setLogo}
                      aspectRatio="square"
                      placeholder={t('logoPlaceholder')}
                    />

                    {/* Cover Photo upload */}
                    <ImageUploader
                      label={t('coverLabel')}
                      value={coverImage}
                      onChange={setCoverImage}
                      aspectRatio="video"
                      placeholder={t('coverPlaceholder')}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Starter Template picker */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeUp}
                  className="space-y-4 text-left"
                >
                  <TemplatePicker selectedId={templateId} onSelect={setTemplateId} />
                </motion.div>
              )}

              {/* STEP 3: Automated database provisioning & collections seeding */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={fadeUp}
                  className="py-12 max-w-md mx-auto text-center space-y-8"
                >
                  <div className="flex justify-center">
                    {provisioningStatus !== 'success' && provisioningStatus !== 'error' ? (
                      <div className="relative flex items-center justify-center">
                        {/* Rotating radial spinner */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-20 h-20 rounded-full border-2 border-stone border-t-primary"
                        />
                        <Database className="w-8 h-8 text-primary absolute" />
                      </div>
                    ) : provisioningStatus === 'success' ? (
                      <CheckCircle className="w-20 h-20 text-accent animate-bounce" />
                    ) : (
                      <AlertCircle className="w-20 h-20 text-primary" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-heading text-2xl italic font-semibold text-charcoal">
                      {provisioningStatus === 'database' && t('loadingDatabase')}
                      {provisioningStatus === 'collections' && t('loadingCollections')}
                      {provisioningStatus === 'template' && t('loadingTemplate')}
                      {provisioningStatus === 'success' && t('loadingSuccess')}
                      {provisioningStatus === 'error' && t('loadingError')}
                    </h3>
                    <p className="font-sans text-sm text-ash font-light max-w-xs mx-auto leading-relaxed">
                      {statusMessage}
                    </p>
                    {provisioningStatus === 'success' && (
                      <div className="mt-4 mx-auto max-w-sm bg-cream border border-stone/50 rounded-sm px-4 py-3 text-left">
                        <p className="font-sans text-[11px] text-charcoal leading-relaxed">
                          <span className="text-gold font-semibold">✉</span>{' '}
                          {t('emailConfirmationNotice', { email })}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Onboarding Wizard Footer */}
          <div className="border-t border-stone/30 pt-6 mt-8 flex items-center justify-between shrink-0 select-none">
            {/* Backward step button */}
            {step === 1 ? (
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ash hover:text-primary transition-colors font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backToHome')}</span>
              </button>
            ) : (step === 3 && provisioningStatus === 'error') || (step > 1 && step < 3) ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 3) {
                    setStep(1); // Go back to Basic Info to let user edit fields (e.g. duplicate slug/email)
                    setProvisioningStatus('idle');
                  } else {
                    setStep(step - 1);
                  }
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ash hover:text-primary transition-colors font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('backBtn')}</span>
              </button>
            ) : (
              <div />
            )}

            {/* Forward step or finish button */}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-[0.12em] text-[10px] px-8 py-3.5 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all"
              >
                <span>{t('continueBtn')}</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </button>
            ) : provisioningStatus === 'success' ? (
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-[0.12em] text-[11px] px-8 py-4 rounded-sm hover:brightness-110 shadow-sm animate-pulse active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>{t('backToHome')}</span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Custom High-Fidelity Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 right-6 z-[9999] max-w-sm w-full bg-cream border border-stone p-4 shadow-lg flex gap-3 items-start select-none"
          >
            {/* Organic texture layer */}
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-20" />
            
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                {notification.type === 'success' ? t('toastTitleSuccess') : t('toastTitleNotice')}
              </h4>
              <p className="text-xs text-ash font-light leading-relaxed">
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
