import React from "react";
import type { Metadata } from "next";
import { type JSX } from "react";

export const metadata: Metadata = {
  title: "Admin — BlueVolt Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <>{children}</>;
}
