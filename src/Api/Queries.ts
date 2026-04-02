import { KEYS, URL_KEYS } from "../Constants";
import type { PolicyType } from "../Constants";
import type {
  ApiResponse,
  AboutApiResponse,
  FaqApiResponse,
  Params,
  PolicyApiResponse,
  UserProfileResponse,
} from "../Types";
import { Get } from "./Methods/Get";
import { useQueries } from "./ReactQuery/useQueries";

export const Queries = {
  useGetSingleUser: (id?: string) =>useQueries<UserProfileResponse>(  [KEYS.USER.BASE, id],  () => Get(`${URL_KEYS.USER.BASE}/${id}`),  { enabled: !!id },),
  useGetUserDropdown: (params?: Params, enabled?: boolean) =>useQueries<UserProfileResponse>(  [KEYS.USER.DROPDOWN, params],  () => Get(URL_KEYS.USER.DROPDOWN, params),  { enabled },),
  useGetUploadedImage: (enabled = true) => useQueries<ApiResponse>([KEYS.UPLOAD.IMAGE], () => Get(URL_KEYS.UPLOAD.IMAGE), { enabled }),
  useGetPolicyByType: (policyType?: PolicyType, enabled = true) =>useQueries<PolicyApiResponse>(  [KEYS.POLICY.ALL, policyType],  () => Get(URL_KEYS.POLICY.ALL, policyType ? { typeFilter: policyType } : undefined),  { enabled: enabled && !!policyType },),
  useGetAboutSections: (contentType?: string, enabled = true) =>useQueries<AboutApiResponse>(  [KEYS.ABOUT.ALL, contentType],  () => Get(URL_KEYS.ABOUT.ALL, contentType ? { typeFilter: contentType } : undefined),  { enabled },),
  useGetFaqAll: (enabled = true) =>useQueries<FaqApiResponse>([KEYS.FAQ.ALL], () => Get(URL_KEYS.FAQ.ALL), { enabled }),
};
