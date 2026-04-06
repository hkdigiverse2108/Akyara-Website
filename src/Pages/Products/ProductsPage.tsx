import ProductCard from "../../Components/ProductCard";
import type { ProductCategory } from "../../Types";
import { badgeStyles, getProductDetailPath, getProductsByCategory, } from "./productData";

type ProductsPageProps = {
  initialCategory?: ProductCategory;
};

const ProductsPage = ({ initialCategory = "All" }: ProductsPageProps) => {
  const visibleProducts = getProductsByCategory(initialCategory);

  return (
    <div className="bg-[#f7f4ef] pb-16 pt-8 sm:pt-10 lg:pb-24">
      <section className="site-container">
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              href={getProductDetailPath(product.id)}
              badgeStyles={badgeStyles}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
