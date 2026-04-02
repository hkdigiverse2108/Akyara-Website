import type { ApiResponse, AuthSessionUser } from "../../../Types";

export type AccountSection = "orders" | "wishlist" | "info" | "addresses" | "payment" | "change-password";

export type ProfileProps = {
  section?: AccountSection;
};

export type ProfileInfoSectionProps = {
  editUser: (input: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: { phoneNo?: string };
    profilePhoto?: string;
  }) => Promise<ApiResponse>;
  uploadImage: (input: FormData) => Promise<ApiResponse>;
  deleteUploadedImage: (input: Record<string, unknown>) => Promise<ApiResponse>;
  isSaving: boolean;
  isUploadingImage: boolean;
  isDeletingImage: boolean;
  isRefreshing: boolean;
  profile: AuthSessionUser | null;
  userId?: string;
};

export type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
};

export type ProfilePlaceholderSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
};
