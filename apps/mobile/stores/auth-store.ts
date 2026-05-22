import { create } from "zustand";
import {
  apiClient,
  clearTokens,
  getAccessToken,
  setTokens,
} from "../lib/api-client";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isSignedIn: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    email: string;
    username: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSignedIn: false,
  isLoading: false,

  async hydrate() {
    const token = await getAccessToken();
    if (!token) {
      set({ user: null, isSignedIn: false });
      return;
    }
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get<AuthUser>("/auth/me");
      set({ user: data, isSignedIn: true });
    } catch {
      await clearTokens();
      set({ user: null, isSignedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },

  async login(input) {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", input);
      await setTokens(data);
      const { data: me } = await apiClient.get<AuthUser>("/auth/me");
      set({ user: me, isSignedIn: true });
    } finally {
      set({ isLoading: false });
    }
  },

  async register(input) {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", input);
      await setTokens(data);
      const { data: me } = await apiClient.get<AuthUser>("/auth/me");
      set({ user: me, isSignedIn: true });
    } finally {
      set({ isLoading: false });
    }
  },

  async logout() {
    await clearTokens();
    set({ user: null, isSignedIn: false });
  },
}));
