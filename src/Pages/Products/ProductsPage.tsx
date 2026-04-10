import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { Queries } from "../../Api";
import { ProductCard, PageLoader, EmptyState } from "../../Components";
import type { ProductCategory } from "../../Types";
import { badgeStyles, getProductDetailPath, getProductsByCategory as getFallbackProductsByCategory } from "./productData";
import { filterProductsByAudience, normalizeProductList, parseProductAudience } from "./productApiUtils";

type ProductsPageProps = {
  initialCategory?: ProductCategory;
};

const ProductsPage = ({ initialCategory = "All" }: ProductsPageProps) => {
  const [searchParams] = useSearchParams();
  const audienceFilter = parseProductAudience(searchParams.get("audience"));
  const isSaleFilter = searchParams.get("sale") === "true";
  const isTrendingFilter = searchParams.get("trending") === "true";
  const searchQuery = searchParams.get("search");
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filterParams: Record<string, any> = { page: currentPage, limit: pageSize };
  if (isSaleFilter) filterParams.isSale = true;
  if (isTrendingFilter) filterParams.isTrending = true;
  if (searchQuery) filterParams.search = searchQuery;
  if (initialCategory !== "All") filterParams.category = initialCategory;

  const { data, isLoading } = Queries.useGetAllProducts(Object.keys(filterParams).length > 0 ? filterParams : undefined);
  const apiProducts = useMemo(() => normalizeProductList(data), [data]);
  const totalProducts = (data?.data as any)?.totalData || apiProducts.length;
  
  const productsByCategory = data 
    ? apiProducts // Backend already filtered by category!
    : getFallbackProductsByCategory(initialCategory);
    
  const searchedProducts = searchQuery && !data
    ? productsByCategory.filter(p => [p.name, p.description].join(' ').toLowerCase().includes(searchQuery.toLowerCase()))
    : productsByCategory;

  const visibleProducts = filterProductsByAudience(searchedProducts, audienceFilter);
  const audienceLabel =
    audienceFilter === "women"? "Women's Wear": audienceFilter === "men"? "Men's Wear": audienceFilter === "kids"? "Kid's Wear": "";

  if (isLoading && apiProducts.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="bg-white pb-16 pt-8 sm:pt-10 lg:pb-24">
      <section className="site-container">
        {visibleProducts.length === 0 ? (
          <div className="bg-white rounded-[18px] border border-gray-100 shadow-sm overflow-hidden">
             <EmptyState 
              title="No products found"
              description={
                audienceLabel? `Products for ${audienceLabel} will appear here as soon as they are available in your catalog.`: "Products will appear here as soon as they are available in your catalog."
              }
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} {...product} href={getProductDetailPath(product.id)} badgeStyles={badgeStyles}/>
              ))}
            </div>
            
            {totalProducts > pageSize && (
               <div className="mt-12 flex justify-center">
                 <Pagination 
                   current={currentPage} 
                   pageSize={pageSize} 
                   total={totalProducts} 
                   onChange={(page) => {
                     setCurrentPage(page);
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }} 
                   showSizeChanger={false}
                 />
               </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
