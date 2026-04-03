import type { SettingsItem } from "../Types";

type SettingsRecord = Record<string, unknown>;

const COLLECTION_KEYS = ["data", "docs", "items", "rows", "results", "records", "settings"] as const;

const isRecord = (value: unknown): value is SettingsRecord => typeof value === "object" && value !== null;

const getString = (value: unknown) => (typeof value === "string" ? value.trim() : undefined);

const toSettingsItem = (value: unknown): SettingsItem | undefined => {
  if (!isRecord(value)) return undefined;

  const item: SettingsItem = {
    _id: getString(value._id),
    address: getString(value.address),
    contact: getString(value.contact),
    email: getString(value.email),
    instagram: getString(value.instagram),
    facebook: getString(value.facebook),
    youtube: getString(value.youtube),
    twitter: getString(value.twitter),
  };

  const hasUsefulValue =
    !!item.address ||
    !!item.contact ||
    !!item.email ||
    !!item.instagram ||
    !!item.facebook ||
    !!item.youtube ||
    !!item.twitter;

  return hasUsefulValue ? item : undefined;
};

export const normalizeSettingsItems = (value: unknown, visited = new WeakSet<object>()): SettingsItem[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => normalizeSettingsItems(item, visited));
  if (!isRecord(value)) return [];
  if (visited.has(value)) return [];

  visited.add(value);

  const directItem = toSettingsItem(value);
  if (directItem) return [directItem];

  const fromCollection = COLLECTION_KEYS.flatMap((key) => normalizeSettingsItems(value[key], visited));
  if (fromCollection.length) return fromCollection;

  return Object.values(value).flatMap((nested) => normalizeSettingsItems(nested, visited));
};

export const getPrimarySettings = (value: unknown) => normalizeSettingsItems(value)[0];

export const normalizeExternalLink = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
};

const isAbsoluteUrl = (value: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(value);

const getApiBaseUrl = () => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const resolveSettingsImageUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (isAbsoluteUrl(trimmed)) return trimmed;

  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return trimmed;

  if (trimmed.startsWith("/")) return `${baseUrl}${trimmed}`;
  return `${baseUrl}/${trimmed.replace(/^\/+/, "")}`;
};
