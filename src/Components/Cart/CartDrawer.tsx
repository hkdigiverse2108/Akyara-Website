import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { Link } from "react-router-dom";
import { useCart } from "../../Hooks/useCart";
import { ROUTES } from "../../Constants";
import { getApiBaseUrl } from "../../Utils";
import EmptyState from "../EmptyState";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cartList, removeCartItem, toggleCart } = useCart();

  const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
  const fallbackImage = assetUrl("assets/1.jpg");

  const formatCurrency = (value: number) => `Rs ${value.toLocaleString("en-IN")}`;

  const isAbsoluteUrl = (value: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(value);

  const resolveImageUrl = (value: unknown) => {
    const raw = typeof value === "string" ? value.trim() : "";
    if (!raw) return fallbackImage;
    if (isAbsoluteUrl(raw)) return raw;

    const normalized = raw.replace(/^\/+/, "");
    if (normalized.startsWith("assets/")) return assetUrl(normalized);

    const apiBase = getApiBaseUrl();
    if (raw.startsWith("/")) return apiBase ? `${apiBase}${raw}` : raw;

    if (apiBase) return `${apiBase}/${normalized}`;
    return `/${normalized}`;
  };

  const getProductId = (value: any) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") return String(value._id || value.id || "");
    return "";
  };

  const parsePrice = (val: any) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const calculateSubtotal = () => {
    return cartList.reduce((acc: number, item: any) => {
      const price = parsePrice(item.price || item.productId?.sellingPrice);
      const qty = item.quantity || 1;
      return acc + price * qty;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const itemCount = cartList.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);

  return (
    <Drawer open={open} onClose={onClose} placement="right" width="min(420px, 100vw)" closable={false} styles={{ header: { padding: 0, borderBottom: "none" }, body: { padding: 0 }, footer: { padding: 0, borderTop: "none" } }} footer={
        cartList.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-5 py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="mb-5 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-semibold">Subtotal</span>
                <span className="font-bold text-[#111827]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-semibold">Estimated Shipping</span>
                <span className="text-green-600 font-bold uppercase tracking-widest text-[0.65rem]">Free</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-sm font-black text-[#111827]">Total Amount</span>
                <span className="text-xl font-black text-[#111827] tracking-tighter">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Link
                to={ROUTES.CHECKOUT}
                onClick={onClose}
                className="grid h-12 w-full place-items-center rounded-xl bg-black text-sm font-extrabold text-white transition hover:bg-[#111111]"
              >
                Checkout
              </Link>
              <button type="button" onClick={onClose} className="h-12 w-full rounded-xl border border-gray-200 bg-white text-sm font-extrabold text-[#111827] transition hover:border-black hover:text-black">Continue Shopping</button>
            </div>
          </div>
        )
      }
    >
      <div className="flex h-full flex-col font-sans">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1f1f1] bg-white px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <ShoppingOutlined className="text-base" />
            </div>
            <div>
              <p className="m-0 font-display text-base font-extrabold tracking-tight text-[#111827]">Your Bag</p>
              <p className="m-0 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{itemCount} Items</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:rotate-90 hover:bg-black hover:text-white"
          >
            <CloseOutlined className="text-[11px]" />
          </button>
        </div>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {cartList.length === 0 ? (
            <EmptyState title="Bag is Empty" description="Your curation awaits. Start exploring our latest collections to fill your bag." buttonText="Start Curating" onButtonClick={onClose}/>
          ) : (
            <div className="space-y-5">
              {cartList.map((item: any) => {
                const productId = getProductId(item.productId);
                const name = item.name || item.productId?.title || "Exclusive Item";
                const price = parsePrice(item.price || item.productId?.sellingPrice);
                const image = resolveImageUrl(item.image || item.productId?.thumbnail);
                const quantity = item.quantity || 1;

                const uniqueKey = `${productId}-${item.size || ""}-${item.color || ""}`;
                const href = productId ? `/products/${productId}` : undefined;

                return (
                  <div key={uniqueKey} className="group flex gap-4 rounded-2xl bg-white p-3 shadow-[0_12px_30px_rgba(17,17,17,0.06)] ring-1 ring-gray-100">
                    {href ? (
                      <Link to={href} onClick={onClose} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f9f9f9]" aria-label={`View ${name}`}>
                        <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </Link>
                    ) : (
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f9f9f9]">
                        <img src={image} alt={name} className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        {href ? (
                          <Link to={href} onClick={onClose} className="line-clamp-2 text-[0.95rem] font-extrabold leading-snug text-[#111827] transition hover:text-[#ef6b4a]">{name}</Link>
                        ) : (
                          <p className="m-0 line-clamp-2 text-[0.95rem] font-extrabold leading-snug text-[#111827]">{name}</p>
                        )}

                        <button type="button" aria-label="Remove item" onClick={() => removeCartItem(productId, item.size, item.color)} className="grid h-9 w-9 place-items-center rounded-full text-gray-300 transition hover:bg-red-50 hover:text-red-500"><DeleteOutlined className="text-[18px]" /></button>
                      </div>

                      {(item.size || item.color) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.size && (<span className="rounded-md bg-gray-100 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide text-gray-500">  Sz: {item.size}</span>)}
                          {item.color && (<span className="rounded-md bg-gray-100 px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide text-gray-500">  Cl: {item.color}</span>)}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-xl bg-gray-50 p-1 ring-1 ring-gray-100">
                          <button type="button" aria-label="Decrease quantity" onClick={() => toggleCart(item, -1)} disabled={quantity <= 1} className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition hover:bg-white hover:shadow-sm disabled:opacity-30"> <MinusOutlined className="text-[10px]" /></button>
                          <span className="w-10 text-center text-sm font-black text-[#111827]">{quantity}</span>
                          <button type="button" aria-label="Increase quantity" onClick={() => toggleCart(item, 1)} className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition hover:bg-white hover:shadow-sm"><PlusOutlined className="text-[10px]" /></button>
                        </div>
                        <div className="text-right">
                          <p className="m-0 text-[0.7rem] font-semibold text-gray-400">{formatCurrency(price)} each</p>
                          <p className="m-0 text-base font-black text-[#111827]">{formatCurrency(price * quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default CartDrawer;
