import type { ApiResponse, AuthSessionUser } from "../../Types";

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
  isSaving: boolean;
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
