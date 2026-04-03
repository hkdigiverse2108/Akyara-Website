import { ROUTES, URL_KEYS } from "../../Constants";
import type { BlogCategoryRef, BlogItem } from "../../Types";

type Rec = Record<string, unknown>;

const KEYS = ["data", "docs", "items", "rows", "results", "records", "blogs"] as const;
const QUERY_KEYS = ["image", "fileName", "filename", "path", "key", "thumbnail", "name"] as const;

const isObj = (v: unknown): v is Rec => v !== null && typeof v === "object";
const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
const arr = (v: unknown): string[] => {
  if (!Array.isArray(v)) return [];
  return v.reduce<string[]>((acc, item) => {const normalized = str(item);if (normalized) acc.push(normalized);return acc;}, []);
};
const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

const baseUrl = () => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const cleanPath = (p: string) => p.replace(/^\/+/, "");
const isUrl = (v: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(v);

const toCategories = (v: unknown): BlogCategoryRef[] | undefined => {
  if (!Array.isArray(v)) return undefined;

  const categories = v.reduce<BlogCategoryRef[]>((acc, item) => {
    if (typeof item === "string") {
      const normalized = item.trim();
      if (normalized) acc.push(normalized);
      return acc;
    }

    if (isObj(item)) {
      const _id = str(item._id);
      const name = str(item.name);
      const title = str(item.title);

      if (_id || name || title) {
        acc.push({ _id, name, title });
      }
    }

    return acc;
  }, []);

  return categories.length ? categories : undefined;
};

const toBlog = (v: unknown): BlogItem | undefined => {
  if (!isObj(v)) return;
  const title = str(v.title);
  const desc = str(v.description);
  const tag = str(v.tagLine);
  const meta = str(v.metaDescription);
  if (![title, desc, tag, meta].some(Boolean)) return;
  return {_id: str(v._id) || str(v.id),titleTag: str(v.titleTag),metaDescription: meta,urlSlug: str(v.urlSlug),imageAltText: str(v.imageAltText),thumbnail: str(v.thumbnail),title,description: desc,tagLine: tag,tags: arr(v.tags),categoryIds: toCategories(v.categoryIds),priority: Number(v.priority) || 0,isActive: typeof v.isActive === "boolean" ? v.isActive : undefined,isDeleted: typeof v.isDeleted === "boolean" ? v.isDeleted : undefined,createdAt: str(v.createdAt),updatedAt: str(v.updatedAt),};
};

export const normalizeBlogItems = (v: unknown, seen = new WeakSet<object>()): BlogItem[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v.flatMap((x) => normalizeBlogItems(x, seen));
  if (!isObj(v) || seen.has(v)) return [];

  seen.add(v);

  const item = toBlog(v);
  if (item) return [item];

  for (const k of KEYS) {
    const res = normalizeBlogItems(v[k], seen);
    if (res.length) return res;
  }

  return Object.values(v).flatMap((x) => normalizeBlogItems(x, seen));
};

export const getBlogIdentifier = (p: BlogItem) =>
  (p._id || p.urlSlug || "").trim();

export const getBlogDetailPath = (id: string) =>
  `${ROUTES.INFO.BLOG}/${id}`;

const cleanText = (v?: string) =>
  v?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "";

export const getBlogTitle = (p: BlogItem) =>
  p.title || p.titleTag || "Untitled Blog";

export const getBlogExcerpt = (p: BlogItem, len = 170) => {
  const t = cleanText(p.tagLine || p.metaDescription || p.description);
  return t ? (t.length > len ? t.slice(0, len).trim() + "..." : t) : "Details will be available soon.";
};

export const getBlogDescription = (p: BlogItem) =>
  cleanText(p.description || p.metaDescription || p.tagLine) || "Details will be available soon.";

export const resolveBlogDate = (v?: string) => {
  const t = Date.parse(v || "");
  return isNaN(t)? v || "": new Intl.DateTimeFormat("en-GB", {day: "2-digit",month: "short",year: "numeric",}).format(new Date(t));
};

export const getBlogThumbnailCandidates = (v?: string) => {
  const t = v?.trim();
  if (!t) return [];
  const base = baseUrl();
  const list: string[] = [];

  if (t.startsWith("assets/")) {
    list.push(`${import.meta.env.BASE_URL}${t}`);
    return uniq(list);
  }

  if (isUrl(t)) {
    list.push(t);
    try {
      const path = cleanPath(new URL(t).pathname);
      if (base && path) {
        list.push(`${base}/${path}`);
        list.push(...QUERY_KEYS.map((k) => `${base}${URL_KEYS.UPLOAD.IMAGE}?${k}=${encodeURIComponent(path)}`));
      }
    } catch {
      // Ignore invalid absolute URL and keep best-effort candidates.
    }
    return uniq(list);
  }

  if (base) {
    const path = cleanPath(t);
    if (t.startsWith("/")) list.push(`${base}${t}`);
    list.push(`${base}/${path}`);
    list.push(...QUERY_KEYS.map((k) => `${base}${URL_KEYS.UPLOAD.IMAGE}?${k}=${encodeURIComponent(path)}`));
  }

  list.push(t);
  return uniq(list);
};
