import { Queries } from "../../Api";
import { ProductCard, PageLoader, EmptyState } from "../../Components";
import type { ProductCategory } from "../../Types";
import { badgeStyles, getProductDetailPath, getProductsByCategory as getFallbackProductsByCategory } from "./productData";
import { filterProductsByCategory, normalizeProductList } from "./productApiUtils";

type ProductsPageProps = {
  initialCategory?: ProductCategory;
};

const ProductsPage = ({ initialCategory = "All" }: ProductsPageProps) => {
  const { data, isLoading } = Queries.useGetAllProducts();
  const apiProducts = normalizeProductList(data);
  const visibleProducts = apiProducts.length > 0
    ? filterProductsByCategory(apiProducts, initialCategory)
    : getFallbackProductsByCategory(initialCategory);

  if (isLoading && apiProducts.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="bg-[#f7f4ef] pb-16 pt-8 sm:pt-10 lg:pb-24">
      <section className="site-container">
        {visibleProducts.length === 0 ? (
          <div className="bg-white rounded-[18px] border border-gray-100 shadow-sm overflow-hidden">
             <EmptyState 
              title="No products found"
              description="Products will appear here as soon as they are available in your catalog."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} {...product} href={getProductDetailPath(product.id)} badgeStyles={badgeStyles}/>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
