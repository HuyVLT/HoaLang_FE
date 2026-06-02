import { MultilingualText } from './tenant';

export interface Village {
  _id?: string;
  slug: string;
  name: MultilingualText;
  desc: MultilingualText;
  province: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  categories: string[];
  images: string[];
  isVerified: boolean;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}
