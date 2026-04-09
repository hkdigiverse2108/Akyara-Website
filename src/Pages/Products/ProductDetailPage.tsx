import { Link, useParams } from "react-router-dom";
import { Queries } from "../../Api";
import { PageLoader, ProductImageGallery, ProductInfo, ProductTabs, RelatedProducts } from "../../Components";
import { ROUTES } from "../../Constants";
import {getProductById as getFallbackProductById,products as fallbackProducts,} from "./productData";
import {normalizeProductDetail,normalizeProductList,} from "./productApiUtils";
import {useProductDetailState,useProductDetailHandlers,} from "./ProductDetail/hooks";

const ProductDetailPage = () => {
  const { id } = useParams();

  const productDetailQuery = Queries.useGetProductById(id, !!id);
  const productsQuery = Queries.useGetAllProducts();

  const fallbackProduct = getFallbackProductById(id);
  const product = normalizeProductDetail(productDetailQuery.data,fallbackProduct);

  const catalog =
    normalizeProductList(productsQuery.data).length > 0? normalizeProductList(productsQuery.data): fallbackProducts;

  const state = useProductDetailState(product);
  const handlers = useProductDetailHandlers(product, state);

  if (productDetailQuery.isLoading && !fallbackProduct)
    return <PageLoader />;

  if (!product) return <div>Product not found</div>;

  const relatedProducts = catalog.filter((p) => p.id !== product.id).sort((a, b) =>  a.category === product.category? -1: b.category === product.category? 1: 0).slice(0, 4);

  return (
    <div className="bg-white pb-16 pt-8 overflow-x-hidden">
      <section className="site-container">
        <div className="mb-6 text-sm">
          <Link to={ROUTES.HOME}>Home</Link> /{" "}
          <Link to={ROUTES.PRODUCTS}>Products</Link> / {product.name}
        </div>

        <div className="grid gap-8 lg:grid-cols-[600px_1fr] xl:grid-cols-[640px_1fr] xl:gap-12">
          <ProductImageGallery product={product} selectedImage={state.selectedImage} setSelectedImage={state.setSelectedImage} isImageZoomed={state.isImageZoomed} setIsImageZoomed={state.setIsImageZoomed} zoomOrigin={state.zoomOrigin} handleImageMouseMove={handlers.handleImageMouseMove} resetImageZoom={handlers.resetImageZoom}/>

          <ProductInfo product={{ ...product, reviews: state.reviews.length }} selectedColor={state.selectedColor} setSelectedColor={state.setSelectedColor} selectedSize={state.selectedSize} setSelectedSize={state.setSelectedSize} quantity={state.quantity} handleAddToCart={handlers.handleAddToCart} handleWishlist={handlers.handleWishlist} handleQuantityChange={handlers.handleQuantityChange}/>
        </div>
      </section>

      <ProductTabs product={product} activeTab={state.activeTab} setActiveTab={state.setActiveTab} reviews={state.reviews} isReviewsLoading={state.isReviewsLoading} reviewForm={state.reviewForm} reviewFormMessage={state.reviewFormMessage} isReviewSubmitting={handlers.isReviewSubmitting} handleReviewFieldChange={handlers.handleReviewFieldChange} handleReviewRatingChange={handlers.handleReviewRatingChange} handleReviewSubmit={handlers.handleReviewSubmit}/>

      {!!relatedProducts.length && (
        <RelatedProducts relatedProducts={relatedProducts} relatedSliderRef={state.relatedSliderRef} scrollRelatedProducts={handlers.scrollRelatedProducts}/>
      )}
    </div>
  );
};

export default ProductDetailPage;
