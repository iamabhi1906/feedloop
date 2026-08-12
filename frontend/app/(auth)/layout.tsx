import { serverApi } from "@/utils/api/ssr-api";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ssrApi = await serverApi();
  const { data: user } = await ssrApi.get("/auth/me");
  if (user) redirect("/");
  return children;
}
