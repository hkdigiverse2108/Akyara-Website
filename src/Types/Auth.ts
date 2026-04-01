import type { ApiResponse } from "./Api";

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserContact = {
  countryCode?: string;
  phoneNo?: string;
};

export type User = {
  firstName?: string;
  lastName?: string;
  email: string;
  contact?: UserContact;
  password?: string;
  profilePhoto?: string;
  role?: UserRole;
  otp?: number | null;
  otpExpireTime?: string | Date | null;
  isEmailVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSessionUser = User & {
  _id?: string;
  token?: string;
  userType?: string | number;
  [key: string]: unknown;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  phoneNumber?: string;
  [key: string]: unknown;
};

export type ForgotPasswordPayload = {
  email: string;
  [key: string]: unknown;
};

export type ResetPasswordPayload = {
  email: string;
  password: string;
  otp?: string | number;
  [key: string]: unknown;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string | number;
  [key: string]: unknown;
};

export type LoginResponse = ApiResponse<AuthSessionUser>;

export type VerifyOtpResponse = ApiResponse<AuthSessionUser>;

export type UserProfileResponse = ApiResponse<AuthSessionUser>;

export type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
  [key: string]: unknown;
};
