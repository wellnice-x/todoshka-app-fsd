import { getAccessToken } from "@/shared/auth/api/accessToken";
import { handleUnauthorizedGlobal } from "@/shared/auth/api/authBridge";
import { SessionRefreshFailedError } from "@/shared/lib/errors";
import axios, { AxiosRequestConfig } from "axios";

const URL = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

type RetryableRequest = AxiosRequestConfig & {
  _retry?: boolean;
};

const axiosClient = axios.create({
  baseURL: `${URL}/rest/v1`,
  timeout: 12000,
});

export default axiosClient;

axiosClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers = config.headers ?? {};
  config.headers.apikey = apiKey;

  return config;
});

let refreshPromise: Promise<void> | null = null;

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequest | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = handleUnauthorizedGlobal().finally(() => {
          refreshPromise = null;
        });
      }

      await refreshPromise;

      const accessToken = getAccessToken();

      if (!accessToken) {
        return Promise.reject(new SessionRefreshFailedError());
      }

      return axiosClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
