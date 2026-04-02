import { KEYS, URL_KEYS } from "../Constants";
import { Delete, Post } from "./Methods/Index";
import { Put } from "./Methods/Put";
import { useMutations } from "./ReactQuery/useMutations";
import type { ApiResponse, ChangePasswordPayload, EditUserPayload, ForgotPasswordPayload, LoginPayload, LoginResponse, NewsletterSubscriptionPayload, ResetPasswordPayload, SignupPayload, VerifyOtpPayload, VerifyOtpResponse, } from "../Types";

export const Mutations = {
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false),),
  useSignup: () => useMutations<SignupPayload, LoginResponse>([KEYS.AUTH.SIGNUP], (input) => Post(URL_KEYS.USER.ADD, input, false),),
  useEditUser: () => useMutations<EditUserPayload, ApiResponse>([KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.EDIT, input)),
  useUploadImage: () => useMutations<FormData, ApiResponse>([KEYS.UPLOAD.IMAGE], (input) => Post(URL_KEYS.UPLOAD.IMAGE, input)),
  useDeleteUploadedImage: () =>
    useMutations<Record<string, unknown>, ApiResponse>([KEYS.UPLOAD.IMAGE], (input) =>
      Delete(URL_KEYS.UPLOAD.IMAGE, input),
    ),
  useSubscribeNewsletter: () => useMutations<NewsletterSubscriptionPayload, ApiResponse>([KEYS.NEWSLETTER.SUBSCRIBE], (input) => Post(URL_KEYS.NEWSLETTER.SUBSCRIBE, input),),
  useForgotPassword: () => useMutations<ForgotPasswordPayload, ApiResponse>([KEYS.AUTH.FORGOT_PASSWORD], (input) => Post(URL_KEYS.AUTH.FORGOT_PASSWORD, input, false),),
  useResetPassword: () => useMutations<ResetPasswordPayload, ApiResponse>([KEYS.AUTH.RESET_PASSWORD], (input) => Post(URL_KEYS.AUTH.RESET_PASSWORD, input, false),),
  useVerifyOtp: () => useMutations<VerifyOtpPayload, VerifyOtpResponse>([KEYS.AUTH.VERIFY_OTP], (input) => Post(URL_KEYS.AUTH.VERIFY_OTP, input, false),),
  useChangePassword: () => useMutations<ChangePasswordPayload, ApiResponse>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input),),
};
