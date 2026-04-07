import { Queries } from "../../Api";
import {ProductCard} from "../../Components/Product";
import PageLoader from "../../Components/PageLoader";
import type { ProductCategory } from "../../Types";
import { getToken } from "../../Utils";
import { badgeStyles, getProductDetailPath, getProductsByCategory as getFallbackProductsByCategory } from "./productData";
import { filterProductsByCategory, normalizeProductList } from "./productApiUtils";

type ProductsPageProps = {
  initialCategory?: ProductCategory;
};

const ProductsPage = ({ initialCategory = "All" }: ProductsPageProps) => {
  const hasToken = Boolean(getToken());
  const { data, isLoading } = Queries.useGetAllProducts(undefined, hasToken);
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
          <div className="grid min-h-[280px] place-items-center rounded-[18px] border border-dashed border-[#d8dee7] bg-white p-6 text-center shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#ef6b4a]">Products</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0f172a]">No products found</h2>
              <p className="mt-2 text-sm leading-7 text-[#64748b]">
                Products will appear here as soon as they are available in your catalog.
              </p>
            </div>
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
