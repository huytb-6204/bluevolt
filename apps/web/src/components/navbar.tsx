"use client";

import React, { type JSX, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Zap, Menu, X } from "lucide-react";

export function Navbar(): JSX.Element | null {
  const pathname = usePathname();
  const isSignedIn = useAuthStore((s) => s.isSignedIn);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#020617]" fill="currentColor" />
            </div>
            <span
              className="text-xl font-bold tracking-wide text-white"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              BLUE<span className="text-[#F5A623]">VOLT</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/#vehicles" className="hover:text-[#F5A623] transition-colors">
              Xe điện
            </Link>
            <Link href="/#how-it-works" className="hover:text-[#F5A623] transition-colors">
              Cách thức
            </Link>
            <Link href="/#why-us" className="hover:text-[#F5A623] transition-colors">
              Tại sao chọn chúng tôi
            </Link>
            <Link href="/admin" className="hover:text-[#F5A623] transition-colors">
              Admin
            </Link>
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <span className="text-sm text-slate-400">
                  {user?.username ?? user?.email}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm bg-[#F5A623] hover:bg-[#e09415] text-[#020617] font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Đặt xe ngay
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0F172A] border-t border-[#1E293B] px-4 py-4 flex flex-col gap-3">
          <Link href="/#vehicles" className="text-slate-300 hover:text-[#F5A623] py-1" onClick={() => setMobileOpen(false)}>Xe điện</Link>
          <Link href="/#how-it-works" className="text-slate-300 hover:text-[#F5A623] py-1" onClick={() => setMobileOpen(false)}>Cách thức</Link>
          <Link href="/#why-us" className="text-slate-300 hover:text-[#F5A623] py-1" onClick={() => setMobileOpen(false)}>Tại sao chọn chúng tôi</Link>
          <Link href="/admin" className="text-slate-300 hover:text-[#F5A623] py-1" onClick={() => setMobileOpen(false)}>Admin</Link>
          <div className="border-t border-[#1E293B] pt-3 flex flex-col gap-2">
            {isSignedIn ? (
              <button onClick={() => logout()} className="text-left text-slate-300">Đăng xuất</button>
            ) : (
              <>
                <Link href="/sign-in" className="text-slate-300">Đăng nhập</Link>
                <Link href="/sign-up" className="bg-[#F5A623] text-[#020617] font-semibold px-4 py-2 rounded-lg text-center">Đặt xe ngay</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
