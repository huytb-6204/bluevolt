"use client";

import { type JSX } from "react";
import { useRequireAuth, useAuth } from "@/hooks/use-auth";
import { Button } from "@repo/ui/components/base/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/base/card";
import { Loader2, LogOut, Mail, User as UserIcon } from "lucide-react";

export default function ProfilePage(): JSX.Element {
  const { user, isLoading } = useRequireAuth();
  const { signOut } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initials =
    user.firstName?.[0]?.toUpperCase() ??
    user.username?.[0]?.toUpperCase() ??
    user.email[0]?.toUpperCase() ??
    "?";

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white">
            {initials}
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl">
              {user.firstName || user.lastName
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
                : user.username}
            </CardTitle>
            <CardDescription>@{user.username}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-md border p-3">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="text-muted-foreground">User ID</p>
              <p className="font-mono text-xs">{user.id}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
