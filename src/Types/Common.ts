import * as Yup from "yup";
import type { ApiResponse, AuthSessionUser } from "./index";
import type { ReactNode } from "react";

export interface Params {
  [key: string]: any;
}

export type Primitive = string | number | boolean | null | undefined;

export type DepValue = Primitive | Primitive[];

export interface FieldOptions<T> {
  required?: boolean;
  extraRules?: (schema: T) => T;
  minItems?: number;
}

export type FieldSchemaArgs<K extends keyof FieldTypeMap> =
  | [type: K, options?: FieldOptions<FieldTypeMap[K]>]
  | [type: K, label: string, options?: FieldOptions<FieldTypeMap[K]>];
export type FieldTypeMap = {
  string: Yup.StringSchema<string | null | undefined>;
  number: Yup.NumberSchema<number | null | undefined>;
  boolean: Yup.BooleanSchema<boolean | null | undefined>;
  array: Yup.ArraySchema<any[], Yup.AnyObject>;
};

export type InfoPageLayoutProps = {
  title: string;
  content?: string;
  isLoading?: boolean;
  showContentCard?: boolean;
  emptyMessage: string;
};

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

export type ProfileEditFormProps = {
  profile: AuthSessionUser | null;
  userId?: string;
  profilePhoto: string;
  isSaving: boolean;
  isUploadingImage: boolean;
  isDeletingImage: boolean;
  editUser: ProfileInfoSectionProps["editUser"];
  uploadImage: ProfileInfoSectionProps["uploadImage"];
  deleteUploadedImage: ProfileInfoSectionProps["deleteUploadedImage"];
  onClose: () => void;
};

export type ProfilePlaceholderSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ProfileChangePasswordSectionProps = {
  changePassword: (input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<ApiResponse>;
  isChangingPassword: boolean;
};

export type CategoryCardProps = {
  title: string;
  count: string;
  image: string;
  contentClass: string;
  imageWrapClass: string;
  imageClass?: string;
  imageAlignClass?: string;
  isLarge?: boolean;
  useImageAsBackground?: boolean;
};

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export type AuthInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};
