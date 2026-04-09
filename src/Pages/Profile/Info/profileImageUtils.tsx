import { URL_KEYS } from "../../../Constants";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "../../../Utils";

export const isAbsoluteImageUrl = (value: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(value);

export const buildProfilePhotoCandidates = (value?: string) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) {return [] as string[];}
  if (isAbsoluteImageUrl(trimmed)) {return [trimmed];}
  const baseUrl = getApiBaseUrl();
  const normalized = trimmed.replace(/^\/+/, "");
  const candidates: string[] = [];

  if (baseUrl && trimmed.startsWith("/"))candidates.push(`${baseUrl}${trimmed}`);

  if (baseUrl) {
    const queryKeys = ["image", "fileName", "filename", "path", "key", "profilePhoto", "name"];
    for (const key of queryKeys) {candidates.push(`${baseUrl}${URL_KEYS.UPLOAD.IMAGE}?${key}=${encodeURIComponent(normalized)}`);}

    if (normalized.includes("/"))  candidates.push(`${baseUrl}/${normalized}`);
  }
  if (!candidates.length) candidates.push(trimmed);
  return candidates.filter((item, index, arr) => arr.indexOf(item) === index);
};

export const getImageIdentifier = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const queryKeys = ["image", "fileName", "filename", "path", "key", "profilePhoto", "name"];

  try {
    if (isAbsoluteImageUrl(trimmed)) {
      const parsed = new URL(trimmed);
      for (const key of queryKeys) {
        const current = parsed.searchParams.get(key);
        if (current?.trim()) {
          return current.trim();
        }
      }

      const pathPart = parsed.pathname.split("/").filter(Boolean).pop();
      if (pathPart) return pathPart;
    }
  } catch {
  }

  if (trimmed.includes("?")) {
    const query = trimmed.split("?")[1] || "";
    const params = new URLSearchParams(query);
    for (const key of queryKeys) {
      const current = params.get(key);
      if (current?.trim()) {
        return current.trim();
      }
    }
  }

  return trimmed.replace(/^\/+/, "");
};

export const extractUploadedImageValue = (response: unknown) => {
  const pickString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

  if (!response || typeof response !== "object") {
    return undefined;
  }

  const root = response as Record<string, unknown>;
  const directRoot =pickString(root.imageUrl) ??pickString(root.imageURL) ??pickString(root.url) ??pickString(root.imagePath) ??pickString(root.path) ??pickString(root.filePath) ??pickString(root.location) ??pickString(root.publicUrl) ??pickString(root.image) ??pickString(root.key) ??pickString(root.fileName) ??pickString(root.filename);

  if (directRoot) return directRoot;
  if (typeof root.data === "string") return pickString(root.data);
  if (!root.data || typeof root.data !== "object") return undefined;

  const data = root.data as Record<string, unknown>;
  return (pickString(data.imageUrl) ??pickString(data.imageURL) ??pickString(data.url) ??pickString(data.imagePath) ??pickString(data.path) ??pickString(data.filePath) ??pickString(data.location) ??pickString(data.publicUrl) ??pickString(data.image) ??pickString(data.key) ??pickString(data.fileName) ??pickString(data.filename));
};

type ProfileImageProps = {value?: string;alt: string;className: string;fallback: ReactNode;};

export const ProfileImage = ({ value, alt, className, fallback }: ProfileImageProps) => {
  const candidates = useMemo(() => buildProfilePhotoCandidates(value), [value]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [value]);

  const currentUrl = candidates[index];

  if (!currentUrl) {
    return <>{fallback}</>;
  }

  return (
    <img src={currentUrl} alt={alt} className={className} onError={() => {   setIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : candidates.length)); }}/>
  );
};
