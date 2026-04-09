import * as Yup from "yup";
import { Validation } from "./Validation";

// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});

// Signup
export const SignupSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .test("valid-phone-number", "Enter a valid phone number", (value) => (value?.replace(/\D/g, "").length ?? 0) >= 6),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export const ProfileSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  countryCode: Yup.string().trim(),
  phoneNumber: Yup.string()
    .test(
      "valid-phone-number",
      "Enter a valid phone number",
      (value) => !value || (value.replace(/\D/g, "").length ?? 0) >= 6,
    ),
  profilePhoto: Yup.string().trim(),
});

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
});

export const ResetPasswordSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  otp: Yup.string().required("OTP is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export const VerifyOtpSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  otp: Yup.string().required("OTP is required"),
});

export const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string().min(6, "Minimum 6 characters").required("New password is required"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm your new password"),
});

export const ContactSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  mobileNumber: Yup.string().trim().required("Mobile number is required"),
  subject: Yup.string().trim(),
  message: Yup.string().trim().required("Message is required"),
});

export const AddressSchema = Yup.object({
  address1: Yup.string().trim().required("Address line 1 is required"),
  address2: Yup.string().trim(),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  zipCode: Yup.string().trim().required("ZIP code is required"),
  country: Yup.string().trim().required("Country is required"),
  isDefault: Yup.boolean().default(false),
});

export const CheckoutSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  countryCode: Yup.string().required("Country code is required"),
  phoneNumber: Yup.string().required("Phone number is required").test("valid-phone-number", "Enter a valid phone number", (value) => (value?.replace(/\D/g, "").length ?? 0) >= 6),
  discountCode: Yup.string().trim().max(50, "Discount code is too long"),
  addressId: Yup.string().trim().test("valid-object-id", "Select a valid saved address", (value) => !value || /^[a-f0-9]{24}$/i.test(value)),
  address1: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("Address is required"), otherwise: (schema) => schema.notRequired() }),
  address2: Yup.string().trim(),
  city: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("City is required"), otherwise: (schema) => schema.notRequired() }),
  state: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("State is required"), otherwise: (schema) => schema.notRequired() }),
  zipCode: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("PIN code is required"), otherwise: (schema) => schema.notRequired() }),
  country: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("Country is required"), otherwise: (schema) => schema.notRequired() }),
  isDefault: Yup.boolean().default(false),
});
