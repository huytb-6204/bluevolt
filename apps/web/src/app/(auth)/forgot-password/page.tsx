"use client";

import { type JSX, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
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
  Mail,
  KeyRound,
  Lock,
  ArrowLeft,
} from "lucide-react";

type Step = "email" | "otp" | "password" | "done";

const passwordRules = [
  { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
  { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Có số", test: (p: string) => /[0-9]/.test(p) },
];

export default function ForgotPasswordPage(): JSX.Element {
  const router = useRouter();
  const { forgotPassword, verifyResetCode, resetPassword } = useAuthStore();

  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Step 1: Gửi OTP ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep("otp");
    } catch {
      setError("Không thể gửi mã. Vui lòng thử lại.");
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
      const token = await verifyResetCode(email, code);
      setResetToken(token);
      setStep("password");
    } catch {
      setError("Mã OTP không đúng hoặc đã hết hạn.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Đặt mật khẩu mới ───────────────────────────────────
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!passwordRules.every((r) => r.test(newPassword))) {
      setError("Mật khẩu chưa đủ điều kiện.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setStep("done");
    } catch {
      setError("Không thể đặt lại mật khẩu. Vui lòng thử lại từ đầu.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP input helper ────────────────────────────────────────────
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

  // ─── Step indicator ──────────────────────────────────────────────
  const steps = [
    { key: "email", label: "Email" },
    { key: "otp", label: "Mã OTP" },
    { key: "password", label: "Mật khẩu" },
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

        {/* Step indicator — ẩn khi done */}
        {step !== "done" && (
          <div className="flex items-center justify-center gap-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    i < currentStepIndex
                      ? "bg-blue-600 text-white"
                      : i === currentStepIndex
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {i < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i === currentStepIndex ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < currentStepIndex ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ─── BƯỚC 1: Nhập Email ─── */}
        {step === "email" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Quên mật khẩu?</CardTitle>
              <CardDescription>
                Nhập email đăng ký để nhận mã xác nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  autoFocus
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500"
                onClick={handleSendOtp}
                disabled={loading || !email}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Gửi mã xác nhận
              </Button>
              <Link
                href="/sign-in"
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại đăng nhập
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
                Mã 6 chữ số đã được gửi đến{" "}
                <span className="font-medium text-slate-700">{email}</span>
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
              {/* OTP boxes */}
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
                  onClick={() => { setOtp(["","","","","",""]); setStep("email"); setError(null); }}
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
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Xác nhận mã
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ─── BƯỚC 3: Đặt mật khẩu mới ─── */}
        {step === "password" && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Đặt mật khẩu mới</CardTitle>
              <CardDescription>Chọn mật khẩu mạnh cho tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Ít nhất 8 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoFocus
                />
                {newPassword && (
                  <ul className="space-y-1 mt-2">
                    {passwordRules.map((rule) => (
                      <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 ${
                            rule.test(newPassword) ? "text-emerald-500" : "text-slate-300"
                          }`}
                        />
                        <span className={rule.test(newPassword) ? "text-emerald-600" : "text-slate-400"}>
                          {rule.label}
                        </span>
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
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500">Mật khẩu không khớp</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500"
                onClick={handleResetPassword}
                disabled={
                  loading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  !passwordRules.every((r) => r.test(newPassword))
                }
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Đặt lại mật khẩu
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ─── DONE ─── */}
        {step === "done" && (
          <Card className="border-0 shadow-xl text-center">
            <CardContent className="pt-10 pb-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Đặt lại thành công!</h2>
              <p className="text-slate-500 text-sm">
                Mật khẩu đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 mt-2"
                onClick={() => router.push("/sign-in")}
              >
                Đăng nhập
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
