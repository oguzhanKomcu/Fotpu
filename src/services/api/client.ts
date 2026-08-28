import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { secureStorage } from '../storage/secureStorage';
import { RefreshTokenUserCommand, LoginResponse } from '@/types/auth';

const BASE_URL = ENV.API_BASE_URL;
const TIMEOUT = ENV.API_TIMEOUT;

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Bearer JWT Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const tokens = await secureStorage.getTokens();
    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Auto Refresh Token via /api/Auth/refresh-token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await secureStorage.getTokens();
        if (!tokens?.refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshCommand: RefreshTokenUserCommand = {
          expiredAccessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };

        const response = await axios.post<LoginResponse>(
          `${BASE_URL}/api/Auth/refresh-token`,
          refreshCommand
        );

        const newAccessToken = response.data.accessToken || (response.data as any).data?.accessToken;
        const newRefreshToken = response.data.refreshToken || (response.data as any).data?.refreshToken;

        if (!newAccessToken) {
          throw new Error('Token refresh did not return a valid access token');
        }

        const newTokens = {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || tokens.refreshToken,
          expiresIn: 3600,
        };

        await secureStorage.saveTokens(newTokens);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        await secureStorage.clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
