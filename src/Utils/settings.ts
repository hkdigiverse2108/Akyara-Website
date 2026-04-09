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

const isLocalHostname = (hostname: string) =>
  ["localhost", "127.0.0.1", "::1"].includes(hostname.trim().toLowerCase());

const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const isLocalApiBaseUrl = (value: string) => {
  if (!value || value.startsWith("/")) return false;
  const lowered = value.toLowerCase();
  if (lowered.includes("localhost") || lowered.includes("127.0.0.1") || lowered.includes("::1")) return true;
  try {
    const parsed = new URL(value);
    return isLocalHostname(parsed.hostname);
  } catch {
    return false;
  }
};

let didWarnLocalhostProdBaseUrl = false;

export const getApiBaseUrl = () => {
  const raw = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();
  const cleaned = stripTrailingSlashes(raw);

  if (!cleaned) return import.meta.env.DEV ? "/api" : "";

  if (import.meta.env.PROD && typeof window !== "undefined" && !isLocalHostname(window.location.hostname) && isLocalApiBaseUrl(cleaned)) {
    if (!didWarnLocalhostProdBaseUrl) {
      didWarnLocalhostProdBaseUrl = true;
      console.warn(
        "VITE_API_BASE_URL is set to a localhost URL in production; falling back to same-origin requests. Set VITE_API_BASE_URL to your production API host."
      );
    }
    return "";
  }

  return cleaned;
};

export const resolveSettingsImageUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  if (isAbsoluteUrl(trimmed)) return trimmed;

  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return trimmed;

  if (trimmed.startsWith("/")) return `${baseUrl}${trimmed}`;
  return `${baseUrl}/${trimmed.replace(/^\/+/, "")}`;
};
