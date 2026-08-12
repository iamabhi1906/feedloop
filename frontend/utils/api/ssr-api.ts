"use server";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";

export async function serverApi(): Promise<AxiosInstance> {
  try {
    const cookieStore = await cookies();

    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050",
      timeout: 10000,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    let isRefreshing = false;
    let refreshSubscribers: Array<() => void> = [];

    const onRefreshed = () => {
      refreshSubscribers.forEach((cb) => cb());
      refreshSubscribers = [];
    };

    const addRefreshSubscriber = (cb: () => void) => {
      refreshSubscribers.push(cb);
    };

    api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as
          | (InternalAxiosRequestConfig & { _retry?: boolean })
          | undefined;
        try {
          if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;
            if (isRefreshing) {
              return new Promise((resolve) => {
                addRefreshSubscriber(() => resolve(api(originalRequest)));
              });
            }
            isRefreshing = true;
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/auth/refresh`,
                {},
                {
                  headers: {
                    Cookie: cookieStore.toString(),
                  },
                },
              );
              isRefreshing = false;
              onRefreshed();
              return api(originalRequest);
            } catch {
              isRefreshing = false;
              onRefreshed();
              return Promise.resolve({
                data: null,
                status: 401,
                statusText: "Unauthorized",
                headers: {},
                config: originalRequest,
              });
            }
          }
          return Promise.resolve({
            data: null,
            status: error.response?.status ?? 500,
            statusText: error.response?.statusText ?? "Error",
            headers: error.response?.headers ?? {},
            config: originalRequest,
          });
        } catch {
          isRefreshing = false;
          onRefreshed();
          return Promise.resolve({
            data: null,
            status: 500,
            statusText: "Internal Error",
            headers: {},
            config: originalRequest,
          });
        }
      },
    );

    return api;
  } catch (err) {
    console.error("serverApi error:", err);
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050",
      timeout: 10000,
    });
  }
}
