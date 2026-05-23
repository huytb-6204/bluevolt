import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";
import { type JSX } from "react";
import { AppTRPCProvider } from "@/providers/trpc-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "BlueVolt — Thuê xe máy điện số 1 Việt Nam",
  description: "Đặt xe máy điện nhanh 60s, giao tận nơi, bảo hiểm toàn diện. 500+ xe điện chất lượng tại 20+ tỉnh thành.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="vi" className="">
      <body
        className="bg-[#020617] text-white"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        <AuthProvider>
          <PostHogProvider>
            <ReduxProvider>
              <AppTRPCProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">{children}</main>
                </div>
              </AppTRPCProvider>
            </ReduxProvider>
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
