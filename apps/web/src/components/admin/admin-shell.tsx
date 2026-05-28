"use client";

import { type JSX, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  Bike,
  CalendarCheck,
  Users,
  Loader2,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/vehicles", label: "Đội xe", icon: Bike },
  { href: "/admin/bookings", label: "Đặt xe", icon: CalendarCheck },
  { href: "/admin/users", label: "Người dùng", icon: Users },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace("/sign-in?from=" + encodeURIComponent(pathname));
    }
  }, [isSignedIn, isLoading, pathname, router]);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Bạn không có quyền truy cập
          </h1>
          <p className="text-slate-500">
            Khu vực này dành cho quản trị viên. Vui lòng liên hệ admin nếu cần
            quyền truy cập.
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-slate-200 p-3 lg:sticky lg:top-24">
              <div className="px-3 pt-2 pb-3">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                  Quản trị
                </p>
              </div>
              <div className="flex lg:flex-col gap-1 overflow-x-auto">
                {items.map((it) => {
                  const active = it.exact
                    ? pathname === it.href
                    : pathname.startsWith(it.href);
                  return (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <it.icon className="w-4 h-4 flex-shrink-0" />
                      {it.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
