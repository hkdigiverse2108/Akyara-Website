import { KEYS, URL_KEYS } from "../Constants";
import { Get } from "./Methods/Get";
import { useQueries } from "./ReactQuery/useQueries";
import type { Params, UserProfileResponse } from "../Types";

export const Queries = {
  useGetSingleUser: (id?: string) =>
    useQueries<UserProfileResponse>([KEYS.USER.BASE, id], () => Get(`${URL_KEYS.USER.BASE}/${id}`), { enabled: !!id }),
  useGetUserDropdown: (params?: Params, enabled?: boolean) =>
    useQueries<UserProfileResponse>([KEYS.USER.DROPDOWN, params], () => Get(URL_KEYS.USER.DROPDOWN, params), {
      enabled,
    }),
};
