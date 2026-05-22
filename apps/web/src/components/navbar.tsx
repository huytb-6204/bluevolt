"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/base/button";
import { useAuthStore } from "@/stores/auth-store";

export function Navbar(): JSX.Element {
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          App Template
        </Link>

        <div className="flex items-center gap-0">
          <Button variant="link" asChild>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </Button>

          <Button variant="link" asChild>
            <Link href="/chat" className="hover:underline">
              Chat
            </Link>
          </Button>

          {isSignedIn ? (
            <>
              <Button variant="link" asChild>
                <Link href="/profile" className="hover:underline">
                  Profile
                </Link>
              </Button>
              <span className="px-2 text-sm">
                {user?.username ?? user?.email}
              </span>
              <Button variant="link" onClick={() => logout()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="link" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
