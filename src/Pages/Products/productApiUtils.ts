import type {ProductApiResponse,ProductAudience,ProductCategory,ProductColor,ProductItem,ProductRecord,ProductRef,} from "../../Types";
import { getApiBaseUrl } from "../../Utils";

const assetUrl = (p: string) => `${import.meta.env.BASE_URL}${p}`;
const fallbackImage = assetUrl("assets/1.jpg");

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

const str = (v: unknown) =>
  typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";

const num = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? v : []);

const isId = (v: string) => /^[a-f0-9]{24}$/i.test(v);


const media = (v: unknown) => {
  const p = str(v);
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;

  const base = getApiBaseUrl();
  return p.startsWith("/") ? (base ? `${base}${p}` : p) : p;
};

const refLabel = (v: unknown) =>isObj(v)  ? str((v as ProductRef).name ||(v as ProductRef).title ||(v as ProductRef).label ||(v as ProductRef).value || (v as ProductRef)._id    )  : str(v);

const refColor = (v: unknown) =>isObj(v)  ? str((v as ProductRef).colorCode ||(v as ProductRef).hexCode || (v as ProductRef).hexColor)  : "";

const normalizeCategory = (v: string) => {
  const val = v.trim().toLowerCase();
  if (!val || isId(val)) return "Products";
  if (val.includes("t-shirt") || val.includes("t shirt") || val.includes("tee")) return "T-Shirts";
  if (val.includes("jean") || val.includes("denim")) return "Jeans";
  if (val.includes("shirt")) return "Shirts";
  return v.trim();
};

const normalizeAudienceText = (value: string) =>
  value
    .toLowerCase()
    .replace(/['`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const audienceMatchers: Array<{ audience: ProductAudience; regex: RegExp }> = [
  { audience: "kids", regex: /\b(kid|kids|child|children|toddler|toddlers|infant|infants|baby|babies|junior|juniors|boys|girls|youth)\b/ },
  { audience: "women", regex: /\b(women|womens|woman|ladies|lady|female|females)\b/ },
  { audience: "men", regex: /\b(men|mens|man|gents|gent|gentlemen|male|males)\b/ },
];

const currency = (v: unknown) => `Rs ${num(v).toLocaleString("en-IN")}`;

const swatch = (v: string, i: number) => /^#/.test(v)? v: ["#2d8f80", "#e06d42", "#5a7ec1", "#f3e089"][i % 4];

const colors = (v: unknown): ProductColor[] =>
  arr<string | ProductRef>(v).map((e, i) => {
    const label = refLabel(e);
    return {
      name: label && !isId(label) ? label : `Color ${i + 1}`,
      swatch: swatch(refColor(e) || label, i),
    };
  });

const sizes = (v: unknown) =>
  arr<string | ProductRef>(v).map((e, i) => {
    const label = refLabel(e);
    return label && !isId(label) ? label : `Size ${i + 1}`;
  });

const uniqueMedia = (...lists: unknown[][]) =>
  [...new Set(lists.flat().map(media).filter(Boolean))];

const normalizeSku = (values: unknown[]) =>
  values.map((entry) => str(entry)).find((entry) => entry && !isId(entry)) || "-";

export const normalizeProduct = (v: unknown): ProductItem | null => {
  if (!isObj(v)) return null;

  const r = v as ProductRecord;
  const id = str(r._id);
  if (!id) return null;

  const categoryCandidates = [
    refLabel(r.categoryId),
    str((r as any).categoryName),
    str((r as any).categoryLabel),
    refLabel((r as any).category),
  ];

  const categoryLabel = categoryCandidates.find((entry) => entry && !isId(entry)) || "Products";
  const category = normalizeCategory(categoryLabel);

  const gallery = uniqueMedia([r.thumbnail], arr<string>(r.images));
  const price = num(r.sellingPrice || r.mrp);
  const mrp = num(r.mrp);

  return {id,name: str(r.title) || "Untitled Product",category,categoryLabel,price: currency(price),oldPrice: mrp > price ? currency(mrp) : undefined,badge: r.isSale || r.isDealOfDay  ? "Sale"  : r.isTrending  ? "Best Seller"  : num(r.discount) > 0  ? "Hot"  : undefined,image: gallery[0] || fallbackImage,description: str(r.shortDescription || r.longDescription) || "No product description available.",longDescription: str(r.longDescription || r.shortDescription) || "No product description available.",sku: normalizeSku([r.sku, (r as any).skuCode, (r as any).SKU, (r as any).productSku, (r as any).productSKU, (r as any).productCode, (r as any).code]),rating: num(r.rating),reviews: 0,availability: r.isActive === false ? "Out of Stock" : "In Stock",colors: colors(r.colorIds),sizes: sizes(r.sizeIds),gallery: gallery.length ? gallery : [fallbackImage],};
};

export const normalizeProductList = (res?: ProductApiResponse) => {
  if (!isObj(res)) return [];

  const data = res.data;
  const list = arr<ProductRecord>(
    (data as any)?.product_data || (data as any)?.products || data
  );

  return list.map(normalizeProduct).filter(Boolean) as ProductItem[];
};
export const normalizeProductDetail = (res?: ProductApiResponse,fallback?: ProductItem | null) => {
  if (!isObj(res)) return fallback ?? null;

  const data = (res.data as any)?.product || res.data;
  return normalizeProduct(data) ?? fallback ?? null;
};

export const parseProductAudience = (value: unknown): ProductAudience | null => {
  const normalized = normalizeAudienceText(str(value));
  if (!normalized) return null;
  if (/\b(kid|kids|child|children|toddler|toddlers|infant|infants|baby|babies|junior|juniors|youth)\b/.test(normalized)) return "kids";
  if (/\b(women|womens|woman|ladies|lady|female|females)\b/.test(normalized)) return "women";
  if (/\b(men|mens|man|gents|gent|gentlemen|male|males)\b/.test(normalized)) return "men";
  return null;
};

export const detectProductAudience = (
  product: Pick<ProductItem, "name" | "category" | "categoryLabel">
): ProductAudience | null => {
  const value = normalizeAudienceText(
    [product.categoryLabel, product.category, product.name]
      .filter(Boolean)
      .join(" ")
  );
  if (!value) return null;
  return audienceMatchers.find((item) => item.regex.test(value))?.audience ?? null;
};

export const getAudienceProductCounts = (products: ProductItem[]) => {
  const counts: Record<ProductAudience, number> = { women: 0, men: 0, kids: 0 };
  products.forEach((product) => {
    const audience = detectProductAudience(product);
    if (audience) counts[audience] += 1;
  });
  return counts;
};

export const filterProductsByCategory = (products: ProductItem[],category: ProductCategory) =>
  category === "All" ? products : products.filter((p) => normalizeCategory(p.category) === category);

export const filterProductsByAudience = (
  products: ProductItem[],
  audience?: ProductAudience | null
) => (audience ? products.filter((product) => detectProductAudience(product) === audience) : products);
