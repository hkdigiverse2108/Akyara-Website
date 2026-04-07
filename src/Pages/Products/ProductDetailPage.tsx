import { Link, useParams } from "react-router-dom";
import { Queries } from "../../Api";
import PageLoader from "../../Components/PageLoader";
import { ROUTES } from "../../Constants";
import { getToken } from "../../Utils";
import { getProductById as getFallbackProductById, products as fallbackProducts } from "./productData";
import { normalizeProductDetail, normalizeProductList } from "./productApiUtils";
import { useProductDetailState, useProductDetailHandlers } from "./ProductDetail/hooks";
import { ProductImageGallery, ProductInfo, ProductTabs, RelatedProducts } from "../../Components/Product";

const ProductDetailPage = () => {
  const { id } = useParams();
  const hasToken = Boolean(getToken());
  const productDetailQuery = Queries.useGetProductById(id, hasToken && !!id);
  const productsQuery = Queries.useGetAllProducts(undefined, hasToken);
  const fallbackProduct = getFallbackProductById(id);
  const product = normalizeProductDetail(productDetailQuery.data, fallbackProduct);
  const apiProducts = normalizeProductList(productsQuery.data);
  const catalogProducts = apiProducts.length > 0 ? apiProducts : fallbackProducts;

  const state = useProductDetailState(product);
  const handlers = useProductDetailHandlers(product, state);

  if (productDetailQuery.isLoading && !fallbackProduct) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="bg-[#f7f4ef] pb-16 pt-8 sm:pt-10 lg:pb-24">
        <section className="site-container">
          <div className="grid min-h-[320px] place-items-center rounded-[18px] border border-dashed border-[#d8dee7] bg-white p-6 text-center shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#ef6b4a]">Product</p>
              <h1 className="mt-3 text-2xl font-semibold text-[#0f172a]">Product not found</h1>
              <p className="mt-2 text-sm leading-7 text-[#64748b]">
                This product could not be loaded from the catalog right now.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const matchingProducts = catalogProducts.filter((item) => item.id !== product.id && item.category === product.category);
  const fillerProducts = catalogProducts.filter(
    (item) => item.id !== product.id && !matchingProducts.some((match) => match.id === item.id),
  );
  const relatedProducts = [...matchingProducts, ...fillerProducts].slice(0, 4);

  return (
    <div className="overflow-x-hidden bg-white pb-16 pt-8">
      <section className="site-container">
        <div className="mb-6 text-sm">
          <Link to={ROUTES.HOME}>Home</Link> / <Link to={ROUTES.PRODUCTS}>Products</Link> / {product.name}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)] xl:gap-12">
          <ProductImageGallery product={product} selectedImage={state.selectedImage} setSelectedImage={state.setSelectedImage} isImageZoomed={state.isImageZoomed} setIsImageZoomed={state.setIsImageZoomed} zoomOrigin={state.zoomOrigin} handleImageMouseMove={handlers.handleImageMouseMove} resetImageZoom={handlers.resetImageZoom}/>

          <ProductInfo product={product} selectedColor={state.selectedColor} setSelectedColor={state.setSelectedColor} selectedSize={state.selectedSize} setSelectedSize={state.setSelectedSize} quantity={state.quantity} handleAddToCart={handlers.handleAddToCart} handleWishlist={handlers.handleWishlist} handleQuantityChange={handlers.handleQuantityChange}
          />
        </div>
      </section>
        <ProductTabs product={product} activeTab={state.activeTab} setActiveTab={state.setActiveTab} reviews={state.reviews} reviewForm={state.reviewForm} reviewFormMessage={state.reviewFormMessage} handleReviewFieldChange={handlers.handleReviewFieldChange} handleReviewRatingChange={handlers.handleReviewRatingChange} handleReviewSubmit={handlers.handleReviewSubmit}/>

      {relatedProducts.length > 0 && (
        <RelatedProducts
          relatedProducts={relatedProducts}
          relatedSliderRef={state.relatedSliderRef}
          scrollRelatedProducts={handlers.scrollRelatedProducts}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
