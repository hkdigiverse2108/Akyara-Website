import * as Yup from "yup";

import type { DepValue, Primitive } from "../../Types";
import { Validation } from "./Validation";


// Signin
export const SigninSchema = Yup.object({
  email: Validation("string", "Email", { extraRules: (s) => s.email("Invalid email address") }),
  password: Validation("string", "Password", { extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character") }),
});

// Signup
export const SignupSchema = Yup.object({
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
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
