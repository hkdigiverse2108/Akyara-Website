import type { ApiResponse } from "./Api";

export type FaqItem = {
  _id?: string;
  question?: string;
  answer?: string;
  priority?: number;
  faqCategoryId?: string | { _id?: string; name?: string };
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type FaqCollection = {
  docs?: FaqItem[];
  items?: FaqItem[];
  rows?: FaqItem[];
  data?: FaqValue;
};

export type FaqValue = FaqItem | FaqItem[] | FaqCollection | undefined;

export type FaqApiResponse = ApiResponse<
  | FaqItem
  | FaqItem[]
  | {
      docs?: FaqItem[];
      items?: FaqItem[];
      rows?: FaqItem[];
      data?: FaqItem | FaqItem[];
    }
>;
