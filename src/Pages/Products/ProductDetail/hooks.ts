import { message } from "antd";
import {useEffect,useRef,useState,type ChangeEvent,type FormEvent,type MouseEvent,} from "react";
import { useNavigate } from "react-router-dom";
import type {ProductItem,ProductReview,ProductTab,ReviewFormValues,} from "../../../Types";
import { addToCart, addToWishlist } from "../../../Utils/commerceStorage";
import {initialReviewEntries,initialReviewFormValues,} from "./constants";
import { formatReviewDate, getReviewInitials } from "./utils";

export const useProductDetailState = (product: ProductItem | null) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<ProductTab>("description");
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviewEntries);
  const [reviewForm, setReviewForm] = useState(initialReviewFormValues);
  const [reviewFormMessage, setReviewFormMessage] = useState<string | null>(null);
  const relatedSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;

    setSelectedImage(product.gallery?.[0] || product.image);
    setSelectedColor(product.colors?.[0]?.name || "");
    setSelectedSize(product.sizes?.[0] || "");
    setQuantity(1);
    setActiveTab("description");
    setReviews(initialReviewEntries);
    setReviewForm(initialReviewFormValues);
    setReviewFormMessage(null);
  }, [product?.id]);

  useEffect(() => {
    setIsImageZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  }, [selectedImage]);

  return {selectedImage,setSelectedImage,selectedColor,setSelectedColor,selectedSize,setSelectedSize,quantity,setQuantity,isImageZoomed,setIsImageZoomed,zoomOrigin,setZoomOrigin,activeTab,setActiveTab,reviews,setReviews,reviewForm,setReviewForm,reviewFormMessage,setReviewFormMessage,relatedSliderRef,};
};

export const useProductDetailHandlers = (product: ProductItem | null,state: ReturnType<typeof useProductDetailState>) => {
  const {selectedColor,selectedSize,selectedImage,quantity,setQuantity,setReviewForm,setReviewFormMessage,setReviews,setIsImageZoomed,setZoomOrigin,relatedSliderRef,reviewForm,reviewFormMessage,} = state;

  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!product) return;

    if (
      (product.colors.length && !selectedColor) ||
      (product.sizes.length && !selectedSize)
    ) {
      return message.warning("Please select required options");
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage || product.image,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });

    message.success("Added to cart");
  };

  const handleWishlist = () => {
    if (!product) return;

    const added = addToWishlist(product);

    message[added ? "success" : "info"](
      added ? "Added to wishlist" : "Already in wishlist"
    );
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Math.trunc(e.target.valueAsNumber);
    setQuantity(!v || v < 1 ? 1 : Math.min(v, 99));
  };

  const handleReviewFieldChange = (
    field: Exclude<keyof ReviewFormValues, "rating">,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (reviewFormMessage) setReviewFormMessage(null);
    setReviewForm((p) => ({ ...p, [field]: e.target.value }));
  };


  const handleReviewRatingChange = (rating: number) => {
    if (reviewFormMessage) setReviewFormMessage(null);
    setReviewForm((p) => ({ ...p, rating }));
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { fullName, email, description, rating } = reviewForm;

    if (!fullName.trim() || !email.trim() || !description.trim()) {
      return setReviewFormMessage("Please fill all fields.");
    }

    const newReview: ProductReview = {id: `review-${Date.now()}`,name: fullName.trim(),date: formatReviewDate(new Date()),rating,comment: description.trim(),avatarLabel: getReviewInitials(fullName) || "R",avatarBackground: "linear-gradient(135deg,#dfe4ea,#b9c3cf)",};

    setReviews((p) => [newReview, ...p]);
    setReviewForm(initialReviewFormValues);
    setReviewFormMessage("Review submitted successfully.");
  };
  const handleImageMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 100;
    const y = ((e.clientY - b.top) / b.height) * 100;

    setZoomOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const resetImageZoom = () => {
    setIsImageZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const scrollRelatedProducts = (dir: 1 | -1) => {
    const el = relatedSliderRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>(
      "[data-related-product-card='true']"
    );
    const width = (card?.offsetWidth || 260) +
      parseFloat(getComputedStyle(el).gap || "0");

    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  /* 🔹 NAVIGATE */
  const handleRelatedProductClick = (p: ProductItem) => {
    navigate(`/products/${p.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    handleAddToCart,
    handleWishlist,
    handleQuantityChange,
    handleReviewFieldChange,
    handleReviewRatingChange,
    handleReviewSubmit,
    handleImageMouseMove,
    resetImageZoom,
    scrollRelatedProducts,
    handleRelatedProductClick,
  };
};