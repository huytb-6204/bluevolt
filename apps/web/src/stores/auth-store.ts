"use client";

import { create } from "zustand";
import {
  apiClient,
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/lib/api-client";

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
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSignedIn: false,
  isLoading: false,

  async hydrate() {
    if (!getAccessToken()) {
      set({ user: null, isSignedIn: false });
      return;
    }
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get<AuthUser>("/auth/me");
      set({ user: data, isSignedIn: true });
    } catch {
      clearTokens();
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
      setTokens(data);
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
      setTokens(data);
      const { data: me } = await apiClient.get<AuthUser>("/auth/me");
      set({ user: me, isSignedIn: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout() {
    clearTokens();
    set({ user: null, isSignedIn: false });
  },
}));
