import type { PolicyType } from "../Constants";
import type { ApiResponse } from "./Api";

export type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  policyType?: PolicyType;
  aboutPage?: boolean;
};

export interface PolicyItem {
  _id?: string;
  type?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PolicyCollection = {
  docs?: PolicyItem[];
  items?: PolicyItem[];
  rows?: PolicyItem[];
  data?: PolicyValue;
};

export type PolicyValue = PolicyItem | PolicyItem[] | PolicyCollection | undefined;

export type PolicyApiResponse = ApiResponse<
  | PolicyItem
  | PolicyItem[]
  | {
      docs?: PolicyItem[];
      items?: PolicyItem[];
      rows?: PolicyItem[];
      data?: PolicyItem | PolicyItem[];
    }
>;

export type AboutApiResponse = ApiResponse<
  | PolicyItem
  | PolicyItem[]
  | {
      docs?: PolicyItem[];
      items?: PolicyItem[];
      rows?: PolicyItem[];
      data?: PolicyItem | PolicyItem[];
    }
>;
