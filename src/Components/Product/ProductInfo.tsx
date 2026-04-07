import { FacebookFilled, HeartOutlined, InstagramOutlined, PinterestFilled, ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import type { ChangeEvent } from "react";
import type { ProductItem } from "../../Types";

interface ProductInfoProps {product: ProductItem;selectedColor: string;setSelectedColor: (color: string) => void;selectedSize: string;setSelectedSize: (size: string) => void;quantity: number;handleAddToCart: () => void;handleWishlist: () => void;handleQuantityChange: (event: ChangeEvent<HTMLInputElement>) => void;}

export const ProductInfo = ({product,selectedColor,setSelectedColor,selectedSize,setSelectedSize,quantity,handleAddToCart,handleWishlist,handleQuantityChange,}: ProductInfoProps) => {
  const productRating = Math.max(0, Math.min(5, Math.round(product.rating || 0)));
  const reviewCount = product.reviews || 0;

  return (
    <div className="min-w-0 w-full max-w-[560px]">
      <p className="text-[0.82rem] font-medium text-[#7c6cff]">{product.categoryLabel}</p>

      <h1 className="mt-3 text-[1.7rem] font-semibold leading-tight text-[#050816] sm:text-[2.1rem]">
        {product.name}
      </h1>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.9rem] text-[#5f6774]">
        <span className="inline-flex items-center gap-0.5 text-[#f4a000]">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarFilled key={index} className={index < productRating ? "" : "opacity-30"} />
          ))}
        </span>
        <span>({reviewCount} Reviews)</span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-3">
        {product.oldPrice ? (
          <span className="text-[1.6rem] font-medium text-[#6b7280] line-through">{product.oldPrice}</span>
        ) : null}
        <span className="text-[1.75rem] font-semibold text-[#ff3b30]">{product.price}</span>
        <span
          className={`inline-flex rounded-[4px] px-2.5 py-1 text-[0.88rem] font-medium ${
            product.availability === "In Stock" ? "bg-[#28a745] text-white" : "bg-[#fff1d8] text-[#b26800]"
          }`}
        >
          {product.availability}
        </span>
      </div>

      <p className="mt-5 max-w-[500px] text-[0.92rem] leading-8 text-[#5f6774]">{product.description}</p>

      {product.colors.length > 0 ? (
        <div className="mt-7">
          <p className="text-[0.96rem] font-semibold text-[#111827]">Color:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const colorName = color.name.trim();
              const isActive = selectedColor.trim().toLowerCase() === colorName.toLowerCase();

              return (
                <button key={colorName} type="button" onClick={() => setSelectedColor(colorName)} className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${   isActive ? "border-[#111827]" : "border-[#d7deea]" }`} title={colorName}>
                  <span className="h-7 w-7 rounded-full border border-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" style={{ backgroundColor: color.swatch }}/>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {product.sizes.length > 0 ? (
        <div className="mt-7">
          <p className="text-[0.96rem] font-semibold text-[#111827]">Size:</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.sizes.map((size) => {
              const sizeValue = size.trim();
              const isActive = selectedSize.trim().toLowerCase() === sizeValue.toLowerCase();

              return (
                <button key={sizeValue} type="button" onClick={() => setSelectedSize(sizeValue)} className={`min-w-[42px] rounded-[4px] border px-3 py-2.5 text-sm font-medium transition ${   isActive     ? "border-[#111827] bg-[#111827] text-white"     : "border-[#dbe2ed] bg-white text-[#1f2937] hover:border-[#111827]" }`}>
                  {sizeValue}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-7 grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[150px_minmax(0,1fr)_204px]">
        <input type="number" min={1} max={99} step={1} inputMode="numeric" value={quantity} onChange={handleQuantityChange} aria-label="Quantity" className="h-16 w-full rounded-[4px] border border-[#dbe2ed] bg-white px-5 text-[1.02rem] font-medium text-[#111827] outline-none transition focus:border-[#111827]"/>

        <button type="button" onClick={handleAddToCart} className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-[4px] bg-[#1d1b1b] px-6 text-[1rem] font-semibold text-white transition hover:bg-black">
          <ShoppingCartOutlined />
          Add to Cart
        </button>

        <button type="button" onClick={handleWishlist} className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-[4px] bg-[#f1f4f8] px-5 text-[1rem] font-medium text-[#111827] transition hover:bg-[#e8edf3] sm:col-span-2 lg:col-span-1">
          <HeartOutlined />
          Wishlist
        </button>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3 text-[0.9rem] text-[#5f6774]">
        <span>Share:</span>
        {[{ key: "instagram", icon: <InstagramOutlined /> },{ key: "facebook", icon: <FacebookFilled /> },{ key: "pinterest", icon: <PinterestFilled /> },].map((item) => (
          <button key={item.key} type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] text-[#6b7280] transition hover:bg-[#111827] hover:text-white">
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
