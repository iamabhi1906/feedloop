import api from "@/utils/api/api";
import authApi from "@/utils/api/auth-api";
import { User } from "./users.type";

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminUsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateUserActionsPayload {
  isLoginDisabled?: boolean;
  hideFeedbacks?: boolean;
  hideComments?: boolean;
}

export async function getUsers(): Promise<User[]> {
  try {
    const { data } = await api.get("/users");
    return data || [];
  } catch {
    return [];
  }
}

export async function getAdminUsers(query: AdminUsersQuery): Promise<AdminUsersResponse> {
  const { data } = await authApi.get("/users/admin", { params: query });
  return data;
}

export async function updateUserActions(
  userId: string,
  payload: UpdateUserActionsPayload,
): Promise<User> {
  const { data } = await authApi.patch(`/users/${userId}/actions`, payload);
  return data;
}
