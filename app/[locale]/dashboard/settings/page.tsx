'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mail, Globe, Phone, Save, MapPin, Compass, Layers, ZoomIn, ZoomOut, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SectionLabel, AddressAutocomplete, VnAddressSelect } from '@/components/shared';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function SettingsPanel() {
  const t = useTranslations('dashboardSettings');
  const locale = useLocale() as 'vi' | 'en';

  const [tenantSlug, setTenantSlug] = useState('bat-trang');
  const [tenantName, setTenantName] = useState('Làng Gốm Bát Tràng');
  const [customDomain, setCustomDomain] = useState('');
  const [hotline, setHotline] = useState('+84 24 3874 0123');
  const [email, setEmail] = useState('contact@bat-trang.hoalang.site');

  // Address and Coordinates States
  const [address, setAddress] = useState('Xóm 3, Làng Cổ Bát Tràng, Gia Lâm, Hà Nội');
  const [province, setProvince] = useState('Hà Nội');
  const [districtWard, setDistrictWard] = useState('Gia Lâm');
  const [latitude, setLatitude] = useState(20.9733);
  const [longitude, setLongitude] = useState(105.9327);
  const [isCoordinatesManual, setIsCoordinatesManual] = useState(false);

  // Mapbox states & refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapStyle, setMapStyle] = useState<'outdoors' | 'satellite' | 'light'>('outdoors');

  const hasToken = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Load settings on mount
  useEffect(() => {
    const savedSlug = sessionStorage.getItem('hoalang_tenant_slug');
    const savedName = sessionStorage.getItem('hoalang_tenant_name');
    const savedAddress = sessionStorage.getItem('hoalang_tenant_address');
    const savedProvince = sessionStorage.getItem('hoalang_tenant_province');
    const savedDistrictWard = sessionStorage.getItem('hoalang_tenant_district_ward');
    const savedLat = sessionStorage.getItem('hoalang_tenant_lat');
    const savedLng = sessionStorage.getItem('hoalang_tenant_lng');
    const savedManual = sessionStorage.getItem('hoalang_tenant_manual_coordinates');

    if (savedSlug) {
      setTenantSlug(savedSlug);
      setCustomDomain(`${savedSlug}.hoalang.site`);
      setEmail(`contact@${savedSlug}.hoalang.site`);
    }
    if (savedName) setTenantName(savedName);
    if (savedAddress) setAddress(savedAddress);
    if (savedProvince) setProvince(savedProvince);
    if (savedDistrictWard) setDistrictWard(savedDistrictWard);
    if (savedLat) setLatitude(Number(savedLat));
    if (savedLng) setLongitude(Number(savedLng));
    if (savedManual) setIsCoordinatesManual(savedManual === 'true');
  }, []);

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      toast.error(t('invalidCoords'));
      return;
    }

    sessionStorage.setItem('hoalang_tenant_name', tenantName);
    sessionStorage.setItem('hoalang_tenant_address', address);
    sessionStorage.setItem('hoalang_tenant_province', province);
    sessionStorage.setItem('hoalang_tenant_district_ward', districtWard);
    sessionStorage.setItem('hoalang_tenant_lat', String(latitude));
    sessionStorage.setItem('hoalang_tenant_lng', String(longitude));
    sessionStorage.setItem('hoalang_tenant_manual_coordinates', String(isCoordinatesManual));

    toast.success(t('saveSuccess'), {
      description: t('saveSuccessDesc'),
    });
  };

  // Mapbox initialization
  useEffect(() => {
    if (!hasToken || !mapContainerRef.current) return;

    if (mapRef.current) {
      // Avoid recreation, simply update target
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 14,
        essential: true,
      });
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      }
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: `mapbox://styles/mapbox/${mapStyle}-v12`,
      center: [longitude, latitude],
      zoom: 14,
      attributionControl: false,
    });

    mapRef.current = map;

    // Premium marker HTML matching the brand theme
    const el = document.createElement('div');
    el.innerHTML = `
      <div class="relative flex items-center justify-center cursor-pointer">
        <span class="absolute inline-flex h-10 w-10 rounded-full bg-[#8B1A1A]/30 animate-ping"></span>
        <div class="w-8 h-8 rounded-full border border-[#8B1A1A] flex items-center justify-center bg-[#8B1A1A] text-[#F7F4EF] shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `;

    const marker = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    // Handle marker drag
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      setLongitude(Number(lngLat.lng.toFixed(6)));
      setLatitude(Number(lngLat.lat.toFixed(6)));
      setIsCoordinatesManual(true);
    });

    // Handle click on map to reposition marker
    map.on('click', (e) => {
      const lngLat = e.lngLat;
      marker.setLngLat(lngLat);
      setLongitude(Number(lngLat.lng.toFixed(6)));
      setLatitude(Number(lngLat.lat.toFixed(6)));
      setIsCoordinatesManual(true);
    });

    return () => {
      // Map cleanup handled on unmount
    };
  }, [hasToken, mapStyle]);

  // Synchronize map & marker location when lat/lng state changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const currentCenter = mapRef.current.getCenter();
    const currentMarkerLngLat = markerRef.current.getLngLat();

    const isMapSame = Math.abs(currentCenter.lng - longitude) < 0.0001 && Math.abs(currentCenter.lat - latitude) < 0.0001;
    const isMarkerSame = Math.abs(currentMarkerLngLat.lng - longitude) < 0.0001 && Math.abs(currentMarkerLngLat.lat - latitude) < 0.0001;

    if (!isMarkerSame) {
      markerRef.current.setLngLat([longitude, latitude]);
    }
    if (!isMapSame) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        essential: true,
      });
    }
  }, [latitude, longitude]);

  // Switch map style dynamically
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(`mapbox://styles/mapbox/${mapStyle}-v12`);
    }
  }, [mapStyle]);

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
        <motion.div variants={fadeUp} className="border-b border-stone/30 pb-4 mb-2">
          <SectionLabel label={t('sectionLabel')} />
          <h2 className="font-heading text-3xl font-semibold italic text-charcoal leading-tight">
            {t('title')}
          </h2>
        </motion.div>

        {/* Sub-navigation tabs */}
        <motion.div variants={fadeUp} className="flex gap-4 border-b border-stone/20 pb-2 mb-2 select-none">
          <button 
            type="button" 
            onClick={() => window.location.href = `/${locale}/dashboard/settings?slug=${tenantSlug}`}
            className="text-xs font-semibold uppercase tracking-wider text-charcoal border-b-2 border-lacquer pb-2 px-1"
          >
            {t('tabInfo')}
          </button>
          <button 
            type="button" 
            onClick={() => window.location.href = `/${locale}/dashboard/settings/payment?slug=${tenantSlug}`}
            className="text-xs font-semibold uppercase tracking-wider text-ash hover:text-charcoal pb-2 px-1"
          >
            {t('tabPayment')}
          </button>
        </motion.div>

        {/* Form controls */}
        <motion.form onSubmit={handleSaveSettings} variants={fadeUp} className="bg-cream border border-stone rounded-sm p-8 space-y-6 shadow-sm">
          <h4 className="font-heading italic text-lg text-charcoal font-semibold border-b border-stone/30 pb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent animate-spin duration-3000" />
            <span>{t('formTitle')}</span>
          </h4>

          <div className="space-y-6">
            {/* Village name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-bronze font-medium"
              />
            </div>

            {/* Custom domain subdomain link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-accent" />
                <span>{t('subdomainLabel')}</span>
              </label>
              <input
                type="text"
                disabled
                value={customDomain}
                className="w-full bg-stone/10 border-b border-stone text-sm text-ash py-2 focus:outline-none cursor-not-allowed font-semibold"
              />
              <p className="text-[10px] text-ash/80 italic">
                {t('subdomainHelp')}
              </p>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>{t('hotlineLabel')}</span>
                </label>
                <input
                  type="text"
                  required
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-bronze font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>{t('emailLabel')}</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-bronze font-medium"
                />
              </div>
            </div>

            {/* Address & Coordinates Section */}
            <div className="pt-6 border-t border-stone/30 space-y-4">
              <h5 className="font-heading italic text-md text-charcoal font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{t('addressTitle')}</span>
              </h5>

              <div className="space-y-4">
                {/* Autocomplete Input */}
                <AddressAutocomplete
                  value={address}
                  onChange={(val) => setAddress(val)}
                  onProvinceSelect={(val) => setProvince(val)}
                  onDistrictWardSelect={(val) => setDistrictWard(val)}
                  onCoordinatesSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    setIsCoordinatesManual(false);
                    toast.info(locale === 'vi' ? 'Đã tự động cập nhật tọa độ từ địa điểm' : 'Coordinates auto-updated from location');
                  }}
                  placeholder={locale === 'vi' ? 'Nhập địa chỉ lò/xưởng để tìm kiếm...' : 'Enter workshop address to search...'}
                />

                {/* Province & Ward Drops */}
                <VnAddressSelect
                  cityValue={province}
                  onCityChange={(val) => setProvince(val)}
                  districtWardValue={districtWard}
                  onDistrictWardChange={(val) => setDistrictWard(val)}
                />

                {/* Latitude & Longitude Numeric Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                      {t('latLabel')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={latitude}
                      onChange={(e) => {
                        setLatitude(Number(e.target.value));
                        setIsCoordinatesManual(true);
                      }}
                      className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-bronze font-medium"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold uppercase tracking-wider text-ash block">
                      {t('lngLabel')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={longitude}
                      onChange={(e) => {
                        setLongitude(Number(e.target.value));
                        setIsCoordinatesManual(true);
                      }}
                      className="w-full bg-transparent border-b border-stone text-sm text-ink py-2 focus:outline-none focus:border-bronze font-medium"
                    />
                  </div>
                </div>

                {/* Accuracy Status Badge */}
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="text-xs font-medium text-ash">
                    {t('accuracyLabel')}:
                  </span>
                  {isCoordinatesManual ? (
                    <span className="inline-flex items-center gap-1 border border-lacquer/50 bg-[#8B1A1A]/10 text-lacquer rounded-xs text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5">
                      <Compass className="w-3 h-3 animate-pulse" />
                      <span>{t('accuracyManual')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 border border-gold/50 bg-[#C4952A]/20 text-gold rounded-xs text-[10px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>{t('accuracyAuto')}</span>
                    </span>
                  )}
                </div>

                {/* Mapbox Map Container */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ash block">
                    {t('mapTitle')}
                  </span>
                  
                  {hasToken ? (
                    <div className="w-full h-[320px] relative rounded-sm overflow-hidden border border-stone shadow-sm">
                      <div ref={mapContainerRef} className="w-full h-full" />
                      
                      {/* Map Controls */}
                      <div className="absolute z-10 flex flex-col gap-1.5 bottom-4 left-4">
                        <button
                          type="button"
                          onClick={() => mapRef.current?.zoomIn()}
                          className="w-8 h-8 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => mapRef.current?.zoomOut()}
                          className="w-8 h-8 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze flex items-center justify-center rounded-sm text-charcoal shadow-sm transition-all"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute top-4 right-4 z-10">
                        <button
                          type="button"
                          onClick={() => {
                            const styles: Array<'outdoors' | 'satellite' | 'light'> = ['outdoors', 'satellite', 'light'];
                            const nextStyle = styles[(styles.indexOf(mapStyle) + 1) % styles.length];
                            setMapStyle(nextStyle);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-cream/90 backdrop-blur-md border border-stone hover:border-bronze rounded-sm text-[9px] font-sans font-semibold uppercase tracking-wider text-charcoal shadow-sm transition-all"
                        >
                          <Layers className="w-3 h-3" />
                          <span>{mapStyle === 'outdoors' ? (locale === 'vi' ? 'Địa hình' : 'Outdoors') : mapStyle === 'satellite' ? (locale === 'vi' ? 'Vệ tinh' : 'Satellite') : (locale === 'vi' ? 'Cổ điển' : 'Classic')}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-[200px] rounded-sm border border-stone bg-stone/5 flex flex-col items-center justify-center p-6 text-center space-y-2 select-none">
                      <Compass className="w-8 h-8 text-gold/60 animate-pulse" />
                      <h6 className="font-heading italic text-sm text-charcoal font-semibold">
                        {locale === 'vi' ? 'Bản đồ di sản ngoại tuyến' : 'Offline Heritage Map'}
                      </h6>
                      <p className="text-[10px] text-ash max-w-sm">
                        {locale === 'vi' 
                          ? 'Vui lòng cấu hình NEXT_PUBLIC_MAPBOX_TOKEN trong .env.local để kích hoạt bản đồ kéo thả ghim tọa độ.'
                          : 'Please configure NEXT_PUBLIC_MAPBOX_TOKEN in .env.local to enable interactive map pin selection.'}
                      </p>
                    </div>
                  )}
                  <p className="text-[10px] text-ash/80 italic leading-relaxed">
                    {t('mapHelp')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone/30 flex justify-end gap-3 select-none">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-semibold uppercase tracking-wider text-[10px] px-8 py-3 rounded-sm hover:brightness-110 shadow-sm active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4 text-accent" />
              <span>{t('btnSave')}</span>
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
