import { useMemo } from "react";
import { Queries } from "../Api";
import { ROUTES } from "../Constants";
import type { ProductAudience } from "../Types";
import { getAudienceProductCounts, normalizeProductList } from "../Pages/Products/productApiUtils";
import CategoryCard from "./CategoryCard";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

type CategoryHighlightConfig = {
  title: string;
  audience: ProductAudience;
  image: string;
  contentClass: string;
  imageWrapClass: string;
  imageClass?: string;
  imageAlignClass?: string;
  useImageAsBackground?: boolean;
};

const categories: CategoryHighlightConfig[] = [
  {title: "Women's Wear",audience: "women",image: assetUrl("assets/b-1.png"),contentClass: "max-w-none",imageWrapClass: "w-[58%]",imageClass: "scale-[2.025] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
  {title: "Kid's Wear",audience: "kids",image: assetUrl("assets/b-3.png"),contentClass: "max-w-none",imageWrapClass: "w-[52%]",imageClass: "scale-[1.1] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
  {title: "Men's Wear",audience: "men",image: assetUrl("assets/b-5.png"),contentClass: "max-w-none",imageWrapClass: "w-[52%]",imageClass: "scale-[1.08] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
];

export default function CategoryHighlights() {
  const { data } = Queries.useGetAllProducts();
  const apiProducts = useMemo(() => normalizeProductList(data), [data]);
  const audienceCounts = useMemo(() => getAudienceProductCounts(apiProducts), [apiProducts]);

  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="site-container pb-5 pt-3 sm:pb-10 sm:pt-4">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[2fr_1fr] lg:auto-rows-fr">
          {categories.map((item, index) => (
            <CategoryCard key={item.title} title={item.title} count={`${audienceCounts[item.audience] ?? 0} Items`} image={item.image} to={`${ROUTES.PRODUCTS}?audience=${item.audience}`} contentClass={item.contentClass} imageWrapClass={item.imageWrapClass} imageClass={item.imageClass} imageAlignClass={item.imageAlignClass} isLarge={index === 0} useImageAsBackground={item.useImageAsBackground}/>
          ))}
        </div>
      </div>
    </section>
  );
}
