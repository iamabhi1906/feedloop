import { User } from "@/features/users/users.type";
import { serverApi } from "@/utils/api/ssr-api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;
  try {
    const api = await serverApi();
    const { data } = await api.get("/auth/me");
    user = data?.user ?? null;
  } catch {
    user = null;
  }

  if (!user) {
    redirect("/login");
  }

  return children;
}
