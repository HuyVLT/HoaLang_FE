import React, { useEffect, useState } from 'react';
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

interface RawWard {
  code?: number | string;
  name?: string;
}

interface RawDistrict {
  wards?: RawWard[];
}

interface ProvincePayload {
  wards?: RawWard[];
  districts?: RawDistrict[];
}

interface VnAddressSelectProps {
  cityValue: string;
  onCityChange: (city: string) => void;
  districtWardValue: string;
  onDistrictWardChange: (districtWard: string) => void;
}

let provincesCache: VnProvince[] | null = null;
const wardsCache = new Map<number, VnWard[]>();

const FALLBACK_PROVINCES: VnProvince[] = [
  { code: 1, name: 'Thành phố Hà Nội' },
  { code: 2, name: 'Tỉnh Hà Giang' },
  { code: 4, name: 'Tỉnh Cao Bằng' },
  { code: 6, name: 'Tỉnh Bắc Kạn' },
  { code: 8, name: 'Tỉnh Tuyên Quang' },
  { code: 10, name: 'Tỉnh Lào Cai' },
  { code: 11, name: 'Tỉnh Điện Biên' },
  { code: 12, name: 'Tỉnh Lai Châu' },
  { code: 14, name: 'Tỉnh Sơn La' },
  { code: 15, name: 'Tỉnh Yên Bái' },
  { code: 17, name: 'Tỉnh Hoà Bình' },
  { code: 19, name: 'Tỉnh Thái Nguyên' },
  { code: 20, name: 'Tỉnh Lạng Sơn' },
  { code: 22, name: 'Tỉnh Quảng Ninh' },
  { code: 24, name: 'Tỉnh Bắc Giang' },
  { code: 25, name: 'Tỉnh Phú Thọ' },
  { code: 26, name: 'Tỉnh Vĩnh Phúc' },
  { code: 27, name: 'Tỉnh Bắc Ninh' },
  { code: 30, name: 'Tỉnh Hải Dương' },
  { code: 31, name: 'Thành phố Hải Phòng' },
  { code: 33, name: 'Tỉnh Hưng Yên' },
  { code: 34, name: 'Tỉnh Thái Bình' },
  { code: 35, name: 'Tỉnh Hà Nam' },
  { code: 36, name: 'Tỉnh Nam Định' },
  { code: 37, name: 'Tỉnh Ninh Bình' },
  { code: 38, name: 'Tỉnh Thanh Hóa' },
  { code: 40, name: 'Tỉnh Nghệ An' },
  { code: 42, name: 'Tỉnh Hà Tĩnh' },
  { code: 44, name: 'Tỉnh Quảng Bình' },
  { code: 45, name: 'Tỉnh Quảng Trị' },
  { code: 46, name: 'Tỉnh Thừa Thiên Huế' },
  { code: 48, name: 'Thành phố Đà Nẵng' },
  { code: 49, name: 'Tỉnh Quảng Nam' },
  { code: 51, name: 'Tỉnh Quảng Ngãi' },
  { code: 52, name: 'Tỉnh Bình Định' },
  { code: 54, name: 'Tỉnh Phú Yên' },
  { code: 56, name: 'Tỉnh Khánh Hòa' },
  { code: 58, name: 'Tỉnh Ninh Thuận' },
  { code: 60, name: 'Tỉnh Bình Thuận' },
  { code: 62, name: 'Tỉnh Kon Tum' },
  { code: 64, name: 'Tỉnh Gia Lai' },
  { code: 66, name: 'Tỉnh Đắk Lắk' },
  { code: 67, name: 'Tỉnh Đắk Nông' },
  { code: 68, name: 'Tỉnh Lâm Đồng' },
  { code: 70, name: 'Tỉnh Bình Phước' },
  { code: 72, name: 'Tỉnh Tây Ninh' },
  { code: 74, name: 'Tỉnh Bình Dương' },
  { code: 75, name: 'Tỉnh Đồng Nai' },
  { code: 77, name: 'Tỉnh Bà Rịa - Vũng Tàu' },
  { code: 79, name: 'Thành phố Hồ Chí Minh' },
  { code: 80, name: 'Tỉnh Long An' },
  { code: 82, name: 'Tỉnh Tiền Giang' },
  { code: 83, name: 'Tỉnh Bến Tre' },
  { code: 84, name: 'Tỉnh Trà Vinh' },
  { code: 86, name: 'Tỉnh Vĩnh Long' },
  { code: 87, name: 'Tỉnh Đồng Tháp' },
  { code: 89, name: 'Tỉnh An Giang' },
  { code: 91, name: 'Tỉnh Kiên Giang' },
  { code: 92, name: 'Thành phố Cần Thơ' },
  { code: 93, name: 'Tỉnh Hậu Giang' },
  { code: 94, name: 'Tỉnh Sóc Trăng' },
  { code: 95, name: 'Tỉnh Bạc Liêu' },
  { code: 96, name: 'Tỉnh Cà Mau' },
];

