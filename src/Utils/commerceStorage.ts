import type { ProductItem } from "../Types";

export const COMMERCE_STORAGE_EVENT = "akyara:commerce-storage";
export const CART_STORAGE_KEY = "Akyara-Cart";
export const WISHLIST_STORAGE_KEY = "Akyara-Wishlist";

export type CartLineItem = {
  productId: string;
  name: string;
  price: string;
  image: string;
  color?: string;
  size?: string;
  quantity: number;
};

export type WishlistProduct = {
  productId: string;
  name: string;
  category: string;
  categoryLabel?: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  image: string;
  availability?: string;
};

const canUseStorage = () =>
  typeof window !== "undefined" &&
  typeof window.localStorage !== "undefined";

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "[]";
  }
};

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const notify = () => {
  if (!canUseStorage()) return;
  window.dispatchEvent(new Event(COMMERCE_STORAGE_EVENT));
};

export const getCartItems = (): CartLineItem[] => {
  if (!canUseStorage()) return [];
  return safeParse<CartLineItem[]>(localStorage.getItem(CART_STORAGE_KEY), []);
};

export const setCartItems = (items: CartLineItem[]) => {
  if (!canUseStorage()) return;
  localStorage.setItem(CART_STORAGE_KEY, safeStringify(items));
  notify();
};

export const addToCart = (item: CartLineItem) => {
  const existing = getCartItems();
  const matchIndex = existing.findIndex(
    (entry) =>
      entry.productId === item.productId &&
      entry.color === item.color &&
      entry.size === item.size
  );

  const next = [...existing];
  if (matchIndex >= 0) {
    const previous = next[matchIndex];
    next[matchIndex] = {
      ...previous,
      quantity: Math.min(99, Math.max(1, (previous.quantity ?? 0) + item.quantity)),
    };
  } else {
    next.unshift({ ...item, quantity: Math.min(99, Math.max(1, item.quantity)) });
  }

  setCartItems(next);
};

export const getCartCount = () =>
  getCartItems().reduce((total, item) => total + (item.quantity ?? 0), 0);

export const getWishlistItems = (): WishlistProduct[] => {
  if (!canUseStorage()) return [];
  return safeParse<WishlistProduct[]>(localStorage.getItem(WISHLIST_STORAGE_KEY), []);
};

export const setWishlistItems = (items: WishlistProduct[]) => {
  if (!canUseStorage()) return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, safeStringify(items));
  notify();
};

const toWishlistProduct = (item: WishlistProduct | ProductItem): WishlistProduct => {
  if ("productId" in item) return item;

  return {
    productId: item.id,
    name: item.name,
    category: item.category,
    categoryLabel: item.categoryLabel,
    price: item.price,
    oldPrice: item.oldPrice,
    badge: item.badge,
    image: item.image,
    availability: item.availability,
  };
};

export const addToWishlist = (item: WishlistProduct | ProductItem): boolean => {
  const normalized = toWishlistProduct(item);
  const existing = getWishlistItems();
  if (existing.some((entry) => entry.productId === normalized.productId)) {
    return false;
  }

  setWishlistItems([{ ...normalized }, ...existing]);
  return true;
};

export const removeFromWishlist = (productId: string) => {
  const existing = getWishlistItems();
  const next = existing.filter((item) => item.productId !== productId);
  setWishlistItems(next);
};

export const clearWishlist = () => {
  setWishlistItems([]);
};

export const getWishlistCount = () => getWishlistItems().length;
