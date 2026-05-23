"use client";

import React, { type JSX, useState } from "react";
import Link from "next/link";
import {
  Zap,
  LayoutDashboard,
  Bike,
  CalendarCheck,
  Users,
  UserCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  Search,
  ChevronDown,
  ArrowUpRight,
  Activity,
  DollarSign,
  Star,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/admin", active: true },
  { icon: <Bike className="w-5 h-5" />, label: "Đội xe", href: "/admin/vehicles", badge: "156" },
  { icon: <CalendarCheck className="w-5 h-5" />, label: "Đặt xe", href: "/admin/bookings", badge: "47" },
  { icon: <UserCheck className="w-5 h-5" />, label: "Chủ xe", href: "/admin/owners" },
  { icon: <Users className="w-5 h-5" />, label: "Người dùng", href: "/admin/users" },
];

const STATS = [
  {
    title: "Tổng doanh thu",
    value: "12.450.000đ",
    change: "+23%",
    trend: "up",
    sub: "So với tháng trước",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-[#F5A623]",
    bg: "bg-[#F5A623]/10",
  },
  {
    title: "Đặt xe mới",
    value: "47",
    change: "+12%",
    trend: "up",
    sub: "Trong 24 giờ qua",
    icon: <CalendarCheck className="w-6 h-6" />,
    color: "text-[#0EA5E9]",
    bg: "bg-[#0EA5E9]/10",
  },
  {
    title: "Xe đang thuê",
    value: "89/156",
    change: "57%",
    trend: "up",
    sub: "Tỉ lệ sử dụng",
    icon: <Bike className="w-6 h-6" />,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    title: "Chủ xe mới",
    value: "8",
    change: "-3%",
    trend: "down",
    sub: "Tuần này",
    icon: <UserCheck className="w-6 h-6" />,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
];

const RECENT_BOOKINGS = [
  { id: "BV-2841", customer: "Nguyễn Minh Tuấn", vehicle: "VinFast Klara S", time: "2 phút trước", status: "confirmed", price: "450.000đ" },
  { id: "BV-2840", customer: "Trần Thị Lan", vehicle: "Dat Bike Weaver", time: "15 phút trước", status: "pending", price: "720.000đ" },
  { id: "BV-2839", customer: "Phạm Quốc Hưng", vehicle: "Yadea G5", time: "32 phút trước", status: "active", price: "290.000đ" },
  { id: "BV-2838", customer: "Lê Thị Mai", vehicle: "VinFast Klara S", time: "1 giờ trước", status: "completed", price: "600.000đ" },
  { id: "BV-2837", customer: "Hoàng Văn Đức", vehicle: "Dat Bike Weaver", time: "2 giờ trước", status: "completed", price: "1.200.000đ" },
];

const ALERTS = [
  {
    type: "warning",
    icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
    title: "Pin thấp — V-0452",
    desc: "VinFast Klara S còn 12% pin, cần sạc ngay",
    time: "5 phút trước",
  },
  {
    type: "info",
    icon: <UserCheck className="w-4 h-4 text-[#0EA5E9]" />,
    title: "Chủ xe chờ duyệt",
    desc: "Nguyễn Văn An đang chờ xác minh hồ sơ",
    time: "20 phút trước",
  },
  {
    type: "success",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    title: "Bảo dưỡng hoàn thành",
    desc: "10 xe đã hoàn thành bảo dưỡng định kỳ",
    time: "1 giờ trước",
  },
];

const POPULAR_VEHICLES = [
  { name: "VinFast Klara S", bookings: 124, revenue: "5.580.000đ", rating: 4.9, utilization: 78 },
  { name: "Dat Bike Weaver", bookings: 87, revenue: "4.350.000đ", rating: 4.8, utilization: 65 },
  { name: "Yadea G5", bookings: 93, revenue: "2.520.000đ", rating: 4.7, utilization: 71 },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30",
  pending: "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30",
  active: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
  completed: "bg-slate-700/60 text-slate-400 border border-slate-600/30",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Đã xác nhận",
  pending: "Chờ xử lý",
  active: "Đang thuê",
  completed: "Hoàn thành",
};

export default function AdminDashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview");

  return (
    <div
      className="min-h-screen bg-[#020617] text-white flex"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col fixed top-0 bottom-0 left-0">
        {/* Logo */}
        <div className="p-5 border-b border-[#1E293B]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#F5A623] rounded-xl flex items-center justify-center shadow-lg shadow-[#F5A623]/20">
              <Zap className="w-5 h-5 text-[#020617]" fill="currentColor" />
            </div>
            <div>
              <span
                className="text-lg font-bold leading-none block"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                BLUE<span className="text-[#F5A623]">VOLT</span>
              </span>
              <span className="text-xs text-slate-500">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold tracking-widest text-slate-600 uppercase mb-3 px-3">
            Quản lý
          </p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? "bg-[#1B3A8C]/50 text-white border border-[#1B3A8C]/60"
                  : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
              }`}
            >
              <span className={item.active ? "text-[#F5A623]" : ""}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-[#1E293B] text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom user */}
        <div className="p-4 border-t border-[#1E293B]">
          <div className="flex items-center gap-3 bg-[#1E293B] rounded-xl p-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B3A8C] to-[#0EA5E9] flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Admin</div>
              <div className="text-xs text-slate-500 truncate">admin@bluevolt.vn</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-[#020617]/90 backdrop-blur-md border-b border-[#1E293B] h-16 flex items-center px-6 gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm kiếm xe, đơn thuê, người dùng..."
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-[#1B3A8C] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-[#0F172A] border border-[#1E293B] rounded-xl flex items-center justify-center hover:border-[#1B3A8C] transition-colors">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F5A623] rounded-full text-[10px] font-bold text-[#020617] flex items-center justify-center">
                3
              </span>
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B3A8C] to-[#0EA5E9] flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                DASHBOARD
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Thứ Sáu, 23 tháng 5 năm 2026
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#0F172A] border border-[#1E293B] rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-[#1B3A8C] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "analytics"
                    ? "bg-[#1B3A8C] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Phân tích
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {STATS.map((s) => (
              <div
                key={s.title}
                className="bg-[#0F172A] border border-[#1E293B] hover:border-[#1B3A8C]/50 rounded-2xl p-5 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
                    {s.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      s.trend === "up"
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-red-400 bg-red-400/10"
                    }`}
                  >
                    {s.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {s.change}
                  </div>
                </div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-sm font-medium text-slate-300 mb-0.5">{s.title}</div>
                <div className="text-xs text-slate-500">{s.sub}</div>
              </div>
            ))}
          </div>

          {activeTab === "overview" ? (
            <div className="grid xl:grid-cols-3 gap-6">
              {/* Recent Bookings — 2 cols */}
              <div className="xl:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
                  <h2
                    className="font-bold"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    ĐƠN THUÊ GẦN ĐÂY
                  </h2>
                  <Link
                    href="/admin/bookings"
                    className="text-xs text-[#0EA5E9] hover:text-[#F5A623] flex items-center gap-1 transition-colors"
                  >
                    Xem tất cả
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="divide-y divide-[#1E293B]">
                  {RECENT_BOOKINGS.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#1E293B]/50 transition-colors"
                    >
                      <div className="hidden sm:flex w-9 h-9 rounded-xl bg-[#1E293B] items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                        {b.customer[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{b.customer}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {b.vehicle} · {b.id}
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {b.time}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[b.status]}`}>
                        {STATUS_LABELS[b.status]}
                      </span>
                      <div className="text-sm font-semibold text-[#F5A623] flex-shrink-0 hidden sm:block">
                        {b.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: Alerts + mini stats */}
              <div className="flex flex-col gap-4">
                {/* Real-time Alerts */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden flex-1">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
                    <h2
                      className="font-bold flex items-center gap-2"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      <Activity className="w-4 h-4 text-[#F5A623]" />
                      GIÁM SÁT THỜI GIAN THỰC
                    </h2>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {ALERTS.map((a, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 p-3 rounded-xl border ${
                          a.type === "warning"
                            ? "bg-yellow-400/5 border-yellow-400/20"
                            : a.type === "success"
                              ? "bg-emerald-400/5 border-emerald-400/20"
                              : "bg-[#0EA5E9]/5 border-[#0EA5E9]/20"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">{a.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold leading-tight">{a.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 leading-snug">{a.desc}</div>
                          <div className="text-xs text-slate-600 mt-1">{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Analytics tab */
            <div className="grid xl:grid-cols-2 gap-6">
              {/* Popular vehicles */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
                  <h2
                    className="font-bold"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    XE PHỔ BIẾN NHẤT
                  </h2>
                  <span className="text-xs text-slate-500">Tháng này</span>
                </div>

                <div className="p-5 space-y-5">
                  {POPULAR_VEHICLES.map((v, i) => (
                    <div key={v.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-lg bg-[#1E293B] flex items-center justify-center text-xs font-bold text-slate-400"
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <div className="text-sm font-semibold">{v.name}</div>
                            <div className="text-xs text-slate-500">
                              {v.bookings} đơn · {v.revenue}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#F5A623]">
                          <Star className="w-3 h-3" fill="currentColor" />
                          {v.rating}
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#1B3A8C] to-[#0EA5E9] rounded-full transition-all"
                          style={{ width: `${v.utilization}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Tỉ lệ sử dụng</span>
                        <span className="text-[#0EA5E9]">{v.utilization}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue chart placeholder */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
                  <h2
                    className="font-bold"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    DOANH THU THEO TUẦN
                  </h2>
                  <span className="text-xs text-slate-500">7 ngày qua</span>
                </div>

                <div className="p-5">
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-2 h-40 mb-3">
                    {[65, 40, 80, 55, 90, 72, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-[#1B3A8C] to-[#0EA5E9] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ height: `${h}%` }}
                          title={`${(h * 200000).toLocaleString()}đ`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <span key={d} className="flex-1 text-center">{d}</span>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#1E293B] grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Cao nhất</div>
                      <div className="text-sm font-bold text-[#F5A623]">1.900.000đ</div>
                      <div className="text-xs text-slate-600">Chủ nhật</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Trung bình</div>
                      <div className="text-sm font-bold text-white">1.278.000đ</div>
                      <div className="text-xs text-slate-600">/ngày</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Tổng tuần</div>
                      <div className="text-sm font-bold text-[#0EA5E9]">8.950.000đ</div>
                      <div className="text-xs text-emerald-400">+18% ↑</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking status breakdown */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl xl:col-span-2 overflow-hidden">
                <div className="px-5 py-4 border-b border-[#1E293B]">
                  <h2
                    className="font-bold"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    PHÂN BỐ TRẠNG THÁI ĐẶT XE
                  </h2>
                </div>
                <div className="p-5 grid sm:grid-cols-4 gap-4">
                  {[
                    { label: "Đã xác nhận", count: 18, pct: 38, color: "bg-[#0EA5E9]" },
                    { label: "Đang thuê", count: 21, pct: 45, color: "bg-emerald-400" },
                    { label: "Chờ xử lý", count: 5, pct: 11, color: "bg-yellow-400" },
                    { label: "Hủy", count: 3, pct: 6, color: "bg-red-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#1E293B]/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-3 h-3 rounded-full ${s.color}`} />
                        <span className="text-xs text-slate-400">{s.label}</span>
                      </div>
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ fontFamily: "'Oswald', sans-serif" }}
                      >
                        {s.count}
                      </div>
                      <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full ${s.color} rounded-full`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1.5">{s.pct}% tổng</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