const FALLBACK_WARDS: Record<number, VnWard[]> = {
  1: [ // Hà Nội
    { code: 101, name: 'Quận Ba Đình' },
    { code: 102, name: 'Quận Hoàn Kiếm' },
    { code: 103, name: 'Quận Tây Hồ' },
    { code: 104, name: 'Quận Cầu Giấy' },
    { code: 105, name: 'Quận Đống Đa' },
    { code: 106, name: 'Quận Hai Bà Trưng' },
    { code: 107, name: 'Quận Hoàng Mai' },
    { code: 108, name: 'Quận Thanh Xuân' },
    { code: 109, name: 'Huyện Sóc Sơn' },
    { code: 110, name: 'Huyện Đông Anh' },
    { code: 111, name: 'Huyện Gia Lâm' },
    { code: 112, name: 'Quận Nam Từ Liêm' },
    { code: 113, name: 'Huyện Thanh Trì' },
    { code: 114, name: 'Quận Bắc Từ Liêm' },
    { code: 115, name: 'Huyện Mê Linh' },
    { code: 116, name: 'Quận Hà Đông' },
    { code: 117, name: 'Thị xã Sơn Tây' },
    { code: 118, name: 'Huyện Ba Vì' },
    { code: 119, name: 'Huyện Phúc Thọ' },
    { code: 120, name: 'Huyện Đan Phượng' },
    { code: 121, name: 'Huyện Hoài Đức' },
    { code: 122, name: 'Huyện Quốc Oai' },
    { code: 123, name: 'Huyện Thạch Thất' },
    { code: 124, name: 'Huyện Chương Mỹ' },
    { code: 125, name: 'Huyện Thanh Oai' },
    { code: 126, name: 'Huyện Thường Tín' },
    { code: 127, name: 'Huyện Phú Xuyên' },
    { code: 128, name: 'Huyện Ứng Hòa' },
    { code: 129, name: 'Huyện Mỹ Đức' },
  ],
  79: [ // TP. HCM
    { code: 701, name: 'Quận 1' },
    { code: 702, name: 'Quận 3' },
    { code: 703, name: 'Quận 4' },
    { code: 704, name: 'Quận 5' },
    { code: 705, name: 'Quận 6' },
    { code: 706, name: 'Quận 7' },
    { code: 707, name: 'Quận 8' },
    { code: 708, name: 'Quận 10' },
    { code: 709, name: 'Quận 11' },
    { code: 710, name: 'Quận 12' },
    { code: 711, name: 'Quận Bình Thạnh' },
    { code: 712, name: 'Quận Gò Vấp' },
    { code: 713, name: 'Quận Phú Nhuận' },
    { code: 714, name: 'Quận Tân Bình' },
    { code: 715, name: 'Quận Tân Phú' },
    { code: 716, name: 'Quận Bình Tân' },
    { code: 717, name: 'Thành phố Thủ Đức' },
    { code: 718, name: 'Huyện Củ Chi' },
    { code: 719, name: 'Huyện Hóc Môn' },
    { code: 720, name: 'Huyện Bình Chánh' },
    { code: 721, name: 'Huyện Nhà Bè' },
    { code: 722, name: 'Huyện Cần Giờ' },
  ],
  48: [ // Đà Nẵng
    { code: 481, name: 'Quận Liên Chiểu' },
    { code: 482, name: 'Quận Thanh Khê' },
    { code: 483, name: 'Quận Hải Châu' },
    { code: 484, name: 'Quận Sơn Trà' },
    { code: 485, name: 'Quận Ngũ Hành Sơn' },
    { code: 486, name: 'Quận Cẩm Lệ' },
    { code: 487, name: 'Huyện Hòa Vang' },
    { code: 488, name: 'Huyện Hoàng Sa' },
  ],
  27: [ // Bắc Ninh
    { code: 271, name: 'Thành phố Bắc Ninh' },
    { code: 272, name: 'Thị xã Từ Sơn' },
    { code: 273, name: 'Huyện Yên Phong' },
    { code: 274, name: 'Huyện Quế Võ' },
    { code: 275, name: 'Huyện Tiên Du' },
    { code: 276, name: 'Thị xã Thuận Thành' },
    { code: 277, name: 'Huyện Gia Bình' },
    { code: 278, name: 'Huyện Lương Tài' },
  ],
  49: [ // Quảng Nam
    { code: 491, name: 'Thành phố Tam Kỳ' },
    { code: 492, name: 'Thành phố Hội An' },
    { code: 493, name: 'Thị xã Điện Bàn' },
    { code: 494, name: 'Huyện Tây Giang' },
    { code: 495, name: 'Huyện Đông Giang' },
    { code: 496, name: 'Huyện Nam Giang' },
    { code: 497, name: 'Huyện Phước Sơn' },
    { code: 498, name: 'Huyện Bắc Trà My' },
    { code: 499, name: 'Huyện Nam Trà My' },
    { code: 4901, name: 'Huyện Hiệp Đức' },
    { code: 4902, name: 'Huyện Tiên Phước' },
    { code: 4903, name: 'Huyện Nông Sơn' },
    { code: 4904, name: 'Huyện Duy Xuyên' },
    { code: 4905, name: 'Huyện Đại Lộc' },
    { code: 4906, name: 'Huyện Thăng Bình' },
    { code: 4907, name: 'Huyện Quế Sơn' },
    { code: 4908, name: 'Huyện Núi Thành' },
    { code: 4909, name: 'Huyện Phú Ninh' },
  ],
  37: [ // Ninh Bình
    { code: 371, name: 'Thành phố Ninh Bình' },
    { code: 372, name: 'Thành phố Tam Điệp' },
    { code: 373, name: 'Huyện Nho Quan' },
    { code: 374, name: 'Huyện Gia Viễn' },
    { code: 375, name: 'Huyện Hoa Lư' },
    { code: 376, name: 'Huyện Yên Khánh' },
    { code: 377, name: 'Huyện Kim Sơn' },
    { code: 378, name: 'Huyện Yên Mô' },
  ],
  74: [ // Bình Dương
    { code: 741, name: 'Thành phố Thủ Dầu Một' },
    { code: 742, name: 'Thành phố Thuận An' },
    { code: 743, name: 'Thành phố Dĩ An' },
    { code: 744, name: 'Thành phố Tân Uyên' },
    { code: 745, name: 'Thị xã Bến Cát' },
    { code: 746, name: 'Huyện Dầu Tiếng' },
    { code: 747, name: 'Huyện Phú Giáo' },
    { code: 748, name: 'Huyện Bắc Tân Uyên' },
    { code: 749, name: 'Huyện Bàu Bàng' },
  ],
};

