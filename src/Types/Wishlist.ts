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
};