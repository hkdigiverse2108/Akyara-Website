import { KEYS, URL_KEYS } from "../Constants";
import type { AddReviewPayload, AddressApiResponse, AddressMutationPayload, ApiResponse, ChangePasswordPayload, ContactPayload, EditUserPayload, ForgotPasswordPayload, LoginPayload, LoginResponse, NewsletterSubscriptionPayload, ResetPasswordPayload, SignupPayload, VerifyOtpPayload, VerifyOtpResponse, AddWishlistPayload, WishlistApiResponse, AddCartPayload, UpdateCartPayload, CartApiResponse } from "../Types";
import { Delete, Post } from "./Methods/Index";
import { Put } from "./Methods/Put";
import { useMutations } from "./ReactQuery/useMutations";

export const Mutations = {
  useSignin: () => useMutations<LoginPayload, LoginResponse>([KEYS.AUTH.SIGNIN], (input) => Post(URL_KEYS.AUTH.SIGNIN, input, false)),
  useSignup: () => useMutations<SignupPayload, LoginResponse>([KEYS.AUTH.SIGNUP], (input) => Post(URL_KEYS.USER.ADD, input, false)),
  useEditUser: () => useMutations<EditUserPayload, ApiResponse>([KEYS.USER.BASE], (input) => Put(URL_KEYS.USER.EDIT, input)),
  useAddAddress: () => useMutations<AddressMutationPayload, AddressApiResponse>([KEYS.ADDRESS.BASE, KEYS.ADDRESS.ALL], (input) => Post(URL_KEYS.ADDRESS.ADD, input),),
  useEditAddress: () => useMutations<AddressMutationPayload, AddressApiResponse>([KEYS.ADDRESS.BASE, KEYS.ADDRESS.ALL, KEYS.ADDRESS.DETAIL], (input) => Put(URL_KEYS.ADDRESS.EDIT, input),),
  useDeleteAddress: () => useMutations<string, AddressApiResponse>([KEYS.ADDRESS.BASE, KEYS.ADDRESS.ALL, KEYS.ADDRESS.DETAIL], (id) => Delete(`${URL_KEYS.ADDRESS.BASE}/${id}`),),
  useUploadImage: () => useMutations<FormData, ApiResponse>([KEYS.UPLOAD.IMAGE], (input) => Post(URL_KEYS.UPLOAD.IMAGE, input)),
  useDeleteUploadedImage: () => useMutations<Record<string, unknown>, ApiResponse>([KEYS.UPLOAD.IMAGE], (input) => Delete(URL_KEYS.UPLOAD.IMAGE, input)),
  useSubscribeNewsletter: () => useMutations<NewsletterSubscriptionPayload, ApiResponse>([KEYS.NEWSLETTER.SUBSCRIBE], (input) => Post(URL_KEYS.NEWSLETTER.SUBSCRIBE, input)),
  useForgotPassword: () => useMutations<ForgotPasswordPayload, ApiResponse>([KEYS.AUTH.FORGOT_PASSWORD], (input) => Post(URL_KEYS.AUTH.FORGOT_PASSWORD, input, false),),
  useResetPassword: () => useMutations<ResetPasswordPayload, ApiResponse>([KEYS.AUTH.RESET_PASSWORD], (input) => Post(URL_KEYS.AUTH.RESET_PASSWORD, input, false),),
  useVerifyOtp: () => useMutations<VerifyOtpPayload, VerifyOtpResponse>([KEYS.AUTH.VERIFY_OTP], (input) => Post(URL_KEYS.AUTH.VERIFY_OTP, input, false),),
  useChangePassword: () => useMutations<ChangePasswordPayload, ApiResponse>([KEYS.AUTH.CHANGE_PASSWORD], (input) => Post(URL_KEYS.AUTH.CHANGE_PASSWORD, input),),
  useAddContact: () => useMutations<ContactPayload, ApiResponse>([KEYS.CONTACT.ADD], (input) => Post(URL_KEYS.CONTACT.ADD, input, false)),
  useAddReview: () => useMutations<AddReviewPayload, ApiResponse>([KEYS.REVIEW.BASE, KEYS.REVIEW.ALL, KEYS.REVIEW.DETAIL], (input) => Post(URL_KEYS.REVIEW.ADD, input)),
  useAddWishlist: () => useMutations<AddWishlistPayload, WishlistApiResponse>([KEYS.WISHLIST.BASE, KEYS.WISHLIST.ALL], (input) => Post(URL_KEYS.WISHLIST.ADD, input)),
  useRemoveWishlist: () => useMutations<string, ApiResponse>([KEYS.WISHLIST.BASE, KEYS.WISHLIST.ALL], (id) => Delete(`${URL_KEYS.WISHLIST.BASE}/${id}`)),
  useAddCart: () => useMutations<AddCartPayload, CartApiResponse>([KEYS.CART.BASE, KEYS.CART.ALL], (input) => Post(URL_KEYS.CART.ADD, input)),
  useUpdateCart: () => useMutations<UpdateCartPayload, CartApiResponse>([KEYS.CART.BASE, KEYS.CART.ALL], (input) => Post(URL_KEYS.CART.UPDATE, input)),
  useRemoveCart: () => useMutations<string, CartApiResponse>([KEYS.CART.BASE, KEYS.CART.ALL], (id) => Delete(`${URL_KEYS.CART.BASE}/${id}`)),
  useAddOrder: () => useMutations<any, any>([KEYS.ORDER.BASE, KEYS.ORDER.ALL], (input) => Post(URL_KEYS.ORDER.ADD, input)),
  useCreateRazorpayPayment: () =>useMutations<any, ApiResponse>([KEYS.RAZORPAY.PAY], (input) => Post(URL_KEYS.RAZORPAY.PAY, input)),
  useVerifyRazorpayPayment: () =>useMutations<any, ApiResponse>([KEYS.RAZORPAY.VERIFY], (input) => Post(URL_KEYS.RAZORPAY.VERIFY, input)),
};

