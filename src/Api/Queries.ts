import { KEYS, URL_KEYS } from "../Constants";
import type { PolicyType } from "../Constants";
import type { AboutApiResponse, AddressApiResponse, BlogApiResponse, FaqApiResponse, Params, PolicyApiResponse, ProductApiResponse, ReviewApiResponse, SettingsApiResponse, UserProfileResponse, WishlistApiResponse, CartApiResponse, BannerApiResponse, SaleBannerApiResponse } from "../Types";
import { Get } from "./Methods/Get";
import { useQueries } from "./ReactQuery/useQueries";

export const Queries = {
  useGetSingleUser: (id?: string) => useQueries<UserProfileResponse>([KEYS.USER.BASE, id], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id, }),
  useGetAllAddresses: (enabled = true) => useQueries<AddressApiResponse>([KEYS.ADDRESS.ALL], () => Get(URL_KEYS.ADDRESS.ALL), { enabled }),
  useGetAddressById: (id?: string, enabled = true) => useQueries<AddressApiResponse>([KEYS.ADDRESS.DETAIL, id], () => Get(`${URL_KEYS.ADDRESS.BASE}/${id}`), { enabled: enabled && !!id, }),
  useGetAllProducts: (params?: Params, enabled = true) => useQueries<ProductApiResponse>([KEYS.PRODUCT.ALL, params], () => Get(URL_KEYS.PRODUCT.ALL, params), { enabled }),
  useGetProductById: (id?: string, enabled = true) => useQueries<ProductApiResponse>([KEYS.PRODUCT.DETAIL, id], () => Get(`${URL_KEYS.PRODUCT.BASE}/${id}`), { enabled: enabled && !!id, }),
  useGetPolicyByType: (policyType?: PolicyType, enabled = true) => useQueries<PolicyApiResponse>([KEYS.POLICY.ALL, policyType], () => Get(URL_KEYS.POLICY.ALL, policyType ? { typeFilter: policyType } : undefined), { enabled: enabled && !!policyType }),
  useGetAboutSections: (contentType?: string, enabled = true) => useQueries<AboutApiResponse>([KEYS.ABOUT.ALL, contentType], () => Get(URL_KEYS.ABOUT.ALL, contentType ? { typeFilter: contentType } : undefined), { enabled }),
  useGetAboutSectionById: (id?: string, enabled = true) => useQueries<AboutApiResponse>([KEYS.ABOUT.DETAIL, id], () => Get(`${URL_KEYS.ABOUT.BASE}/${id}`), { enabled: enabled && !!id, }),
  useGetFaqAll: (enabled = true) => useQueries<FaqApiResponse>([KEYS.FAQ.ALL], () => Get(URL_KEYS.FAQ.ALL), { enabled }),
  useGetBlogAll: (enabled = true) => useQueries<BlogApiResponse>([KEYS.BLOG.ALL], () => Get(URL_KEYS.BLOG.ALL), { enabled }),
  useGetBlogById: (id?: string, enabled = true) => useQueries<BlogApiResponse>([KEYS.BLOG.DETAIL, id], () => Get(`${URL_KEYS.BLOG.BASE}/${id}`), { enabled: enabled && !!id, }),
  useGetAllReviews: (enabled = true) => useQueries<ReviewApiResponse>([KEYS.REVIEW.ALL], () => Get(URL_KEYS.REVIEW.ALL), { enabled }),
  useGetSettings: (enabled = true) => useQueries<SettingsApiResponse>([KEYS.SETTINGS.ALL], () => Get(URL_KEYS.SETTINGS.BASE), { enabled }),
  useGetWishlist: (params?: Params, enabled = true) => useQueries<WishlistApiResponse>([KEYS.WISHLIST.ALL, params], () => Get(URL_KEYS.WISHLIST.ALL, params), { enabled }),
  useGetCart: (params?: Params, enabled = true) => useQueries<CartApiResponse>([KEYS.CART.ALL, params], () => Get(URL_KEYS.CART.ALL, params), { enabled }),
  useGetAllOrders: (params?: Params, enabled = true) => useQueries<any>([KEYS.ORDER.ALL, params], () => Get(URL_KEYS.ORDER.ALL, params), { enabled }),
  useGetIgPosts: (params?: Params, enabled = true) => useQueries<any>([KEYS.IG_POST.ALL, params], () => Get(URL_KEYS.IG_POST.ALL, params), { enabled }),
  useGetAllBanners: (enabled = true) => useQueries<BannerApiResponse>([KEYS.BANNER.ALL], () => Get(URL_KEYS.BANNER.ALL), { enabled }),
  useGetSaleBanner: (enabled = true) => useQueries<SaleBannerApiResponse>([KEYS.SALE_BANNER.ALL], () => Get(URL_KEYS.SALE_BANNER.BASE), { enabled }),
  useGetAllCategories: (params?: Params, enabled = true) => useQueries<any>([KEYS.CATEGORY.ALL, params], () => Get(URL_KEYS.CATEGORY.ALL, params), { enabled }),
};
