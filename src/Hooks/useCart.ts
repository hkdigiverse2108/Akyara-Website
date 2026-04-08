import { useEffect, useMemo, useState } from "react";
import { Queries } from "../Api";
import { getToken } from "../Utils";
import { COMMERCE_STORAGE_EVENT, getCartItems, addToCart as addLocalCart, setCartItems } from "../Utils/commerceStorage";
import type { ProductItem } from "../Types";

export const useCart = () => {
  const token = getToken();
  const [localCart, setLocalCart] = useState(() => getCartItems());

  const { data: productsData } = Queries.useGetAllProducts(undefined, !!token);

  useEffect(() => {
    const sync = () => setLocalCart(getCartItems());
    window.addEventListener(COMMERCE_STORAGE_EVENT, sync);
    return () => window.removeEventListener(COMMERCE_STORAGE_EVENT, sync);
  }, []);

  const cartList = useMemo(() => {
    const list = localCart;

    if (productsData?.data) {
      const allProducts = Array.isArray(productsData.data) ? productsData.data : ((productsData.data as any).products || []);
      const productMap = new Map(allProducts.map((p: any) => [String(p._id || p.id), p]));
      
      return list.map(item => {
        const pId = String(item.productId);
        const details = productMap.get(pId);
        if (details) {
          return {...item,productId: details,};
        }
        return item;
      });
    }

    return list;
  }, [localCart, productsData]);

  const toggleCart = async (product: Partial<ProductItem> & { productId?: any; id?: string; _id?: string; title?: string; sellingPrice?: string | number; thumbnail?: string; size?: string; color?: string }, quantity = 1) => {
    const pId = String(product.productId || product.id || product._id);
    const productObj = {productId: pId,name: product.name || (product.productId?.title || product.title) || "",price: (product.price || product.productId?.sellingPrice || product.sellingPrice)?.toString() || "0",image: product.image || (product.productId?.thumbnail || product.thumbnail) || "",quantity: quantity,size: product.size,color: product.color,};
    addLocalCart(productObj);
  };

  const removeCartItem = async (productId: string, size?: string, color?: string) => {
    const next = getCartItems().filter((item) => {
        const matchesId = item.productId === productId;
        const matchesSize = item.size === size;
        const matchesColor = item.color === color;
        return !(matchesId && matchesSize && matchesColor);
    });
    setCartItems(next);
  };

  return { cartList, toggleCart, removeCartItem };
};
