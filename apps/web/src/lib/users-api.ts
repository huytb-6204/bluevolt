import { apiClient } from "@/lib/api-client";
import type { UserRole } from "@/stores/auth-store";

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: UserRole;
  createdAt: string;
}

export interface ListUsersResponse {
  users: AdminUser[];
  total: number;
  skip: number;
  take: number;
}

export const ROLE_LABEL: Record<UserRole, string> = {
  USER: "Khách hàng",
  ADMIN: "Quản trị viên",
  SUPERADMIN: "Quản trị cấp cao",
};

export async function listUsersAdmin(
  skip = 0,
  take = 100,
): Promise<ListUsersResponse> {
  const { data } = await apiClient.get<ListUsersResponse>("/users", {
    params: { skip, take },
  });
  return data;
}

export async function setUserRole(
  id: string,
  role: UserRole,
): Promise<AdminUser> {
  const { data } = await apiClient.patch<AdminUser>(`/users/${id}/role`, {
    role,
  });
  return data;
}
