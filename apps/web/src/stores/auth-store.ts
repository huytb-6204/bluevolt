"use client";

import { create } from "zustand";
import {
  apiClient,
  clearTokens,
  getAccessToken,
  setTokens,
} from "@/lib/api-client";

export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: UserRole;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  username?: string;
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
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  changePassword: (input: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, otp: string) => Promise<string>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<void>;
  sendPhoneOtp: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, code: string) => Promise<{ tokens: { accessToken: string; refreshToken: string } } | { setupToken: string; isNewUser: true }>;
  completePhoneRegister: (setupToken: string, input: { password: string; firstName?: string; lastName?: string }) => Promise<void>;
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

  async updateProfile(input) {
    const { data } = await apiClient.patch<AuthUser>("/auth/me", input);
    set({ user: data });
  },

  async changePassword(input) {
    await apiClient.post("/auth/change-password", input);
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<AuthUser>("/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    set({ user: data });
  },

  logout() {
    clearTokens();
    set({ user: null, isSignedIn: false });
  },

  async forgotPassword(email) {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async verifyResetCode(email, otp) {
    const { data } = await apiClient.post<{ resetToken: string }>(
      "/auth/verify-reset-code",
      { email, otp },
    );
    return data.resetToken;
  },

  async resetPassword(resetToken, newPassword) {
    await apiClient.post("/auth/reset-password", { resetToken, newPassword });
  },

  async sendPhoneOtp(phone) {
    await apiClient.post("/auth/phone/send-otp", { phone });
  },

  async verifyPhoneOtp(phone, code) {
    const { data } = await apiClient.post("/auth/phone/verify-otp", { phone, code });
    if ("tokens" in data) {
      setTokens(data.tokens);
      const { data: me } = await apiClient.get<AuthUser>("/auth/me");
      set({ user: me, isSignedIn: true });
    }
    return data;
  },

  async completePhoneRegister(setupToken, input) {
    const { data } = await apiClient.post<{ accessToken: string; refreshToken: string }>(
      "/auth/phone/complete-register",
      { setupToken, ...input },
    );
    setTokens(data);
    const { data: me } = await apiClient.get<AuthUser>("/auth/me");
    set({ user: me, isSignedIn: true });
  },
}));
