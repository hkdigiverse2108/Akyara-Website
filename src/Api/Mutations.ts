import { KEYS, URL_KEYS } from "../Constants";
import { Post } from "./Methods/Index";
import { useMutations } from "./ReactQuery/useMutations";
import type {ApiResponse,ChangePasswordPayload,ForgotPasswordPayload,LoginPayload,LoginResponse,ResetPasswordPayload,SignupPayload,VerifyOtpPayload,VerifyOtpResponse,} from "../Types";

export const Mutations = {
  useSignin: () =>useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),
  useSignup: () =>useMutations<SignupPayload, LoginResponse>([KEYS.AUTH.SIGNUP], (input) => Post(URL_KEYS.USER.ADD, input, false)),
  useForgotPassword: () =>useMutations<ForgotPasswordPayload, ApiResponse>([KEYS.AUTH.FORGOT_PASSWORD], (input) =>Post(URL_KEYS.AUTH.FORGOT_PASSWORD, input, false)),
  useResetPassword: () =>useMutations<ResetPasswordPayload, ApiResponse>([KEYS.AUTH.RESET_PASSWORD], (input) =>Post(URL_KEYS.AUTH.RESET_PASSWORD, input, false)),
  useVerifyOtp: () =>useMutations<VerifyOtpPayload, VerifyOtpResponse>([KEYS.AUTH.VERIFY_OTP], (input) => Post(URL_KEYS.AUTH.VERIFY_OTP, input, false)),
  useChangePassword: () =>useMutations<ChangePasswordPayload, ApiResponse>([KEYS.AUTH.CHANGE_PASSWORD], (input) =>Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input)),
};
