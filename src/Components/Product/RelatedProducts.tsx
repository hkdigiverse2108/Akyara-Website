import type { RefObject } from "react";
import type { ProductItem } from "../../Types";
import ProductCard from "./ProductCard";

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-[#111827]",
  New: "bg-[#0f9d58]",
  Hot: "bg-[#ef6b4a]",
  Sale: "bg-[#c62828]",
  "Editor Pick": "bg-[#7c3aed]",
};

interface RelatedProductsProps {
  relatedProducts: ProductItem[];
  relatedSliderRef?: RefObject<HTMLDivElement | null>;
  scrollRelatedProducts?: (direction: 1 | -1) => void;
}

export const RelatedProducts = ({
  relatedProducts,
  relatedSliderRef,
  scrollRelatedProducts,
}: RelatedProductsProps) => {
  return (
    <section className="mt-16 border-t border-[#eef1f5] pt-14">
      <div className="site-container">
        <div className="sec_title relative text-center">
          <h2 className="off_title pointer-events-none absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 whitespace-nowrap text-[clamp(2.6rem,6vw,4.5rem)] font-semibold italic leading-none text-black/10 md:block">
            Similar Products
          </h2>
          <h3 className="ft-bold relative z-10 pt-2 font-display text-2xl font-semibold sm:pt-10 sm:text-3xl">
            Matching Products
          </h3>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-left-4"
            aria-label="Scroll to previous matching products"
            onClick={() => scrollRelatedProducts?.(-1)}
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-right-4"
            aria-label="Scroll to next matching products"
            onClick={() => scrollRelatedProducts?.(1)}
          >
            <span aria-hidden="true">&rarr;</span>
          </button>

          <div
            ref={relatedSliderRef}
            className="hide-scrollbar flex gap-4 overflow-x-auto px-2 pb-6 scroll-smooth snap-x snap-mandatory sm:gap-6 sm:px-6 xl:px-0"
          >
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                href={`/products/${product.id}`}
                badgeStyles={badgeStyles}
                className="min-w-[180px] flex-shrink-0 snap-start min-[420px]:min-w-[210px] sm:min-w-[230px] md:min-w-[250px] lg:min-w-[260px] xl:min-w-0 xl:flex-[0_0_calc((100%-72px)/4)]"
                imageClassName="h-[220px] min-[420px]:h-[250px] sm:h-[300px] lg:h-[340px]"
                cardDataAttribute={{ name: "data-related-product-card", value: "true" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
