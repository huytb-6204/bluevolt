"use client";

import { type JSX, useEffect, useState } from "react";
import Link from "next/link";
import {
  listVehicles,
  VEHICLE_TYPE_LABEL,
  type Vehicle,
  type VehicleType,
} from "@/lib/vehicles-api";
import { formatPrice } from "@/lib/bookings-api";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";
import { Button } from "@repo/ui/components/base/button";
import {
  Bike,
  Battery,
  Gauge,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-react";

const TYPE_FILTERS: Array<{ value: VehicleType | "ALL"; label: string }> = [
  { value: "ALL", label: "Tất cả" },
  { value: "SCOOTER", label: "Xe ga" },
  { value: "MOTORBIKE", label: "Xe máy" },
  { value: "PREMIUM", label: "Cao cấp" },
];

export default function VehiclesCatalogPage(): JSX.Element {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<VehicleType | "ALL">("ALL");

  useEffect(() => {
    setLoading(true);
    setError(null);
    listVehicles(filter === "ALL" ? undefined : filter)
      .then(setVehicles)
      .catch(() => setError("Không tải được danh sách xe."))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 mb-3">
              <Bike className="w-3.5 h-3.5 mr-1.5" />
              Đội xe BlueVolt
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Khám phá các mẫu xe máy điện
            </h1>
            <p className="text-slate-600 text-lg">
              Chọn xe phù hợp với nhu cầu — giá minh bạch, đặt nhanh trong 60
              giây.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-600">{error}</div>
        )}

        {!loading && !error && vehicles.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Chưa có xe nào trong nhóm này.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Link key={v.id} href={`/vehicles/${v.id}`} className="group">
              <Card className="overflow-hidden border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center overflow-hidden">
                  {v.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Bike
                      className="w-32 h-32 text-blue-600/30 group-hover:scale-110 transition-transform"
                      strokeWidth={1.2}
                    />
                  )}
                  <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-600 text-white border-0">
                    {VEHICLE_TYPE_LABEL[v.type]}
                  </Badge>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    4.8
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {v.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Battery className="w-4 h-4 text-blue-600" />
                      {v.rangeKm} km
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      {v.maxSpeed} km/h
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(v.pricePerDay)}
                      </p>
                      <p className="text-xs text-slate-500">/ ngày</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      Xem chi tiết
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
