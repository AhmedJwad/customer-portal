import axios from "axios";
import { tokenStorage, type AuthTokens } from "./tokenStorage";
import type { HttpResponseWrapper } from "../Repositories/httpResponseWrapper";

const baseURL = import.meta.env.VITE_API_URL ?? "https://localhost:44372/api/";

export const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});


const refreshClient = axios.create({ baseURL, timeout: 30000 });

let refreshPromise: Promise<string | null> | null = null;

const refreshTokens = (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const current = tokenStorage.get();
      if (!current) return null;
      try {
        const { data } = await refreshClient.post<AuthTokens>("Accounts/Refresh", {
          refreshToken: current.refreshToken,
        });
        tokenStorage.set(data);
        return data.token;
      } catch {
        tokenStorage.clear();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

axiosInstance.interceptors.request.use((config) => {
  const tokens = tokenStorage.get();
  if (tokens?.token) config.headers.Authorization = `Bearer ${tokens.token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const url: string = original?.url ?? "";
    const isAuthCall = url.includes("Accounts/Login") || url.includes("Accounts/Refresh");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthCall &&
      tokenStorage.get()
    ) {
      original._retry = true;
      const newToken = await refreshTokens();

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original); // إعادة الطلب الأصلي
      }

      const publicPaths = ["/", "/cart", "/ContinueShopping", "/homeproducts", "/register"];
      const path = window.location.pathname;
      const isPublic = publicPaths.includes(path) || path.startsWith("/homeproducts/");
      if (!isPublic) window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

const extractErrorMessage = (errorData: any): string => {
  if (!errorData) return "An unexpected error has occurred.";
  if (typeof errorData === "string") return errorData;
  if (typeof errorData.message === "string") return errorData.message;
  return JSON.stringify(errorData);
};


const request = async <T>(call: () => Promise<{ data: T; status: number }>): Promise<HttpResponseWrapper<T>> => {
  try {
    const response = await call();
    return { response: response.data, error: false, statusCode: response.status };
  } catch (error: any) {
    return {
      response: null,
      error: true,
      statusCode: error.response?.status ?? 500,
      message: extractErrorMessage(error.response?.data),
    };
  }
};

const httpService = {
  get: <T>(url: string, params: Record<string, any> | null = null) =>
    request<T>(() => axiosInstance.get(url, { params })),

  post: <T>(url: string, data?: any) =>
    request<T>(() => axiosInstance.post(url, data)),

  put: <T>(url: string, data?: any) =>
    request<T>(() => axiosInstance.put(url, data)),

  delete: <T>(url: string) =>
    request<T>(() => axiosInstance.delete(url)),
};

export default httpService;