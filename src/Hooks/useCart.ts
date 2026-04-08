import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Mutations, Queries } from "../Api";
import { getToken } from "../Utils";
import { COMMERCE_STORAGE_EVENT, getCartItems, addToCart as addLocalCart, setCartItems } from "../Utils/commerceStorage";
import type { ProductItem, CartRecord, AddCartPayload } from "../Types";

export const useCart = () => {
  const token = getToken();
  const [localCart, setLocalCart] = useState(() => getCartItems());

  const { data: apiCartData, refetch } = Queries.useGetCart(undefined, !!token);
  const addCartMut = Mutations.useAddCart();
  const updateCartMut = Mutations.useUpdateCart();
  const removeCartMut = Mutations.useRemoveCart();

  useEffect(() => {
    const sync = () => setLocalCart(getCartItems());
    window.addEventListener(COMMERCE_STORAGE_EVENT, sync);
    return () => window.removeEventListener(COMMERCE_STORAGE_EVENT, sync);
  }, []);

  const cartMap = useMemo(() => {
    const map = new Map<string, number | string>();
    if (token && apiCartData?.data) {
      const arr = Array.isArray(apiCartData.data) ? apiCartData.data : ((apiCartData.data as any)?.cart_data || []);
      arr.forEach((w: any) => {
        const rawPId = w.productId?._id || w.productId;
        if (rawPId && !w.isDeleted) {
          const pId = String(rawPId);
          map.set(pId, String(w._id || pId)); // Maps Product ID -> Cart Record ID
        }
      });
    } else {
      localCart.forEach((w) => map.set(w.productId, w.quantity));
    }
    return map;
  }, [apiCartData, localCart, token]);

  const cartList = useMemo(() => {
    if (token && apiCartData?.data) {
      const arr = Array.isArray(apiCartData.data) ? apiCartData.data : ((apiCartData.data as any)?.cart_data || []);
      return arr.filter((w: any) => !w.isDeleted);
    }
    return localCart;
  }, [apiCartData, localCart, token]);

  const toggleCart = async (product: Partial<ProductItem> & { id: string }, quantity = 1) => {
    const pId = String(product.id || (product as any)._id);
    const cartVal = cartMap.get(pId);
    
    if (token) {
      try {
        if (cartVal) {
          // If you click it, typically toggling from product card removes it, but cart is ADD generally.
          // Assuming we just Add if not exist, or increment if exists. 
          await addCartMut.mutateAsync({ productId: pId, quantity });
        } else {
          await addCartMut.mutateAsync({ productId: pId, quantity });
        }
        refetch();
        message.success(`Added to cart`);
      } catch (err: any) {
        message.error("Failed to update cart");
      }
    } else {
      const productObj = {
        productId: pId,
        name: product.name || "",
        price: product.price?.toString() || "0",
        image: product.image || "",
        quantity: quantity,
      };
      
      addLocalCart(productObj);
      message.success("Added to cart");
    }
  };

  const removeCartItem = async (cartItemId: string, productId: string) => {
    if (token) {
      try {
        await removeCartMut.mutateAsync(cartItemId);
        refetch();
        message.success("Removed from cart");
      } catch (err) {
        message.error("Failed to remove item");
      }
    } else {
      const next = getCartItems().filter((item) => item.productId !== productId);
      setCartItems(next);
      message.success("Removed from cart");
    }
  };

  return { cartMap, cartList, toggleCart, removeCartItem };
};
