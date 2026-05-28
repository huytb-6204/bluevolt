"use client";

import { type JSX, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  listUsersAdmin,
  setUserRole,
  ROLE_LABEL,
  type AdminUser,
} from "@/lib/users-api";
import { useAuthStore, type UserRole } from "@/stores/auth-store";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Badge } from "@repo/ui/components/base/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/base/select";
import { Loader2, Mail } from "lucide-react";

const ROLE_COLOR: Record<UserRole, string> = {
  USER: "bg-slate-100 text-slate-700",
  ADMIN: "bg-blue-100 text-blue-700",
  SUPERADMIN: "bg-purple-100 text-purple-700",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminUsersPage(): JSX.Element {
  const me = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    listUsersAdmin()
      .then((r) => setUsers(r.users))
      .finally(() => setLoading(false));
  }, []);

  // Only SUPERADMIN can change roles to/from ADMIN/SUPERADMIN
  const canManageRoles = me?.role === "SUPERADMIN";

  async function onChangeRole(id: string, role: UserRole) {
    setUpdatingId(id);
    try {
      await setUserRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u)),
      );
    } catch {
      alert("Không cập nhật được vai trò.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell title="Quản lý người dùng">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {loading ? "Đang tải..." : `${users.length} người dùng`}
        </p>
        {!canManageRoles && (
          <p className="text-xs text-amber-600">
            Chỉ SUPERADMIN có quyền đổi vai trò.
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => {
            const initials =
              u.firstName?.[0]?.toUpperCase() ??
              u.username?.[0]?.toUpperCase() ??
              u.email[0]?.toUpperCase() ??
              "?";
            const isSelf = u.id === me?.id;
            return (
              <Card key={u.id} className="border-slate-200">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                  {u.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.imageUrl}
                      alt={u.username}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">
                        {u.firstName || u.lastName
                          ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                          : u.username}
                      </span>
                      <Badge
                        className={`${ROLE_COLOR[u.role]} hover:opacity-90 border-0`}
                      >
                        {ROLE_LABEL[u.role]}
                      </Badge>
                      {isSelf && (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                          Bạn
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
                      <span>@{u.username}</span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </span>
                      <span>Tham gia {fmtDate(u.createdAt)}</span>
                    </div>
                  </div>
                  <Select
                    value={u.role}
                    onValueChange={(v) =>
                      onChangeRole(u.id, v as UserRole)
                    }
                    disabled={!canManageRoles || updatingId === u.id || isSelf}
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">{ROLE_LABEL.USER}</SelectItem>
                      <SelectItem value="ADMIN">{ROLE_LABEL.ADMIN}</SelectItem>
                      <SelectItem value="SUPERADMIN">
                        {ROLE_LABEL.SUPERADMIN}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
