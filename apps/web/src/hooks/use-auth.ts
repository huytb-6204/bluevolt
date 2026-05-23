"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  const hydrate = useAuthStore((s) => s.hydrate);
  const router = useRouter();

  const signOut = () => {
    logout();
    router.push("/sign-in");
  };

  return { user, isSignedIn, isLoading, signOut, hydrate };
}

// Redirect về /sign-in nếu chưa đăng nhập
export function useRequireAuth() {
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, isLoading, router]);

  return { user, isSignedIn, isLoading };
}

// Redirect về "/" nếu đã đăng nhập (dùng cho /sign-in, /sign-up)
export function useRedirectIfSignedIn(redirectTo: string = "/") {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace(redirectTo);
    }
  }, [isSignedIn, redirectTo, router]);
}
