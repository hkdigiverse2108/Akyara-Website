import type { ApiResponse } from "./Api";

export interface Banner {
  _id: string;
  type: string;
  title: string;
  subtitle?: string;
  ctaButton?: string;
  ctaButtonRedirection?: string;
  pageRedirection?: string;
  endDate?: string;
  image?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface BannerData {
  banner_data: Banner[];
  totalData: number;
}

export type BannerApiResponse = ApiResponse<BannerData>;
export type SingleBannerApiResponse = ApiResponse<Banner>;
