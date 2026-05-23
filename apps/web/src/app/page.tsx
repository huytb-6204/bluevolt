"use client";

import { type JSX } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/components/base/button";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";
import { Input } from "@repo/ui/components/base/input";
import {
  Zap,
  MapPin,
  Calendar as CalendarIcon,
  Search,
  Battery,
  Gauge,
  Bike,
  ShieldCheck,
  Leaf,
  Clock,
  CreditCard,
  Headphones,
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  Wind,
} from "lucide-react";

const featuredVehicles = [
  {
    id: "1",
    name: "VinFast Klara S",
    type: "Xe máy điện",
    pricePerDay: 180000,
    range: 120,
    maxSpeed: 60,
    rating: 4.9,
    badge: "Phổ biến",
  },
  {
    id: "2",
    name: "Dat Bike Weaver 200",
    type: "Xe máy điện cao cấp",
    pricePerDay: 250000,
    range: 200,
    maxSpeed: 80,
    rating: 4.8,
    badge: "Premium",
  },
  {
    id: "3",
    name: "VinFast Feliz S",
    type: "Xe ga điện",
    pricePerDay: 150000,
    range: 90,
    maxSpeed: 49,
    rating: 4.7,
    badge: "Tiết kiệm",
  },
];

const steps = [
  {
    icon: Search,
    title: "Tìm xe phù hợp",
    desc: "Chọn dòng xe, địa điểm và thời gian thuê. Đa dạng xe máy điện cao cấp.",
  },
  {
    icon: CalendarIcon,
    title: "Đặt xe online",
    desc: "Đặt xe trong vài giây với thanh toán an toàn. Xác nhận tức thì qua email và SMS.",
  },
  {
    icon: Bike,
    title: "Nhận xe & khởi hành",
    desc: "Lấy xe tại điểm đã chọn hoặc giao tận nơi. Bắt đầu chuyến đi xanh của bạn.",
  },
];