function getGenericWards(code: number, name: string): VnWard[] {
  const cleanName = name.replace(/^(tỉnh|thành phố)\s+/i, '').trim();
  return [
    { code: code * 100 + 1, name: `Quận/Huyện Trung Tâm ${cleanName}` },
    { code: code * 100 + 2, name: `Thị xã ${cleanName}` },
    { code: code * 100 + 3, name: `Quận/Huyện Ngoại Thành ${cleanName}` },
  ];
}

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
    .map((item: unknown) => {
      const obj = item as Record<string, unknown>;
      return {
        code: Number(obj?.code),
        name: String(obj?.name || ''),
      };
    })
    .filter((p: VnProvince) => Number.isFinite(p.code) && !!p.name);
}

function normalizeWardsFromProvincePayload(data: unknown): VnWard[] {
  if (!data) return [];
  const payload = data as ProvincePayload;

  if (Array.isArray(payload.wards)) {
    return payload.wards
      .map((w: RawWard) => ({
        code: Number(w?.code),
        name: String(w?.name || ''),
      }))
      .filter((w: VnWard) => Number.isFinite(w.code) && !!w.name);
  }

  if (Array.isArray(payload.districts)) {
    const flattened = payload.districts.flatMap((d: RawDistrict) =>
      Array.isArray(d?.wards) ? d.wards : []
    );
    const mapped = flattened
      .map((w: RawWard) => ({
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
      if (provincesCache && provincesCache.length > 0) {
        setProvinces(provincesCache);
        return;
      }

      try {
        setLoadingProvinces(true);
        const data = await fetchJsonWithFallback<unknown>([
          'https://provinces.open-api.vn/api/v2/',
          'https://provinces.open-api.vn/api/v2/p/',
        ]);
        let next = normalizeProvinceList(data);
        if (!next || next.length === 0) {
          console.warn('[VnAddressSelect] Live provinces API returned empty or failed. Loading local fallback.');
          next = FALLBACK_PROVINCES;
        }
        provincesCache = next;
        setProvinces(next);
      } catch (err) {
        console.error('[VnAddressSelect] Failed to load provinces, falling back to local data:', err);
        provincesCache = FALLBACK_PROVINCES;
        setProvinces(FALLBACK_PROVINCES);
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

    // Sync official province name back to parent state if it has a prefix mismatch (e.g. Thành phố Đà Nẵng vs Đà Nẵng)
    if (matchedProvince.name !== cityValue) {
      onCityChange(matchedProvince.name);
    }

    const loadWards = async () => {
      let nextWards = wardsCache.get(matchedProvince!.code) || [];
      if (!nextWards.length) {
        try {
          setLoadingWards(true);
          const data = await fetchJsonWithFallback<unknown>([
            `https://provinces.open-api.vn/api/v2/${matchedProvince!.code}?depth=2`,
            `https://provinces.open-api.vn/api/v2/p/${matchedProvince!.code}?depth=2`,
          ]);
          nextWards = normalizeWardsFromProvincePayload(data);
          if (!nextWards || nextWards.length === 0) {
            console.warn(`[VnAddressSelect] Live wards API returned empty for province code ${matchedProvince!.code}. Loading local fallback.`);
            nextWards = FALLBACK_WARDS[matchedProvince!.code] || getGenericWards(matchedProvince!.code, matchedProvince!.name);
          }
          wardsCache.set(matchedProvince!.code, nextWards);
        } catch (err) {
          console.error(`[VnAddressSelect] Failed to load wards for code ${matchedProvince!.code}, falling back to local data:`, err);
          nextWards = FALLBACK_WARDS[matchedProvince!.code] || getGenericWards(matchedProvince!.code, matchedProvince!.name);
          wardsCache.set(matchedProvince!.code, nextWards);
        } finally {
          setLoadingWards(false);
        }
      }

      setWards(nextWards);

      // Normalization check for districtWardValue to match the official ward dropdown options list!
      if (districtWardValue) {
        const wardName = String(districtWardValue).trim();
        let matchedWard = nextWards.find(
          (w) => w.name.toLowerCase() === wardName.toLowerCase()
        );

        if (!matchedWard) {
          const cleanInput = wardName.toLowerCase().replace(/^(phường|xã|quận|huyện|thị xã|thị trấn)\s+/i, '').trim();
          matchedWard = nextWards.find(
            (w) => w.name.toLowerCase().replace(/^(phường|xã|quận|huyện|thị xã|thị trấn)\s+/i, '').trim() === cleanInput
          );
        }

        if (matchedWard && matchedWard.name !== districtWardValue) {
          onDistrictWardChange(matchedWard.name);
        }
      }
    };

    loadWards();
  }, [provinces, cityValue, districtWardValue, onCityChange, onDistrictWardChange]);

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
      const data = await fetchJsonWithFallback<unknown>([
        `https://provinces.open-api.vn/api/v2/${selected.code}?depth=2`,
        `https://provinces.open-api.vn/api/v2/p/${selected.code}?depth=2`,
      ]);
      let nextWards = normalizeWardsFromProvincePayload(data);
      if (!nextWards || nextWards.length === 0) {
        console.warn(`[VnAddressSelect] Live wards API returned empty for province code ${selected.code}. Loading local fallback.`);
        nextWards = FALLBACK_WARDS[selected.code] || getGenericWards(selected.code, selected.name);
      }
      wardsCache.set(selected.code, nextWards);
      setWards(nextWards);
    } catch (err) {
      console.error(`[VnAddressSelect] Failed to load wards for code ${selected.code}, falling back to local data:`, err);
      const fallbackWards = FALLBACK_WARDS[selected.code] || getGenericWards(selected.code, selected.name);
      wardsCache.set(selected.code, fallbackWards);
      setWards(fallbackWards);
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
    <div className="grid grid-cols-1 gap-4">
      {/* Province/City Select */}
      <div className="space-y-1.5 text-left font-sans select-none relative">
        <label className="text-xs font-semibold uppercase tracking-wider text-ash flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          <span>{t.cityLabel} <span className="text-lacquer">*</span></span>
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
          <span>{t.wardLabel} <span className="text-lacquer">*</span></span>
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
