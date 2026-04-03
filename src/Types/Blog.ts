import type { ApiResponse } from "./Api";

export type BlogCategoryRef = string | { _id?: string; name?: string; title?: string };

export type BlogItem = {
  _id?: string;
  titleTag?: string;
  metaDescription?: string;
  urlSlug?: string;
  imageAltText?: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  tagLine?: string;
  tags?: string[];
  categoryIds?: BlogCategoryRef[];
  isActive?: boolean;
  isDeleted?: boolean;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogCollection = {
  docs?: BlogItem[];
  items?: BlogItem[];
  rows?: BlogItem[];
  results?: BlogItem[];
  records?: BlogItem[];
  data?: BlogValue;
};

export type BlogValue = BlogItem | BlogItem[] | BlogCollection | undefined;

export type BlogApiResponse = ApiResponse<
  | BlogItem
  | BlogItem[]
  | {
      docs?: BlogItem[];
      items?: BlogItem[];
      rows?: BlogItem[];
      results?: BlogItem[];
      records?: BlogItem[];
      data?: BlogItem | BlogItem[];
    }
>;
