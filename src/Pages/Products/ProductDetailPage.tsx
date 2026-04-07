import {
  FacebookFilled,
  HeartOutlined,
  InstagramOutlined,
  PinterestFilled,
  ShoppingCartOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Queries } from "../../Api";
import ProductCard from "../../Components/ProductCard";
import PageLoader from "../../Components/PageLoader";
import { ROUTES } from "../../Constants";
import type { ProductColor, ProductItem, ProductReview, ProductTab, ReviewFormValues } from "../../Types";
import { getToken } from "../../Utils";
import { badgeStyles, getProductById as getFallbackProductById, getProductDetailPath, products as fallbackProducts } from "./productData";
import { normalizeProductDetail, normalizeProductList } from "./productApiUtils";

const initialReviewEntries: ProductReview[] = [
  {
    id: "review-1",
    name: "Daniel Rajdesh",
    date: "30 Jul 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "DR",
    avatarBackground: "linear-gradient(135deg, #d8e6d4 0%, #8eb38a 100%)",
  },
  {
    id: "review-2",
    name: "Seema Gupta",
    date: "30 Aug 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "SG",
    avatarBackground: "linear-gradient(135deg, #f4d8dd 0%, #d7a0a9 100%)",
  },
  {
    id: "review-3",
    name: "Mark Jugermi",
    date: "10 Oct 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "MJ",
    avatarBackground: "linear-gradient(135deg, #d7e5f5 0%, #8fb4db 100%)",
  },
  {
    id: "review-4",
    name: "Meena Rajpoot",
    date: "17 Dec 2021",
    rating: 5,
    comment:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum.",
    avatarLabel: "MR",
    avatarBackground: "linear-gradient(135deg, #f7d9cb 0%, #dd9e80 100%)",
  },
];

const initialReviewFormValues: ReviewFormValues = {
  rating: 4,
  fullName: "",
  email: "",
  description: "",
};

const formatReviewDate = (value: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);

const getReviewInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const ProductDetailPage = () => {
  const { id } = useParams();
  const hasToken = Boolean(getToken());
  const productDetailQuery = Queries.useGetProductById(id, hasToken && !!id);
  const productsQuery = Queries.useGetAllProducts(undefined, hasToken);
  const fallbackProduct = getFallbackProductById(id);
  const product = normalizeProductDetail(productDetailQuery.data, fallbackProduct);
  const apiProducts = normalizeProductList(productsQuery.data);
  const catalogProducts = apiProducts.length > 0 ? apiProducts : fallbackProducts;

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<ProductTab>("description");
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviewEntries);
  const [reviewForm, setReviewForm] = useState<ReviewFormValues>(initialReviewFormValues);
  const [reviewFormMessage, setReviewFormMessage] = useState<string | null>(null);
  const relatedSliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!product) return;

    setSelectedImage(product.gallery[0] ?? product.image);
    setSelectedColor(product.colors[0]?.name ?? "");
    setSelectedSize(product.sizes[0] ?? "");
    setQuantity(1);
    setActiveTab("description");
    setReviews(initialReviewEntries);
    setReviewForm(initialReviewFormValues);
    setReviewFormMessage(null);
  }, [product]);

  useEffect(() => {
    setIsImageZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  }, [selectedImage]);

  const handleAddToCart = () => {
    if (!product) return;

    if ((product.colors.length > 0 && !selectedColor) || (product.sizes.length > 0 && !selectedSize)) {
      alert("Please select required product options");
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || product.image,
      color: selectedColor,
      size: selectedSize,
      quantity,
    };

    console.log("Add to cart:", cartItem);
  };

  const handleWishlist = () => {
    if (!product) return;

    const wishlistItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
    };

    console.log("Wishlist:", wishlistItem);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuantity = Math.trunc(event.target.valueAsNumber);

    if (Number.isNaN(nextQuantity) || nextQuantity < 1) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.min(nextQuantity, 99));
  };

  const handleReviewFieldChange = (
    field: Exclude<keyof ReviewFormValues, "rating">,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const nextValue = event.target.value;

    if (reviewFormMessage) {
      setReviewFormMessage(null);
    }

    setReviewForm((previous) => ({
      ...previous,
      [field]: nextValue,
    }));
  };

  const handleReviewRatingChange = (rating: number) => {
    if (reviewFormMessage) {
      setReviewFormMessage(null);
    }

    setReviewForm((previous) => ({
      ...previous,
      rating,
    }));
  };

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = reviewForm.fullName.trim();
    const email = reviewForm.email.trim();
    const description = reviewForm.description.trim();

    if (!fullName || !email || !description) {
      setReviewFormMessage("Please fill in your name, email, and review description.");
      return;
    }

    const newReview: ProductReview = {
      id: `review-${Date.now()}`,
      name: fullName,
      date: formatReviewDate(new Date()),
      rating: reviewForm.rating,
      comment: description,
      avatarLabel: getReviewInitials(fullName) || "R",
      avatarBackground: "linear-gradient(135deg, #dfe4ea 0%, #b9c3cf 100%)",
    };

    setReviews((previous) => [newReview, ...previous]);
    setReviewForm(initialReviewFormValues);
    setReviewFormMessage("Review submitted successfully.");
  };

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setZoomOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const resetImageZoom = () => {
    setIsImageZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const scrollRelatedProducts = (direction: 1 | -1) => {
    const container = relatedSliderRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-related-product-card='true']");
    const cardWidth = card?.offsetWidth ?? 260;
    const styles = window.getComputedStyle(container);
    const gapValue = parseFloat(styles.columnGap || styles.gap || "0");
    const scrollAmount = cardWidth + (Number.isFinite(gapValue) ? gapValue : 0);

    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };

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
  const pageContainerClass = "site-container";
  const productReferenceId = `#${product.sku.replace(/[^0-9]/g, "").padStart(7, "1").slice(-7)}`;
  const primaryColor = selectedColor || product.colors[0]?.name || "-";
  const sizeLabel = selectedSize || (product.sizes.length > 0 ? product.sizes.slice(0, 2).join(", ") : "-");
  const productWeight =
    product.category === "Jeans" ? "450 Gr" : product.category === "Shirts" ? "320 Gr" : "220 Gr";
  const additionalInfoRows = [
    { label: "ID", value: productReferenceId },
    { label: "SKU", value: product.sku },
    { label: "Color", value: primaryColor },
    { label: "Size", value: sizeLabel },
    { label: "Weight", value: productWeight },
  ];
  const reviewLabel = `${reviewForm.rating} Star${reviewForm.rating > 1 ? "s" : ""}`;
  const productRating = Math.max(0, Math.min(5, Math.round(product.rating || 0)));
  const reviewCount = product.reviews || reviews.length;
  const productDescription = product.longDescription || product.description;
  const descriptionParagraphs = productDescription
    .split(/\n+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const tabCopy: Record<ProductTab, ReactNode> = {
    description: (
      <div className="space-y-5">
        {(descriptionParagraphs.length > 0 ? descriptionParagraphs : [product.description]).map((paragraph, index) => (
          <p key={`${product.id}-description-${index}`}>{paragraph}</p>
        ))}
      </div>
    ),
    additional: (
      <div className="overflow-hidden border-y border-[#e9edf3]">
        {additionalInfoRows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(100px,160px)_1fr] items-center gap-5 border-b border-[#e9edf3] px-4 py-4 text-sm text-[#111827] last:border-b-0 sm:px-6"
          >
            <span className="font-semibold">{row.label}</span>
            <span className="text-[#374151]">{row.value}</span>
          </div>
        ))}
      </div>
    ),
    reviews: (
      <div className="space-y-12">
        <div className="overflow-hidden border-y border-[#edf1f5]">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col gap-5 border-b border-[#edf1f5] py-7 last:border-b-0 sm:py-8 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className="inline-flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                  style={{ background: review.avatarBackground }}
                >
                  {review.avatarLabel}
                </div>

                <div className="min-w-0">
                  <h3 className="text-[1.08rem] font-semibold text-[#111827]">{review.name}</h3>
                  <p className="mt-0.5 text-[0.88rem] text-[#8b96a8]">{review.date}</p>
                  <p className="mt-2.5 max-w-[920px] text-[0.98rem] leading-8 text-[#667085]">{review.comment}</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 text-[0.9rem] text-[#ff9f0a] lg:mt-1 lg:shrink-0">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarFilled key={`${review.id}-${index}`} className={index < review.rating ? "" : "opacity-20"} />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div>
          <h3 className="text-[1.9rem] font-semibold text-[#111827]">Submit Rating</h3>

          <form className="mt-6 space-y-6" onSubmit={handleReviewSubmit}>
            <div className="flex flex-col gap-3 rounded-[8px] bg-[#f5f7fb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 text-[1rem]">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starValue = index + 1;
                  const isActive = starValue <= reviewForm.rating;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => handleReviewRatingChange(starValue)}
                      className={`transition ${isActive ? "text-[#ff9f0a]" : "text-[#b7bec8] hover:text-[#ff9f0a]"}`}
                      aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                    >
                      {isActive ? <StarFilled /> : <StarOutlined />}
                    </button>
                  );
                })}
              </div>

              <span className="text-[0.98rem] font-medium text-[#111827]">{reviewLabel}</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[#111827]">
                <span>Full Name</span>
                <input
                  type="text"
                  value={reviewForm.fullName}
                  onChange={(event) => handleReviewFieldChange("fullName", event)}
                  className="h-14 w-full rounded-[6px] border border-[#d8dde6] bg-white px-4 text-[0.95rem] text-[#111827] outline-none transition focus:border-black"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-[#111827]">
                <span>Email Address</span>
                <input
                  type="email"
                  value={reviewForm.email}
                  onChange={(event) => handleReviewFieldChange("email", event)}
                  className="h-14 w-full rounded-[6px] border border-[#d8dde6] bg-white px-4 text-[0.95rem] text-[#111827] outline-none transition focus:border-black"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold text-[#111827]">
              <span>Description</span>
              <textarea
                rows={7}
                value={reviewForm.description}
                onChange={(event) => handleReviewFieldChange("description", event)}
                className="w-full resize-y rounded-[6px] border border-[#d8dde6] bg-white px-4 py-3 text-[0.95rem] leading-7 text-[#111827] outline-none transition focus:border-black"
              />
            </label>

            {reviewFormMessage ? (
              <p
                className={`rounded-[10px] px-4 py-3 text-sm ${
                  reviewFormMessage === "Review submitted successfully."
                    ? "bg-[#ecfff0] text-[#1b7f3a]"
                    : "bg-[#ffecec] text-[#e53935]"
                }`}
              >
                {reviewFormMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex h-[56px] items-center justify-center gap-3 rounded-[6px] bg-[#111111] px-8 text-[1rem] font-semibold text-white transition hover:bg-black"
            >
              Submit Review
              <span aria-hidden="true">&rarr;</span>
            </button>
          </form>
        </div>
      </div>
    ),
  };

  return (
    <div className="overflow-x-hidden bg-white pb-16 pt-8">
      <section className={pageContainerClass}>
        <div className="mb-6 text-sm">
          <Link to={ROUTES.HOME}>Home</Link> / <Link to={ROUTES.PRODUCTS}>Products</Link> / {product.name}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)] xl:gap-12">
          <div className="min-w-0 w-full max-w-[640px]">
            <div
              className="mx-auto flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[2px] p-4 sm:aspect-[5/6] sm:p-5"
              onMouseEnter={() => setIsImageZoomed(true)}
              onMouseMove={handleImageMouseMove}
              onMouseLeave={resetImageZoom}
            >
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="block h-full w-full object-contain transition duration-200 ease-out"
                style={{
                  transform: isImageZoomed ? "scale(1.45)" : "scale(1)",
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
              />
            </div>

            <div className="mt-3 grid grid-cols-6 gap-2">
              {product.gallery.map((img, index) => {
                const isActive = selectedImage === img;

                return (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`overflow-hidden rounded-[2px] border bg-white transition ${
                      isActive ? "border-[#111827]" : "border-[#eceef2] hover:border-[#c9d1dc]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-14 w-full object-contain sm:h-16"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 w-full max-w-[560px]">
            <p className="text-[0.82rem] font-medium text-[#7c6cff]">{product.categoryLabel}</p>

            <h1 className="mt-3 text-[1.7rem] font-semibold leading-tight text-[#050816] sm:text-[2.1rem]">
              {product.name}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.9rem] text-[#5f6774]">
              <span className="inline-flex items-center gap-0.5 text-[#f4a000]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarFilled key={index} className={index < productRating ? "" : "opacity-30"} />
                ))}
              </span>
              <span>({reviewCount} Reviews)</span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              {product.oldPrice ? (
                <span className="text-[1.6rem] font-medium text-[#6b7280] line-through">{product.oldPrice}</span>
              ) : null}
              <span className="text-[1.75rem] font-semibold text-[#ff3b30]">{product.price}</span>
              <span
                className={`inline-flex rounded-[4px] px-2.5 py-1 text-[0.88rem] font-medium ${
                  product.availability === "In Stock" ? "bg-[#28a745] text-white" : "bg-[#fff1d8] text-[#b26800]"
                }`}
              >
                {product.availability}
              </span>
            </div>

            <p className="mt-5 max-w-[500px] text-[0.92rem] leading-8 text-[#5f6774]">{product.description}</p>

            {product.colors.length > 0 ? (
              <div className="mt-7">
                <p className="text-[0.96rem] font-semibold text-[#111827]">Color:</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.colors.map((color: ProductColor) => {
                    const isActive = selectedColor === color.name;

                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${
                          isActive ? "border-[#111827]" : "border-[#d7deea]"
                        }`}
                        title={color.name}
                      >
                        <span
                          className="h-7 w-7 rounded-full border border-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                          style={{ backgroundColor: color.swatch }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {product.sizes.length > 0 ? (
              <div className="mt-7">
                <p className="text-[0.96rem] font-semibold text-[#111827]">Size:</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const isActive = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[42px] rounded-[4px] border px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                            ? "border-[#111827] bg-[#111827] text-white"
                            : "border-[#dbe2ed] bg-white text-[#1f2937] hover:border-[#111827]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-7 grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[150px_minmax(0,1fr)_204px]">
              <input
                type="number"
                min={1}
                max={99}
                step={1}
                inputMode="numeric"
                value={quantity}
                onChange={handleQuantityChange}
                aria-label="Quantity"
                className="h-16 w-full rounded-[4px] border border-[#dbe2ed] bg-white px-5 text-[1.02rem] font-medium text-[#111827] outline-none transition focus:border-[#111827]"
              />

              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-[4px] bg-[#1d1b1b] px-6 text-[1rem] font-semibold text-white transition hover:bg-black"
              >
                <ShoppingCartOutlined />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-[4px] bg-[#f1f4f8] px-5 text-[1rem] font-medium text-[#111827] transition hover:bg-[#e8edf3] sm:col-span-2 lg:col-span-1"
              >
                <HeartOutlined />
                Wishlist
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-[0.9rem] text-[#5f6774]">
              <span>Share:</span>
              {[
                { key: "instagram", icon: <InstagramOutlined /> },
                { key: "facebook", icon: <FacebookFilled /> },
                { key: "pinterest", icon: <PinterestFilled /> },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f5f7] text-[#6b7280] transition hover:bg-[#111827] hover:text-white"
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-[#eef1f5] pt-14">
        <div className={pageContainerClass}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b96a8] sm:gap-8">
            {([
              { key: "description", label: "Description" },
              { key: "additional", label: "Additional Information" },
              { key: "reviews", label: "Reviews" },
            ] as Array<{ key: ProductTab; label: string }>).map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`border-b pb-3 transition ${
                    isActive ? "border-[#111827] text-[#111827]" : "border-transparent text-[#8b96a8] hover:text-[#111827]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-[980px] text-sm leading-8 text-[#5f6774]">{tabCopy[activeTab]}</div>

          {relatedProducts.length > 0 ? (
            <>
              <div className="relative mt-16 text-center">
                <span
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-[62%] whitespace-nowrap text-[clamp(2.6rem,6vw,4.8rem)] font-semibold italic text-black/5 md:block"
                  aria-hidden="true"
                >
                  Similar Products
                </span>
                <h2 className="relative z-10 text-2xl font-semibold text-[#111827] sm:text-3xl">Matching Products</h2>
              </div>

              <div className="relative mt-10">
                <button
                  type="button"
                  className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-left-4"
                  aria-label="Scroll to previous products"
                  onClick={() => scrollRelatedProducts(-1)}
                >
                  <span aria-hidden="true">&larr;</span>
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-right-4"
                  aria-label="Scroll to next products"
                  onClick={() => scrollRelatedProducts(1)}
                >
                  <span aria-hidden="true">&rarr;</span>
                </button>

                <div
                  ref={relatedSliderRef}
                  className="hide-scrollbar flex gap-4 overflow-x-auto px-2 pb-6 scroll-smooth snap-x snap-mandatory sm:gap-6 sm:px-6 xl:px-0"
                >
                  {relatedProducts.map((item: ProductItem) => (
                    <ProductCard
                      key={item.id}
                      {...item}
                      href={getProductDetailPath(item.id)}
                      badgeStyles={badgeStyles}
                      className="min-w-[180px] flex-shrink-0 snap-start min-[420px]:min-w-[210px] sm:min-w-[230px] md:min-w-[250px] lg:min-w-[260px] xl:min-w-0 xl:flex-[0_0_calc((100%-72px)/4)]"
                      imageClassName="h-[220px] min-[420px]:h-[250px] sm:h-[300px] lg:h-[340px]"
                      favoriteIcon={<HeartOutlined />}
                      cardDataAttribute={{ name: "data-related-product-card", value: "true" }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
