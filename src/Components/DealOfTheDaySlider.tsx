import { useEffect, useRef, useState } from "react";
import ProductCard from "./Product/ProductCard";
import { badgeStyles, getProductDetailPath } from "../Pages/Products/productData";
import type { ProductItem } from "../Types";

interface DealOfTheDaySliderProps {
  products: ProductItem[];
}

export const DealOfTheDaySlider = ({ products }: DealOfTheDaySliderProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const scrollAmountRef = useRef(260);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || products.length === 0) return;

    const card = el.querySelector<HTMLElement>("[data-product-card='true']");
    const gap = parseFloat(getComputedStyle(el).gap || "0");
    scrollAmountRef.current = (card?.offsetWidth ?? 260) + gap;
  }, [products]);

  useEffect(() => {
    const id = setInterval(() => {
      if (isHovered) return;
      const el = sliderRef.current;
      if (!el) return;
      const scroll = scrollAmountRef.current;
      const max = el.scrollWidth - el.clientWidth;

      el.scrollLeft + scroll >= max ? el.scrollTo({ left: 0, behavior: "smooth" }) : el.scrollBy({ left: scroll, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(id);
  }, [isHovered]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * scrollAmountRef.current, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mt-12 py-10 sm:mt-16 sm:py-16">
      <div className="site-container">
        <div className="mb-10 sm:mb-12">
          <div className="sec_title relative text-center">
            <h2 className="off_title pointer-events-none absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 whitespace-nowrap text-[clamp(2.6rem,6vw,4.5rem)] font-semibold italic leading-none text-black/10 md:block">Good Deals</h2>
            <h3 className="ft-bold relative z-10 pt-2 font-display text-2xl font-semibold sm:pt-10 sm:text-3xl">Deals of The Day</h3>
          </div>
        </div>

        <div className="relative">
          <button type="button" className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-left-4" aria-label="Scroll to previous deals" onClick={() => scrollByCard(-1)}>
            <span aria-hidden="true">&larr;</span>
          </button>
          <button type="button" className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-right-4" aria-label="Scroll to next deals" onClick={() => scrollByCard(1)}>
            <span aria-hidden="true">&rarr;</span>
          </button>

          <div ref={sliderRef} className="hide-scrollbar flex gap-4 overflow-x-auto px-2 pb-6 scroll-smooth snap-x snap-mandatory sm:gap-6 sm:px-6 xl:px-0" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onTouchStart={() => setIsHovered(true)} onTouchEnd={() => setIsHovered(false)}>
            {products.map((deal) => (
              <ProductCard key={deal.id} {...deal} href={getProductDetailPath(deal.id)} badgeStyles={badgeStyles} className="min-w-[180px] flex-shrink-0 snap-start min-[420px]:min-w-[210px] sm:min-w-[230px] md:min-w-[250px] lg:min-w-[260px] xl:min-w-0 xl:flex-[0_0_calc((100%-72px)/4)]" imageClassName="h-[220px] min-[420px]:h-[250px] sm:h-[300px] lg:h-[340px]" cardDataAttribute={{ name: "data-product-card", value: "true" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
