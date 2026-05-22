"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode, Suspense, type JSX } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { env } from "@/env";
import { useAuthStore } from "@/stores/auth-store";

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: false,
    autocapture: true,
    person_profiles: "identified_only",
  });
}

interface PostHogProviderProps {
  children: ReactNode;
}

function PostHogUserIdentification(): JSX.Element | null {
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const posthogClient = usePostHog();

  useEffect(() => {
    if (isSignedIn && user) {
      posthogClient.identify(user.id, {
        email: user.email,
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username,
        first_name: user.firstName,
        last_name: user.lastName,
      });
    } else {
      posthogClient.reset();
    }
  }, [isSignedIn, user, posthogClient]);

  return null;
}

function PostHogPageView(): JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = `${url}?${searchParams.toString()}`;
      }
      posthogClient.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthogClient]);

  return null;
}

function SuspendedTracking(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
      <PostHogUserIdentification />
    </Suspense>
  );
}

export function PostHogProvider({
  children,
}: PostHogProviderProps): JSX.Element {
  return (
    <PHProvider client={posthog}>
      <SuspendedTracking />
      {children}
    </PHProvider>
  );
}

export { posthog };
