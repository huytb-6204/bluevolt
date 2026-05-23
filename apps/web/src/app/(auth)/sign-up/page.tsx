"use client";

import { type JSX, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import Image from "next/image";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";


const passwordRules = [
  { label: "Ít nhất 8 ký tự", test: (p: string) => p.length >= 8 },
  { label: "Có chữ hoa", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Có số", test: (p: string) => /[0-9]/.test(p) },
];

export default function SignUpPage(): JSX.Element {
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
          ?.message ?? (err instanceof Error ? err.message : "Đăng ký thất bại.");
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.jpg" alt="BlueVolt" width={160} height={56} className="object-contain" priority />
        </div>

        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-white">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="text-slate-400">
              Đăng ký để bắt đầu sử dụng BlueVolt.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-950/50 border-red-800 text-red-300"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm">
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
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300 text-sm">
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
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 text-sm">
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
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
                {showPasswordHint && form.password.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.password);
                      return (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            passed ? "text-green-400" : "text-slate-500"
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
                  className="text-slate-300 text-sm"
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
                  className={`bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11 focus:ring-blue-500/20 transition-colors ${
                    form.confirmPassword.length > 0
                      ? form.confirmPassword === form.password
                        ? "border-green-600 focus:border-green-500"
                        : "border-red-700 focus:border-red-500"
                      : "focus:border-blue-500"
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

              <p className="text-sm text-slate-400 text-center">
                Đã có tài khoản?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
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
