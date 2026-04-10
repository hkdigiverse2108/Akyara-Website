import type { ApiResponse } from "./Api";

export interface SaleBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  saleEndTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SaleBannerApiResponse = ApiResponse<SaleBanner>;
