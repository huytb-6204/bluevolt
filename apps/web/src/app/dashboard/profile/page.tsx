"use client";

import { type JSX, useRef, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Alert, AlertDescription } from "@repo/ui/components/base/alert";
import {
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
} from "lucide-react";

function extractError(err: unknown, fallback: string): string {
  const msg =
    (err as { response?: { data?: { message?: string | string[] } } })?.response
      ?.data?.message ?? (err instanceof Error ? err.message : fallback);
  return Array.isArray(msg) ? (msg[0] ?? fallback) : msg;
}

export default function ProfileManagementPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);
  const uploadAvatar = useAuthStore((s) => s.uploadAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form
  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    username: user?.username ?? "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Password form
  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // Avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return <div />;

  const initials =
    user.firstName?.[0]?.toUpperCase() ??
    user.username?.[0]?.toUpperCase() ??
    user.email[0]?.toUpperCase() ??
    "?";

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      await updateProfile(profile);
      setProfileMsg({ type: "ok", text: "Cập nhật hồ sơ thành công." });
    } catch (err) {
      setProfileMsg({ type: "err", text: extractError(err, "Cập nhật thất bại.") });
    } finally {
      setSavingProfile(false);
    }
  }

  async function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdMsg({ type: "err", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    if (pwd.newPassword.length < 8) {
      setPwdMsg({ type: "err", text: "Mật khẩu mới phải có ít nhất 8 ký tự." });
      return;
    }
    setSavingPwd(true);
    try {
      await changePassword({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwdMsg({ type: "ok", text: "Đổi mật khẩu thành công." });
    } catch (err) {
      setPwdMsg({ type: "err", text: extractError(err, "Đổi mật khẩu thất bại.") });
    } finally {
      setSavingPwd(false);
    }
  }

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } catch {
      // surfaced silently; could add toast
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hồ sơ của tôi</h1>
        <p className="text-slate-500 mt-1">
          Quản lý thông tin cá nhân và bảo mật tài khoản.
        </p>
      </div>

      {/* Avatar */}
      <Card className="border-slate-200">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center text-3xl font-semibold">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-colors disabled:opacity-60"
              aria-label="Đổi ảnh đại diện"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickAvatar}
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-slate-900">
              {user.firstName || user.lastName
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                : user.username}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              Nhấn biểu tượng máy ảnh để đổi ảnh (tối đa 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật tên và tên người dùng.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSaveProfile} className="space-y-4">
            {profileMsg && (
              <Alert
                className={
                  profileMsg.type === "ok"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }
              >
                {profileMsg.type === "ok" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{profileMsg.text}</AlertDescription>
              </Alert>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-700 text-sm">
                  Tên
                </Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, firstName: e.target.value }))
                  }
                  placeholder="Văn A"
                  className="border-slate-300 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-700 text-sm">
                  Họ
                </Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, lastName: e.target.value }))
                  }
                  placeholder="Nguyễn"
                  className="border-slate-300 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700 text-sm">
                Tên người dùng
              </Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, username: e.target.value }))
                }
                minLength={3}
                className="border-slate-300 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 text-sm">Email</Label>
              <Input
                value={user.email}
                disabled
                className="border-slate-200 bg-slate-50 h-11 text-slate-500"
              />
              <p className="text-xs text-slate-400">Email không thể thay đổi.</p>
            </div>

            <Button
              type="submit"
              disabled={savingProfile}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-600" />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription>
            Để bảo mật, hãy dùng mật khẩu mạnh và không chia sẻ với ai.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onChangePassword} className="space-y-4">
            {pwdMsg && (
              <Alert
                className={
                  pwdMsg.type === "ok"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }
              >
                {pwdMsg.type === "ok" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{pwdMsg.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-slate-700 text-sm">
                Mật khẩu hiện tại
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={pwd.currentPassword}
                onChange={(e) =>
                  setPwd((p) => ({ ...p, currentPassword: e.target.value }))
                }
                placeholder="••••••••"
                required
                className="border-slate-300 h-11"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-700 text-sm">
                  Mật khẩu mới
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={pwd.newPassword}
                  onChange={(e) =>
                    setPwd((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  placeholder="••••••••"
                  minLength={8}
                  required
                  className="border-slate-300 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmNewPassword"
                  className="text-slate-700 text-sm"
                >
                  Xác nhận mật khẩu mới
                </Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={pwd.confirmPassword}
                  onChange={(e) =>
                    setPwd((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  placeholder="••••••••"
                  required
                  className="border-slate-300 h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={savingPwd}
              variant="outline"
              className="border-slate-300 text-slate-900"
            >
              {savingPwd ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đổi...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
