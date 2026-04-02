import type { PolicyItem } from "../../Types";
import { COLLECTION_FIELD_KEYS, CONTENT_FIELD_KEYS, TITLE_FIELD_KEYS } from "./constants";

type ContentRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ContentRecord => typeof value === "object" && value !== null;

const getStringField = (value: ContentRecord, keys: readonly string[]): string | undefined => {
  for (const key of keys) {
    const field = value[key];
  if (typeof field === "string" && field.trim())return field.trim();
  }
  return undefined;
};

const pickFirstItem = (items: PolicyItem[], contentType?: string, strictTypeMatch?: boolean) => {
  if (contentType) {
    const typedActiveItem = items.find((item) => item?.type === contentType && item?.isActive !== false,);
    const typedItem = items.find((item) => item?.type === contentType);

    if (typedActiveItem || typedItem)return typedActiveItem ?? typedItem;
    if (strictTypeMatch)return undefined;
  }
  return items.find((item) => item?.isActive !== false) ?? items[0];
};

const toPolicyItem = (value: ContentRecord): PolicyItem | undefined => {
  const type = typeof value.type === "string" ? value.type : undefined;
  const title = getStringField(value, TITLE_FIELD_KEYS);
  const description = getStringField(value, CONTENT_FIELD_KEYS);

  if (!type && !title && !description)return undefined;
  return {type,title,description,isActive: typeof value.isActive === "boolean" ? value.isActive : undefined,};
};

export const normalizeInfoPageContent = (value: unknown,contentType?: string,strictTypeMatch?: boolean,visited = new WeakSet<object>(),): PolicyItem | undefined => {
  if (!value)return undefined;
  if (typeof value === "string") return value.trim() ? { description: value.trim() } : undefined;
  if (Array.isArray(value)) {const normalizedItems = value.map((item) => normalizeInfoPageContent(item, contentType, strictTypeMatch, visited)).filter((item): item is PolicyItem => !!item);
    return pickFirstItem(normalizedItems, contentType, strictTypeMatch);
  }
  if (!isRecord(value))return undefined;
  if (visited.has(value)) return undefined;


  visited.add(value);
  const currentItem = toPolicyItem(value);
  if (currentItem && (!contentType || currentItem.type === contentType || !currentItem.type)) return currentItem;


  for (const key of COLLECTION_FIELD_KEYS) {
    const nestedContent = normalizeInfoPageContent(value[key], contentType, strictTypeMatch, visited);

    if (nestedContent) {
      return nestedContent;
    }
  }

  return undefined;
};
