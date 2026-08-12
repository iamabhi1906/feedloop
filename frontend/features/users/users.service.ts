import api from "@/utils/api/api";
import { User } from "./users.type";

export async function getUsers(): Promise<User[]> {
  try {
    const { data } = await api.get("/users");
    return data || [];
  } catch {
    return [];
  }
}
