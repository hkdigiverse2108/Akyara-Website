import type { ReactNode } from "react";

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

export type ProductColor = {
  name: string;
  swatch: string;
};

export type ProductItem = {
  id: string;
  name: string;
  category: Exclude<ProductCategory, "All">;
  categoryLabel: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
  description: string;
  sku: string;
  rating: number;
  reviews: number;
  availability: "In Stock" | "Low Stock";
  colors: ProductColor[];
  sizes: string[];
  gallery: string[];
};

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

