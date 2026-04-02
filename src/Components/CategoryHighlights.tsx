import CategoryCard from "./CategoryCard";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const categories = [
  {title: "Women's Wear",count: "3268 Items",image: assetUrl("assets/b-1.png"),background: "from-[#d3ecf1] via-[#d3ecf1] to-[#d3ecf1]",contentClass: "max-w-none",imageWrapClass: "w-[60%]",imageClass: "scale-[2.025] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
  {title: "Kid's Wear",count: "8562 Items",image: assetUrl("assets/b-3.png"),background: "from-[#f2eae7] via-[#f2eae7] to-[#f2eae7]",contentClass: "max-w-none",imageWrapClass: "w-[55%]",imageClass: "scale-[1.1] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
  {title: "Men's Wear",count: "32 Items",image: assetUrl("assets/b-5.png"),background: "from-[#ede8e1] via-[#ede8e1] to-[#ede8e1]",contentClass: "max-w-none",imageWrapClass: "w-[55%]",imageClass: "scale-[1.08] object-bottom",imageAlignClass: "items-end",useImageAsBackground: true,},
];

export default function CategoryHighlights() {
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1400px] pb-8 pt-4 sm:pb-12 sm:pt-5">
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[2fr_1fr] lg:auto-rows-fr">
          {categories.map((item, index) => (
            <CategoryCard key={item.title} title={item.title} count={item.count} image={item.image} background={item.background} contentClass={item.contentClass} imageWrapClass={item.imageWrapClass} imageClass={item.imageClass} imageAlignClass={item.imageAlignClass} isLarge={index === 0} useImageAsBackground={item.useImageAsBackground}/>
          ))}
        </div>
      </div>
    </section>
  );
}
