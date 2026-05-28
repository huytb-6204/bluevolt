"use client";

import { type JSX, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  listAllBookingsAdmin,
  setBookingStatus,
  formatPrice,
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_COLOR,
  type AdminBooking,
  type BookingStatus,
} from "@/lib/bookings-api";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/base/select";
import { Bike, Loader2, Calendar as CalendarIcon, User } from "lucide-react";

const STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminBookingsPage(): JSX.Element {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");

  function refresh() {
    setLoading(true);
    listAllBookingsAdmin()
      .then(setBookings)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  async function onStatusChange(id: string, status: BookingStatus) {
    setUpdatingId(id);
    try {
      await setBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
    } catch {
      alert("Không cập nhật được trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell title="Quản lý đặt xe">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-slate-500">
          {loading ? "Đang tải..." : `${filtered.length} / ${bookings.length} đơn`}
        </p>
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as BookingStatus | "ALL")}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {BOOKING_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-12 text-center text-slate-500">
            Không có đơn nào.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.id} className="border-slate-200">
              <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Bike className="w-6 h-6 text-blue-600/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">
                      {b.vehicle.name}
                    </span>
                    <Badge
                      className={`${BOOKING_STATUS_COLOR[b.status]} hover:opacity-90 border-0`}
                    >
                      {BOOKING_STATUS_LABEL[b.status]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {b.user.username} ({b.user.email})
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {fmtDate(b.startDate)} → {fmtDate(b.endDate)} ·{" "}
                      {b.days} ngày
                    </span>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(b.totalPrice)}
                    </span>
                  </div>
                </div>
                <Select
                  value={b.status}
                  onValueChange={(v) =>
                    onStatusChange(b.id, v as BookingStatus)
                  }
                  disabled={updatingId === b.id}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {BOOKING_STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
