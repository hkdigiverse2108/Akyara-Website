import type { ApiResponse } from "./Api";
import type { ProductRecord } from "./Product";

export type WishlistStock = "In stock" | "Low stock" | "Out of stock";

export type WishlistItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: WishlistStock;
  accent: string;
  badge?: string;
  image?: string;
};

export type WishlistRecord = {
  _id: string;
  userId: string;
  productId: ProductRecord;
  isDeleted: boolean;
};

export type AddWishlistPayload = {
  productId: string;
};

export type WishlistApiResponse = ApiResponse<WishlistRecord[]>;