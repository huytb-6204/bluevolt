"use client";

import { type JSX } from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";
import { Button } from "@repo/ui/components/base/button";
import { Bike, Clock, CreditCard, User as UserIcon, ArrowRight } from "lucide-react";

const roleLabel: Record<string, string> = {
  USER: "Khách hàng",
  ADMIN: "Quản trị viên",
  SUPERADMIN: "Quản trị cấp cao",
};

const stats = [
  { label: "Chuyến đã đặt", value: "0", icon: Bike, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Đang thuê", value: "0", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Tổng chi tiêu", value: "0đ", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
];

export default function DashboardPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);

  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Xin chào, {displayName} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Chào mừng trở lại với BlueVolt.
          </p>
        </div>
        {user?.role && (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 w-fit">
            {roleLabel[user.role] ?? user.role}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-slate-200">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Bắt đầu nhanh</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <Button
            asChild
            variant="outline"
            className="justify-between h-auto py-4 border-slate-200 text-slate-900"
          >
            <Link href="/#fleet">
              <span className="flex items-center gap-3">
                <Bike className="w-5 h-5 text-blue-600" />
                Thuê xe mới
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="justify-between h-auto py-4 border-slate-200 text-slate-900"
          >
            <Link href="/dashboard/profile">
              <span className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-emerald-600" />
                Cập nhật hồ sơ
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
