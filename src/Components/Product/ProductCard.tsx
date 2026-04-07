import { HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { ProductCardProps } from "../../Types";


const ProductCard = ({name,price,oldPrice,badge,image,href,badgeStyles,className,imageClassName,favoriteIcon = <HeartOutlined />,favoriteAriaLabel,cardDataAttribute,
}: ProductCardProps) => {
  const articleProps = cardDataAttribute ? { [cardDataAttribute.name]: cardDataAttribute.value } : {};

  return (
    <article className={[   "product-card group relative overflow-hidden rounded-[6px] bg-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.35)]",   className, ]   .filter(Boolean)   .join(" ")} {...articleProps}>
      {badge ? (<span className={`absolute left-4 top-4 z-10 rounded-[6px] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white ${   badgeStyles?.[badge] ?? "bg-black" }`}>{badge}</span>) : null}
      <button type="button" className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition hover:scale-105" aria-label={favoriteAriaLabel ?? `Save ${name}`}>{favoriteIcon}</button>
      <div className="relative overflow-hidden bg-[#f1f0ec]">
        <Link to={href} aria-label={`Open ${name}`} className="block">
          <img src={image} alt={name} loading="lazy" className={[   "card-img-top w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]",   imageClassName ?? "h-[220px] min-[420px]:h-[260px] sm:h-[300px] lg:h-[360px]", ]   .filter(Boolean)   .join(" ")}/>
        </Link>
        <Link to={href} className="absolute inset-x-0 bottom-0 translate-y-full bg-black/90 px-4 py-3 text-center text-sm text-white transition-transform duration-300 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wide">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"> <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" /><circle cx="12" cy="12" r="3" /></svg> Quick View
          </span>
        </Link>
      </div>

      <div className="p-4 text-center">
        <Link to={href} className="mb-1 block text-sm font-medium text-[#1f1f1f] transition hover:text-[#ef6b4a]">
          {name}
        </Link>
        <div className="text-sm font-medium">
          {oldPrice ? <span className="mr-2 text-[#9b9b9b] line-through">{oldPrice}</span> : null}
          <span className={`text-base font-semibold ${oldPrice ? "text-[#e53935]" : "text-[#1f1f1f]"}`}>{price}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
