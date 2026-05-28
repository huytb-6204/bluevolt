"use client";

import { type JSX, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getVehicle,
  VEHICLE_TYPE_LABEL,
  type Vehicle,
} from "@/lib/vehicles-api";
import { createBooking, formatPrice } from "@/lib/bookings-api";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import { Alert, AlertDescription } from "@repo/ui/components/base/alert";
import {
  Bike,
  Battery,
  Gauge,
  Calendar as CalendarIcon,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Wind,
  Leaf,
} from "lucide-react";

const MS_DAY = 24 * 60 * 60 * 1000;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function plusDays(yyyymmdd: string, days: number): string {
  const d = new Date(`${yyyymmdd}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function diffDaysInclusive(start: string, end: string): number {
  const s = new Date(`${start}T00:00:00.000Z`).getTime();
  const e = new Date(`${end}T00:00:00.000Z`).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 0;
  return Math.floor((e - s) / MS_DAY) + 1;
}

function extractError(err: unknown, fallback: string): string {
  const msg =
    (err as { response?: { data?: { message?: string | string[] } } })?.response
      ?.data?.message ?? (err instanceof Error ? err.message : fallback);
  return Array.isArray(msg) ? (msg[0] ?? fallback) : msg;
}

export default function VehicleDetailPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const isSignedIn = useAuthStore((s) => s.isSignedIn);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Booking form
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(plusDays(todayStr(), 1));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getVehicle(id)
      .then(setVehicle)
      .catch(() => setLoadError("Không tải được thông tin xe."))
      .finally(() => setLoading(false));
  }, [id]);

  const days = useMemo(
    () => diffDaysInclusive(startDate, endDate),
    [startDate, endDate],
  );

  const total = vehicle ? days * vehicle.pricePerDay : 0;
  const canBook = !!vehicle && days > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!vehicle) return;
    if (!isSignedIn) {
      router.push(`/sign-in?from=/vehicles/${vehicle.id}`);
      return;
    }
    if (days <= 0) {
      setError("Vui lòng chọn ngày hợp lệ.");
      return;
    }
    setSubmitting(true);
    try {
      const booking = await createBooking({
        vehicleId: vehicle.id,
        startDate,
        endDate,
        note: note || undefined,
      });
      setSuccess(
        `Đặt xe thành công! Mã đơn: ${booking.id.slice(0, 8)}. Tổng: ${formatPrice(booking.totalPrice)}.`,
      );
      setNote("");
    } catch (err) {
      setError(extractError(err, "Đặt xe thất bại."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (loadError || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <Card className="max-w-md w-full border-slate-200">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-slate-700">{loadError ?? "Không tìm thấy xe."}</p>
            <Button asChild variant="outline" className="text-slate-900">
              <Link href="/vehicles">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/vehicles"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Danh sách xe
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left — vehicle info */}
          <div className="space-y-6">
            <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {vehicle.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Bike
                  className="w-60 h-60 text-blue-600/30"
                  strokeWidth={1.2}
                />
              )}
              <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-600 text-white border-0">
                {VEHICLE_TYPE_LABEL[vehicle.type]}
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {vehicle.name}
              </h1>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(vehicle.pricePerDay)}
                <span className="text-base font-normal text-slate-500">
                  {" "}
                  / ngày
                </span>
              </p>
            </div>

            {vehicle.description && (
              <p className="text-slate-600 leading-relaxed">
                {vehicle.description}
              </p>
            )}

            <div className="grid sm:grid-cols-3 gap-3">
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Battery className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Quãng đường</p>
                    <p className="font-bold text-slate-900">
                      {vehicle.rangeKm} km
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tốc độ tối đa</p>
                    <p className="font-bold text-slate-900">
                      {vehicle.maxSpeed} km/h
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Vận hành</p>
                    <p className="font-bold text-slate-900">Êm ái</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Bảo hiểm 2 chiều miễn phí
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Leaf className="w-4 h-4 text-emerald-600" />
                100% năng lượng sạch, không khí thải
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                Huỷ miễn phí trước ngày nhận xe
              </div>
            </div>
          </div>

          {/* Right — booking form */}
          <div>
            <Card className="border-slate-200 shadow-lg lg:sticky lg:top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Đặt xe
                </h2>

                {success && (
                  <Alert className="bg-emerald-50 border-emerald-200 text-emerald-700 mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert className="bg-red-50 border-red-200 text-red-700 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="start" className="text-slate-700 text-sm">
                      Ngày nhận xe
                    </Label>
                    <Input
                      id="start"
                      type="date"
                      value={startDate}
                      min={todayStr()}
                      onChange={(e) => {
                        const v = e.target.value;
                        setStartDate(v);
                        if (endDate < v) setEndDate(v);
                      }}
                      className="border-slate-300 h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end" className="text-slate-700 text-sm">
                      Ngày trả xe
                    </Label>
                    <Input
                      id="end"
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border-slate-300 h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note" className="text-slate-700 text-sm">
                      Ghi chú (tuỳ chọn)
                    </Label>
                    <Input
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="VD: giao xe tận nơi"
                      className="border-slate-300 h-11"
                    />
                  </div>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{formatPrice(vehicle.pricePerDay)} × {days || 0} ngày</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!canBook || submitting}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đặt...
                      </>
                    ) : isSignedIn ? (
                      "Đặt xe ngay"
                    ) : (
                      "Đăng nhập để đặt xe"
                    )}
                  </Button>

                  {success && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full text-slate-900"
                    >
                      <Link href="/dashboard/trips">Xem chuyến đi của tôi</Link>
                    </Button>
                  )}

                  <p className="text-xs text-slate-400 text-center pt-2">
                    Thanh toán hiển thị cho mục đích minh hoạ — chưa tích hợp
                    cổng thanh toán thật.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
