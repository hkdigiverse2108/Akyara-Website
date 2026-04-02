import type { ApiResponse } from "./Api";

export type AboutSection = {
  _id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  priority?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AboutCollection = {
  docs?: AboutSection[];
  items?: AboutSection[];
  rows?: AboutSection[];
  data?: AboutValue;
};

export type AboutValue = AboutSection | AboutSection[] | AboutCollection | undefined;

export type AboutApiResponse = ApiResponse<
  | AboutSection
  | AboutSection[]
  | {
      docs?: AboutSection[];
      items?: AboutSection[];
      rows?: AboutSection[];
      data?: AboutSection | AboutSection[];
    }
>;
