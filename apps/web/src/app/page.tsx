"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import {
  Zap,
  MapPin,
  Clock,
  Shield,
  Star,
  ChevronRight,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Battery,
  Headphones,
} from "lucide-react";

const STATS = [
  { value: "500+", label: "Xe điện chất lượng" },
  { value: "50K+", label: "Chuyến thành công" },
  { value: "20+", label: "Tỉnh thành" },
  { value: "4.9★", label: "Đánh giá trung bình" },
];

const VEHICLES = [
  {
    name: "VinFast Klara S",
    price: "150.000",
    range: "110 km",
    speed: "60 km/h",
    badge: "Phổ biến nhất",
    badgeColor: "bg-[#F5A623] text-[#020617]",
    gradient: "from-[#1B3A8C] to-[#0EA5E9]",
    features: ["Tự động", "Không tiếng ồn", "Cốp rộng"],
  },
  {
    name: "Dat Bike Weaver",
    price: "200.000",
    range: "130 km",
    speed: "75 km/h",
    badge: "Mạnh nhất",
    badgeColor: "bg-[#0EA5E9] text-white",
    gradient: "from-[#0EA5E9] to-[#1B3A8C]",
    features: ["Tốc độ cao", "Pin bền", "Thiết kế sport"],
  },
  {
    name: "Yadea G5",
    price: "150.000",
    range: "100 km",
    speed: "55 km/h",
    badge: "Tiết kiệm",
    badgeColor: "bg-emerald-500 text-white",
    gradient: "from-[#1E293B] to-[#1B3A8C]",
    features: ["Kinh tế", "Nhẹ nhàng", "Dễ điều khiển"],
  },
];

