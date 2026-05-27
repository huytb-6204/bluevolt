"use client";

import { type JSX } from "react";
import Link from "next/link";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Button } from "@repo/ui/components/base/button";
import { Bike, ArrowRight } from "lucide-react";

export default function TripsPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chuyến đi của tôi</h1>
        <p className="text-slate-500 mt-1">
          Lịch sử và chuyến đi đang hoạt động.
        </p>
      </div>

      <Card className="border-slate-200">
        <CardContent className="py-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Bike className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Chưa có chuyến đi nào
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm">
            Bạn chưa thuê xe lần nào. Khám phá các mẫu xe điện và bắt đầu chuyến
            đi xanh đầu tiên.
          </p>
          <Button
            asChild
            className="mt-5 bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Link href="/#fleet">
              Thuê xe ngay
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
