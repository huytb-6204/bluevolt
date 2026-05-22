"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return <>{children}</>;
}
