import { ROUTES } from "../../../Constants";
import type { AboutSection } from "../../../Types";

type AboutRecord = Record<string, unknown>;

const COLLECTION_KEYS = ["data", "docs", "items", "rows", "results", "records"] as const;

const isRecord = (value: unknown): value is AboutRecord => typeof value === "object" && value !== null;

const toAboutSection = (value: unknown): AboutSection | undefined => {
  if (!isRecord(value)) return undefined;

  const title = typeof value.title === "string" ? value.title.trim() : undefined;
  const subtitle = typeof value.subtitle === "string" ? value.subtitle.trim() : undefined;
  const description = typeof value.description === "string" ? value.description.trim() : undefined;
  const image = typeof value.image === "string" ? value.image.trim() : undefined;

  if (!title && !subtitle && !description && !image) return undefined;

  return {_id: typeof value._id === "string" ? value._id : undefined,title,subtitle,description,image,priority: typeof value.priority === "number" ? value.priority : 0,};
};

export const normalizeAboutSections = (value: unknown, visited = new WeakSet<object>()): AboutSection[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => normalizeAboutSections(item, visited));
  if (!isRecord(value)) return [];
  if (visited.has(value)) return [];

  visited.add(value);

  const directSection = toAboutSection(value);
  if (directSection) return [directSection];

  const fromCollectionKeys = COLLECTION_KEYS.flatMap((key) => normalizeAboutSections(value[key], visited));
  if (fromCollectionKeys.length) return fromCollectionKeys;

  return Object.values(value).flatMap((nestedValue) => normalizeAboutSections(nestedValue, visited));
};

export const getAboutDetailPath = (id: string) => `${ROUTES.INFO.ABOUT}/${id}`;

