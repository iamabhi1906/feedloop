import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

export const authApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050",
  timeout: 10000,
  withCredentials: true,
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
authApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(authApi(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        isRefreshing = false;
        onRefreshed();
        return authApi(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default authApi;
