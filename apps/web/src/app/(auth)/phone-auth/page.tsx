"use client";

import { type JSX, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useRedirectIfSignedIn } from "@/hooks/use-auth";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Alert, AlertDescription } from "@repo/ui/components/base/alert";
import {
  Loader2,
  Zap,
  AlertCircle,
  CheckCircle2,
  Phone,
  KeyRound,
  User,
  ArrowLeft,
} from "lucide-react";

type Step = "phone" | "otp" | "register";

const passwordRules = [
  { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
  { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Có số", test: (p: string) => /[0-9]/.test(p) },
];

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "+84" + digits.slice(1);
  if (digits.startsWith("84")) return "+" + digits;
  return "+" + digits;
}

export default function PhoneAuthPage(): JSX.Element {
  useRedirectIfSignedIn("/");
  const router = useRouter();
  const { sendPhoneOtp, verifyPhoneOtp, completePhoneRegister } = useAuthStore();

  const [step, setStep] = useState<Step>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [setupToken, setSetupToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Step 1: Gửi OTP ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone) return;
    setError(null);
    setLoading(true);
    try {
      await sendPhoneOtp(formatPhone(phone));
      setStep("otp");
    } catch {
      setError("Không thể gửi mã. Kiểm tra lại số điện thoại.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Xác minh OTP ────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setError(null);
    setLoading(true);
    try {
      const result = await verifyPhoneOtp(formatPhone(phone), code);
      if ("isNewUser" in result) {
        setSetupToken(result.setupToken);
        setStep("register");
      } else {
        router.push("/");
      }
    } catch {
      setError("Mã OTP không đúng hoặc đã hết hạn.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Hoàn tất đăng ký ───────────────────────────────────
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!passwordRules.every((r) => r.test(password))) {
      setError("Mật khẩu chưa đủ điều kiện.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await completePhoneRegister(setupToken, {
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      router.push("/");
    } catch {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP helpers ─────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const steps = [
    { key: "phone", label: "Số điện thoại" },
    { key: "otp", label: "Xác minh" },
    { key: "register", label: "Tài khoản" },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">BlueVolt</span>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  i < currentStepIndex
                    ? "bg-blue-600 text-white"
                    : i === currentStepIndex
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {i < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === currentStepIndex ? "text-slate-900" : "text-slate-400"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < currentStepIndex ? "bg-blue-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ─── BƯỚC 1: Nhập SĐT ─── */}
        {step === "phone" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-7 h-7 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Đăng nhập / Đăng ký</CardTitle>
              <CardDescription>Nhập số điện thoại để tiếp tục</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-slate-100 border rounded-md text-sm text-slate-600 font-medium">
                    🇻🇳 +84
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09x xxx xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    className="flex-1"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Mã OTP sẽ được gửi qua SMS
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500"
                onClick={handleSendOtp}
                disabled={loading || phone.length < 9}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi mã OTP
              </Button>
              <Link
                href="/sign-in"
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Đăng nhập bằng email
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* ─── BƯỚC 2: Nhập OTP ─── */}
        {step === "otp" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-7 h-7 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Nhập mã xác nhận</CardTitle>
              <CardDescription>
                Mã OTP đã gửi đến{" "}
                <span className="font-medium text-slate-700">{formatPhone(phone)}</span>
                <br />
                <span className="text-xs text-slate-400">Hiệu lực trong 10 phút</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-slate-50"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-slate-500">
                Không nhận được mã?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => { setOtp(["","","","","",""]); setStep("phone"); setError(null); }}
                >
                  Gửi lại
                </button>
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500"
                onClick={handleVerifyOtp}
                disabled={loading || otp.join("").length !== 6}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ─── BƯỚC 3: Thông tin tài khoản (chỉ cho user mới) ─── */}
        {step === "register" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <User className="w-7 h-7 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Hoàn tất đăng ký</CardTitle>
              <CardDescription>Thêm thông tin cơ bản cho tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    placeholder="Nguyễn"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    placeholder="Huy"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ít nhất 8 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <ul className="space-y-1 mt-1">
                    {passwordRules.map((rule) => (
                      <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${rule.test(password) ? "text-emerald-500" : "text-slate-300"}`} />
                        <span className={rule.test(password) ? "text-emerald-600" : "text-slate-400"}>{rule.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500">Mật khẩu không khớp</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500"
                onClick={handleRegister}
                disabled={
                  loading ||
                  !password ||
                  password !== confirmPassword ||
                  !passwordRules.every((r) => r.test(password))
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo tài khoản
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Link đến sign-in */}
        {step === "phone" && (
          <p className="text-center text-sm text-slate-500">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <Link href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</Link>
          </p>
        )}
      </div>
    </div>
  );
}
