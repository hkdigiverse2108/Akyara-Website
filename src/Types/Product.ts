import type { ReactNode } from "react";
import type { ApiResponse } from "./Api";

export type ProductCardItem = {
  id: string;
  name: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
};

export type ProductCardProps = ProductCardItem & {
  href: string;
  badgeStyles?: Record<string, string>;
  className?: string;
  imageClassName?: string;
  favoriteIcon?: ReactNode;
  favoriteAriaLabel?: string;
  cardDataAttribute?: {
    name: string;
    value: string;
  };
};

export type ProductCategory = "All" | "Shirts" | "T-Shirts" | "Jeans";
export type ProductAudience = "women" | "men" | "kids";

export type ProductColor = {
  name: string;
  swatch: string;
};

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
  description: string;
  longDescription?: string;
  sku: string;
  rating: number;
  reviews: number;
  availability: string;
  colors: ProductColor[];
  sizes: string[];
  gallery: string[];
};

export type ProductRef = {
  _id?: string;
  name?: string;
  title?: string;
  label?: string;
  categoryName?: string;
  colorCode?: string;
  colourCode?: string;
  hexCode?: string;
  hexColor?: string;
  value?: string;
};

export type ProductRecord = {
  _id?: string;
  images?: string[];
  thumbnail?: string;
  categoryId?: string | ProductRef;
  title?: string;
  rating?: number | string;
  mrp?: number | string;
  sellingPrice?: number | string;
  cogsPrice?: number | string;
  netProfit?: number | string;
  discount?: number | string;
  shortDescription?: string;
  longDescription?: string;
  brandId?: string | ProductRef;
  sku?: string;
  isTrending?: boolean;
  isDealOfDay?: boolean;
  isOurTrendingProduct?: boolean;
  sizeIds?: Array<string | ProductRef>;
  colorIds?: Array<string | ProductRef>;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductApiResponse = ApiResponse<
  ProductRecord | ProductRecord[] | { product_data?: ProductRecord[]; products?: ProductRecord[]; product?: ProductRecord }
>;

export type ProductTab = "description" | "additional" | "reviews";

export type ProductReview = {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatarLabel: string;
  avatarBackground: string;
};

export type ReviewFormValues = {
  rating: number;
  fullName: string;
  email: string;
  description: string;
};

