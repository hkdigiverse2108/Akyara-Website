import { KEYS, URL_KEYS } from "../Constants";
import type { PolicyType } from "../Constants";
import type { AboutApiResponse, Params, PolicyApiResponse, UserProfileResponse } from "../Types";
import { Get } from "./Methods/Get";
import { useQueries } from "./ReactQuery/useQueries";

export const Queries = {
  useGetSingleUser: (id?: string) =>useQueries<UserProfileResponse>([KEYS.USER.BASE, id],() => Get(`${URL_KEYS.USER.BASE}/${id}`),{ enabled: !!id }),
  useGetUserDropdown: (params?: Params, enabled?: boolean) =>useQueries<UserProfileResponse>([KEYS.USER.DROPDOWN, params],() => Get(URL_KEYS.USER.DROPDOWN, params),{ enabled: enabled }),
  useGetPolicyByType: (policyType?: PolicyType, enabled = true) =>useQueries<PolicyApiResponse>([KEYS.POLICY.ALL, policyType],() => Get(URL_KEYS.POLICY.ALL, policyType ? { typeFilter: policyType } : undefined),{ enabled: enabled && !!policyType }),
  useGetAboutSections: (enabled = true) =>useQueries<AboutApiResponse>([KEYS.ABOUT.ALL], () => Get(URL_KEYS.ABOUT.ALL), {enabled,}),
};