const features = [
  {
    icon: Leaf,
    title: "100% xanh",
    desc: "Không khí thải, góp phần bảo vệ môi trường mỗi km bạn đi.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Battery,
    title: "Sạc nhanh khắp nơi",
    desc: "Mạng lưới trạm sạc rộng khắp Việt Nam, sạc đầy 80% trong 30 phút.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hiểm toàn diện",
    desc: "Mọi xe đều được bảo hiểm 2 chiều, an tâm trên mọi hành trình.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Clock,
    title: "Đặt xe 24/7",
    desc: "Hệ thống đặt xe hoạt động liên tục, sẵn sàng phục vụ mọi lúc.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: CreditCard,
    title: "Giá minh bạch",
    desc: "Không phí ẩn, không phụ thu bất ngờ. Báo giá rõ ràng trước khi đặt.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export default function Home(): JSX.Element {
  return (
    <div className="bg-white text-slate-900 pt-16">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative container mx-auto px-4 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 px-3 py-1 text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Mới ra mắt tại Việt Nam
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Thuê xe máy điện{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  dễ dàng
                </span>
                <br />
                cho mọi chuyến đi
              </h1>

              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
                BlueVolt — nền tảng cho thuê xe máy điện hàng đầu Việt Nam.
                Linh hoạt, tiết kiệm và thân thiện môi trường.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 h-12"
                >
                  <Link href="/sign-up">
                    Đặt xe ngay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 font-medium px-8 h-12 text-slate-900"
                >
                  <Link href="#fleet">Xem các mẫu xe</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-6 justify-center lg:justify-start text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="font-medium">10.000+ khách hàng</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Hero illustration — bike card */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Bike
                    className="w-40 h-40 text-blue-600/40"
                    strokeWidth={1.2}
                  />
                  <Badge className="absolute top-4 left-4 bg-emerald-500 hover:bg-emerald-500 text-white border-0">
                    <Zap className="w-3 h-3 mr-1" />
                    EV
                  </Badge>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" />
                    100% pin
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">
                      Đề xuất hôm nay
                    </p>
                    <p className="text-lg font-bold mt-0.5">VinFast Klara S</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">180.000đ</p>
                    <p className="text-xs text-slate-500">/ ngày</p>
                  </div>
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">CO₂ tiết kiệm</p>
                  <p className="text-sm font-bold">~500kg / năm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-12 lg:mt-16 max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-2 md:p-3">
                <div className="grid md:grid-cols-[1.5fr_1fr_1fr_auto] gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <Input
                      placeholder="Địa điểm lấy xe"
                      className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors border-l md:border-l border-slate-100">
                    <CalendarIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <Input
                      placeholder="Ngày nhận"
                      className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors border-l md:border-l border-slate-100">
                    <CalendarIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <Input
                      placeholder="Ngày trả"
                      className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Tìm xe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ FEATURED VEHICLES ============ */}
      <section id="fleet" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 mb-4">
              <Bike className="w-3.5 h-3.5 mr-1.5" />
              Mẫu xe nổi bật
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Đa dạng xe máy điện
            </h2>
            <p className="text-slate-600 text-lg">
              Từ xe ga phổ thông tới xe máy điện cao cấp, đầy đủ cho mọi nhu cầu
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((v) => (
              <Card
                key={v.id}
                className="group overflow-hidden border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center overflow-hidden">
                  <Bike
                    className="w-32 h-32 text-blue-600/30 group-hover:scale-110 transition-transform"
                    strokeWidth={1.2}
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-600 text-white border-0">
                    {v.badge}
                  </Badge>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {v.rating}
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        {v.type}
                      </p>
                      <h3 className="text-lg font-bold mt-0.5">{v.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Battery className="w-4 h-4 text-blue-600" />
                      {v.range} km
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-blue-600" />
                      {v.maxSpeed} km/h
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-emerald-600" />
                      Êm ái
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(v.pricePerDay)}đ
                      </p>
                      <p className="text-xs text-slate-500">/ ngày</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      Đặt ngay
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 hover:bg-slate-50 text-slate-900"
            >
              Xem tất cả xe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 mb-4">
              Quy trình đơn giản
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Chỉ 3 bước để bắt đầu
            </h2>
            <p className="text-slate-600 text-lg">
              Quy trình thuê xe nhanh gọn, an toàn và minh bạch
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold text-slate-200">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 text-slate-300 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY BLUEVOLT ============ */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 mb-4">
              Tại sao chọn BlueVolt?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Trải nghiệm khác biệt
            </h2>
            <p className="text-slate-600 text-lg">
              Những giá trị BlueVolt mang đến cho mỗi chuyến đi của bạn
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="border-slate-100 hover:border-slate-200 hover:shadow-md transition-all"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}
                  >
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 px-8 py-16 lg:px-16 lg:py-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="relative max-w-3xl mx-auto text-center text-white space-y-6">
              <Sparkles className="w-12 h-12 mx-auto opacity-90" />
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Sẵn sàng cho chuyến đi xanh đầu tiên?
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Đăng ký ngay hôm nay để nhận ưu đãi 20% cho lần thuê xe đầu
                tiên.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-50 font-medium px-8 h-12"
                >
                  <Link href="/sign-up">
                    Đăng ký miễn phí
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 font-medium px-8 h-12"
                >
                  <Link href="/sign-in">Đã có tài khoản?</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  BlueVolt
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nền tảng cho thuê xe máy điện hàng đầu Việt Nam. Di chuyển xanh,
                an toàn và tiện lợi.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#fleet"
                    className="hover:text-white transition-colors"
                  >
                    Các mẫu xe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-white transition-colors"
                  >
                    Đặt xe
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Trạm sạc
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Điều khoản dịch vụ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  <span>Hà Nội, Việt Nam</span>
                </li>
                <li className="flex items-start gap-2">
                  <Headphones className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  <span>Hotline: 1900 1234</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2026 BlueVolt. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Built with <Leaf className="w-4 h-4 text-emerald-500" /> by
              BlueVolt Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
