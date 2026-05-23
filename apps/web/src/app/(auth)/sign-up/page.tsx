"use client";

import { type JSX, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Loader2, Zap, AlertCircle, CheckCircle2 } from "lucide-react";

const passwordRules = [
  { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
  { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Có số", test: (p: string) => /[0-9]/.test(p) },
];

export default function SignUpPage(): JSX.Element {
  useRedirectIfSignedIn("/");
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!passwordRules.every((r) => r.test(form.password))) {
      setError("Mật khẩu chưa đủ điều kiện.");
      return;
    }

    try {
      await register({
        email: form.email,
        username: form.username,
        password: form.password,
      });
      router.push("/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err instanceof Error ? err.message : "Đăng ký thất bại.");
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 py-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            BlueVolt
          </span>
        </Link>

        <Card className="border-slate-200 bg-white shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="text-slate-500">
              Đăng ký để bắt đầu sử dụng BlueVolt.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200 text-red-700"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 text-sm">
                  Tên người dùng
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="nguyenvana"
                  value={form.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  autoComplete="username"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 text-sm">
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordHint(true)}
                  required
                  autoComplete="new-password"
                  className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
                {showPasswordHint && form.password.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.password);
                      return (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            passed ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                          {rule.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-slate-700 text-sm"
                >
                  Xác nhận mật khẩu
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className={`bg-white text-slate-900 placeholder:text-slate-400 h-11 focus:ring-blue-500/20 transition-colors ${
                    form.confirmPassword.length > 0
                      ? form.confirmPassword === form.password
                        ? "border-emerald-500 focus:border-emerald-600"
                        : "border-red-400 focus:border-red-500"
                      : "border-slate-300 focus:border-blue-500"
                  }`}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>

              <p className="text-sm text-slate-500 text-center">
                Đã có tài khoản?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
