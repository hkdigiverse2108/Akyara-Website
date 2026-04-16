import type { ProductCategory, ProductItem } from "../../Types";

export const products: ProductItem[] = [];

export const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-[#111827]",
  New: "bg-[#0f9d58]",
  Hot: "bg-[#ef6b4a]",
  Sale: "bg-[#c62828]",
  "Editor Pick": "bg-[#7c3aed]",
};

export const getProductDetailPath = (id: string) => `/products/${id}`;

export const getProductsByCategory = (category: ProductCategory) =>
  category === "All" ? products : products.filter((product) => product.category === category);

export const getProductById = (id?: string) =>
  products.find((product) => product.id === id) ?? null;
