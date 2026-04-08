import type { ApiResponse } from "./Api";

export type ReviewRecord = {
  _id?: string;
  productId?: string | { _id?: string };
  name?: string;
  image?: string;
  personName?: string;
  email?: string;
  description?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ReviewApiResponse = ApiResponse<
  | ReviewRecord
  | ReviewRecord[]
  | {
      review_data?: ReviewRecord[];
      reviews?: ReviewRecord[];
      review?: ReviewRecord;
    }
>;

export type AddReviewPayload = {
  productId: string;
  name?: string;
  image?: string;
  personName: string;
  email: string;
  description: string;
  rating: number;
};
