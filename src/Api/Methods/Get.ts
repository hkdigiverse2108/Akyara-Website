import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { ErrorMessage, ShowNotification } from "../../Attribute/Notification";
import { HTTP_STATUS, ROUTES } from "../../Constants";
import type { Params } from "../../Types";
import { getApiBaseUrl, getToken, Storage } from "../../Utils";

let isRedirecting = false;

export async function Get<T>(url: string, params?: Params, headers?: Record<string, string>): Promise<T> {
  const authToken = getToken();
  const BASE_URL = getApiBaseUrl();
  const config: AxiosRequestConfig = {
    method: "GET",
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    params,
  };

  try {
    const response = await axios.get<T>(BASE_URL + url, config);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status?: string }>;

    if (axiosError?.response?.status === HTTP_STATUS.UNAUTHORIZED && !!authToken && !isRedirecting) {
      Storage.clear();
      isRedirecting = true;
      window.location.href = ROUTES.HOME;
      setTimeout(() => (isRedirecting = false), 1000);
    } else {
      ShowNotification(ErrorMessage(error), "error");
    }
    throw null;
  }
}
