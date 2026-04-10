import * as Yup from "yup";
import { Validation } from "./Validation";

// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});

// Regex Patterns
const regex = {
  alpha: /^[A-Za-z\s]+$/,
  alphaNumeric: /^[A-Za-z0-9\s,.-/]+$/,
  digits: /^[0-9]+$/,
  phoneCountryCode: /^\+[0-9]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  otp: /^[0-9]{6}$/
};

// Signup
export const SignupSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required").matches(regex.alpha, "First name must contain only alphabetic characters"),
  lastName: Yup.string().trim().required("Last name is required").matches(regex.alpha, "Last name must contain only alphabetic characters"),
  email: Yup.string().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
  countryCode: Yup.string().required("Country code is required").matches(regex.phoneCountryCode, "Invalid country code format"),
  phoneNumber: Yup.string().required("Phone number is required").test("valid-phone-number", "Enter a valid phone number", (value) => (value?.replace(/\D/g, "").length ?? 0) >= 6).matches(regex.digits, "Phone number must contain only digits"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required").matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Confirm your password").matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
});

export const ProfileSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required").matches(regex.alpha, "First name must contain only alphabetic characters"),
  lastName: Yup.string().trim().required("Last name is required").matches(regex.alpha, "Last name must contain only alphabetic characters"),
  email: Yup.string().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
  countryCode: Yup.string().trim().matches(regex.phoneCountryCode, "Invalid country code format"),
  phoneNumber: Yup.string().test("valid-phone-number", "Enter a valid phone number", (value) => !value || (value.replace(/\D/g, "").length ?? 0) >= 6),
  profilePhoto: Yup.string().trim(),
});

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
});

export const ResetPasswordSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
  otp: Yup.string().required("OTP is required").matches(regex.otp, "OTP must be 6 digits"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required").matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Confirm your password").matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
});

export const VerifyOtpSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
  otp: Yup.string().required("OTP is required").matches(regex.otp, "OTP must be 6 digits"),
});

export const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string().min(6, "Minimum 6 characters").required("New password is required").matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
  confirmNewPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match").required("Confirm your new password").matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
});

export const ContactSchema = Yup.object({
  name: Yup.string().trim().required("Name is required").matches(regex.alpha, "Name must contain only alphabetic characters"),
  email: Yup.string().trim().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
  mobileNumber: Yup.string().trim().required("Mobile number is required").matches(regex.digits, "Mobile number must contain only digits"),
  subject: Yup.string().trim(),
  message: Yup.string().trim().required("Message is required"),
});

export const AddressSchema = Yup.object({
  address1: Yup.string().trim().required("Address line 1 is required").matches(regex.alphaNumeric, "Address contains invalid characters"),
  address2: Yup.string().trim().matches(regex.alphaNumeric, "Address contains invalid characters"),
  city: Yup.string().trim().required("City is required").matches(regex.alpha, "City must contain only alphabetic characters"),
  state: Yup.string().trim().required("State is required").matches(regex.alpha, "State must contain only alphabetic characters"),
  zipCode: Yup.string().trim().required("ZIP code is required").matches(regex.digits, "ZIP code must contain only digits"),
  country: Yup.string().trim().required("Country is required").matches(regex.alpha, "Country must contain only alphabetic characters"),
  isDefault: Yup.boolean().default(false),
});

export const CheckoutSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required").matches(regex.alpha, "First name must contain only alphabetic characters"),
  lastName: Yup.string().trim().required("Last name is required").matches(regex.alpha, "Last name must contain only alphabetic characters"),
  email: Yup.string().email("Enter a valid email").required("Email is required").matches(regex.email, "Enter a valid email"),
  countryCode: Yup.string().required("Country code is required").matches(regex.phoneCountryCode, "Invalid country code format"),
  phoneNumber: Yup.string().required("Phone number is required").test("valid-phone-number", "Enter a valid phone number", (value) => (value?.replace(/\D/g, "").length ?? 0) >= 6).matches(regex.digits, "Phone number must contain only digits"),
  discountCode: Yup.string().trim().max(50, "Discount code is too long"),
  addressId: Yup.string().trim().test("valid-object-id", "Select a valid saved address", (value) => !value || /^[a-f0-9]{24}$/i.test(value)),
  address1: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("Address is required"), otherwise: (schema) => schema.notRequired() }).matches(regex.alphaNumeric, "Address contains invalid characters"),
  address2: Yup.string().trim().matches(regex.alphaNumeric, "Address contains invalid characters"),
  city: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("City is required"), otherwise: (schema) => schema.notRequired() }).matches(regex.alpha, "City must contain only alphabetic characters"),
  state: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("State is required"), otherwise: (schema) => schema.notRequired() }).matches(regex.alpha, "State must contain only alphabetic characters"),
  zipCode: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("PIN code is required"), otherwise: (schema) => schema.notRequired() }).matches(regex.digits, "PIN code must contain only digits"),
  country: Yup.string().trim().when("addressId", { is: (value: string) => !value, then: (schema) => schema.required("Country is required"), otherwise: (schema) => schema.notRequired() }).matches(regex.alpha, "Country must contain only alphabetic characters"),
  isDefault: Yup.boolean().default(false),
});
