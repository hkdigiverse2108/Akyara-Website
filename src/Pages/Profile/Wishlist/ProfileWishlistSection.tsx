import { DeleteOutlined, HeartFilled, ShoppingCartOutlined, TagOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../Constants";
import type { WishlistItem } from "../../../Types/Wishlist";
import { COMMERCE_STORAGE_EVENT, clearWishlist as clearStoredWishlist, getWishlistItems, removeFromWishlist } from "../../../Utils/commerceStorage";



const accentOptions = [
  "from-[#eef4ff] to-[#dbe7ff]",
  "from-[#effcf6] to-[#d7f7e8]",
  "from-[#fff4ef] to-[#ffe7dc]",
  "from-[#f3f0ff] to-[#e6dcff]",
  "from-[#f8fafc] to-[#e2e8f0]",
];

const stockClass: Record<WishlistItem["stock"], string> = {
  "In stock": "bg-[#e9f8ef] text-[#0f9d58]",
  "Low stock": "bg-[#fff7e8] text-[#b26800]",
  "Out of stock": "bg-[#ffeaea] text-[#c62828]",
};

const formatPrice = (amount: number) => `Rs ${amount.toLocaleString("en-IN")}`;

const parsePrice = (value?: string) => {
  if (!value) return 0;
  const digits = value.replace(/[^\d.]/g, "");
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toStock = (availability?: string): WishlistItem["stock"] => {
  const normalized = (availability ?? "").toLowerCase();
  if (normalized.includes("out")) return "Out of stock";
  if (normalized.includes("low")) return "Low stock";
  return "In stock";
};

const getAccent = (id: string) => {
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return accentOptions[hash % accentOptions.length];
};

const loadStoredWishlist = (): WishlistItem[] =>
  getWishlistItems()
    .map((item) => {
      const id = item.productId?.trim();
      if (!id) return null;

      const category = (item.categoryLabel || item.category || "Products").trim();
      const normalized: WishlistItem = {
        id,
        name: item.name?.trim() || "Untitled Product",
        category,
        price: parsePrice(item.price),
        ...(item.oldPrice ? { originalPrice: parsePrice(item.oldPrice) } : {}),
        stock: toStock(item.availability),
        accent: getAccent(id),
        badge: item.badge,
      };

      return normalized;
    })
    .filter((entry): entry is WishlistItem => entry !== null);

const ProfileWishlistSection = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => loadStoredWishlist());

  useEffect(() => {
    const sync = () => setWishlist(loadStoredWishlist());
    sync();
    window.addEventListener(COMMERCE_STORAGE_EVENT, sync);
    return () => window.removeEventListener(COMMERCE_STORAGE_EVENT, sync);
  }, []);

  const summary = useMemo(() => {
    const savedItems = wishlist.length;
    const inStock = wishlist.filter((item) => item.stock === "In stock").length;
    const lowStock = wishlist.filter((item) => item.stock === "Low stock").length;
    const totalValue = wishlist.reduce((acc, item) => acc + item.price, 0);

    return { savedItems, inStock, lowStock, totalValue };
  }, [wishlist]);

  const removeItem = (id: string) => {
    removeFromWishlist(id);
  };

  const clearWishlist = () => {
    clearStoredWishlist();
  };

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">Wishlist</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">Saved Products</h2>
            <p className="mt-2 text-sm text-[#5b6472]">Keep your favorites here and move them to cart whenever you are ready.</p>
          </div>

          <div className="flex items-center gap-2">
            {wishlist.length ? (
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-2 rounded-full border border-[#ffe0e0] bg-[#fff6f6] px-4 py-2 text-sm font-semibold text-[#c62828] transition hover:bg-[#ffeaea]"
              >
                <DeleteOutlined />
                Clear All
              </button>
            ) : null}

            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center gap-2 rounded-full border border-[#dde4ee] bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a]"
            >
              <ShoppingCartOutlined />
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      {wishlist.length ? (
        <>
          <div className="grid gap-4 border-b border-[#e6ebf1] p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-6 xl:p-8">
            {[
              { label: "Saved Items", value: summary.savedItems.toString() },
              { label: "In Stock", value: summary.inStock.toString() },
              { label: "Low Stock", value: summary.lowStock.toString() },
              { label: "Current Value", value: formatPrice(summary.totalValue) },
            ].map((item) => (
              <div key={item.label} className="rounded-[12px] border border-[#e8edf4] bg-white p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-[#111827]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:p-6 xl:grid-cols-3 xl:p-8">
            {wishlist.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[12px] border border-[#e5e9f0] bg-white">
                <div className={`grid aspect-[4/3] place-items-center bg-gradient-to-br ${item.accent}`}>
                  <div className="flex flex-col items-center gap-2 rounded-[14px] border border-white/70 bg-white/75 px-4 py-3 text-[#111827] backdrop-blur-sm">
                    <HeartFilled className="text-[#ef6b4a]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7280]">{item.category}</p>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#111827]">{item.name}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${stockClass[item.stock]}`}>
                      {item.stock}
                    </span>
                  </div>

                  {item.badge ? (
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f6fb] px-2.5 py-1 text-[0.68rem] font-semibold text-[#445068]">
                      <TagOutlined />
                      {item.badge}
                    </p>
                  ) : null}

                  <div className="flex items-end gap-2">
                    <p className="text-lg font-semibold text-[#111827]">{formatPrice(item.price)}</p>
                    {item.originalPrice ? <p className="text-sm text-[#8b96a8] line-through">{formatPrice(item.originalPrice)}</p> : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      disabled={item.stock === "Out of stock"}
                      className="inline-flex items-center justify-center rounded-[10px] border border-[#d9e0eb] bg-white px-3 py-2 text-sm font-semibold text-[#0f172a] transition hover:border-[#0f172a] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-[#ffe0e0] bg-[#fff6f6] px-3 py-2 text-sm font-semibold text-[#c62828] transition hover:bg-[#ffeaea]"
                    >
                      <DeleteOutlined />
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-[10px] border border-dashed border-[#d9d9d9] bg-[#f9fafb] px-5 py-8 text-center">
            <p className="text-sm text-[#5f6774] sm:text-base">Your wishlist is currently empty.</p>
            <Link
              to={ROUTES.PRODUCTS}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWishlistSection;
