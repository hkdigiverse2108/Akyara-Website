import { message } from "antd";
import {useEffect,useMemo,useRef,useState,type ChangeEvent,type FormEvent,type MouseEvent,} from "react";
import { useNavigate } from "react-router-dom";
import { Mutations, Queries } from "../../../Api";
import { ROUTES } from "../../../Constants";
import type {ProductItem,ProductReview,ProductTab,ReviewFormValues,ReviewRecord,} from "../../../Types";
import { getToken } from "../../../Utils";
import { useWishlist } from "../../../Hooks/useWishlist";
import { useCart } from "../../../Hooks/useCart";
import {initialReviewEntries,initialReviewFormValues,} from "./constants";
import { formatReviewDate, getReviewInitials } from "./utils";

const isObjectId = (v?: string) => /^[a-f0-9]{24}$/i.test(v ?? "");

const clamp = (n: unknown) =>
  Math.max(1, Math.min(5, Math.round(Number(n) || 5)));

const gradients = ["linear-gradient(135deg,#d8e6d4,#8eb38a)","linear-gradient(135deg,#f4d8dd,#d7a0a9)","linear-gradient(135deg,#d7e5f5,#8fb4db)","linear-gradient(135deg,#f7d9cb,#dd9e80)","linear-gradient(135deg,#efe7ff,#b8a2ff)","linear-gradient(135deg,#e6f7ff,#7cc6ff)",];

const pickGradient = (seed: string) =>gradients[  [...(seed || "r")].reduce((a, c) => a + c.charCodeAt(0), 0) %    gradients.length];

const normalizeReviews = (data: unknown,productId: string
): ProductReview[] => {
  const list = Array.isArray((data as any)?.data)? (data as any).data: Array.isArray(data)? data: [];

  return list.filter((r: ReviewRecord) => {  const id =    typeof r.productId === "string"      ? r.productId      : (r.productId as any)?._id;  return !id || id === productId;}).map((r: ReviewRecord, i: number) => {  const name = (r.personName || "Anonymous").trim();  const date = new Date(r.createdAt || Date.now());
    return {id: r._id || `r-${i}`,name,date: formatReviewDate(date),rating: clamp(r.rating),comment: r.description || "",avatarLabel: getReviewInitials(name) || "R",avatarBackground: pickGradient(r._id || name),};
    });
};

export const useProductDetailState = (product: ProductItem | null) => {
  const [state, setState] = useState({image: "",color: "",size: "",qty: 1,zoom: false,zoomOrigin: { x: 50, y: 50 },tab: "description" as ProductTab,form: initialReviewFormValues,msg: null as string | null,});

  const sliderRef = useRef<HTMLDivElement>(null);

  const token = getToken();
  const productId = isObjectId(product?.id) ? product?.id : "";
  const canFetch = !!token && !!productId;

  const reviewQuery = Queries.useGetAllReviews(canFetch);

  const reviews = useMemo(() => canFetch? normalizeReviews(reviewQuery.data, productId): initialReviewEntries,[reviewQuery.data, productId]);

  useEffect(() => {
    if (!product) return;

    setState((p) => ({...p,image: product.gallery?.[0] || product.image,color: product.colors?.[0]?.name || "",size: product.sizes?.[0] || "",qty: 1,tab: "description",form: initialReviewFormValues,msg: null,}));
  }, [product?.id]);

  return {
    selectedImage: state.image,setSelectedImage: (v: string) =>setState((p) => ({ ...p, image: v })),
    selectedColor: state.color,setSelectedColor: (v: string) => setState((p) => ({ ...p, color: v })),
    selectedSize: state.size,setSelectedSize: (v: string) =>setState((p) => ({ ...p, size: v })),
    quantity: state.qty,setQuantity: (v: number) =>setState((p) => ({ ...p, qty: v })),
    isImageZoomed: state.zoom,setIsImageZoomed: (v: boolean) =>setState((p) => ({ ...p, zoom: v })),zoomOrigin: state.zoomOrigin,
    activeTab: state.tab,setActiveTab: (v: ProductTab) =>setState((p) => ({ ...p, tab: v })),
    reviewForm: state.form,setReviewForm: (v: ReviewFormValues) =>setState((p) => ({ ...p, form: v })),
    reviewFormMessage: state.msg,setReviewFormMessage: (v: string | null) =>setState((p) => ({ ...p, msg: v })),
    relatedSliderRef: sliderRef,
    reviews,
    isReviewsLoading: canFetch && reviewQuery.isLoading,
    setState,
  };
};

/* ------------------ HANDLERS ------------------ */
export const useProductDetailHandlers = (product: ProductItem | null,state: ReturnType<typeof useProductDetailState>) => {
  const {setState,selectedColor,selectedSize,selectedImage,quantity,reviewForm,reviewFormMessage,relatedSliderRef,} = state;
  const navigate = useNavigate();
  const addReview = Mutations.useAddReview();
  const { toggleWishlist, wishlistMap } = useWishlist();
  const update = (data: any) =>setState((p: any) => ({ ...p, ...data }));

  const { toggleCart } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;

    if (
      (product.colors.length && !selectedColor) ||
      (product.sizes.length && !selectedSize)
    )
      return message.warning("Select required options");

    await toggleCart(
      { ...product, id: product.id, image: selectedImage || product.image },
      quantity
    );
  };

  const handleWishlist = async () => {
    if (!product) return;
    await toggleWishlist(product);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) =>
    update({qty: Math.max(  1,  Math.min(99, e.target.valueAsNumber || 1)),
    });

  const handleReviewFieldChange = (field: any, e: any) => {
    if (reviewFormMessage) update({ msg: null });
    update({ form: { ...reviewForm, [field]: e.target.value } });
  };

  const handleReviewRatingChange = (rating: number) =>
    update({ form: { ...reviewForm, rating } });

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!getToken()) {
      navigate(ROUTES.AUTH.SIGNIN);
      return update({ msg: "Login required" });
    }

    const productId = isObjectId(product?.id) ? product?.id : "";
    if (!productId) return update({ msg: "Invalid product" });

    const { fullName, email, description, rating } = reviewForm;

    if (!fullName || !email || !description)
      return update({ msg: "Fill all fields" });

    try {
      await addReview.mutateAsync({productId,personName: fullName,email,description,rating,});

      update({form: initialReviewFormValues,msg: "Review added",});
    } catch (e: any) {
      update({ msg: e.message || "Error" });
    }
  };

  const handleImageMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    update({zoomOrigin: {x: ((e.clientX - b.left) / b.width) * 100,y: ((e.clientY - b.top) / b.height) * 100,},});
  };

  const resetImageZoom = () =>
    update({ zoom: false, zoomOrigin: { x: 50, y: 50 } });

  const scrollRelatedProducts = (dir: 1 | -1) => {
    const el = relatedSliderRef.current;
    if (!el) return;

    const card = el.querySelector("[data-related-product-card]");
    const w = (card as HTMLElement)?.offsetWidth || 260;

    el.scrollBy({ left: dir * w, behavior: "smooth" });
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
    isReviewSubmitting: addReview.isPending,
    isWished: !!product && wishlistMap.has(product.id),
  };
};