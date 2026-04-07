import type {ProductApiResponse,ProductCategory,ProductColor,ProductItem,ProductRecord,ProductRef,} from "../../Types";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const fallbackImage = assetUrl("assets/1.jpg");

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const toString = (value: unknown): string =>
  typeof value === "string"? value.trim(): typeof value === "number"  ? String(value)  : "";

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const isObjectIdLike = (value: string) => /^[a-f0-9]{24}$/i.test(value.trim());

const resolveMediaUrl = (value: unknown) => {
  const mediaPath = toString(value);
  if (!mediaPath) return "";
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const apiBase = toString(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, "");
  if (mediaPath.startsWith("/")) return apiBase ? `${apiBase}${mediaPath}` : mediaPath;
  
  return mediaPath;
};

const getRefLabel = (value: unknown) => {
  if (!isObject(value)) return toString(value);
  const refValue = value as ProductRef;
  return (toString(refValue.name) ||toString(refValue.title) ||toString(refValue.label) ||toString(refValue.categoryName) ||toString(refValue.value) ||toString(refValue._id));
};

const getRefColor = (value: unknown) => {
  if (!isObject(value)) return "";

  const refValue = value as ProductRef;
  return (toString(refValue.colorCode) ||toString(refValue.colourCode) ||toString(refValue.hexCode) ||toString(refValue.hexColor));
};

const normalizeProductCategory = (value: string): string => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "Products";
  if (normalized.includes("t-shirt") || normalized.includes("t shirt") || normalized.includes("tee")) return "T-Shirts";
  if (normalized.includes("jean") || normalized.includes("denim")) {
    return "Jeans";
  }
  if (normalized.includes("shirt")) {
    return "Shirts";
  }
  return value.trim();
};

const toCurrency = (value: unknown) => `Rs ${toNumber(value).toLocaleString("en-IN")}`;

const getColorSwatch = (value: string, index: number) => {
  const normalized = value.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized)) {
    return normalized;
  }

  const fallbacks = ["#2d8f80", "#e06d42", "#5a7ec1", "#f3e089", "#c084fc", "#111827"];
  return fallbacks[index % fallbacks.length];
};

const toProductColors = (value: unknown): ProductColor[] =>
  toArray<string | ProductRef>(value)
    .map((entry, index) => {
      const label = getRefLabel(entry);
      const safeLabel = label && !isObjectIdLike(label) ? label : `Color ${index + 1}`;
      return {name: safeLabel,swatch: getColorSwatch(getRefColor(entry) || label, index),
      };
    })
    .filter((entry) => Boolean(entry.name));

const toProductSizes = (value: unknown): string[] =>
  toArray<string | ProductRef>(value)
    .map((entry, index) => {
      const label = getRefLabel(entry);
      return label && !isObjectIdLike(label) ? label : `Size ${index + 1}`;
    })
    .filter(Boolean);

const toUniqueMedia = (...collections: unknown[][]) =>
  [...new Set(collections.flat().map((entry) => resolveMediaUrl(entry)).filter(Boolean))];

export const normalizeProduct = (value: unknown): ProductItem | null => {
  if (!isObject(value)) return null;

  const raw = value as ProductRecord;
  const id = toString(raw._id);
  if (!id) return null;

  const categorySource = getRefLabel(raw.categoryId);
  const category = normalizeProductCategory(categorySource);
  const gallery = toUniqueMedia([raw.thumbnail], toArray<string>(raw.images));
  const sellingPrice = toNumber(raw.sellingPrice || raw.mrp);
  const mrp = toNumber(raw.mrp);
  const badge = raw.isDealOfDay? "Sale": raw.isTrending  ? "Best Seller"  : raw.isOurTrendingProduct    ? "Editor Pick"    : toNumber(raw.discount) > 0      ? "Hot"      : undefined;
  return {id,name: toString(raw.title) || "Untitled Product",category,categoryLabel: categorySource || category,price: toCurrency(sellingPrice),oldPrice: mrp > sellingPrice ? toCurrency(mrp) : undefined,badge,image: gallery[0] || fallbackImage,description: toString(raw.shortDescription) || toString(raw.longDescription) || "No product description available.",longDescription: toString(raw.longDescription) || toString(raw.shortDescription) || "No product description available.",sku: toString(raw.sku) || id,rating: toNumber(raw.rating),reviews: 0,availability: raw.isActive === false ? "Out of Stock" : "In Stock",colors: toProductColors(raw.colorIds),sizes: toProductSizes(raw.sizeIds),gallery: gallery.length > 0 ? gallery : [fallbackImage],};
};

export const normalizeProductList = (response?: ProductApiResponse): ProductItem[] => {
  if (!isObject(response)) return [];

  const data = response.data;
  const dataObject = isObject(data) ? (data as Record<string, unknown>) : null;
  const list = toArray<ProductRecord>(dataObject?.product_data ?? dataObject?.products ?? data);

  return list
    .map((entry) => normalizeProduct(entry))
    .filter((entry): entry is ProductItem => Boolean(entry));
};

export const normalizeProductDetail = (
  response?: ProductApiResponse,
  fallback?: ProductItem | null
): ProductItem | null => {
  if (!isObject(response)) return fallback ?? null;

  const data = response.data;
  const dataObject = isObject(data) ? (data as Record<string, unknown>) : null;
  const candidate = dataObject?.product ?? data;
  return normalizeProduct(candidate) ?? fallback ?? null;
};

export const filterProductsByCategory = (
  products: ProductItem[],
  category: ProductCategory
) => {
  if (category === "All") return products;
  return products.filter((product) => normalizeProductCategory(product.category) === category);
};
