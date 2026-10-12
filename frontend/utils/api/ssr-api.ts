"use server";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
export async function serverApi(): Promise<AxiosInstance> {
  const cookieStore = await cookies();
  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });
  api.interceptors.request.use(async (config) => {
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      config.headers.Cookie = cookieHeader;
    }
    return config;
  });
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig | undefined;
      // Only refresh once
      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      console.log(error.request.path);
      try {
        const currentCookies = cookieStore.toString();
        console.log(currentCookies);
        const refreshResponse = await axios.post(
          "/api/refresh",
          {},
          {
            headers: {
              Cookie: currentCookies,
            },
          },
        );
        console.log(refreshResponse);
        const setCookies = refreshResponse.headers["set-cookie"] ?? [];
        const newCookies = new Map<string, string>();
        for (const cookie of currentCookies.split(";")) {
          const separator = cookie.indexOf("=");
          if (separator === -1) continue;
          const name = cookie.slice(0, separator).trim();
          const value = cookie.slice(separator + 1).trim();
          newCookies.set(name, value);
        }
        for (const cookie of setCookies) {
          const [nameValue] = cookie.split(";");
          const separator = nameValue.indexOf("=");
          if (separator === -1) continue;
          const name = nameValue.slice(0, separator).trim();
          const value = nameValue.slice(separator + 1).trim();
          newCookies.set(name, value);
        }
        const retryCookieHeader = Array.from(newCookies.entries())
          .map(([name, value]) => `${name}=${value}`)
          .join("; ");
        originalRequest.headers.Cookie = retryCookieHeader;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );

  return api;
}
