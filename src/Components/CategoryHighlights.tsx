import CategoryCard from "./CategoryCard";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const categories = [
  {title: "Women's Wear",count: "3268 Items",image: assetUrl("assets/b-1.png"),contentClass: "max-w-none",imageWrapClass: "w-[58%]",imageClass: "scale-[2.025] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
  {title: "Kid's Wear",count: "8562 Items",image: assetUrl("assets/b-3.png"),contentClass: "max-w-none",imageWrapClass: "w-[52%]",imageClass: "scale-[1.1] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
  {title: "Men's Wear",count: "32 Items",image: assetUrl("assets/b-5.png"),contentClass: "max-w-none",imageWrapClass: "w-[52%]",imageClass: "scale-[1.08] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
];

export default function CategoryHighlights() {
  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="site-container pb-5 pt-3 sm:pb-10 sm:pt-4">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[2fr_1fr] lg:auto-rows-fr">
          {categories.map((item, index) => (
            <CategoryCard key={item.title} title={item.title} count={item.count} image={item.image} contentClass={item.contentClass} imageWrapClass={item.imageWrapClass} imageClass={item.imageClass} imageAlignClass={item.imageAlignClass} isLarge={index === 0} useImageAsBackground={item.useImageAsBackground}/>
          ))}
        </div>
      </div>
    </section>
  );
}
