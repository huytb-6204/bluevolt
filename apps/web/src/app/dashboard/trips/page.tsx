"use client";

import { type JSX, useEffect, useState } from "react";
import Link from "next/link";
import {
  listMyBookings,
  cancelBooking,
  formatPrice,
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_COLOR,
  type Booking,
} from "@/lib/bookings-api";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Button } from "@repo/ui/components/base/button";
import { Badge } from "@repo/ui/components/base/badge";
import {
  Bike,
  ArrowRight,
  Loader2,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TripsPage(): JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    listMyBookings()
      .then(setBookings)
      .catch(() => setError("Không tải được danh sách chuyến đi."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCancel(id: string) {
    setCancellingId(id);
    try {
      const updated = await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? updated : b)),
      );
    } catch {
      setError("Không huỷ được đơn này.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chuyến đi của tôi</h1>
        <p className="text-slate-500 mt-1">
          Lịch sử và chuyến đi đang hoạt động.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : bookings.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Bike className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Chưa có chuyến đi nào
            </h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              Bạn chưa thuê xe lần nào. Khám phá các mẫu xe điện và bắt đầu
              chuyến đi xanh đầu tiên.
            </p>
            <Button
              asChild
              className="mt-5 bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Link href="/vehicles">
                Thuê xe ngay
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const canCancel =
              b.status !== "CANCELLED" &&
              b.status !== "COMPLETED" &&
              b.status !== "ACTIVE";
            return (
              <Card key={b.id} className="border-slate-200">
                <CardContent className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
                    <Bike className="w-8 h-8 text-blue-600/60" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate">
                        {b.vehicle.name}
                      </h3>
                      <Badge
                        className={`${BOOKING_STATUS_COLOR[b.status]} border-0 hover:opacity-90 flex-shrink-0`}
                      >
                        {BOOKING_STATUS_LABEL[b.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mb-2">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {fmtDate(b.startDate)} → {fmtDate(b.endDate)}
                      </span>
                      <span>{b.days} ngày</span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      {formatPrice(b.totalPrice)}
                    </p>
                    {b.note && (
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        Ghi chú: {b.note}
                      </p>
                    )}
                  </div>
                  {canCancel && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      {cancellingId === b.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Đang huỷ...
                        </>
                      ) : (
                        "Huỷ đơn"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
