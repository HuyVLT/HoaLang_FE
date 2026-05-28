'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';

interface VnProvince {
  code: number;
  name: string;
}

interface VnWard {
  code: number;
  name: string;
}

interface VnAddressSelectProps {
  cityValue: string;
  onCityChange: (city: string) => void;
  districtWardValue: string;
  onDistrictWardChange: (districtWard: string) => void;
}

let provincesCache: VnProvince[] | null = null;
const wardsCache = new Map<number, VnWard[]>();

async function fetchJsonWithFallback<T>(urls: string[]): Promise<T | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      return (await res.json()) as T;
    } catch {
      // try next URL
    }
  }
  return null;
}

function normalizeProvinceList(data: unknown): VnProvince[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((item: any) => ({
      code: Number(item?.code),
      name: String(item?.name || ''),
    }))
    .filter((p: VnProvince) => Number.isFinite(p.code) && !!p.name);
}

function normalizeWardsFromProvincePayload(data: any): VnWard[] {
  if (!data) return [];

  if (Array.isArray(data.wards)) {
    return data.wards
      .map((w: any) => ({
        code: Number(w?.code),
        name: String(w?.name || ''),
      }))
      .filter((w: VnWard) => Number.isFinite(w.code) && !!w.name);
  }

  if (Array.isArray(data.districts)) {
    const flattened = data.districts.flatMap((d: any) => (Array.isArray(d?.wards) ? d.wards : []));
    const mapped = flattened
      .map((w: any) => ({
        code: Number(w?.code),
        name: String(w?.name || ''),
      }))
      .filter((w: VnWard) => Number.isFinite(w.code) && !!w.name);

    const uniq = new Map<number, VnWard>();
    mapped.forEach((w: VnWard) => uniq.set(w.code, w));
    return Array.from(uniq.values());
  }

  return [];
}

export default function VnAddressSelect({
  cityValue,
  onCityChange,
  districtWardValue,
  onDistrictWardChange,
}: VnAddressSelectProps) {
  const locale = useLocale() as 'vi' | 'en';
  
  const [provinces, setProvinces] = useState<VnProvince[]>([]);
  const [wards, setWards] = useState<VnWard[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      if (provincesCache) {
        setProvinces(provincesCache);
        return;
      }

      try {
        setLoadingProvinces(true);
        const data = await fetchJsonWithFallback<unknown>([
          'https://provinces.open-api.vn/api/v2/',
          'https://provinces.open-api.vn/api/v2/p/',
        ]);
        const next = normalizeProvinceList(data);
        provincesCache = next;
        setProvinces(next);
      } catch (err) {
        console.error('[VnAddressSelect] Failed to load provinces:', err);
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Sync wards when province or city value changes from autocomplete
  useEffect(() => {
    if (!provinces.length || !cityValue) return;

    const provinceName = String(cityValue).trim();
    let matchedProvince = provinces.find(
      (p) => p.name.toLowerCase() === provinceName.toLowerCase()
    );

    // Fallback normalization (remove Tỉnh / Thành phố prefixes)
    if (!matchedProvince) {
      const cleanInput = provinceName.toLowerCase().replace(/^(tỉnh|thành phố)\s+/i, '').trim();
      matchedProvince = provinces.find(
        (p) => p.name.toLowerCase().replace(/^(tỉnh|thành phố)\s+/i, '').trim() === cleanInput
      );
    }

    if (!matchedProvince) return;

    setProvinceCode(matchedProvince.code);

    const loadWards = async () => {
      let nextWards = wardsCache.get(matchedProvince!.code) || [];
      if (!nextWards.length) {
        try {
          setLoadingWards(true);
          const data = await fetchJsonWithFallback<any>([
            `https://provinces.open-api.vn/api/v2/${matchedProvince!.code}?depth=2`,
            `https://provinces.open-api.vn/api/v2/p/${matchedProvince!.code}?depth=2`,
          ]);
          nextWards = normalizeWardsFromProvincePayload(data);
          wardsCache.set(matchedProvince!.code, nextWards);
        } catch (err) {
          console.error('[VnAddressSelect] Failed to load wards:', err);
        } finally {
          setLoadingWards(false);
        }
      }

      setWards(nextWards);
    };

    loadWards();
  }, [provinces, cityValue]);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onCityChange(val);
    onDistrictWardChange(''); // reset ward on province change
    setWards([]);
    setProvinceCode(null);

    if (!val) return;

    const selected = provinces.find((p) => p.name === val);
    if (!selected) return;

    setProvinceCode(selected.code);

    // Load wards for selected province
    const cached = wardsCache.get(selected.code);
    if (cached) {
      setWards(cached);
      return;
    }

    try {
      setLoadingWards(true);
      const data = await fetchJsonWithFallback<any>([
        `https://provinces.open-api.vn/api/v2/${selected.code}?depth=2`,
        `https://provinces.open-api.vn/api/v2/p/${selected.code}?depth=2`,
      ]);
      const nextWards = normalizeWardsFromProvincePayload(data);
      wardsCache.set(selected.code, nextWards);
      setWards(nextWards);
    } catch (err) {
      console.error('[VnAddressSelect] Failed to load wards:', err);
      setWards([]);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDistrictWardChange(e.target.value);
  };

  const t = {
    cityLabel: locale === 'vi' ? 'Tỉnh/Thành phố' : 'Province/City',
    cityPlaceholder: locale === 'vi' ? 'Chọn tỉnh thành...' : 'Select province...',
    wardLabel: locale === 'vi' ? 'Phường/Xã/Quận/Huyện' : 'Ward/District',
    wardPlaceholder: locale === 'vi' ? 'Chọn phường/xã...' : 'Select ward...',
    loading: locale === 'vi' ? 'Đang tải...' : 'Loading...',
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Province/City Select */}
      <div className="space-y-1.5 text-left font-sans select-none relative">
        <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>{t.cityLabel}</span>
        </label>
        <div className="relative border-b border-stone py-2 flex items-center">
          <select
            value={cityValue}
            onChange={handleProvinceChange}
            disabled={loadingProvinces}
            className="w-full bg-transparent text-ink text-sm focus:outline-none font-medium placeholder:text-ash/60 appearance-none pr-8 cursor-pointer disabled:opacity-50"
          >
            <option value="" className="bg-cream text-ash">
              {loadingProvinces ? t.loading : t.cityPlaceholder}
            </option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name} className="bg-cream text-ink">
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-ash/60 absolute right-1 pointer-events-none" />
        </div>
      </div>

      {/* Ward/District Select */}
      <div className="space-y-1.5 text-left font-sans select-none relative">
        <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>{t.wardLabel}</span>
        </label>
        <div className="relative border-b border-stone py-2 flex items-center">
          <select
            value={districtWardValue}
            onChange={handleWardChange}
            disabled={!provinceCode || loadingWards}
            className="w-full bg-transparent text-ink text-sm focus:outline-none font-medium placeholder:text-ash/60 appearance-none pr-8 cursor-pointer disabled:opacity-50"
          >
            <option value="" className="bg-cream text-ash">
              {loadingWards ? t.loading : t.wardPlaceholder}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.name} className="bg-cream text-ink">
                {w.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-ash/60 absolute right-1 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
