import { message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Mutations, Queries } from "../Api";
import { getToken } from "../Utils";
import { COMMERCE_STORAGE_EVENT, addToWishlist, getWishlistItems, removeFromWishlist } from "../Utils/commerceStorage";
import type { ProductItem } from "../Types";

export const useWishlist = () => {
  const token = getToken();
  const [localWishlist, setLocalWishlist] = useState(() => getWishlistItems());

  const { data: apiWishlistData, refetch } = Queries.useGetWishlist(undefined, !!token);
  const addWishlistMut = Mutations.useAddWishlist();
  const removeWishlistMut = Mutations.useRemoveWishlist();

  useEffect(() => {
    const sync = () => setLocalWishlist(getWishlistItems());
    window.addEventListener(COMMERCE_STORAGE_EVENT, sync);
    return () => window.removeEventListener(COMMERCE_STORAGE_EVENT, sync);
  }, []);

  const wishlistMap = useMemo(() => {
    const map = new Map<string, string | boolean>();
    if (token && apiWishlistData?.data) {
      const arr = Array.isArray(apiWishlistData.data) ? apiWishlistData.data : ((apiWishlistData.data as any)?.wishlist_data || []);
      arr.forEach((w: any) => {
        const rawPId = w.productId?._id || w.productId;
        if (rawPId) {
          const pId = String(rawPId);
          map.set(pId, String(w._id || pId));
        }
      });
    } else {
      localWishlist.forEach((w) => map.set(w.productId, true));
    }
    return map;
  }, [apiWishlistData, localWishlist, token]);

  const toggleWishlist = async (product: Partial<ProductItem> & { id: string }) => {
    const pId = String(product.id || (product as any)._id);
    const wishId = wishlistMap.get(pId);
    
    if (token) {
      try {
        if (wishId) {
          await removeWishlistMut.mutateAsync(wishId as string);
        } else {
          await addWishlistMut.mutateAsync({ productId: pId });
        }
        refetch();
        message.success(`Wishlist updated`);
      } catch (err: any) {
        message.error("Failed to update wishlist");
      }
    } else {
      if (wishId) {
        removeFromWishlist(pId);
        message.success("Removed from wishlist");
      } else {
        addToWishlist(product as any);
        message.success("Added to wishlist");
      }
    }
  };

  return { wishlistMap, toggleWishlist };
};
