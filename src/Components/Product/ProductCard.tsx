import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { ProductCardProps } from "../../Types";
import { useWishlist } from "../../Hooks/useWishlist";

const ProductCard = (props: ProductCardProps) => {
  const { id, name, price, oldPrice, badge, image, href, badgeStyles, className, imageClassName, favoriteAriaLabel, cardDataAttribute } = props;
  const { wishlistMap, toggleWishlist } = useWishlist();
  const isWished = wishlistMap.has(id);
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({ id, name, price, image } as any);
  };

  const articleProps = cardDataAttribute ? { [cardDataAttribute.name]: cardDataAttribute.value } : {};

  return (
    <article className={[   "product-card group relative overflow-hidden rounded-[6px] bg-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.35)]",   className, ]   .filter(Boolean)   .join(" ")} {...articleProps}>
      {badge ? (<span className={`absolute left-4 top-4 z-10 rounded-[6px] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white ${   badgeStyles?.[badge] ?? "bg-black" }`}>{badge}</span>) : null}
      <button type="button" onClick={handleWishlistClick} className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition active:scale-90 sm:h-10 sm:w-10 sm:right-4 sm:top-4" aria-label={favoriteAriaLabel ?? `Save ${name}`}>
        {isWished ? <HeartFilled className="text-[#e53935]" /> : <HeartOutlined className="text-lg" />}
      </button>
      <div className="relative overflow-hidden bg-[#f9f9f9]">
        <Link to={href} aria-label={`Open ${name}`} className="block">
          <img src={image} alt={name} loading="lazy" className={[   "card-img-top w-full object-cover object-top transition-transform duration-700 group-hover:scale-110",   imageClassName ?? "aspect-[4/5] sm:h-[300px] lg:h-[380px]", ]   .filter(Boolean)   .join(" ")}/>
        </Link>
        <Link to={href} className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-black/90 px-4 py-3 text-center text-xs text-white transition-transform duration-300 group-hover:translate-y-0 sm:block sm:text-sm">
          <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wider">
            Quick View
          </span>
        </Link>
      </div>

      <div className="p-3 text-center sm:p-5">
        <Link to={href} className="line-clamp-1 mb-1 block text-[0.82rem] font-medium text-[#1f1f1f] transition hover:text-[#e53935] sm:text-sm">
          {name}
        </Link>
        <div className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-2">
          {oldPrice ? <span className="text-[0.75rem] text-[#9b9b9b] line-through sm:text-sm">{oldPrice}</span> : null}
          <span className={`text-sm font-bold sm:text-base ${oldPrice ? "text-[#e53935]" : "text-[#111111]"}`}>{price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
