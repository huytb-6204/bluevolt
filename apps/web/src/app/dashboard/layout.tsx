"use client";

import { type JSX, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRequireAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  User as UserIcon,
  Bike,
  Shield,
  Loader2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Hồ sơ", icon: UserIcon },
  { href: "/dashboard/trips", label: "Chuyến đi", icon: Bike },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { isLoading, user } = useRequireAuth();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  const items = [
    ...navItems,
    ...(isAdmin
      ? [{ href: "/admin", label: "Quản trị", icon: Shield }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-slate-200 p-3 lg:sticky lg:top-24">
              <div className="flex lg:flex-col gap-1 overflow-x-auto">
                {items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
