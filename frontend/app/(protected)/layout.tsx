import { User } from "@/features/users/users.type";
import { serverApi } from "@/utils/api/ssr-api";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = await serverApi();
  const { data } = await api.get("/auth/me");
  const user: User | null = data?.user;
  if (!user) redirect("/login");
  return <section>{children}</section>;
}
