import axios, { AxiosError, type AxiosInstance } from "axios";
import * as SecureStore from "expo-secure-store";
import { env } from "../utils/env";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";

let cachedAccessToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  if (cachedAccessToken) return cachedAccessToken;
  const stored = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  cachedAccessToken = stored;
  return stored;
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  cachedAccessToken = tokens.accessToken;
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  cachedAccessToken = null;
}

const apiBaseUrl = env.EXPO_PUBLIC_TRPC_URL.replace(/\/trpc\/?$/, "");

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${apiBaseUrl}/auth/refresh`, { refreshToken });
    await setTokens(data);
    return data.accessToken;
  } catch {
    await clearTokens();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (typeof error.config & { _retried?: boolean })
      | undefined;
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      refreshing ??= refreshAccessToken().finally(() => {
        refreshing = null;
      });
      const newToken = await refreshing;
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(original);
      }
    }
    return Promise.reject(error);
  },
);
