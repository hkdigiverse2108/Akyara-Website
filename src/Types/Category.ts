import type { ApiResponse } from "./Api";

export type CategoryItem = {
  _id: string;
  name: string;
  image?: string;
  isActive?: boolean;
};

export type CategoryApiResponse = ApiResponse<
  CategoryItem | CategoryItem[] | { category_data?: CategoryItem[] }
>;