const STEPS = [
  {
    step: "01",
    title: "Chọn xe & địa điểm",
    desc: "Chọn loại xe và điểm giao nhận phù hợp với lịch trình của bạn.",
    icon: <MapPin className="w-6 h-6" />,
  },
  {
    step: "02",
    title: "Đặt xe trong 60 giây",
    desc: "Điền thông tin, chọn thời gian thuê và thanh toán an toàn qua app.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    step: "03",
    title: "Nhận xe tận nơi",
    desc: "Xe được giao đến khách sạn, sân bay hoặc bất kỳ địa chỉ bạn chọn.",
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
];

const FEATURES = [
  {
    icon: <Clock className="w-7 h-7 text-[#F5A623]" />,
    title: "Đặt nhanh 60 giây",
    desc: "Quy trình đặt xe đơn giản, nhanh chóng chỉ trong vài thao tác trên ứng dụng.",
  },
  {
    icon: <MapPin className="w-7 h-7 text-[#F5A623]" />,
    title: "Giao xe tận nơi",
    desc: "Chúng tôi giao xe đến khách sạn, sân bay hoặc bất kỳ địa chỉ bạn chỉ định.",
  },
  {
    icon: <Shield className="w-7 h-7 text-[#F5A623]" />,
    title: "Bảo hiểm toàn diện",
    desc: "Mỗi chuyến đi đều được bảo hiểm đầy đủ, đảm bảo an tâm tuyệt đối cho bạn.",
  },
  {
    icon: <Headphones className="w-7 h-7 text-[#F5A623]" />,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ hỗ trợ luôn sẵn sàng giải quyết mọi vấn đề bất kỳ lúc nào.",
  },
  {
    icon: <Battery className="w-7 h-7 text-[#F5A623]" />,
    title: "Pin dự phòng miễn phí",
    desc: "Kèm theo bộ sạc dự phòng và hỗ trợ đổi pin tại điểm trả xe.",
  },
  {
    icon: <Star className="w-7 h-7 text-[#F5A623]" />,
    title: "Xe chất lượng cao",
    desc: "100% xe điện mới, bảo dưỡng định kỳ, được kiểm định nghiêm ngặt trước khi giao.",
  },
];

const REVIEWS = [
  {
    name: "Nguyễn Minh Tuấn",
    location: "Hà Nội",
    rating: 5,
    text: "Dịch vụ xuất sắc! Xe giao đúng giờ, pin đầy, nhân viên hỗ trợ tận tình. Sẽ tiếp tục sử dụng trong những chuyến đi tiếp theo.",
  },
  {
    name: "Trần Thị Lan",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    text: "BlueVolt thực sự thay đổi cách tôi di chuyển. Êm, xanh và tiết kiệm chi phí. Đặt xe chỉ mất 1 phút qua app!",
  },
  {
    name: "Phạm Quốc Hưng",
    location: "Đà Nẵng",
    rating: 5,
    text: "Đã thuê Dat Bike Weaver để khám phá Đà Nẵng 3 ngày. Mạnh, đẹp, không ồn. Trải nghiệm hoàn toàn khác biệt so với xe xăng.",
  },
];

export default function LandingPage(): JSX.Element {
  return (
    <div className="bg-[#020617] text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1B3A8C]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F5A623]/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0EA5E9]/10 rounded-full blur-3xl" />
        </div>

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E293B] border border-[#0EA5E9]/30 rounded-full px-4 py-1.5 mb-6 text-sm text-[#0EA5E9]">
              <Zap className="w-4 h-4" />
              <span>Xanh · Êm · Thông minh</span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              THUÊ XE MÁY
              <br />
              <span className="text-[#F5A623]">ĐIỆN SỐ 1</span>
              <br />
              VIỆT NAM
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Đặt xe máy điện chất lượng cao trong 60 giây. Giao tận nơi, bảo
              hiểm toàn diện, hỗ trợ 24/7 trên khắp 20+ tỉnh thành.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e09415] text-[#020617] font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <Zap className="w-5 h-5" fill="currentColor" />
                ĐẶT XE NGAY
              </Link>
              <Link
                href="/#how-it-works"
                className="flex items-center justify-center gap-2 border border-[#1E293B] hover:border-[#F5A623]/50 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg transition-all"
              >
                Xem cách hoạt động
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="text-2xl font-bold text-[#F5A623]"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: hero illustration */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              {/* Glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A8C]/40 to-[#F5A623]/20 rounded-full blur-2xl scale-110" />

              {/* Motorcycle illustration placeholder */}
              <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl border border-[#1E293B] p-12 flex flex-col items-center justify-center aspect-square">
                <div className="w-48 h-48 bg-gradient-to-br from-[#1B3A8C] to-[#0EA5E9] rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-[#0EA5E9]/30">
                  <Zap className="w-24 h-24 text-[#F5A623]" fill="currentColor" />
                </div>
                <div
                  className="text-2xl font-bold text-white text-center"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  BLUEVOLT
                </div>
                <div className="text-[#0EA5E9] text-sm mt-1">Electric Mobility</div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-[#F5A623] text-[#020617] rounded-2xl px-4 py-2 text-sm font-bold shadow-lg">
                  Đặt nhanh 60s ⚡
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#0F172A] border border-[#0EA5E9]/40 rounded-2xl px-4 py-2 text-sm text-[#0EA5E9] shadow-lg">
                  🛡️ Bảo hiểm toàn diện
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-[#F5A623] text-sm font-semibold tracking-widest uppercase mb-3">
              Quy trình
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              ĐẶT XE CHỈ 3 BƯỚC
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Quy trình đơn giản, nhanh chóng — từ lúc chọn xe đến khi nhận xe
              chỉ mất vài phút.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#1B3A8C] via-[#F5A623] to-[#1B3A8C]" />

            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative inline-flex w-24 h-24 items-center justify-center bg-gradient-to-br from-[#1B3A8C] to-[#0EA5E9] rounded-2xl mb-6 shadow-lg shadow-[#1B3A8C]/30 group-hover:scale-110 transition-transform">
                  <span
                    className="absolute -top-3 -right-3 w-7 h-7 bg-[#F5A623] text-[#020617] rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {s.step}
                  </span>
                  <div className="text-white">{s.icon}</div>
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VEHICLES ── */}
      <section id="vehicles" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-[#F5A623] text-sm font-semibold tracking-widest uppercase mb-3">
              Đội xe
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              XE ĐIỆN CHẤT LƯỢNG CAO
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Đội xe đa dạng, luôn được bảo dưỡng định kỳ và kiểm định nghiêm
              ngặt trước mỗi chuyến thuê.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {VEHICLES.map((v) => (
              <div
                key={v.name}
                className="group relative bg-[#0F172A] border border-[#1E293B] hover:border-[#F5A623]/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F5A623]/10"
              >
                {/* Top gradient bar */}
                <div className={`h-1 bg-gradient-to-r ${v.gradient}`} />

                {/* Vehicle image area */}
                <div
                  className={`bg-gradient-to-br ${v.gradient} h-52 flex items-center justify-center relative`}
                >
                  <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Zap className="w-14 h-14 text-white" fill="currentColor" />
                  </div>
                  <span
                    className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full ${v.badgeColor}`}
                  >
                    {v.badge}
                  </span>
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {v.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-[#F5A623]">
                      {v.price}đ
                    </span>
                    <span className="text-slate-500 text-sm">/ngày</span>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-[#1E293B] rounded-lg p-2.5 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">Tầm xa</div>
                      <div className="text-sm font-semibold text-[#0EA5E9]">{v.range}</div>
                    </div>
                    <div className="bg-[#1E293B] rounded-lg p-2.5 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">Tốc độ max</div>
                      <div className="text-sm font-semibold text-[#0EA5E9]">{v.speed}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {v.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-[#1E293B] text-slate-400 px-2.5 py-1 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/sign-up"
                    className="w-full flex items-center justify-center gap-2 bg-[#1B3A8C] hover:bg-[#F5A623] hover:text-[#020617] text-white font-semibold py-3 rounded-xl transition-all text-sm group-hover:bg-[#F5A623] group-hover:text-[#020617]"
                  >
                    Thuê ngay
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#F5A623] transition-colors font-medium"
            >
              Xem toàn bộ 500+ xe điện
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why-us" className="py-24 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-[#F5A623] text-sm font-semibold tracking-widest uppercase mb-3">
              Lợi thế
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              TẠI SAO CHỌN BLUEVOLT?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-[#020617] border border-[#1E293B] hover:border-[#F5A623]/30 rounded-2xl p-6 group transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#1E293B] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F5A623]/10 transition-colors">
                  {f.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block text-[#F5A623] text-sm font-semibold tracking-widest uppercase mb-3">
              Đánh giá
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              KHÁCH HÀNG NÓI GÌ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 hover:border-[#F5A623]/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#F5A623]"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  &quot;{r.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A8C] to-[#0EA5E9] flex items-center justify-center text-sm font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / APP DOWNLOAD ── */}
      <section className="py-24 bg-gradient-to-br from-[#1B3A8C] via-[#0F172A] to-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-[#F5A623] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#F5A623]/30">
            <Zap className="w-9 h-9 text-[#020617]" fill="currentColor" />
          </div>

          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            SẴN SÀNG TRẢI NGHIỆM
            <br />
            <span className="text-[#F5A623]">DI CHUYỂN ĐIỆN?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Tải ứng dụng BlueVolt ngay hôm nay và nhận{" "}
            <span className="text-[#F5A623] font-semibold">50.000đ</span> ưu
            đãi cho chuyến đầu tiên.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="flex items-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs text-slate-500">Tải trên</div>
                <div className="font-semibold text-sm">App Store</div>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-white text-black px-6 py-3.5 rounded-xl hover:bg-slate-100 transition-colors">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs text-slate-500">Tải trên</div>
                <div className="font-semibold text-sm">Google Play</div>
              </div>
            </button>
          </div>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 text-[#0EA5E9] hover:text-[#F5A623] transition-colors text-sm"
          >
            Hoặc đặt xe trên web
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#020617] border-t border-[#1E293B] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#F5A623] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#020617]" fill="currentColor" />
                </div>
                <span
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  BLUE<span className="text-[#F5A623]">VOLT</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nền tảng thuê xe máy điện số 1 Việt Nam. Xanh · Êm · Thông
                minh.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-slate-300">
                Dịch vụ
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Thuê xe ngắn hạn", "Thuê xe dài hạn", "Xe cho doanh nghiệp", "Giao xe tận nơi"].map((item) => (
                  <li key={item}><Link href="/sign-up" className="hover:text-[#F5A623] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-slate-300">
                Công ty
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Về chúng tôi", "Blog", "Tuyển dụng", "Đối tác"].map((item) => (
                  <li key={item}><Link href="/" className="hover:text-[#F5A623] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wide uppercase text-slate-300">
                Hỗ trợ
              </h4>
              <ul className="space-y-2 text-sm text-slate-500">
                {["Trung tâm trợ giúp", "Liên hệ", "Điều khoản dịch vụ", "Chính sách bảo mật"].map((item) => (
                  <li key={item}><Link href="/" className="hover:text-[#F5A623] transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1E293B] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              © 2026 BlueVolt. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Zap className="w-4 h-4 text-[#F5A623]" fill="currentColor" />
              <span>Powered by clean energy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
