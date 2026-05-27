"use client";

import { type JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Legacy /profile route — profile management now lives under /dashboard/profile.
 * Redirect to keep old links working.
 */
export default function ProfileRedirectPage(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center pt-16">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
